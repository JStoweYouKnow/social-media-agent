// Example usage of the modular post generation system

import { generatePost } from './utils/postGenerator';
import { getScheduleForDay, weeklySchedule } from './data/contentSchedule';

// ============================================
// EXAMPLE 1: Generate Monday motivational post
// ============================================
const mondayData = {
  quote: "The secret of getting ahead is getting started.",
  context: "Don't wait for the perfect moment. Start where you are, use what you have, do what you can."
};

const mondayPost = generatePost("Monday", mondayData);
console.log("Monday Post:", mondayPost);
/* Output:
✨ The secret of getting ahead is getting started.

Don't wait for the perfect moment. Start where you are, use what you have, do what you can.

#ProjectComfort #MotivationMonday
*/

// ============================================
// EXAMPLE 2: Generate Wednesday event post
// ============================================
const wednesdayData = {
  title: "Weekly Community Meetup",
  date: "Wednesday at 6:45pm",
  location: "All Saints Church in Pasadena",
  details: "Join us for networking, discussion, and community building.",
  link: "RSVP: projectcomfort.com/events"
};

const wednesdayPost = generatePost("Wednesday", wednesdayData);
console.log("Wednesday Post:", wednesdayPost);
/* Output:
📅 Weekly Community Meetup

Join us Wednesday at 6:45pm at All Saints Church in Pasadena

Join us for networking, discussion, and community building.

RSVP: projectcomfort.com/events

#ComfortCollective #RealEstateCommunity #ProjectComfort
*/

// ============================================
// EXAMPLE 3: Generate Friday recipe post  
// ============================================
const fridayData = {
  title: "Fall Harvest Bowl",
  description: "Perfect meal prep for busy weeks! This hearty bowl is packed with seasonal vegetables and plant-based protein.",
  ingredients: "Roasted sweet potato, quinoa, kale, chickpeas, tahini dressing"
};

const fridayPost = generatePost("Friday", fridayData);
console.log("Friday Post:", fridayPost);

// ============================================
// EXAMPLE 4: Check schedule for any day
// ============================================
const thursdaySchedule = getScheduleForDay("Thursday");
console.log("Thursday Schedule:", thursdaySchedule);
/* Output:
{
  day: "Thursday",
  type: "Real Estate Insight",
  template: "insight",
  source: "insights",
  description: "Share real estate tips and market insights"
}
*/

// ============================================
// EXAMPLE 5: Generate entire week's posts
// ============================================
function generateWeeklyPosts(weekData) {
  return weeklySchedule.map(schedule => {
    const data = weekData[schedule.day.toLowerCase()];
    return {
      day: schedule.day,
      type: schedule.type,
      post: generatePost(schedule.day, data)
    };
  });
}

const weekData = {
  monday: {
    quote: "Progress, not perfection.",
    context: "Every step forward counts."
  },
  tuesday: {
    title: "Meetup Reminder",
    date: "tomorrow at 6:45pm",
    location: "All Saints Church"
  },
  // ... data for other days
};

const allPosts = generateWeeklyPosts(weekData);
console.log("Weekly Posts Generated:", allPosts.length);

// ============================================
// EXAMPLE 6: React component usage
// ============================================
/*
function PostPreview({ selectedDay, formData }) {
  try {
    const post = generatePost(selectedDay, formData);
    const schedule = getScheduleForDay(selectedDay);
    
    return (
      <div className="preview-box">
        <h3>{selectedDay} - {schedule.type}</h3>
        <p className="post-content">{post}</p>
        <button onClick={() => navigator.clipboard.writeText(post)}>
          Copy to Clipboard
        </button>
      </div>
    );
  } catch (error) {
    return <div className="error">Error: {error.message}</div>;
  }
}
*/

export {
  mondayPost,
  wednesdayPost,
  fridayPost,
  generateWeeklyPosts
};
