# Post Generator Module Structure

This modular structure separates concerns for easier maintenance and testing.

## 📁 File Structure

```
/src
  /data
    contentSchedule.js        # Weekly content logic (day → post type)
  /templates
    index.js                  # Caption templates by type and style
  /utils
    postGenerator.js          # Post assembly and generation functions
```

## 📚 Module Documentation

### `/data/contentSchedule.js`

Manages the weekly content schedule, mapping days to topics and themes.

**Exports:**
- `weeklySchedule` - Object mapping days to content configuration
- `getTopicForDay(dayName)` - Get content settings for a specific day
- `getWeekSchedule(startDay)` - Get reordered week starting from any day

**Example:**
```javascript
import { getTopicForDay } from './data/contentSchedule';

const mondayTopic = getTopicForDay('monday');
// { primaryTopic: 'mindfulness', theme: 'Fresh Start', ... }
```

---

### `/templates/index.js`

Caption templates organized by content type and style variations.

**Template Types:**
- `event` - Event announcements (casual, professional, urgent)
- `educational` - How-to and learning content (detailed, quickTip, tutorial)
- `announcement` - News and updates (exciting, milestone)
- `inspirational` - Motivational content (motivational, reflection)
- `fitness` - Workout posts (workout, progress)

**Exports:**
- `captionTemplates` - All template collections
- `getTemplate(type, style)` - Get specific template function
- `detectContentType(text)` - Auto-detect content type from prompt

**Example:**
```javascript
import { getTemplate, detectContentType } from './templates';

const type = detectContentType("Join us for a meetup at 6pm");
// Returns: 'event'

const template = getTemplate('event', 'casual');
const caption = template({
  description: "Community meetup",
  time: "6pm",
  location: "Main Hall"
});
```

---

### `/utils/postGenerator.js`

Core post generation utilities and helper functions.

**Main Functions:**

#### `generatePostCaption(customPrompt, options)`
Primary function to generate social media captions.

**Parameters:**
- `customPrompt` (string) - User's input/prompt
- `options` (object)
  - `style` - 'casual', 'professional', or 'urgent' (default: 'casual')
  - `includeHashtags` - Generate hashtags (default: true)
  - `maxHashtags` - Maximum hashtags to generate (default: 5)

**Returns:** Formatted caption string

**Example:**
```javascript
import { generatePostCaption } from './utils/postGenerator';

const caption = generatePostCaption(
  "Meetup on Wednesday at 6:45pm at All Saints Church",
  { style: 'casual', maxHashtags: 5 }
);
```

#### `extractEventDetails(prompt)`
Extracts time, day, and location from event prompts.

**Returns:**
```javascript
{
  description: "full prompt text",
  time: "6:45pm",
  day: "Wednesday",
  location: "All Saints Church"
}
```

#### `extractTopic(prompt)`
Cleans and extracts the main topic from educational prompts.

#### `generateHashtags(text, maxTags)`
Generates relevant hashtags from text content.

#### `validateCaption(caption, platform)`
Validates caption length against platform limits.

**Returns:**
```javascript
{
  isValid: true,
  length: 450,
  maxLength: 2200,
  remaining: 1750
}
```

---

## 🔧 Usage in Main App

### Integration Example

In your `App.js`, replace the custom prompt handler:

```javascript
import { generatePostCaption } from './utils/postGenerator';

// In your generateAIContent function:
if (data.customPrompt) {
  console.log(`✨ Processing custom prompt: "${data.customPrompt}"`);
  
  const generatedCaption = generatePostCaption(data.customPrompt, {
    style: 'casual',
    includeHashtags: true,
    maxHashtags: 5
  });
  
  return generatedCaption;
}
```

### Testing Different Styles

```javascript
import { generateCaptionVariation } from './utils/postGenerator';

// Generate 3 variations
const variation1 = generateCaptionVariation(prompt, 0); // casual
const variation2 = generateCaptionVariation(prompt, 1); // professional  
const variation3 = generateCaptionVariation(prompt, 2); // urgent
```

---

## 🎨 Customization

### Adding New Templates

Edit `/templates/index.js`:

```javascript
export const captionTemplates = {
  // ... existing templates ...
  
  myNewType: {
    style1: (data) => `Your template with ${data.field}`,
    style2: (data) => `Another variation with ${data.field}`
  }
};
```

### Adding New Content Types

Update `detectContentType` in `/templates/index.js`:

```javascript
export const detectContentType = (text) => {
  const lowerText = text.toLowerCase();
  
  // Add new detection logic
  if (lowerText.includes('your-keyword')) {
    return 'your-new-type';
  }
  
  // ... existing logic ...
};
```

---

## 📊 Benefits of This Structure

✅ **Separation of Concerns** - Data, templates, and logic are separated  
✅ **Easy Testing** - Each module can be tested independently  
✅ **Maintainability** - Find and edit specific functionality quickly  
✅ **Reusability** - Import only what you need  
✅ **Scalability** - Easy to add new templates and content types  
✅ **Type Safety** - Clear function signatures and expected data shapes  

---

## 🚀 Next Steps

1. **Import these modules** into your `App.js`
2. **Replace the inline custom prompt handler** with `generatePostCaption()`
3. **Test with various prompts** to ensure proper content generation
4. **Add new templates** as needed for your specific use cases
5. **Consider adding TypeScript** for better type checking

---

## 📝 Example Prompts and Expected Outputs

### Event Prompt
**Input:** "Meetup on Wednesday at 6:45pm at All Saints Church in Pasadena"

**Output:**
```
🌟 Save the date! Meetup on Wednesday at 6:45pm...
📅 When: Wednesday at 6:45pm
📍 Where: All Saints Church in Pasadena
[... rest of event template]
```

### Educational Prompt
**Input:** "Share mindfulness exercises"

**Output:**
```
💡 Let's talk about mindfulness exercises

Here's what you need to know:
[... educational template with tips]
```

### General Prompt
**Input:** "Feeling grateful today"

**Output:**
```
✨ Feeling grateful today

This is something I've been thinking about lately...
[... inspirational template]
```
