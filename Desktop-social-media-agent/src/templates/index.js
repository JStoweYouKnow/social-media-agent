// Caption templates organized by post type
// Each template is a function that takes data and returns a formatted caption

const templates = {
  // Monday: Motivational quote
  quote: (data) => 
    `✨ ${data.quote || 'Start your week with purpose'}

${data.context || 'Every Monday is a chance to begin again. Choose progress over perfection.'}

#ProjectComfort #MotivationMonday`,

  // Tuesday/Wednesday: Event posts
  event: (data) => 
    `📅 ${data.title || 'Community Meetup'}

Join us ${data.date || 'this week'} at ${data.location || 'our usual spot'}

${data.details || 'Bring your energy and enthusiasm!'}

${data.link || ''}

#ComfortCollective #RealEstateCommunity #ProjectComfort`,

  // Thursday: Real estate insights
  insight: (data) => 
    `💡 Real Estate Insight: ${data.tip || data.title || 'Market Update'}

${data.context || data.content || 'Stay informed about the market trends that matter to you.'}

${data.details || ''}

#RealEstateTips #ProjectComfort #MarketInsights`,

  // Friday: Recipe posts
  recipePost: (data) => 
    `🍽️ ${data.title || 'Meal Prep Friday'}

${data.description || data.content || 'Get ready for the week ahead with this delicious recipe.'}

${data.ingredients ? `\n📝 Key ingredients:\n${data.ingredients}` : ''}

#MealPrepFriday #FallFlavors #ProjectComfort #Cooking`,

  // Saturday: Fitness/workout posts
  fitness: (data) => 
    `💪 ${data.title || 'Weekend Workout'}

${data.details || data.content || 'Time to move your body and build strength.'}

${data.exercises || ''}

Discipline creates freedom.

#ProjectComfort #WeekendWorkout #DisciplineEqualsFreedom #Fitness`,

  // Sunday: Reflection/gratitude posts
  sweet: (data) => 
    `🍰 ${data.title || 'Sunday Reflection'}

${data.reflection || data.content || 'Take a moment to appreciate how far you\'ve come this week.'}

${data.gratitude ? `\nGrateful for: ${data.gratitude}` : ''}

#SundayReflection #Gratitude #ProjectComfort #Mindfulness`
};

// Helper function to get template by name
export const getTemplate = (templateName) => {
  return templates[templateName] || templates.quote;
};

// Legacy captionTemplates for backward compatibility  
export const captionTemplates = {
  // Event-focused templates
  event: {
    casual: (details) => `🌟 Save the date! ${details.description}

📅 When: ${details.day || 'Soon'} at ${details.time || 'TBA'}
📍 Where: ${details.location || 'Details below'}

This is going to be amazing and I'd love to see you there! 

✨ What to expect:
• Meaningful connections
• Inspiring conversations  
• A welcoming community
• Great energy and vibes

💬 Comment "I'm in!" if you're coming
📲 Share with someone who needs to be there
🔔 Turn on notifications so you don't miss updates

See you soon! 🙌

#community #event #meetup #connection #together`,

    professional: (details) => `📢 Event Announcement

${details.description}

📅 Date & Time: ${details.day || 'TBD'} | ${details.time || 'TBD'}
📍 Location: ${details.location || 'Will be announced'}

We're excited to bring this experience to you. Mark your calendars and join us for an enriching event.

Registration details and updates coming soon.

#event #community #professional #networking`,

    urgent: (details) => `⚡ DON'T MISS THIS! ${details.description}

🗓️ ${details.day || 'This week'} @ ${details.time || 'Check comments'}
📍 ${details.location || 'Location in bio'}

Spots are filling up fast! Drop a comment or DM to secure your spot.

#limitedspots #event #dontmiss #rsvp`
  },

  // Educational/how-to templates
  educational: {
    detailed: (topic) => `💡 Let's talk about ${topic}

Here's what you need to know:

${topic.charAt(0).toUpperCase() + topic.slice(1)} can truly transform your daily experience when you approach it with intention and consistency.

🔑 Key points to remember:
• Start small and build gradually
• Consistency matters more than perfection
• Find what works for YOUR unique situation
• Be patient with yourself in the process

✨ Why this matters right now:
In our fast-paced world, taking time for ${topic.toLowerCase()} isn't just helpful—it's essential for your wellbeing.

💬 What's your experience with this? Drop a comment below!
📌 Save this post for later reference
🔄 Share with someone who could benefit

#wellness #selfcare #mindfulness #growth #lifestyle`,

    quickTip: (topic) => `⚡ Quick Tip: ${topic}

Here's something that changed the game for me...

[Your insight here]

Try it out and let me know how it goes! 👇

#tips #lifehack #productivity #growth`,

    tutorial: (steps) => `📚 Step-by-Step Guide

${steps.title || 'How to get started'}:

${steps.points?.map((point, i) => `${i + 1}. ${point}`).join('\n') || '• Follow along below'}

💡 Pro tip: Take it one step at a time!

Questions? Drop them in the comments! 👇

#tutorial #howto #learn #education #guide`
  },

  // Announcement templates
  announcement: {
    exciting: (content) => `🎉 ${content}

I'm thrilled to share this with you all! This has been in the works and I couldn't be more excited about what's coming.

✨ Why this is special:
This represents something meaningful and I believe it's going to make a real impact.

💫 What's next:
Stay tuned for more updates! I'll be sharing more details soon.

Drop a 🎉 in the comments if you're excited too!

#announcement #excited #community #news #update`,

    milestone: (achievement) => `🏆 Milestone Unlocked!

${achievement}

This journey has been incredible, and I'm so grateful for everyone who's been part of it.

Thank you for your support! Here's to what's next 🚀

#milestone #grateful #growth #achievement #celebration`
  },

  // General inspirational templates
  inspirational: {
    motivational: (message) => `✨ ${message}

This is something I've been thinking about lately, and I wanted to share it with you.

Here's why it matters:

In a world that's constantly demanding our attention, taking a moment to focus on what truly matters can make all the difference. Whether you're just starting out or you've been on this journey for a while, every step counts.

💫 Remember:
• Progress over perfection
• Small actions lead to big changes
• Your journey is unique to you
• Community makes everything better

What are your thoughts on this? I'd love to hear from you in the comments! 👇

#inspiration #community #growth #mindfulness #lifestyle`,

    reflection: (thought) => `🌙 Sunday Reflection

${thought}

Sometimes we need to pause and remember why we started.

What's one thing you're grateful for today?

#reflection #gratitude #mindfulness #sunday #selfcare`
  },

  // Fitness/workout templates
  fitness: {
    workout: (details) => `💪 Workout of the Day

${details.title || 'Time to move!'}

🏋️ ${details.exercises || 'Full body workout'}
⏱️ ${details.duration || '30 minutes'}
🎯 ${details.difficulty || 'All levels welcome'}

Remember: It's not about being perfect, it's about showing up!

Drop a 💪 if you're in!

#fitness #workout #exercise #motivation #fitfam`,

    progress: (achievement) => `🔥 Progress Check!

${achievement}

Your fitness journey is unique to you. Celebrate every win, no matter how small!

What's one fitness goal you're working toward? 👇

#fitness #progress #fitnessmotivation #goals #consistency`
  }
};

// Helper function to get template by type and style (for legacy captionTemplates)
export const getTemplateByTypeAndStyle = (type, style = 'casual') => {
  return captionTemplates[type]?.[style] || captionTemplates.inspirational.motivational;
};

// Helper to detect content type from text
export const detectContentType = (text) => {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('meetup') || lowerText.includes('event') || /\d{1,2}:\d{2}/.test(text)) {
    return 'event';
  }
  if (lowerText.includes('how to') || lowerText.includes('guide') || lowerText.includes('tips')) {
    return 'educational';
  }
  if (lowerText.includes('announcing') || lowerText.includes('excited to')) {
    return 'announcement';
  }
  if (lowerText.includes('workout') || lowerText.includes('fitness') || lowerText.includes('exercise')) {
    return 'fitness';
  }
  
  return 'inspirational';
};

// Export default templates object
export default templates;
