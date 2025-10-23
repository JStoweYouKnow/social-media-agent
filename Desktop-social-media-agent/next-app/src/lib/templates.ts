type TemplateData = Record<string, any>;

export const templates = {
  quote: (data: TemplateData) => `✨ ${data.quote || 'Start your week with purpose'}

${data.context || 'Every Monday is a chance to begin again. Choose progress over perfection.'}

#ProjectComfort #MotivationMonday`,

  event: (data: TemplateData) => `📅 ${data.title || 'Community Meetup'}

Join us ${data.date || 'this week'} ${data.time ? `at ${data.time}` : ''}
📍 Location: ${data.location || 'TBA'}

${data.details || 'Come together for connection, conversation, and community.'}

${data.link ? `🔗 ${data.link}\n\n` : ''}#ProjectComfort #ComfortCollective #CommunityFirst`,

  insight: (data: TemplateData) => `💡 Real Estate Insight: ${data.tip || 'Market Update'}

${data.context || 'Understanding the market helps you make informed decisions.'}

#ProjectComfort #RealEstateTips #MarketInsights`,

  recipePost: (data: TemplateData) => `🍽️ ${data.title || 'Recipe of the Week'}

${data.description || 'Delicious and nutritious meal to fuel your week.'}

${data.ingredients ? `📝 Key Ingredients: ${data.ingredients}\n\n` : ''}#ProjectComfort #MealPrepFriday #FallFlavors`,

  fitness: (data: TemplateData) => `💪 ${data.title || 'Weekend Workout'}

${data.exercises || 'Get moving this weekend!'}

Discipline creates freedom.

#ProjectComfort #WeekendWorkout #FitnessMotivation`,

  sweet: (data: TemplateData) => `🍰 ${data.title || 'Sunday Reflection'}

${data.reflection || 'Taking time to pause and appreciate the week.'}

${data.gratitude || 'This week, I am grateful for community, growth, and connection.'}

#ProjectComfort #SundayReflection #Gratitude`
};

export function getTemplate(templateName: keyof typeof templates) {
  return templates[templateName] || templates.quote;
}


