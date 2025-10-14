// Canva API integration for design generation
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

/**
 * POST /api/canva/create
 * Generate a design from a Canva template
 * 
 * Body:
 * - templateId: Canva template ID
 * - variables: Object with template variable values (text, images, etc.)
 * 
 * Example:
 * {
 *   templateId: "DAFxxx",
 *   variables: {
 *     title: "Project Comfort Meetup",
 *     date: "October 16, 2024",
 *     location: "All Saints Church"
 *   }
 * }
 */
router.post("/create", async (req, res) => {
  const { templateId, variables } = req.body;

  // Validation
  if (!templateId) {
    return res.status(400).json({ 
      success: false, 
      message: "Template ID is required" 
    });
  }

  if (!process.env.CANVA_API_KEY) {
    return res.status(500).json({ 
      success: false, 
      message: "Canva API key not configured" 
    });
  }

  try {
    const response = await fetch(`https://api.canva.com/v1/designs/${templateId}/links`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CANVA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ variables: variables || {} })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Canva API error: ${response.status}`);
    }

    const data = await response.json();
    
    res.json({ 
      success: true, 
      designLink: data.url,
      templateId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Canva API Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/canva/autofill
 * Auto-populate Canva template with Post Planner data
 * 
 * Body:
 * - templateId: Canva template ID
 * - postData: Post data from Post Planner
 * - day: Day of the week
 */
router.post("/autofill", async (req, res) => {
  const { templateId, postData, day } = req.body;

  if (!templateId || !postData) {
    return res.status(400).json({ 
      success: false, 
      message: "Template ID and post data are required" 
    });
  }

  try {
    // Map Post Planner data to Canva variables
    const variables = {
      // Text fields
      caption: postData.caption || "",
      hashtags: postData.hashtags || "#ProjectComfort",
      date: postData.date || new Date().toLocaleDateString(),
      
      // Day-specific fields
      ...(day === "Monday" && { 
        quote: postData.quote || "",
        author: postData.author || ""
      }),
      
      ...(day === "Wednesday" && { 
        eventTitle: postData.title || "Community Meetup",
        time: postData.time || "6:45pm",
        location: postData.location || "All Saints Church"
      }),
      
      ...(day === "Thursday" && { 
        tip: postData.tip || postData.insight || ""
      }),
      
      ...(day === "Friday" && { 
        recipeTitle: postData.title || "",
        ingredients: postData.ingredients || ""
      }),
      
      ...(day === "Saturday" && { 
        workoutTitle: postData.title || "",
        exercises: postData.exercises || ""
      }),
      
      ...(day === "Sunday" && { 
        reflection: postData.reflection || ""
      }),
      
      // Image URL if provided
      ...(postData.imageUrl && { image: postData.imageUrl })
    };

    const response = await fetch(`https://api.canva.com/v1/designs/${templateId}/links`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CANVA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ variables })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Canva API error: ${response.status}`);
    }

    const data = await response.json();
    
    res.json({ 
      success: true, 
      designLink: data.url,
      variables,
      day
    });
    
  } catch (error) {
    console.error("Canva Autofill Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/canva/batch
 * Generate multiple designs from templates (weekly batch)
 * 
 * Body:
 * - designs: Array of { templateId, variables, day }
 */
router.post("/batch", async (req, res) => {
  const { designs } = req.body;

  if (!designs || !Array.isArray(designs) || designs.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: "Designs array is required" 
    });
  }

  try {
    const results = [];
    const errors = [];

    for (const design of designs) {
      const { templateId, variables, day } = design;
      
      try {
        const response = await fetch(`https://api.canva.com/v1/designs/${templateId}/links`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.CANVA_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ variables: variables || {} })
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            success: true,
            day,
            templateId,
            designLink: data.url
          });
        } else {
          const errorData = await response.json();
          errors.push({
            day,
            templateId,
            error: errorData.message || `Status ${response.status}`
          });
        }
      } catch (error) {
        errors.push({
          day,
          templateId,
          error: error.message
        });
      }

      // Rate limiting: wait 200ms between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    res.json({ 
      success: errors.length === 0,
      results,
      errors: errors.length > 0 ? errors : undefined,
      total: designs.length,
      successful: results.length,
      failed: errors.length
    });
    
  } catch (error) {
    console.error("Canva Batch Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * GET /api/canva/templates
 * List available Canva templates (mock endpoint - replace with actual API call)
 */
router.get("/templates", async (req, res) => {
  try {
    // Mock data - replace with actual Canva API call when available
    const templates = [
      {
        id: "DAF_Monday_Quote",
        name: "Monday Motivation Quote",
        day: "Monday",
        description: "Minimalist quote template with Project Comfort branding"
      },
      {
        id: "DAF_Wednesday_Event",
        name: "Wednesday Meetup Event",
        day: "Wednesday",
        description: "Event flyer with date, time, and location fields"
      },
      {
        id: "DAF_Thursday_RealEstate",
        name: "Thursday Real Estate Tip",
        day: "Thursday",
        description: "Professional tip card with house icon"
      },
      {
        id: "DAF_Friday_Recipe",
        name: "Friday Recipe Card",
        day: "Friday",
        description: "Recipe template with ingredients and instructions"
      },
      {
        id: "DAF_Saturday_Workout",
        name: "Saturday Workout",
        day: "Saturday",
        description: "Fitness motivation with exercise list"
      },
      {
        id: "DAF_Sunday_Reflection",
        name: "Sunday Reflection",
        day: "Sunday",
        description: "Gratitude and reflection card"
      }
    ];

    res.json({ 
      success: true, 
      templates,
      count: templates.length
    });
    
  } catch (error) {
    console.error("Templates Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
