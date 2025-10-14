// CommonJS version for API server
const { getTemplate } = require('./templates.js');
const { getScheduleForDay } = require('./contentSchedule.js');

function generatePost(day, data) {
  const schedule = getScheduleForDay(day);
  
  if (!schedule) {
    console.error(`No schedule found for day: ${day}`);
    return `Post for ${day}: ${data.title || data.content || 'Content'}`;
  }
  
  const template = getTemplate(schedule.template);
  
  if (typeof template !== 'function') {
    console.error(`Template ${schedule.template} is not a function`);
    return `Post for ${day}: ${data.title || data.content || 'Content'}`;
  }
  
  try {
    return template(data);
  } catch (error) {
    console.error(`Error generating post for ${day}:`, error);
    return `Post for ${day}: ${data.title || data.content || 'Content'}`;
  }
}

module.exports = {
  generatePost
};
