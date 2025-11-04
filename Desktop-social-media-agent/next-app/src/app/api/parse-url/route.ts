import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, contentType } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PostPlannerBot/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Parse HTML to extract metadata
    const title = extractMetadata(html, [
      /<meta property="og:title" content="([^"]+)"/,
      /<meta name="twitter:title" content="([^"]+)"/,
      /<title>([^<]+)<\/title>/,
    ]) || '';

    const description = extractMetadata(html, [
      /<meta property="og:description" content="([^"]+)"/,
      /<meta name="twitter:description" content="([^"]+)"/,
      /<meta name="description" content="([^"]+)"/,
    ]) || '';

    const image = extractMetadata(html, [
      /<meta property="og:image" content="([^"]+)"/,
      /<meta name="twitter:image" content="([^"]+)"/,
    ]) || '';

    const siteName = extractMetadata(html, [
      /<meta property="og:site_name" content="([^"]+)"/,
    ]) || new URL(url).hostname;

    // Extract main content text (simplified - gets first paragraph)
    const contentMatch = html.match(/<p[^>]*>([^<]+)<\/p>/);
    const content = contentMatch ? contentMatch[1].trim() : description;

    // Detect content type and extract specialized data
    let field1 = '';
    let field2 = '';
    let detectedType = contentType;

    // Auto-detect type if not provided
    if (!detectedType) {
      if (isRecipe(html, url)) {
        detectedType = 'recipes';
      } else if (isWorkout(html, url)) {
        detectedType = 'workouts';
      }
    }

    // Extract type-specific data
    if (detectedType === 'recipes') {
      const recipeData = extractRecipeData(html);
      field1 = recipeData.ingredients;
      field2 = recipeData.cookTime;
    } else if (detectedType === 'workouts') {
      const workoutData = extractWorkoutData(html);
      field1 = workoutData.duration;
      field2 = workoutData.difficulty;
    }

    return NextResponse.json({
      title: cleanText(title),
      content: cleanText(content),
      description: cleanText(description),
      image,
      siteName,
      url,
      field1,
      field2,
      detectedType,
    });
  } catch (error) {
    console.error('Error parsing URL:', error);
    return NextResponse.json(
      { error: 'Failed to parse URL. Please try again.' },
      { status: 500 }
    );
  }
}

function extractMetadata(html: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

function cleanText(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function isRecipe(html: string, url: string): boolean {
  const recipeIndicators = [
    /@type"?\s*:\s*"?Recipe/i,
    /"@type":\s*"Recipe"/,
    /recipe/i,
    /allrecipes\.com/i,
    /foodnetwork\.com/i,
    /tasty\.co/i,
    /epicurious\.com/i,
    /simplyrecipes\.com/i,
    /budgetbytes\.com/i,
    /<h[1-3][^>]*>.*ingredients.*<\/h[1-3]>/i,
    /class="[^"]*recipe[^"]*"/i,
  ];

  return recipeIndicators.some(pattern => pattern.test(html) || pattern.test(url));
}

function isWorkout(html: string, url: string): boolean {
  const workoutIndicators = [
    /workout/i,
    /exercise/i,
    /fitness/i,
    /bodybuilding\.com/i,
    /menshealth\.com/i,
    /womenshealthmag\.com/i,
    /self\.com/i,
    /myfitnesspal\.com/i,
    /muscleandstrength\.com/i,
    /jefit\.com/i,
    /<h[1-3][^>]*>.*(workout|exercise).*<\/h[1-3]>/i,
  ];

  return workoutIndicators.some(pattern => pattern.test(html) || pattern.test(url));
}

function extractRecipeData(html: string): { ingredients: string; cookTime: string } {
  let ingredients = '';
  let cookTime = '';

  // Try to extract from JSON-LD structured data first
  const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  if (jsonLdMatch) {
    try {
      const jsonData = JSON.parse(jsonLdMatch[1]);
      const recipe = Array.isArray(jsonData)
        ? jsonData.find((item: any) => item['@type'] === 'Recipe')
        : jsonData['@type'] === 'Recipe' ? jsonData : null;

      if (recipe) {
        // Extract ingredients
        if (recipe.recipeIngredient && Array.isArray(recipe.recipeIngredient)) {
          ingredients = recipe.recipeIngredient.slice(0, 5).join(', ');
          if (recipe.recipeIngredient.length > 5) {
            ingredients += ` (+${recipe.recipeIngredient.length - 5} more)`;
          }
        }

        // Extract cook time
        if (recipe.totalTime) {
          cookTime = parseDuration(recipe.totalTime);
        } else if (recipe.cookTime && recipe.prepTime) {
          cookTime = `${parseDuration(recipe.prepTime)} prep + ${parseDuration(recipe.cookTime)} cook`;
        } else if (recipe.cookTime) {
          cookTime = parseDuration(recipe.cookTime);
        }
      }
    } catch (e) {
      // Fall through to manual parsing
    }
  }

  // Fallback: Try to find ingredients list manually
  if (!ingredients) {
    const ingredientPatterns = [
      /<ul[^>]*class="[^"]*ingredient[^"]*"[^>]*>([\s\S]*?)<\/ul>/i,
      /<div[^>]*class="[^"]*ingredient[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ];

    for (const pattern of ingredientPatterns) {
      const match = html.match(pattern);
      if (match) {
        const items = match[1].match(/<li[^>]*>([^<]+)<\/li>/gi);
        if (items && items.length > 0) {
          const cleanedItems = items
            .slice(0, 5)
            .map(item => item.replace(/<[^>]+>/g, '').trim())
            .filter(item => item.length > 0);
          ingredients = cleanedItems.join(', ');
          if (items.length > 5) {
            ingredients += ` (+${items.length - 5} more)`;
          }
          break;
        }
      }
    }
  }

  // Fallback: Try to find cook time manually
  if (!cookTime) {
    const timePatterns = [
      /(?:cook|total|prep)\s*time[:\s]*(\d+\s*(?:hours?|hrs?|minutes?|mins?))/i,
      /(\d+\s*(?:hours?|hrs?)(?:\s*\d+\s*(?:minutes?|mins?))?)/i,
    ];

    for (const pattern of timePatterns) {
      const match = html.match(pattern);
      if (match) {
        cookTime = match[1];
        break;
      }
    }
  }

  return {
    ingredients: ingredients || 'See recipe for ingredients',
    cookTime: cookTime || 'See recipe for time',
  };
}

function extractWorkoutData(html: string): { duration: string; difficulty: string } {
  let duration = '';
  let difficulty = '';

  // Extract duration
  const durationPatterns = [
    /duration[:\s]*(\d+\s*(?:minutes?|mins?|hours?|hrs?))/i,
    /(\d+\s*(?:minute|min|hour|hr)\s*workout)/i,
    /length[:\s]*(\d+\s*(?:minutes?|mins?))/i,
  ];

  for (const pattern of durationPatterns) {
    const match = html.match(pattern);
    if (match) {
      duration = match[1].replace(/\s+/g, ' ').trim();
      break;
    }
  }

  // Extract difficulty
  const difficultyPatterns = [
    /difficulty[:\s]*(beginner|intermediate|advanced|easy|moderate|hard)/i,
    /level[:\s]*(beginner|intermediate|advanced|easy|moderate|hard)/i,
    /(beginner|intermediate|advanced)\s*workout/i,
  ];

  for (const pattern of difficultyPatterns) {
    const match = html.match(pattern);
    if (match) {
      difficulty = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      break;
    }
  }

  return {
    duration: duration || '30 minutes',
    difficulty: difficulty || 'Intermediate',
  };
}

function parseDuration(isoDuration: string): string {
  // Parse ISO 8601 duration format (PT1H30M)
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (match) {
    const hours = match[1] ? `${match[1]}h` : '';
    const minutes = match[2] ? `${match[2]}m` : '';
    return `${hours}${hours && minutes ? ' ' : ''}${minutes}`.trim();
  }
  return isoDuration;
}
