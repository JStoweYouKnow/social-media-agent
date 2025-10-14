// Post scheduling and weekly generation routes
const express = require('express');
const { weeklySchedule, getScheduleForDay, getWeekSchedule } = require('../api/contentSchedule.js');
const { generatePost } = require('../api/postGenerator.js');

const router = express.Router();

/**
 * POST /api/schedule/generate-week
 * Generate a full week of posts using the content schedule
 * 
 * Body:
 * - contentData: Object with data for each source
 *   {
 *     quotes: { quote: "...", author: "...", context: "..." },
 *     events: { title: "...", date: "...", time: "...", location: "..." },
 *     insights: { tip: "...", context: "..." },
 *     recipes: { title: "...", description: "...", ingredients: "..." },
 *     workouts: { title: "...", exercises: "...", duration: "..." },
 *     sweets: { title: "...", reflection: "..." }
 *   }
 * - startDay: Optional starting day (default: Monday)
 */
router.post("/generate-week", async (req, res) => {
  const { contentData, startDay = "Monday" } = req.body;

  if (!contentData) {
    return res.status(400).json({ 
      success: false, 
      message: "contentData is required" 
    });
  }

  try {
    const schedule = getWeekSchedule(startDay);
    const posts = [];
    const errors = [];

    for (const item of schedule) {
      try {
        // Get data for this day's source
        const data = contentData[item.source];
        
        if (!data) {
          errors.push({
            day: item.day,
            error: `Missing data for source: ${item.source}`
          });
          continue;
        }

        // Generate post caption
        const caption = generatePost(item.day, data);

        posts.push({
          day: item.day,
          caption,
          type: item.type,
          template: item.template,
          source: item.source,
          description: item.description
        });
      } catch (error) {
        errors.push({
          day: item.day,
          error: error.message
        });
      }
    }

    res.json({ 
      success: errors.length === 0,
      posts,
      errors: errors.length > 0 ? errors : undefined,
      startDay,
      count: posts.length
    });
    
  } catch (error) {
    console.error("Generate Week Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/schedule/generate-day
 * Generate a single day's post
 * 
 * Body:
 * - day: Day name (Monday-Sunday)
 * - data: Content data for that day
 */
router.post("/generate-day", async (req, res) => {
  const { day, data } = req.body;

  if (!day || !data) {
    return res.status(400).json({ 
      success: false, 
      message: "Day and data are required" 
    });
  }

  try {
    const schedule = getScheduleForDay(day);
    
    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: `No schedule found for day: ${day}` 
      });
    }

    const caption = generatePost(day, data);

    res.json({ 
      success: true,
      post: {
        day: schedule.day,
        caption,
        type: schedule.type,
        template: schedule.template,
        source: schedule.source,
        description: schedule.description
      }
    });
    
  } catch (error) {
    console.error("Generate Day Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * GET /api/schedule/weekly
 * Get the weekly content schedule (template info only)
 * 
 * Query:
 * - startDay: Optional starting day (default: Monday)
 */
router.get("/weekly", (req, res) => {
  try {
    const { startDay = "Monday" } = req.query;
    const schedule = getWeekSchedule(startDay);

    res.json({ 
      success: true,
      schedule,
      startDay,
      count: schedule.length
    });
    
  } catch (error) {
    console.error("Weekly Schedule Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * GET /api/schedule/day/:dayName
 * Get schedule info for a specific day
 */
router.get("/day/:dayName", (req, res) => {
  try {
    const { dayName } = req.params;
    const schedule = getScheduleForDay(dayName);

    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: `No schedule found for day: ${dayName}` 
      });
    }

    res.json({ 
      success: true,
      schedule
    });
    
  } catch (error) {
    console.error("Day Schedule Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/schedule/batch-with-images
 * Generate weekly posts with Canva design links
 * 
 * Body:
 * - contentData: Content for each day
 * - canvaTemplates: Object mapping days to template IDs
 * - startDay: Optional starting day
 */
router.post("/batch-with-images", async (req, res) => {
  const { contentData, canvaTemplates = {}, startDay = "Monday" } = req.body;

  if (!contentData) {
    return res.status(400).json({ 
      success: false, 
      message: "contentData is required" 
    });
  }

  try {
    const schedule = getWeekSchedule(startDay);
    const posts = [];
    const errors = [];

    for (const item of schedule) {
      try {
        const data = contentData[item.source];
        
        if (!data) {
          errors.push({
            day: item.day,
            error: `Missing data for source: ${item.source}`
          });
          continue;
        }

        const caption = generatePost(item.day, data);
        const templateId = canvaTemplates[item.day];

        posts.push({
          day: item.day,
          caption,
          type: item.type,
          template: item.template,
          canvaTemplateId: templateId || null,
          ready: !!templateId
        });
      } catch (error) {
        errors.push({
          day: item.day,
          error: error.message
        });
      }
    }

    res.json({ 
      success: errors.length === 0,
      posts,
      errors: errors.length > 0 ? errors : undefined,
      startDay,
      total: posts.length,
      withImages: posts.filter(p => p.ready).length
    });
    
  } catch (error) {
    console.error("Batch with Images Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/schedule/validate
 * Validate content data before generating posts
 * 
 * Body:
 * - contentData: Content to validate
 */
router.post("/validate", (req, res) => {
  const { contentData } = req.body;

  if (!contentData) {
    return res.status(400).json({ 
      success: false, 
      message: "contentData is required" 
    });
  }

  try {
    const validation = {
      valid: true,
      missing: [],
      incomplete: []
    };

    // Check each day's required source
    for (const item of weeklySchedule) {
      const data = contentData[item.source];
      
      if (!data) {
        validation.valid = false;
        validation.missing.push({
          day: item.day,
          source: item.source,
          type: item.type
        });
        continue;
      }

      // Check for required fields based on template type
      const requiredFields = {
        quote: ['quote'],
        event: ['title', 'date'],
        insight: ['tip'],
        recipePost: ['title'],
        fitness: ['title'],
        sweet: ['title']
      };

      const required = requiredFields[item.template] || [];
      const missingFields = required.filter(field => !data[field]);

      if (missingFields.length > 0) {
        validation.valid = false;
        validation.incomplete.push({
          day: item.day,
          source: item.source,
          missingFields
        });
      }
    }

    res.json({ 
      success: true,
      validation
    });
    
  } catch (error) {
    console.error("Validation Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
