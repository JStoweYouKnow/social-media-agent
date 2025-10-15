// Post generation utility functions
import templates, { getTemplate, detectContentType } from '../templates/index.js';
import { getScheduleForDay } from '../data/contentSchedule.js';

/**
 * Main post generation function based on weekly schedule
 * @param {string} day - Day of the week (e.g., "Monday", "Tuesday")
 * @param {object} data - Content data specific to the post type
 * @returns {string} Formatted post caption
 */
export function generatePost(day, data) {
  const schedule = getScheduleForDay(day);
  if (!schedule) {
    throw new Error(`No schedule found for ${day}`);
  }
  
  const template = templates[schedule.template];
  if (!template) {
    throw new Error(`No template found for ${schedule.template}`);
  }

  return template(data);
}

/**
 * Extract details from event-related prompts
 */
export const extractEventDetails = (prompt) => {
  const timeMatch = prompt.match(/(\d{1,2}:\d{2}\s*(?:am|pm)?)/i);
  const dayMatch = prompt.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
  const locationMatch = prompt.match(/at\s+([A-Z][^.!?]+(?:Church|Center|Park|Hall|Building|Street|Ave|Road|Blvd))/i);
  
  return {
    description: prompt,
    time: timeMatch ? timeMatch[0] : null,
    day: dayMatch ? dayMatch[0] : null,
    location: locationMatch ? locationMatch[1] : null
  };
};

/**
 * Extract educational topic from prompt
 */
export const extractTopic = (prompt) => {
  // Remove common prefixes
  let topic = prompt
    .replace(/share|post|write about|discuss|tell me about|explain/gi, '')
    .trim();
  
  // If topic starts with "how to", keep it
  if (topic.toLowerCase().startsWith('how to')) {
    return topic;
  }
  
  return topic;
};

/**
 * Generate hashtags from text
 */
export const generateHashtags = (text, maxTags = 5) => {
  const commonWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by']);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index); // unique words
  
  const hashtags = words
    .slice(0, maxTags)
    .map(word => `#${word}`)
    .join(' ');
  
  return hashtags;
};

/**
 * Main post generation function
 * Takes a custom prompt and returns formatted caption
 */
export const generatePostCaption = (customPrompt, options = {}) => {
  const {
    style = 'casual',
    includeHashtags = true,
    maxHashtags = 5
  } = options;
  
  // Detect what type of content this is
  const contentType = detectContentType(customPrompt);
  
  let caption = '';
  
  // Generate content based on type
  switch (contentType) {
    case 'event': {
      const eventDetails = extractEventDetails(customPrompt);
      const template = getTemplate('event', style);
      caption = template(eventDetails);
      break;
    }
    
    case 'educational': {
      const topic = extractTopic(customPrompt);
      const template = getTemplate('educational', 'detailed');
      caption = template(topic);
      break;
    }
    
    case 'announcement': {
      const template = getTemplate('announcement', 'exciting');
      caption = template(customPrompt);
      break;
    }
    
    case 'fitness': {
      const details = {
        title: customPrompt,
        exercises: 'Check description',
        duration: 'Your pace',
        difficulty: 'All levels'
      };
      const template = getTemplate('fitness', 'workout');
      caption = template(details);
      break;
    }
    
    default: {
      // General inspirational content
      const template = getTemplate('inspirational', 'motivational');
      caption = template(customPrompt);
    }
  }
  
  // Add custom hashtags if requested
  if (includeHashtags && !caption.includes('#')) {
    const hashtags = generateHashtags(customPrompt, maxHashtags);
    if (hashtags) {
      caption += `\n\n${hashtags}`;
    }
  }
  
  return caption;
};

/**
 * Generate variation of a caption (for testing different versions)
 */
export const generateCaptionVariation = (prompt, variationNumber = 1) => {
  const styles = ['casual', 'professional', 'urgent'];
  const style = styles[variationNumber % styles.length];
  
  return generatePostCaption(prompt, { style });
};

/**
 * Validate generated caption
 */
export const validateCaption = (caption, platform = 'instagram') => {
  const limits = {
    instagram: 2200,
    twitter: 280,
    facebook: 63206,
    linkedin: 3000
  };
  
  const maxLength = limits[platform] || 2200;
  
  return {
    isValid: caption.length <= maxLength,
    length: caption.length,
    maxLength,
    remaining: maxLength - caption.length
  };
};
