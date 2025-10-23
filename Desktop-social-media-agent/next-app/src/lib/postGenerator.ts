import { getTemplate } from './templates';
import { getScheduleForDay } from './contentSchedule';

export function generatePost(day: string, data: Record<string, any>): string {
  const schedule = getScheduleForDay(day);
  if (!schedule) {
    return `Post for ${day}: ${data.title || data.content || 'Content'}`;
  }

  const template = getTemplate(schedule.template);
  try {
    return template(data);
  } catch {
    return `Post for ${day}: ${data.title || data.content || 'Content'}`;
  }
}


