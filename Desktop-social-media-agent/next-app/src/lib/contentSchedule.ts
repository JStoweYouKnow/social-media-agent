export type WeeklyScheduleItem = {
  day: string;
  type: string;
  template: 'quote' | 'event' | 'insight' | 'recipePost' | 'fitness' | 'sweet';
  source: 'quotes' | 'events' | 'insights' | 'recipes' | 'workouts' | 'desserts';
  description: string;
};

export const weeklySchedule: WeeklyScheduleItem[] = [
  { day: 'Monday', type: 'Motivational', template: 'quote', source: 'quotes', description: 'Start the week with inspiration' },
  { day: 'Tuesday', type: 'Meetup Reminder', template: 'event', source: 'events', description: 'Remind about upcoming Wednesday meetup' },
  { day: 'Wednesday', type: 'Meetup Day', template: 'event', source: 'events', description: 'Main event day - meetup announcement' },
  { day: 'Thursday', type: 'Real Estate Insight', template: 'insight', source: 'insights', description: 'Share real estate tips and market insights' },
  { day: 'Friday', type: 'Recipes', template: 'recipePost', source: 'recipes', description: 'Meal prep and cooking inspiration' },
  { day: 'Saturday', type: 'Workout', template: 'fitness', source: 'workouts', description: 'Weekend fitness motivation' },
  { day: 'Sunday', type: 'Reflection', template: 'sweet', source: 'desserts', description: 'Sunday reflection and gratitude' }
];

export function getScheduleForDay(dayName: string): WeeklyScheduleItem | undefined {
  return weeklySchedule.find(d => d.day.toLowerCase() === dayName.toLowerCase());
}

export function getScheduleByIndex(index: number): WeeklyScheduleItem {
  return weeklySchedule[index % 7];
}

export function getWeekSchedule(startDay: string = 'Monday'): WeeklyScheduleItem[] {
  const startIndex = weeklySchedule.findIndex(d => d.day.toLowerCase() === startDay.toLowerCase());
  if (startIndex === -1) return weeklySchedule;
  return [
    ...weeklySchedule.slice(startIndex),
    ...weeklySchedule.slice(0, startIndex)
  ];
}


