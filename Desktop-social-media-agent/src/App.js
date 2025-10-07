import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Upload, Copy, Share, Target, FileText, ChefHat, Dumbbell, Camera, Lightbulb, X, Eye, Edit2, Check, Plane, Smartphone, DollarSign, Sparkles, Heart, Building, Coffee, ChevronDown, Download, Home, GraduationCap, Zap } from 'lucide-react';

function PreBuffer() {
  // State initialization
  const [recipes, setRecipes] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [realEstateTips, setRealEstateTips] = useState([]);
  const [mindfulnessPosts, setMindfulnessPosts] = useState([]);
  const [educationalContent, setEducationalContent] = useState([]);
  const [motivationalContent, setMotivationalContent] = useState([]);
  const [contentCalendar, setContentCalendar] = useState([]);
  
  // New specialized categories
  const [travelContent, setTravelContent] = useState([]);
  const [techContent, setTechContent] = useState([]);
  const [financeContent, setFinanceContent] = useState([]);
  const [beautyContent, setBeautyContent] = useState([]);
  const [parentingContent, setParentingContent] = useState([]);
  const [businessContent, setBusinessContent] = useState([]);
  const [lifestyleContent, setLifestyleContent] = useState([]);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Form states
  const [newRecipe, setNewRecipe] = useState({ title: '', ingredients: '', instructions: '', tags: '', url: '' });
  const [newWorkout, setNewWorkout] = useState({ title: '', exercises: '', duration: '', difficulty: '', tags: '', url: '' });
  const [newRealEstateTip, setNewRealEstateTip] = useState({ title: '', content: '', category: '', tags: '', url: '' });
  const [newMindfulness, setNewMindfulness] = useState({ title: '', content: '', practice: '', tags: '', url: '' });
  const [newEducational, setNewEducational] = useState({ title: '', content: '', category: '', tags: '', url: '' });
  const [newMotivational, setNewMotivational] = useState({ title: '', content: '', theme: '', tags: '', url: '' });
  
  // New specialized category form states
  const [newTravel, setNewTravel] = useState({ title: '', destination: '', content: '', category: '', tags: '', url: '' });
  const [newTech, setNewTech] = useState({ title: '', content: '', category: '', tags: '', url: '' });
  const [newFinance, setNewFinance] = useState({ title: '', content: '', type: '', tags: '', url: '' });
  const [newBeauty, setNewBeauty] = useState({ title: '', content: '', category: '', tags: '', url: '' });
  const [newParenting, setNewParenting] = useState({ title: '', ageGroup: '', content: '', category: '', tags: '', url: '' });
  const [newBusiness, setNewBusiness] = useState({ title: '', content: '', category: '', tags: '', url: '' });
  const [newLifestyle, setNewLifestyle] = useState({ title: '', content: '', category: '', tags: '', url: '' });
  
  // Preview and editing states
  const [activeImageModal, setActiveImageModal] = useState(null);
  const [previewRecipe, setPreviewRecipe] = useState(null);
  const [previewWorkout, setPreviewWorkout] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  
  // Navigation state
  const [showSpecializedDropdown, setShowSpecializedDropdown] = useState(false);
  
  // Calendar view state
  const [calendarView, setCalendarView] = useState('month'); // 'day', 'week', 'month'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // AI settings
  const [apiKey, setApiKey] = useState('');
  const [llmProvider, setLlmProvider] = useState('openai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [contentComplexity, setContentComplexity] = useState('intermediate');
  const [isFetchingUrl, setIsFetchingUrl] = useState({
    recipe: false,
    workout: false,
    realEstate: false,
    mindfulness: false
  });
  const [contentMix, setContentMix] = useState({
    recipes: true,
    workouts: true,
    realEstate: true,
    mindfulness: true,
    motivational: true,
    educational: true,
    travel: true,
    tech: true,
    finance: true,
    beauty: true,
    parenting: true,
    business: true,
    lifestyle: true
  });
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: 'motivational',
    tuesday: 'workout',
    wednesday: 'mindfulness',
    thursday: 'realEstate',
    friday: 'educational',
    saturday: 'recipe',
    sunday: 'random'
  });
  
  // Generation mode: 'calendar' for Sunday-Saturday, 'nextDay' for starting tomorrow
  const [generationMode, setGenerationMode] = useState('calendar');
  
  // Refs
  const recipeFileInputRef = useRef(null);
  const workoutFileInputRef = useRef(null);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSpecializedDropdown && !event.target.closest('.dropdown-container')) {
        setShowSpecializedDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSpecializedDropdown]);

  const platforms = {
    instagram: { name: 'Instagram', color: 'bg-pink-500', icon: '📸' },
    linkedin: { name: 'LinkedIn', color: 'bg-blue-600', icon: '💼' },
    facebook: { name: 'Facebook', color: 'bg-blue-500', icon: '👥' }
  };

  // Calendar utility functions
  const getCalendarDays = (date, view) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    if (view === 'month') {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      const endDate = new Date(lastDay);
      
      // Get first day of week (Sunday = 0)
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      
      const days = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return days;
    } else if (view === 'week') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }
      
      return days;
    } else { // day
      return [new Date(date)];
    }
  };
  
  const formatDate = (date, format = 'full') => {
    if (format === 'full') {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (format === 'short') {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } else if (format === 'day') {
      return date.getDate().toString();
    }
    return date.toLocaleDateString();
  };
  
  const getContentForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return contentCalendar.filter(content => content.date === dateStr);
  };
  
  const navigateCalendar = (direction) => {
    const newDate = new Date(currentDate);
    
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else { // day
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  const contentTypes = {
    recipe: { name: 'Recipe', icon: ChefHat, color: 'text-orange-500' },
    workout: { name: 'Workout', icon: Dumbbell, color: 'text-green-500' },
    realEstate: { name: 'Real Estate', icon: FileText, color: 'text-blue-500' },
    mindfulness: { name: 'Mindfulness', icon: Target, color: 'text-purple-500' },
    motivational: { name: 'Motivational', icon: Target, color: 'text-pink-500' },
    educational: { name: 'Educational', icon: FileText, color: 'text-indigo-500' }
  };

  // Helper functions
  const addRecipe = () => {
    if (newRecipe.title.trim()) {
      setRecipes([...recipes, { ...newRecipe, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewRecipe({ title: '', ingredients: '', instructions: '', tags: '', url: '' });
    }
  };

  const addWorkout = () => {
    if (newWorkout.title.trim()) {
      setWorkouts([...workouts, { ...newWorkout, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewWorkout({ title: '', exercises: '', duration: '', difficulty: '', tags: '', url: '' });
    }
  };

  const addRealEstateTip = () => {
    if (newRealEstateTip.title.trim()) {
      setRealEstateTips([...realEstateTips, { ...newRealEstateTip, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewRealEstateTip({ title: '', content: '', category: '', tags: '', url: '' });
    }
  };

  const addMindfulness = () => {
    if (newMindfulness.title.trim()) {
      setMindfulnessPosts([...mindfulnessPosts, { ...newMindfulness, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewMindfulness({ title: '', content: '', practice: '', tags: '', url: '' });
    }
  };

  const addEducational = () => {
    if (newEducational.title.trim()) {
      setEducationalContent([...educationalContent, { ...newEducational, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewEducational({ title: '', content: '', category: '', tags: '', url: '' });
    }
  };

  const addMotivational = () => {
    if (newMotivational.title.trim()) {
      setMotivationalContent([...motivationalContent, { ...newMotivational, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewMotivational({ title: '', content: '', theme: '', tags: '', url: '' });
    }
  };

  const addTravel = () => {
    if (newTravel.title.trim()) {
      setTravelContent([...travelContent, { ...newTravel, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewTravel({ title: '', destination: '', content: '', category: '', tags: '', url: '' });
    }
  };

  const addTech = () => {
    if (newTech.title.trim()) {
      setTechContent([...techContent, { ...newTech, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewTech({ title: '', content: '', category: '', tags: '', url: '' });
    }
  };

  const addFinance = () => {
    if (newFinance.title.trim()) {
      setFinanceContent([...financeContent, { ...newFinance, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewFinance({ title: '', content: '', type: '', tags: '', url: '' });
    }
  };

  const addBeauty = () => {
    if (newBeauty.title.trim()) {
      setBeautyContent([...beautyContent, { ...newBeauty, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewBeauty({ title: '', content: '', category: '', tags: '', url: '' });
    }
  };

  const addParenting = () => {
    if (newParenting.title.trim()) {
      setParentingContent([...parentingContent, { ...newParenting, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewParenting({ title: '', content: '', ageGroup: '', tags: '', url: '' });
    }
  };

  const addBusiness = () => {
    if (newBusiness.title.trim()) {
      setBusinessContent([...businessContent, { ...newBusiness, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewBusiness({ title: '', content: '', category: '', tags: '', url: '' });
    }
  };

  const addLifestyle = () => {
    if (newLifestyle.title.trim()) {
      setLifestyleContent([...lifestyleContent, { ...newLifestyle, id: Date.now(), createdAt: new Date().toISOString() }]);
      setNewLifestyle({ title: '', content: '', category: '', tags: '', url: '' });
    }
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
    if (previewRecipe?.id === id) setPreviewRecipe(null);
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
    if (previewWorkout?.id === id) setPreviewWorkout(null);
  };

  const deleteRealEstate = (id) => {
    setRealEstateTips(realEstateTips.filter(t => t.id !== id));
  };

  const deleteMindfulness = (id) => {
    setMindfulnessPosts(mindfulnessPosts.filter(m => m.id !== id));
  };

  const deleteEducational = (id) => {
    setEducationalContent(educationalContent.filter(e => e.id !== id));
  };

  const deleteMotivational = (id) => {
    setMotivationalContent(motivationalContent.filter(m => m.id !== id));
  };

  const deleteTravel = (id) => {
    setTravelContent(travelContent.filter(t => t.id !== id));
  };

  const deleteTech = (id) => {
    setTechContent(techContent.filter(t => t.id !== id));
  };

  const deleteFinance = (id) => {
    setFinanceContent(financeContent.filter(f => f.id !== id));
  };

  const deleteBeauty = (id) => {
    setBeautyContent(beautyContent.filter(b => b.id !== id));
  };

  const deleteParenting = (id) => {
    setParentingContent(parentingContent.filter(p => p.id !== id));
  };

  const deleteBusiness = (id) => {
    setBusinessContent(businessContent.filter(b => b.id !== id));
  };

  const deleteLifestyle = (id) => {
    setLifestyleContent(lifestyleContent.filter(l => l.id !== id));
  };

  const generatePostVariations = async (content, type) => {
    try {
      console.log(`🎨 Generating enhanced variations for ${type} content:`, content.title);
      
      // Generate enhanced fallback variations with our improved templates
      const fallbackVariations = generateFallbackVariations(content, type);
      
      console.log(`✅ Generated enhanced variations for all platforms`);
      return fallbackVariations;
      
    } catch (error) {
      console.error('Error generating enhanced variations:', error);
      
      // Final fallback to basic variations if everything fails
      const basicVariations = generateBasicFallbackVariations(content, type);
      return basicVariations;
    }
  };
  
  // Enhanced fallback variations (better than the old simple templates)
  const generateFallbackVariations = (content, type) => {
    const currentDate = new Date();
    const currentSeason = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter'][currentDate.getMonth()];
    const dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' });
    
    const personalTouches = [
      'been obsessed with this lately', 'completely changed my perspective', 'wish I discovered this sooner',
      'game-changer in my routine', 'exactly what I needed', 'sharing because it works'
    ];
    const randomPersonal = personalTouches[Math.floor(Math.random() * personalTouches.length)];
    
    const seasonalContext = {
      'Winter': 'cozy vibes', 'Spring': 'fresh energy', 'Summer': 'peak season', 'Fall': 'harvest time'
    };
    
    const variations = {
      instagram: {},
      linkedin: {},
      facebook: {}
    };
    
    // Enhanced Instagram variations with personality and context
    variations.instagram[type] = generateEnhancedInstagramPost(content, type, currentSeason, randomPersonal);
    variations.linkedin[type] = generateEnhancedLinkedInPost(content, type, currentSeason, dayOfWeek);
    variations.facebook[type] = generateEnhancedFacebookPost(content, type, currentSeason, randomPersonal);
    
    return variations;
  };
  
  const generateEnhancedInstagramPost = (content, type, season, personal) => {
    const typeConfigs = {
      recipe: {
        emoji: '🍽️', hook: `${season} cooking hits different when you discover`, 
        cta: 'Save this for your next meal prep!', hashtags: '#healthyeating #mealprep #foodie #recipe'
      },
      workout: {
        emoji: '💪', hook: `That moment when you realize`, 
        cta: 'Tag someone who needs this energy!', hashtags: '#fitness #workout #motivation #strong'
      },
      travel: {
        emoji: '✈️', hook: `${content.destination || 'This destination'} wasn't even on my radar until I discovered`, 
        cta: 'Adding this to your bucket list?', hashtags: '#travel #wanderlust #adventure #explore'
      },
      tech: {
        emoji: '📱', hook: `I've ${personal} with this ${content.category || 'tech'}.`, 
        cta: 'Anyone else trying this?', hashtags: '#tech #innovation #gadgets #techtips'
      },
      finance: {
        emoji: '💰', hook: `The ${content.type || 'money'} strategy I've ${personal}:`, 
        cta: 'What\'s your money goal this ${season.toLowerCase()}?', hashtags: '#finance #money #investing #financialfreedom'
      },
      beauty: {
        emoji: '✨', hook: `${season} glow-up starts with`, 
        cta: 'Drop your favorite beauty hack below!', hashtags: '#beauty #skincare #selfcare #glowup'
      },
      parenting: {
        emoji: '👨‍👩‍👧‍👦', hook: `Parenting ${content.ageGroup || 'kids'} taught me that`, 
        cta: 'Other parents - can you relate?', hashtags: '#parenting #momlife #dadlife #family'
      },
      business: {
        emoji: '💼', hook: `The ${content.category || 'business'} lesson I've ${personal}:`, 
        cta: 'What business lesson changed your game?', hashtags: '#entrepreneur #business #mindset #success'
      },
      lifestyle: {
        emoji: '🌟', hook: `${season} lifestyle upgrade`, 
        cta: 'What\'s your latest lifestyle win?', hashtags: '#lifestyle #wellness #selfcare #mindful'
      },
      motivational: {
        emoji: '✨', hook: `${season} motivation hits different when you discover`, 
        cta: `What motivates you this ${season.toLowerCase()}?`, hashtags: `#motivation #mindset #${season.toLowerCase()}motivation #inspiration`
      },
      educational: {
        emoji: '📚', hook: `I've ${personal} with`, 
        cta: 'What\'s the most useful thing you learned recently?', hashtags: '#wellness #education #healthtips #learning'
      }
    };
    
    const config = typeConfigs[type] || typeConfigs.recipe;
    
    // Include URL source attribution when available
    const sourceAttribution = content.source ? `\n\n📖 Source: ${content.source}` : '';
    const urlLink = content.url ? `\n🔗 ${content.url}` : '';
    
    // Use key insights if available for richer content
    const hasInsights = content.keyInsights && content.keyInsights.length > 0;
    const insightText = hasInsights ? `\n\n💡 Key insight: ${content.keyInsights[0]}` : '';
    const contentText = content.content || `I've ${personal} - it's completely shifted my ${season.toLowerCase()} routine.`;
    
    return `${config.emoji} ${config.hook} ${content.title}.

${contentText}${insightText}

${config.cta}${sourceAttribution}${urlLink}

${config.hashtags}`;
  };
  
  const generateEnhancedLinkedInPost = (content, type, season, day) => {
    const typeConfigs = {
      recipe: {
        angle: 'Nutrition & Peak Performance', focus: 'workplace wellness', 
        insight: 'What we eat directly impacts cognitive performance and leadership effectiveness.'
      },
      workout: {
        angle: 'Leadership Through Fitness', focus: 'executive wellness', 
        insight: 'Physical discipline translates directly to mental resilience and decision-making clarity.'
      },
      travel: {
        angle: 'Global Leadership Insights', focus: 'cultural intelligence', 
        insight: `Lessons from ${content.destination || 'international markets'} that reshape business perspective.`
      },
      tech: {
        angle: 'Technology Strategy', focus: 'digital transformation', 
        insight: `${content.category || 'Innovation'} is reshaping how we approach business challenges.`
      },
      finance: {
        angle: 'Financial Leadership', focus: 'strategic planning', 
        insight: `${content.type || 'Financial'} literacy isn't just personal - it's essential for business leaders.`
      },
      beauty: {
        angle: 'Professional Presence', focus: 'personal branding', 
        insight: 'Executive presence includes how we show up - confidence starts with self-care.'
      },
      parenting: {
        angle: 'Leadership Lessons', focus: 'work-life integration', 
        insight: `Parenting ${content.ageGroup || 'children'} develops skills directly applicable to team management.`
      },
      business: {
        angle: 'Strategic Thinking', focus: 'business growth', 
        insight: `${content.category || 'Business'} insights that drive organizational transformation.`
      },
      lifestyle: {
        angle: 'Executive Wellness', focus: 'sustainable performance', 
        insight: 'High performance requires intentional lifestyle design, not just hard work.'
      },
      motivational: {
        angle: 'Leadership Mindset', focus: 'peak performance', 
        insight: `${content.theme || 'Mindset'} development is the foundation of sustained professional success.`
      },
      educational: {
        angle: 'Professional Development', focus: 'continuous learning', 
        insight: `Understanding ${content.category || 'industry'} insights gives professionals a competitive edge in ${season} 2025.`
      }
    };
    
    const config = typeConfigs[type] || typeConfigs.business;
    
    // Include URL source attribution when available  
    const sourceAttribution = content.source ? `\n\nInsights from: ${content.source}` : '';
    const urlLink = content.url ? `\nRead more: ${content.url}` : '';
    const contentDescription = content.content && content.content !== content.title ? `\n\n${content.content}` : '';
    
    // Add key insights for professional context
    const professionalInsight = content.keyInsights && content.keyInsights.length > 1 
      ? `\n\n🔍 Research insight: ${content.keyInsights[1]}` 
      : '';
    
    return `${config.angle}: ${content.title}

${day} reflection on ${config.focus}:${contentDescription}

${config.insight}${professionalInsight}

The intersection of personal development and professional excellence continues to reshape how we think about leadership in ${season} 2025.

What's your take on integrating ${config.focus} into leadership strategy?${sourceAttribution}${urlLink}

#leadership #${type} #professionaldev`;
  };
  
  const generateEnhancedFacebookPost = (content, type, season, personal) => {
    const typeConfigs = {
      recipe: {
        emoji: '🥗', community: 'Food lovers', sharing: 'family meal ideas', 
        question: 'What\'s your go-to comfort food this season?'
      },
      workout: {
        emoji: '💪', community: 'Fitness friends', sharing: 'workout motivation', 
        question: 'Who\'s your workout accountability partner?'
      },
      travel: {
        emoji: '🌎', community: 'Fellow travelers', sharing: 'travel discoveries', 
        question: `Who else is dreaming of ${content.destination || 'adventure'}?`
      },
      tech: {
        emoji: '📲', community: 'Tech enthusiasts', sharing: 'tech tips', 
        question: 'What tech discovery changed your daily routine?'
      },
      finance: {
        emoji: '💳', community: 'Money-smart friends', sharing: 'financial tips', 
        question: 'What\'s your best money-saving discovery?'
      },
      beauty: {
        emoji: '💅', community: 'Beauty lovers', sharing: 'beauty discoveries', 
        question: 'What\'s your holy grail beauty product?'
      },
      parenting: {
        emoji: '👪', community: 'Parent tribe', sharing: 'parenting wins', 
        question: `Other ${content.ageGroup || 'parents'} - can you relate to this?`
      },
      business: {
        emoji: '💼', community: 'Entrepreneur network', sharing: 'business insights', 
        question: 'What business lesson surprised you the most?'
      },
      lifestyle: {
        emoji: '🌺', community: 'Lifestyle lovers', sharing: 'life improvements', 
        question: 'What small change made the biggest impact on your daily life?'
      },
      motivational: {
        emoji: '🌟', community: 'Motivation squad', sharing: 'inspiration', 
        question: `What\'s your go-to strategy for ${content.theme || 'staying motivated'}?`
      },
      educational: {
        emoji: '📖', community: 'Learning community', sharing: 'knowledge gems', 
        question: `Anyone else surprised by ${content.category || 'wellness'} insights like this?`
      }
    };
    
    const config = typeConfigs[type] || typeConfigs.lifestyle;
    
    // Include URL source attribution when available
    const sourceAttribution = content.source ? `\n\n📚 Found this through: ${content.source}` : '';
    const urlLink = content.url ? `\n🔗 Check it out: ${content.url}` : '';
    const contentDescription = content.content && content.content !== content.title ? `\n\n${content.content}` : '';
    
    return `${config.emoji} ${config.community}! I've ${personal} with this: ${content.title}.${contentDescription}

Sharing because sometimes the best discoveries come from our community. This has been such a game-changer for my ${season.toLowerCase()} routine!

${config.question}

Drop your thoughts below - love hearing about your ${config.sharing}! 💕${sourceAttribution}${urlLink}

#community #${type} #${season.toLowerCase()}vibes`;
  };
  
  // Basic fallback variations as a final safety net
  const generateBasicFallbackVariations = (content, type) => {
    const variations = {
      instagram: {},
      linkedin: {},
      facebook: {}
    };
    
    // Simple but functional variations
    variations.instagram[type] = `✨ ${content.title}\n\nThis has been a game-changer! 🚀\n\nWhat do you think?\n\n#${type} #content #social`;
    variations.linkedin[type] = `${content.title}\n\nSharing this valuable insight with my network.\n\n#${type} #professional`;
    variations.facebook[type] = `Check out: ${content.title}\n\nWould love to hear your thoughts!\n\n#${type} #community`;
    
    return variations;
  };

  const generateWeeklyContent = async () => {
    setIsGenerating(true);
    
    try {
      console.log(`🚀 Starting enhanced weekly content generation in ${generationMode} mode...`);
      const weeklyPlan = [];
      const today = new Date();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      let weekStart;
      let dayOrder;
      
      if (generationMode === 'calendar') {
        // Standard Sunday-Saturday calendar week
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        weekStart = today.getDay() === 0 ? startOfWeek : new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
        dayOrder = dayNames; // Standard Sunday-Saturday order
        console.log(`📅 Calendar Mode - Generating week: ${weekStart.toLocaleDateString()} - ${new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
      } else {
        // Next day mode - start from tomorrow for 7 days
        weekStart = new Date(today);
        weekStart.setDate(today.getDate() + 1);
        const endDate = new Date(weekStart);
        endDate.setDate(weekStart.getDate() + 6);
        dayOrder = dayNames; // We'll use the actual day names based on dates
        console.log(`🗓️ Next Day Mode - Generating 7 days: ${weekStart.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
      }
      
      const availableContent = {
        recipe: recipes,
        workout: workouts,
        realEstate: realEstateTips,
        mindfulness: mindfulnessPosts,
        travel: travelContent,
        tech: techContent,
        finance: financeContent,
        beauty: beautyContent,
        parenting: parentingContent,
        business: businessContent,
        lifestyle: lifestyleContent
      };
      
      // Generate content for each day based on selected mode
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        
        let dayName;
        if (generationMode === 'calendar') {
          dayName = dayNames[i]; // Use index directly since we're starting from Sunday
        } else {
          dayName = dayNames[date.getDay()]; // Get actual day name for the date
        }
        
        let contentType = weeklySchedule[dayName];
        let content;
        
        // Handle 'random' selection
        if (contentType === 'random') {
          const enabledTypes = Object.keys(contentMix).filter(key => 
            contentMix[key] && (availableContent[key]?.length > 0 || ['motivational', 'educational'].includes(key))
          );
          if (enabledTypes.length > 0) {
            contentType = enabledTypes[Math.floor(Math.random() * enabledTypes.length)];
          } else {
            contentType = 'motivational';
          }
        }
        
        // Get content based on type - unified approach with URL parsing integration
        let urlMetadata = null;
        
        if (availableContent[contentType] && availableContent[contentType].length > 0) {
          content = availableContent[contentType][Math.floor(Math.random() * availableContent[contentType].length)];
          
          // If content has a URL, fetch its metadata for enrichment
          if (content.url) {
            try {
              console.log(`🌐 Fetching URL metadata for ${contentType} content: ${content.url}`);
              urlMetadata = await fetchUrlMetadata(content.url);
              console.log(`✅ URL metadata fetched:`, urlMetadata);
            } catch (error) {
              console.log(`⚠️ URL metadata fetch failed for ${content.url}:`, error.message);
            }
          }
        } else {
          // Generate topical website and fetch metadata for content enrichment
          console.log(`🎯 Generating topical website for ${contentType} content`);
          const topicalSite = generateTopicalWebsite(contentType, { day: dayName, contentType });
          
          try {
            console.log(`🌐 Fetching metadata from generated URL: ${topicalSite.url}`);
            urlMetadata = await fetchUrlMetadata(topicalSite.url);
            console.log(`✅ Topical URL metadata fetched:`, urlMetadata);
          } catch (error) {
            console.log(`⚠️ Topical URL metadata fetch failed for ${topicalSite.url}:`, error.message);
          }
          
          // Generate content based on content type with URL metadata integration
          if (contentType === 'motivational') {
            // Generate dynamic motivational content
            const motivationalTopics = [
              'mindset shift that changes everything', 'overcoming Monday blues', 'finding your inner strength',
              'building unstoppable confidence', 'turning setbacks into comebacks', 'embracing your potential',
              'creating momentum from nothing', 'the power of daily habits', 'breakthrough moments',
              'resilience in tough times', 'goal-setting that actually works', 'motivation that lasts'
            ];
            const randomTopic = motivationalTopics[Math.floor(Math.random() * motivationalTopics.length)];
            content = { 
              title: urlMetadata?.title || `The ${randomTopic}`,
              content: urlMetadata?.description || 'Transformative insights for personal growth',
              theme: 'empowerment',
              url: topicalSite.url,
              source: urlMetadata?.domain || topicalSite.domain
            };
          } else if (contentType === 'educational') {
            // Generate dynamic educational content  
            const educationalTopics = [
              'wellness hack that surprised me', 'health myth debunked', 'productivity secret revealed',
              'stress management technique', 'sleep optimization tip', 'nutrition insight that works',
              'mental health breakthrough', 'exercise science discovery', 'brain health boost',
              'energy level game-changer', 'focus improvement method', 'longevity research finding'
            ];
            const randomTopic = educationalTopics[Math.floor(Math.random() * educationalTopics.length)];
            content = { 
              title: urlMetadata?.title || `The ${randomTopic}`,
              content: urlMetadata?.description || 'Evidence-based insights for better living',
              category: 'wellness',
              url: topicalSite.url,
              source: urlMetadata?.domain || topicalSite.domain
            };
          } else {
            // Fallback if selected type has no content - create engaging fallback
            const inspirationTopics = [
              'small change that made a big difference', 'lesson learned the hard way', 'perspective shift moment',
              'gratitude practice that works', 'simple truth about success', 'reminder you needed today'
            ];
            const randomTopic = inspirationTopics[Math.floor(Math.random() * inspirationTopics.length)];
            content = { 
              title: urlMetadata?.title || `The ${randomTopic}`,
              content: urlMetadata?.description || 'Daily inspiration for meaningful living',
              theme: 'growth',
              url: topicalSite.url,
              source: urlMetadata?.domain || topicalSite.domain
            };
            contentType = 'motivational';
          }
        }

        console.log(`📝 Generating enhanced ${contentType} content for ${dayName}:`, content.title);
        if (urlMetadata) {
          console.log(`🔗 URL-enhanced content with source: ${content.source}`);
        }
        
        // Generate enhanced variations using our comprehensive AI system
        const enhancedVariations = await generatePostVariations(content, contentType);
        
        const postData = {
          id: Date.now() + i,
          date: date.toISOString().split('T')[0],
          dayName: dayName,
          contentType,
          content,
          platforms: ['instagram', 'linkedin', 'facebook'],
          status: 'draft',
          variations: {
            instagram: enhancedVariations.instagram?.[contentType] || enhancedVariations.instagram || 'Generated content for Instagram',
            linkedin: enhancedVariations.linkedin?.[contentType] || enhancedVariations.linkedin || 'Generated content for LinkedIn', 
            facebook: enhancedVariations.facebook?.[contentType] || enhancedVariations.facebook || 'Generated content for Facebook'
          }
        };

        weeklyPlan.push(postData);
      }
      
      console.log(`✅ Generated ${weeklyPlan.length} enhanced weekly posts with AI system`);
      setContentCalendar(weeklyPlan);
      
    } catch (error) {
      console.error('Error generating enhanced weekly content:', error);
      
      // Fallback to basic generation if AI fails
      const weeklyPlan = [];
      const today = new Date();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      let weekStart;
      if (generationMode === 'calendar') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        weekStart = today.getDay() === 0 ? startOfWeek : new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
        console.log(`📅 Fallback Calendar Mode - Generating week: ${weekStart.toLocaleDateString()} - ${new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
      } else {
        weekStart = new Date(today);
        weekStart.setDate(today.getDate() + 1);
        const endDate = new Date(weekStart);
        endDate.setDate(weekStart.getDate() + 6);
        console.log(`🗓️ Fallback Next Day Mode - Generating 7 days: ${weekStart.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
      }
      
      const availableContent = {
        recipe: recipes,
        workout: workouts,
        realEstate: realEstateTips,
        mindfulness: mindfulnessPosts,
        travel: travelContent,
        tech: techContent,
        finance: financeContent,
        beauty: beautyContent,
        parenting: parentingContent,
        business: businessContent,
        lifestyle: lifestyleContent
      };
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        
        let dayName;
        if (generationMode === 'calendar') {
          dayName = dayNames[i]; // Use index directly since we're starting from Sunday
        } else {
          dayName = dayNames[date.getDay()]; // Get actual day name for the date
        }
        
        let contentType = weeklySchedule[dayName];
        let content;
        
        if (contentType === 'random') {
          const enabledTypes = Object.keys(contentMix).filter(key => 
            contentMix[key] && (availableContent[key]?.length > 0 || ['motivational', 'educational'].includes(key))
          );
          if (enabledTypes.length > 0) {
            contentType = enabledTypes[Math.floor(Math.random() * enabledTypes.length)];
          } else {
            contentType = 'motivational';
          }
        }
        
        if (availableContent[contentType] && availableContent[contentType].length > 0) {
          content = availableContent[contentType][Math.floor(Math.random() * availableContent[contentType].length)];
        } else if (contentType === 'motivational') {
          // Generate dynamic motivational content
          const motivationalTopics = [
            'mindset shift that changes everything', 'overcoming Monday blues', 'finding your inner strength',
            'building unstoppable confidence', 'turning setbacks into comebacks', 'embracing your potential',
            'creating momentum from nothing', 'the power of daily habits', 'breakthrough moments',
            'resilience in tough times', 'goal-setting that actually works', 'motivation that lasts'
          ];
          const randomTopic = motivationalTopics[Math.floor(Math.random() * motivationalTopics.length)];
          content = { 
            title: `The ${randomTopic}`,
            content: 'Transformative insights for personal growth',
            theme: 'empowerment'
          };
        } else if (contentType === 'educational') {
          // Generate dynamic educational content  
          const educationalTopics = [
            'wellness hack that surprised me', 'health myth debunked', 'productivity secret revealed',
            'stress management technique', 'sleep optimization tip', 'nutrition insight that works',
            'mental health breakthrough', 'exercise science discovery', 'brain health boost',
            'energy level game-changer', 'focus improvement method', 'longevity research finding'
          ];
          const randomTopic = educationalTopics[Math.floor(Math.random() * educationalTopics.length)];
          content = { 
            title: `The ${randomTopic}`,
            content: 'Evidence-based insights for better living',
            category: 'wellness'
          };
        } else {
          // Fallback if selected type has no content - create engaging fallback
          const inspirationTopics = [
            'small change that made a big difference', 'lesson learned the hard way', 'perspective shift moment',
            'gratitude practice that works', 'simple truth about success', 'reminder you needed today'
          ];
          const randomTopic = inspirationTopics[Math.floor(Math.random() * inspirationTopics.length)];
          content = { 
            title: `The ${randomTopic}`,
            content: 'Daily inspiration for meaningful living',
            theme: 'growth'
          };
          contentType = 'motivational';
        }

        const fallbackVariations = generateFallbackVariations(content, contentType);
        const postData = {
          id: Date.now() + i,
          date: date.toISOString().split('T')[0],
          dayName: dayName,
          contentType,
          content,
          platforms: ['instagram', 'linkedin', 'facebook'],
          status: 'draft',
          variations: {
            instagram: fallbackVariations.instagram?.[contentType] || fallbackVariations.instagram?.motivational || 'Generated content for Instagram',
            linkedin: fallbackVariations.linkedin?.[contentType] || fallbackVariations.linkedin?.motivational || 'Generated content for LinkedIn',
            facebook: fallbackVariations.facebook?.[contentType] || fallbackVariations.facebook?.motivational || 'Generated content for Facebook'
          }
        };

        weeklyPlan.push(postData);
      }
      
      setContentCalendar(weeklyPlan);
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = (text, platform) => {
    navigator.clipboard.writeText(text);
    alert(`${platform} content copied!`);
  };

  // Function to fetch metadata from URL
  const fetchUrlMetadata = async (url) => {
    console.log('🔍 Starting URL fetch for:', url);
    
    try {
      // Try multiple CORS proxy services in order - enhanced with more services
      const proxyServices = [
        { name: 'corsproxy.io', url: `https://corsproxy.io/?${encodeURIComponent(url)}` },
        { name: 'allorigins', url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}` },
        { name: 'codetabs', url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}` },
        { name: 'thingproxy', url: `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}` },
        { name: 'crossorigin', url: `https://crossorigin.me/${url}` },
        // Fallback with different allorigins parameters
        { name: 'allorigins-raw', url: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` }
      ];

      let response;
      let data;
      let htmlContent = '';
      let usedProxy = '';

      // Try each proxy service
      for (const proxy of proxyServices) {
        try {
          console.log(`📡 Trying ${proxy.name}:`, proxy.url);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          response = await fetch(proxy.url, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          console.log(`📊 ${proxy.name} response status:`, response.status, response.statusText);

          if (response.ok) {
            // Handle different response formats with enhanced error handling
            try {
              if (proxy.name.includes('allorigins') && !proxy.name.includes('raw')) {
                const jsonResponse = await response.json();
                htmlContent = jsonResponse.contents || jsonResponse.data || '';
                console.log('📄 AllOrigins response keys:', Object.keys(jsonResponse));
                console.log('📄 AllOrigins status:', jsonResponse.status);
              } else {
                htmlContent = await response.text();
              }
              
              // Validate content quality
              const isValidHtml = htmlContent.includes('<html') || htmlContent.includes('<head') || htmlContent.includes('<body');
              const hasMetaTags = htmlContent.includes('<meta') || htmlContent.includes('<title');
              const minLength = htmlContent && htmlContent.length > 200;
              
              if (minLength && (isValidHtml || hasMetaTags)) {
                usedProxy = proxy.name;
                console.log(`✅ Success with ${proxy.name}, content length:`, htmlContent.length);
                console.log(`🔍 Content validation - HTML: ${isValidHtml}, Meta: ${hasMetaTags}, Length: ${minLength}`);
                break;
              } else {
                console.log(`❌ ${proxy.name} content validation failed - HTML: ${isValidHtml}, Meta: ${hasMetaTags}, Length: ${htmlContent?.length || 0}`);
                console.log(`📝 Sample content:`, htmlContent?.substring(0, 200) || 'No content');
              }
            } catch (parseError) {
              console.warn(`❌ ${proxy.name} response parsing failed:`, parseError.message);
              // Try treating as plain text if JSON parsing fails
              if (proxy.name.includes('allorigins')) {
                htmlContent = await response.text();
                if (htmlContent && htmlContent.length > 200) {
                  usedProxy = proxy.name;
                  console.log(`✅ Fallback success with ${proxy.name} as text`);
                  break;
                }
              }
            }
          }
        } catch (proxyError) {
          console.warn(`❌ ${proxy.name} failed:`, proxyError.message);
          continue;
        }
      }

      if (!htmlContent) {
        throw new Error('All proxy services failed to return content');
      }

      console.log('🔧 Parsing HTML content...');
      
      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Log available meta tags for debugging
      const allMetas = doc.querySelectorAll('meta');
      console.log('🏷️ Available meta tags:');
      allMetas.forEach(meta => {
        const name = meta.getAttribute('name') || meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (name && content) {
          console.log(`  ${name}: ${content.substring(0, 100)}...`);
        }
      });

      // Extract metadata with improved selectors
      const getMetaContent = (selectors) => {
        for (const selector of selectors) {
          const element = doc.querySelector(selector);
          if (element) {
            const content = element.getAttribute('content') || element.textContent || '';
            if (content.trim()) {
              console.log(`✅ Found content with selector "${selector}":`, content.substring(0, 100));
              return content.trim();
            }
          }
        }
        return '';
      };

      const title = getMetaContent([
        'meta[property="og:title"]',
        'meta[name="og:title"]',
        'meta[name="title"]',
        'title',
        'h1.entry-title',
        'h1.workout-title',
        'h1'
      ]);
                   
      const description = getMetaContent([
        'meta[property="og:description"]',
        'meta[name="og:description"]',
        'meta[name="description"]',
        'meta[name="twitter:description"]',
        '.workout-description',
        '.entry-content p'
      ]);

      // Enhanced content extraction for longer articles
      const extractArticleContent = (doc) => {
        const contentSelectors = [
          // Common article selectors
          'article',
          '.article-content',
          '.post-content',
          '.entry-content',
          '.content',
          '.main-content',
          'main',
          // Blog-specific selectors
          '.blog-post',
          '.post-body',
          '.article-body',
          // News site selectors
          '.story-body',
          '.article-text',
          '.news-content',
          // General content selectors
          '#content',
          '.container .content',
          '[role="main"]'
        ];

        for (const selector of contentSelectors) {
          const element = doc.querySelector(selector);
          if (element) {
            // Extract text content, removing scripts and styles
            const clone = element.cloneNode(true);
            const scripts = clone.querySelectorAll('script, style, nav, header, footer, aside, .sidebar, .comments, .social-share');
            scripts.forEach(el => el.remove());
            
            const textContent = clone.textContent || clone.innerText || '';
            const cleanText = textContent.replace(/\s+/g, ' ').trim();
            
            if (cleanText.length > 200) {
              console.log(`✅ Found article content with selector "${selector}":`, cleanText.substring(0, 150) + '...');
              
              // Smart truncation for better descriptions
              const smartTruncate = (text, maxLength = 500) => {
                if (text.length <= maxLength) return text;
                
                // Find the last complete sentence within the limit
                const truncated = text.substring(0, maxLength);
                const lastSentenceEnd = Math.max(
                  truncated.lastIndexOf('.'),
                  truncated.lastIndexOf('!'),
                  truncated.lastIndexOf('?')
                );
                
                if (lastSentenceEnd > maxLength * 0.6) {
                  // If we found a sentence ending in the latter 60% of the text, use it
                  return truncated.substring(0, lastSentenceEnd + 1);
                } else {
                  // Otherwise, find the last complete word
                  const lastSpace = truncated.lastIndexOf(' ');
                  return truncated.substring(0, lastSpace > maxLength * 0.8 ? lastSpace : maxLength) + '...';
                }
              };
              
              return smartTruncate(cleanText);
            }
          }
        }
        return '';
      };

      const articleContent = extractArticleContent(doc);
      
      // Extract key insights for social media posts
      const extractKeyInsights = (content) => {
        if (!content || content.length < 100) return [];
        
        const insights = [];
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        
        // Look for insight-indicating phrases
        const insightPatterns = [
          /research shows?/i,
          /studies? (show|indicate|suggest|find)/i,
          /according to/i,
          /experts? (say|believe|recommend)/i,
          /key (finding|insight|takeaway)/i,
          /importantly?/i,
          /surprisingly?/i,
          /(tip|advice|recommendation)/i,
          /the (secret|key) (to|is)/i
        ];
        
        sentences.forEach(sentence => {
          const trimmed = sentence.trim();
          if (insightPatterns.some(pattern => pattern.test(trimmed))) {
            insights.push(trimmed + '.');
          }
        });
        
        return insights.slice(0, 3); // Return top 3 insights
      };
      
      const keyInsights = extractKeyInsights(articleContent);
      const enhancedDescription = description || articleContent;

      // Try to extract workout-specific data
      const workoutData = extractWorkoutData(doc, url);
      
      // Try to extract recipe-specific data
      const recipeData = extractRecipeData(doc);
      
      // Extract site-specific data based on URL domain
      const domain = new URL(url).hostname.toLowerCase();
      const youtubeData = extractYouTubeData(url, doc);
      const allRecipesData = extractAllRecipesData(doc, domain);
      const zillowData = extractZillowData(doc, domain);
      const mediumData = extractMediumData(doc, domain);
      const amazonData = extractAmazonData(doc, domain);
      const linkedinData = extractLinkedInData(doc, domain);
      const instagramData = extractInstagramData(doc, domain);
      
      const result = {
        title: title || youtubeData.title || allRecipesData.title || zillowData.title || mediumData.title || amazonData.title || 'Untitled',
        description: enhancedDescription || youtubeData.description || workoutData.description || allRecipesData.description || zillowData.description || mediumData.description || amazonData.description || '',
        originalDescription: description, // Keep original meta description
        articleContent: articleContent, // Full extracted content
        keyInsights: keyInsights, // Key insights for social posts
        contentLength: articleContent?.length || 0,
        hasRichContent: articleContent?.length > 500,
        usedProxy,
        domain: domain,
        ...recipeData,
        ...youtubeData,
        ...allRecipesData,
        ...zillowData,
        ...mediumData,
        ...amazonData,
        ...linkedinData,
        ...instagramData,
        ...workoutData
      };

      console.log('🎯 Final extracted data:', {
        title: result.title,
        descriptionLength: result.description?.length || 0,
        contentLength: result.contentLength,
        hasRichContent: result.hasRichContent,
        keyInsightsCount: result.keyInsights?.length || 0,
        domain: result.domain,
        usedProxy: result.usedProxy
      });
      console.log('📋 Key insights found:', result.keyInsights || 'No insights extracted');
      console.log('📄 Content sample:', result.description?.substring(0, 200) + '...' || 'No content');
      return result;

    } catch (error) {
      console.error('💥 Error fetching URL metadata:', error);
      
      // Return basic info extracted from URL if possible
      const urlInfo = extractInfoFromUrl(url);
      console.log('🔄 Fallback URL info:', urlInfo);
      return urlInfo;
    }
  };

  // Function to extract recipe-specific data
  const extractRecipeData = (doc) => {
    const recipeData = {};
    
    // Look for JSON-LD structured data
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
      try {
        const data = JSON.parse(script.textContent);
        if (data['@type'] === 'Recipe' || (Array.isArray(data) && data.some(item => item['@type'] === 'Recipe'))) {
          const recipe = Array.isArray(data) ? data.find(item => item['@type'] === 'Recipe') : data;
          if (recipe) {
            recipeData.ingredients = Array.isArray(recipe.recipeIngredient) 
              ? recipe.recipeIngredient.join('\n') 
              : recipe.recipeIngredient || '';
            recipeData.instructions = Array.isArray(recipe.recipeInstructions) 
              ? recipe.recipeInstructions.map(inst => 
                  typeof inst === 'string' ? inst : inst.text || inst.name || ''
                ).join('\n') 
              : recipe.recipeInstructions || '';
            recipeData.duration = recipe.totalTime || recipe.prepTime || '';
            break;
          }
        }
      } catch (e) {
        // Continue if JSON parsing fails
      }
    }
    
    return recipeData;
  };

  // Extract workout-specific data from fitness websites
  const extractWorkoutData = (doc, url) => {
    const workoutData = {};
    
    console.log('🏋️ Extracting workout data from:', url);
    
    // Check if it's a Muscle & Strength website
    if (url.includes('muscleandstrength.com')) {
      console.log('💪 Detected Muscle & Strength website');
      
      // Skip description extraction - only use meta description if available
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                             doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
      
      if (metaDescription) {
        workoutData.description = metaDescription;
        console.log('✅ Using meta description only:', metaDescription.substring(0, 100));
      }
      
      // Extract workout exercises/routine from text patterns
      const allText = doc.body?.textContent || '';
      
      // Look for duration patterns (12 week, 8 week, etc.)
      const durationMatch = allText.match(/(\d+)\s*week/i) || url.match(/(\d+)-?week/i);
      if (durationMatch) {
        workoutData.duration = `${durationMatch[1]} weeks`;
        console.log('✅ Found duration from text:', workoutData.duration);
      }
      
      // Look for difficulty/level patterns
      const difficultyPatterns = [
        /beginner/i,
        /intermediate/i, 
        /advanced/i,
        /expert/i,
        /all levels/i
      ];
      
      for (const pattern of difficultyPatterns) {
        if (pattern.test(allText)) {
          workoutData.difficulty = allText.match(pattern)[0];
          console.log('✅ Found difficulty:', workoutData.difficulty);
          break;
        }
      }
      
      // Extract actual workout routine from tables and structured content
      const workoutSections = extractWorkoutTables(doc);
      if (workoutSections.length > 0) {
        workoutData.exercises = workoutSections.join('\n\n---\n\n'); // Separate sections with dividers
        console.log('✅ Found structured workout sections:', workoutData.exercises.substring(0, 200));
      } else {
        // Fallback: extract exercise lists from text
        const exerciseList = extractExerciseList(doc, allText);
        if (exerciseList) {
          workoutData.exercises = exerciseList;
          console.log('✅ Found exercise list:', workoutData.exercises.substring(0, 200));
        }
      }
      
      // Extract from URL patterns
      if (url.includes('transformation')) {
        workoutData.category = 'Body Transformation';
      } else if (url.includes('muscle')) {
        workoutData.category = 'Muscle Building';
      } else if (url.includes('strength')) {
        workoutData.category = 'Strength Training';
      }
    }
    
    // Generic workout extraction for other fitness sites
    else if (url.includes('bodybuilding.com') || url.includes('fitness') || url.includes('workout')) {
      console.log('🏃 Detected fitness website');
      
      const allText = doc.body?.textContent || '';
      
      // Look for common workout patterns
      const durationMatch = allText.match(/(\d+)\s*week/i);
      if (durationMatch) {
        workoutData.duration = `${durationMatch[1]} weeks`;
        console.log('Found workout duration:', workoutData.duration);
      }
      
      // Use only meta description for generic sites
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                             doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
      
      if (metaDescription) {
        workoutData.description = metaDescription;
      }
    }
    
    // Ensure we have some workout content
    if (!workoutData.exercises && workoutData.description) {
      workoutData.exercises = workoutData.description;
      console.log('📝 Using description as exercises fallback');
    }
    
    console.log('🎯 Final workout data extracted:', {
      ...workoutData,
      exercises: workoutData.exercises ? `${workoutData.exercises.length} chars` : 'No exercises'
    });
    return workoutData;
  };

  // Extract workout tables from Muscle & Strength pages
  const extractWorkoutTables = (doc) => {
    const workoutSections = [];
    
    console.log('📋 Looking for workout tables with headings...');
    
    // Enhanced debugging to see document content
    console.log('🔍 Document structure analysis:');
    console.log('- Total elements:', doc.querySelectorAll('*').length);
    console.log('- Document HTML length:', doc.documentElement.innerHTML.length);
    
    // Look for ALL tables first
    const tables = doc.querySelectorAll('table');
    console.log(`📊 Found ${tables.length} total tables`);
    
    // Debug each table to see what's inside
    tables.forEach((table, index) => {
      const tableText = table.textContent?.trim() || '';
      console.log(`Table ${index + 1}:`, {
        className: table.className,
        id: table.id,
        textLength: tableText.length,
        preview: tableText.substring(0, 100),
        hasRows: table.querySelectorAll('tr').length
      });
    });
    
    // Process each table and look for associated headings
    let workoutTableCount = 0;
    const maxTables = 10; // Limit to prevent excessive content
    
    for (let i = 0; i < tables.length && workoutTableCount < maxTables; i++) {
      const table = tables[i];
      const tableText = table.textContent?.toLowerCase() || '';
      const rows = table.querySelectorAll('tr');
      
      console.log(`🔍 Analyzing table ${i + 1} with ${rows.length} rows`);
      
      // More flexible workout detection
      const workoutKeywords = ['exercise', 'sets', 'reps', 'rest', 'weight', 'muscle', 'day'];
      const hasWorkoutKeywords = workoutKeywords.some(keyword => tableText.includes(keyword));
      const hasNumbers = /\d+/.test(tableText);
      const hasMultipleRows = rows.length > 1;
      
      if ((hasWorkoutKeywords || hasNumbers) && hasMultipleRows && tableText.length > 20) {
        console.log('✅ Found potential workout table:', {
          hasWorkoutKeywords,
          hasNumbers,
          rowCount: rows.length,
          textPreview: tableText.substring(0, 150)
        });
        
        // Extract heading information before the table
        const tableHeading = extractTableHeading(table, doc);
        const workoutTable = parseWorkoutTable(table);
        
        if (workoutTable) {
          workoutTableCount++;
          
          // Combine heading and table content
          let workoutSection = '';
          if (tableHeading) {
            workoutSection += `${tableHeading}\n\n`;
          }
          workoutSection += workoutTable;
          
          workoutSections.push(workoutSection);
          console.log('📝 Successfully parsed workout section with heading');
        } else {
          console.log('❌ Failed to parse workout table');
        }
      }
    }
    
    // Look for modern div-based workout layouts (CSS Grid/Flexbox patterns)
    const workoutSelectors = [
      '.workout-day', '.workout-table', '.exercise-table', '.routine-table',
      '.workout', '.exercises', '.routine', '.program', '.exercise-list',
      '[class*="workout"]', '[class*="exercise"]', '[class*="routine"]',
      '.entry-content', '.post-content', 'article',
      '.workout-content', '.exercise-content', '.routine-content'
    ];
    
    console.log('🔍 Searching for div-based workout content...');
    
    for (const selector of workoutSelectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(`📝 Found ${elements.length} elements with selector: ${selector}`);
        
        for (const element of elements) {
          // Look for workout patterns within these elements
          const childTables = element.querySelectorAll('table');
          const elementText = element.textContent || '';
          
          console.log(`Element content preview:`, elementText.substring(0, 200));
          
          // Check if this element contains workout-like content
          const hasWorkoutPattern = /(\d+\s*(?:sets?|reps?|x|×))/i.test(elementText) ||
                                   /exercise/i.test(elementText) ||
                                   childTables.length > 0;
          
          if (hasWorkoutPattern) {
            console.log('✅ Found workout pattern in element');
            
            // Try parsing tables within this element first
            for (const childTable of childTables) {
              const tableHeading = extractTableHeading(childTable, doc);
              const parsedTable = parseWorkoutTable(childTable);
              
              if (parsedTable) {
                let workoutSection = '';
                if (tableHeading) {
                  workoutSection += `${tableHeading}\n\n`;
                }
                workoutSection += parsedTable;
                workoutSections.push(workoutSection);
              }
            }
            
            // If no tables, try parsing the div structure
            if (childTables.length === 0) {
              const workoutDiv = parseWorkoutDiv(element);
              if (workoutDiv) {
                workoutSections.push(workoutDiv);
              }
            }
          }
        }
      }
    }
    
    // Look for structured lists with exercise patterns (only if no tables found)
    if (workoutSections.length === 0) {
      console.log('🔍 No tables found, searching for exercise lists...');
      const exerciseLists = doc.querySelectorAll('ol, ul');
      let listCount = 0;
      
      for (const list of exerciseLists) {
        if (listCount >= 5) break; // Limit lists to prevent excessive content
        
        const listText = list.textContent?.toLowerCase() || '';
        if (listText.includes('sets') || listText.includes('reps') || listText.includes('exercise')) {
          const parsedList = parseExerciseList(list);
          if (parsedList) {
            workoutSections.push(parsedList);
            listCount++;
          }
        }
      }
    }
    
    console.log(`🎯 Total workout sections extracted: ${workoutSections.length}`);
    return workoutSections;
  };

  // Extract heading information that appears before a workout table
  const extractTableHeading = (table, doc) => {
    try {
      console.log('🔍 Looking for heading above table...');
      
      // Look for heading elements before the table
      let currentElement = table.previousElementSibling;
      const headings = [];
      let searchDepth = 0;
      
      // Search backwards through siblings for headings
      while (currentElement && searchDepth < 10) {
        const tagName = currentElement.tagName?.toLowerCase();
        const text = currentElement.textContent?.trim() || '';
        
        // Check if it's a heading element
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
          if (text.length > 3 && text.length < 200) {
            console.log('📝 Found heading:', text);
            headings.unshift(text); // Add to beginning
          }
        }
        // Check if it's a paragraph that looks like a section title
        else if (tagName === 'p' || tagName === 'div' || tagName === 'strong' || tagName === 'b') {
          const lowerText = text.toLowerCase();
          // Look for day indicators, workout names, or section titles
          if (text.length > 5 && text.length < 150 && 
              (lowerText.includes('day') || 
               lowerText.includes('week') || 
               lowerText.includes('workout') ||
               lowerText.includes('training') ||
               lowerText.includes('phase') ||
               lowerText.includes('session') ||
               /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i.test(text) ||
               /day \d+/i.test(text) ||
               /week \d+/i.test(text) ||
               /phase \d+/i.test(text))) {
            console.log('📝 Found section title:', text);
            headings.unshift(text);
          }
        }
        // Stop if we hit another table or major content break
        else if (tagName === 'table' || 
                 (tagName === 'div' && currentElement.textContent?.length > 500)) {
          break;
        }
        
        currentElement = currentElement.previousElementSibling;
        searchDepth++;
      }
      
      // Also look in parent elements for context
      let parentElement = table.parentElement;
      let parentDepth = 0;
      
      while (parentElement && parentDepth < 3) {
        // Look for headings within the parent that might be section titles
        const parentHeadings = parentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const heading of parentHeadings) {
          const headingText = heading.textContent?.trim() || '';
          if (headingText.length > 3 && headingText.length < 200 && 
              !headings.includes(headingText)) {
            // Only include if it's close to our table
            const tableRect = table.getBoundingClientRect?.();
            const headingRect = heading.getBoundingClientRect?.();
            
            if (!tableRect || !headingRect || 
                Math.abs(tableRect.top - headingRect.bottom) < 500) {
              headings.unshift(headingText);
            }
          }
        }
        
        parentElement = parentElement.parentElement;
        parentDepth++;
      }
      
      const result = headings.length > 0 ? headings.join(' - ') : null;
      console.log('🎯 Final heading result:', result || 'No heading found');
      return result;
    } catch (error) {
      console.error('Error extracting table heading:', error);
      return null;
    }
  };

  // Parse a workout table into readable format
  const parseWorkoutTable = (table) => {
    try {
      const rows = table.querySelectorAll('tr');
      console.log(`🔍 Parsing table with ${rows.length} rows`);
      
      if (rows.length < 1) return null;
      
      let workoutText = '';
      let headers = [];
      let dataStartIndex = 0;
      
      // Try to identify headers - could be in first row or might not exist
      if (rows.length > 0) {
        const firstRow = rows[0];
        const firstRowCells = firstRow.querySelectorAll('th, td');
        const firstRowText = firstRow.textContent?.toLowerCase() || '';
        
        // If first row looks like headers (contains common header words)
        if (firstRowText.includes('exercise') || firstRowText.includes('sets') || 
            firstRowText.includes('reps') || firstRow.querySelectorAll('th').length > 0) {
          for (const cell of firstRowCells) {
            headers.push(cell.textContent?.trim() || '');
          }
          dataStartIndex = 1;
          console.log('📝 Found headers:', headers);
        } else {
          // No clear headers, create generic ones based on columns
          const cellCount = firstRowCells.length;
          for (let i = 0; i < cellCount; i++) {
            headers.push(`Column ${i + 1}`);
          }
          dataStartIndex = 0;
          console.log('📝 No headers found, using generic headers for', cellCount, 'columns');
        }
      }
      
      // Process all data rows
      for (let i = dataStartIndex; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td, th');
        const rowText = row.textContent?.trim() || '';
        
        // Skip empty rows
        if (rowText.length < 3) continue;
        
        console.log(`Row ${i}: "${rowText}"`);
        
        if (cells.length > 0) {
          const rowData = [];
          
          // If we have headers, use them
          if (headers.length > 0) {
            for (let j = 0; j < Math.min(cells.length, headers.length); j++) {
              const cellText = cells[j]?.textContent?.trim() || '';
              if (cellText && cellText !== '-' && cellText !== '') {
                if (headers[j] && headers[j] !== '') {
                  rowData.push(`${headers[j]}: ${cellText}`);
                } else {
                  rowData.push(cellText);
                }
              }
            }
          } else {
            // No headers, just join cell content
            for (const cell of cells) {
              const cellText = cell.textContent?.trim() || '';
              if (cellText && cellText !== '-' && cellText !== '') {
                rowData.push(cellText);
              }
            }
          }
          
          if (rowData.length > 0) {
            workoutText += rowData.join(' | ') + '\n';
          }
        }
      }
      
      const result = workoutText.trim();
      console.log('📋 Parsed table result:', result ? result.substring(0, 200) + '...' : 'No content');
      
      return result ? result : null; // Remove "Workout Table:" prefix since we now have headings
    } catch (error) {
      console.error('Error parsing workout table:', error);
      return null;
    }
  };

  // Parse workout div structures
  const parseWorkoutDiv = (div) => {
    try {
      console.log('🔍 Parsing workout div:', div.tagName, div.className);
      
      let workoutText = '';
      
      // First, try to find structured elements within the div
      const structuredElements = div.querySelectorAll('p, li, div, span, strong, b');
      
      console.log(`Found ${structuredElements.length} structured elements`);
      
      // Look for exercise patterns in structured elements
      for (const element of structuredElements) {
        const elementText = element.textContent?.trim() || '';
        const lowerText = elementText.toLowerCase();
        
        // Skip if too short or too long (likely descriptive text)
        if (elementText.length < 10 || elementText.length > 200) continue;
        
        // Look for exercise patterns
        const hasNumbers = /\d+/.test(elementText);
        const hasExerciseTerms = /sets?|reps?|exercise|workout/i.test(lowerText);
        const hasSetRep = /\d+\s*[x×]\s*\d+/i.test(elementText) || 
                          (lowerText.includes('set') && lowerText.includes('rep'));
        
        // Common exercise names
        const hasExerciseName = /squat|press|curl|row|pull|push|fly|raise|extension|lunge|dip|deadlift|bench/i.test(lowerText);
        
        if ((hasNumbers && hasExerciseTerms) || hasSetRep || hasExerciseName) {
          console.log('✅ Found exercise pattern:', elementText.substring(0, 100));
          workoutText += `• ${elementText}\n`;
        }
      }
      
      // If no structured content found, try parsing raw text
      if (!workoutText.trim()) {
        console.log('📝 No structured content, trying raw text parsing...');
        
        const text = div.textContent?.trim();
        if (text && text.length > 50) {
          const lines = text.split(/[\n\r]+/).filter(line => line.trim().length > 10);
          
          for (const line of lines.slice(0, 15)) {
            const trimmedLine = line.trim();
            const lowerLine = trimmedLine.toLowerCase();
            
            // Look for exercise patterns in lines
            if ((trimmedLine.match(/\d+/) && 
                 (lowerLine.includes('set') || lowerLine.includes('rep'))) ||
                trimmedLine.match(/\d+\s*[x×]\s*\d+/) ||
                /squat|press|curl|row|pull|push|fly|raise|extension|lunge|dip|deadlift|bench/i.test(lowerLine)) {
              workoutText += `• ${trimmedLine}\n`;
            }
          }
        }
      }
      
      const result = workoutText.trim();
      console.log('📋 Div parsing result:', result ? result.substring(0, 200) + '...' : 'No content found');
      
      return result ? result : null; // Remove prefix since we now have structured headings
    } catch (error) {
      console.error('Error parsing workout div:', error);
      return null;
    }
  };

  // Parse exercise lists
  const parseExerciseList = (list) => {
    try {
      const items = list.querySelectorAll('li');
      if (items.length === 0) return null;
      
      let exerciseText = '';
      
      for (const item of items) {
        const text = item.textContent?.trim();
        if (text && text.length > 10) {
          // Check if it looks like an exercise
          if (text.match(/\d+/) || 
              text.toLowerCase().includes('set') || 
              text.toLowerCase().includes('rep')) {
            exerciseText += `• ${text}\n`;
          }
        }
      }
      
      return exerciseText.trim() ? exerciseText.trim() : null;
    } catch (error) {
      console.error('Error parsing exercise list:', error);
      return null;
    }
  };

  // Extract exercise information from unstructured text
  const extractExerciseList = (doc, allText) => {
    console.log('🔍 Looking for exercises in text content...');
    console.log('📝 Text sample (first 500 chars):', allText.substring(0, 500));
    
    // Common exercise names to look for
    const exerciseNames = [
      'squat', 'deadlift', 'bench press', 'overhead press', 'barbell row',
      'pull-up', 'chin-up', 'dip', 'lunge', 'leg press', 'leg curl', 'leg extension',
      'bicep curl', 'tricep', 'lateral raise', 'shoulder press', 'chest fly',
      'cable', 'dumbbell', 'barbell', 'machine', 'pushup', 'push-up', 'plank',
      'crunch', 'sit-up', 'romanian deadlift', 'front squat', 'incline', 'decline'
    ];
    
    // Look for exercise patterns in text with more aggressive matching
    const exercisePatterns = [
      // Standard format: "Exercise: 3 sets of 8 reps"
      /([\w\s]+(?:press|squat|curl|row|pull|push|fly|raise|extension|lunge|dip)[\w\s]*)\s*[-:]\s*(\d+[\w\s,x×-]+)/gi,
      // "3x8 Exercise Name" format
      /(\d+\s*[x×]\s*\d+)\s+([\w\s]+(?:press|squat|curl|row|pull|push|fly|raise|extension|lunge|dip)[\w\s]*)/gi,
      // "Exercise Name - 3 sets x 8 reps"
      /([\w\s]+(?:press|squat|curl|row|pull|push|fly|raise|extension|lunge|dip)[\w\s]*)\s*[-–]\s*(\d+[\w\s,x×-]+)/gi
    ];
    
    let exercises = '';
    
    for (const pattern of exercisePatterns) {
      const matches = [...allText.matchAll(pattern)];
      console.log(`Pattern found ${matches.length} matches:`, matches.slice(0, 3));
      
      for (const match of matches.slice(0, 20)) {
        const exerciseLine = match[0].trim();
        if (exerciseLine.length > 5 && exerciseLine.length < 150) {
          exercises += `• ${exerciseLine}\n`;
        }
      }
    }
    
    // Look for any mention of common exercises with numbers nearby (more restrictive)
    for (const exerciseName of exerciseNames) {
      const regex = new RegExp(`(${exerciseName}[^.]*?(?:\\d+[^.]*?(?:set|rep|x|×)[^.]*?){1,2})`, 'gi');
      const matches = [...allText.matchAll(regex)];
      
      for (const match of matches.slice(0, 3)) { // Reduced from 5 to 3
        const exerciseLine = match[1].trim();
        const lowerLine = exerciseLine.toLowerCase();
        
        // Filter out navigation/promotional content
        if (exerciseLine.length > 15 && exerciseLine.length < 100 &&
            !lowerLine.includes('store') && 
            !lowerLine.includes('follow') && 
            !lowerLine.includes('subscribe') &&
            !lowerLine.includes('menu') &&
            !lowerLine.includes('navigation')) {
          exercises += `• ${exerciseLine}\n`;
        }
      }
    }
    
    // Look for numbered lists in the content (more restrictive)
    const lines = allText.split('\n');
    let exerciseCount = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      const lowerTrimmed = trimmed.toLowerCase();
      
      // Only extract if it's clearly an exercise line with sets AND reps
      if ((trimmed.match(/^\d+\./) || trimmed.match(/^[-•]\s*/)) && 
          lowerTrimmed.includes('set') && lowerTrimmed.includes('rep') &&
          exerciseNames.some(name => lowerTrimmed.includes(name))) {
        
        // Filter out unwanted content
        if (trimmed.length > 20 && trimmed.length < 150 &&
            !lowerTrimmed.includes('store') && 
            !lowerTrimmed.includes('follow') && 
            !lowerTrimmed.includes('subscribe') &&
            !lowerTrimmed.includes('menu') &&
            exerciseCount < 10) { // Limit to max 10 exercises
          exercises += `• ${trimmed.replace(/^\d+\./, '').replace(/^[-•]\s*/, '')}\n`;
          exerciseCount++;
        }
      }
    }
    
    // Only look for structured workout content, avoid navigation/promotional content
    const workoutContainers = doc.querySelectorAll('table, .workout-table, .exercise-table, .routine-table');
    for (const container of workoutContainers) {
      const text = container.textContent?.trim();
      if (text && text.length > 20 && text.length < 500) {
        const lowerText = text.toLowerCase();
        
        // Only extract if it's clearly workout content (has sets AND reps AND exercise name)
        if ((lowerText.includes('set') && lowerText.includes('rep')) &&
            exerciseNames.some(name => lowerText.includes(name))) {
          // Filter out navigation/menu items
          if (!lowerText.includes('store') && 
              !lowerText.includes('menu') && 
              !lowerText.includes('navigation') &&
              !lowerText.includes('follow') &&
              !lowerText.includes('share') &&
              !lowerText.includes('subscribe')) {
            exercises += `• ${text}\n`;
          }
        }
      }
    }
    
    const result = exercises.trim() || null;
    console.log('🎯 Extracted exercises result:', result ? `${result.length} chars: ${result.substring(0, 300)}...` : 'No exercises found');
    return result;
  };

  // Extract YouTube video information
  const extractYouTubeData = (url, doc) => {
    const youtubeData = {};
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Try to get video ID
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      
      if (videoId) {
        // Extract title from various sources
        const titleElements = [
          'meta[name="title"]',
          'meta[property="og:title"]',
          'title',
          '#watch-headline-title',
          '.title'
        ];
        
        for (const selector of titleElements) {
          const element = doc.querySelector(selector);
          if (element) {
            youtubeData.title = element.getAttribute('content') || element.textContent;
            if (youtubeData.title) {
              youtubeData.title = youtubeData.title.replace(' - YouTube', '').trim();
              break;
            }
          }
        }
        
        // Extract description
        const descElements = [
          'meta[name="description"]',
          'meta[property="og:description"]',
          '#watch-description-text',
          '.description'
        ];
        
        for (const selector of descElements) {
          const element = doc.querySelector(selector);
          if (element) {
            youtubeData.description = element.getAttribute('content') || element.textContent;
            if (youtubeData.description) break;
          }
        }
      }
    }
    
    return youtubeData;
  };

  // Extract basic info from URL when fetching fails
  const extractInfoFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      let title = '';
      let description = '';
      let duration = '';
      let difficulty = '';
      
      // Extract title from domain and path
      if (urlObj.hostname.includes('youtube')) {
        title = 'YouTube Workout Video';
        description = 'Workout video from YouTube';
      } else if (urlObj.hostname.includes('muscleandstrength')) {
        // Extract from M&S URL pattern
        const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
        if (pathParts.length > 0) {
          title = pathParts[pathParts.length - 1]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        }
        description = 'Workout program from Muscle & Strength';
        
        // Try to extract duration from URL
        const durationMatch = url.match(/(\d+)-?week/i);
        if (durationMatch) {
          duration = `${durationMatch[1]} weeks`;
        }
        
        // Determine workout type from URL
        if (url.includes('transformation')) {
          description = 'Total body transformation workout program from Muscle & Strength';
        } else if (url.includes('muscle')) {
          description = 'Muscle building workout from Muscle & Strength';
        } else if (url.includes('strength')) {
          description = 'Strength training program from Muscle & Strength';
        }
        
      } else if (urlObj.hostname.includes('bodybuilding')) {
        title = 'Bodybuilding.com Workout';
        description = 'Workout program from Bodybuilding.com';
      } else if (urlObj.hostname.includes('allrecipes')) {
        title = 'Recipe from AllRecipes';
        description = 'Recipe from AllRecipes.com';
      } else if (urlObj.hostname.includes('food')) {
        title = 'Recipe';
        description = 'Recipe from cooking website';
      } else if (urlObj.hostname.includes('fitness') || urlObj.hostname.includes('workout')) {
        title = 'Fitness Workout';
        description = 'Workout from fitness website';
      } else {
        // Try to extract from path
        const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
        if (pathParts.length > 0) {
          title = pathParts[pathParts.length - 1]
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/\.(html|php|aspx?)$/i, '')
            .replace(/\b\w/g, l => l.toUpperCase());
        } else {
          title = urlObj.hostname.replace('www.', '');
        }
        description = `Content from ${urlObj.hostname}`;
      }
      
      const result = {
        title: title || 'Content from URL',
        description: description || `Content from ${urlObj.hostname}`
      };
      
      // Add workout-specific fields if detected
      if (duration) result.duration = duration;
      if (difficulty) result.difficulty = difficulty;
      
      return result;
    } catch (error) {
      return {
        title: 'Content from URL',
        description: ''
      };
    }
  };

  // Extract AllRecipes data
  const extractAllRecipesData = (doc, domain) => {
    const data = {};
    if (!domain.includes('allrecipes')) return data;

    // AllRecipes specific selectors
    const titleEl = doc.querySelector('.recipe-summary__h1, h1.headline, .entry-title');
    if (titleEl) data.title = titleEl.textContent.trim();

    const ingredientsEl = doc.querySelectorAll('.recipe-ingred_txt, .ingredients li, .recipe-ingredient');
    if (ingredientsEl.length) {
      data.ingredients = Array.from(ingredientsEl).map(el => el.textContent.trim()).join('\n');
    }

    const instructionsEl = doc.querySelectorAll('.recipe-directions__list--item, .instructions li, .recipe-instruction');
    if (instructionsEl.length) {
      data.instructions = Array.from(instructionsEl).map(el => el.textContent.trim()).join('\n');
    }

    const prepTimeEl = doc.querySelector('.recipe-summary__prep-time, .prep-time, .prepTime');
    if (prepTimeEl) data.duration = prepTimeEl.textContent.trim();

    return data;
  };

  // Extract Zillow data
  const extractZillowData = (doc, domain) => {
    const data = {};
    if (!domain.includes('zillow')) return data;

    const addressEl = doc.querySelector('.ds-address-container h1, .zsg-photo-card-address');
    if (addressEl) data.title = `Property: ${addressEl.textContent.trim()}`;

    const priceEl = doc.querySelector('.ds-price .ds-value, .zsg-photo-card-price');
    if (priceEl) data.price = priceEl.textContent.trim();

    const detailsEl = doc.querySelector('.ds-home-facts, .zsg-photo-card-info');
    if (detailsEl) data.description = detailsEl.textContent.trim();

    return data;
  };

  // Extract Medium data  
  const extractMediumData = (doc, domain) => {
    const data = {};
    if (!domain.includes('medium')) return data;

    const titleEl = doc.querySelector('h1[data-testid="storyTitle"], .graf--title');
    if (titleEl) data.title = titleEl.textContent.trim();

    const subtitleEl = doc.querySelector('.graf--subtitle, .subtitle');
    if (subtitleEl) data.subtitle = subtitleEl.textContent.trim();

    const authorEl = doc.querySelector('[data-testid="authorName"], .ds-link');
    if (authorEl) data.author = authorEl.textContent.trim();

    const readTimeEl = doc.querySelector('[data-testid="storyReadTime"], .readingTime');
    if (readTimeEl) data.readTime = readTimeEl.textContent.trim();

    return data;
  };

  // Extract Amazon data
  const extractAmazonData = (doc, domain) => {
    const data = {};
    if (!domain.includes('amazon')) return data;

    const titleEl = doc.querySelector('#productTitle, .product-title');
    if (titleEl) data.title = titleEl.textContent.trim();

    const priceEl = doc.querySelector('.a-price-whole, .a-offscreen, .price');
    if (priceEl) data.price = priceEl.textContent.trim();

    const ratingEl = doc.querySelector('.a-icon-alt, .aok-align-bottom');
    if (ratingEl) data.rating = ratingEl.textContent.trim();

    const featuresEl = doc.querySelectorAll('#feature-bullets li, .a-unordered-list li');
    if (featuresEl.length) {
      data.features = Array.from(featuresEl).slice(0, 5).map(el => el.textContent.trim()).join('\n');
    }

    return data;
  };

  // Extract LinkedIn data
  const extractLinkedInData = (doc, domain) => {
    const data = {};
    if (!domain.includes('linkedin')) return data;

    const titleEl = doc.querySelector('.share-update-card__title, .feed-shared-text');
    if (titleEl) data.title = titleEl.textContent.trim();

    const authorEl = doc.querySelector('.feed-shared-actor__name, .share-actor-name');
    if (authorEl) data.author = authorEl.textContent.trim();

    return data;
  };

  // Extract Instagram data
  const extractInstagramData = (doc, domain) => {
    const data = {};
    if (!domain.includes('instagram')) return data;

    // Instagram is mostly JavaScript-rendered, limited extraction possible
    const titleEl = doc.querySelector('title');
    if (titleEl && titleEl.textContent.includes('@')) {
      data.title = titleEl.textContent.replace(' • Instagram', '').trim();
    }

    return data;
  };

  // Topical Website Generator Function
  const generateTopicalWebsite = (contentType, userInput) => {
    const websiteSuggestions = {
      workout: {
        authoritative: ['bodybuilding.com', 'menshealth.com', 'womenshealthmag.com', 'acefitness.org', 'nasm.org'],
        trending: ['athleanx.com', 'tigerfitness.com', 'muscleandstrength.com', 'strongapp.me', 'calisthenic-workout.com'],
        scientific: ['pubmed.ncbi.nlm.nih.gov', 'journals.lww.com', 'tandfonline.com', 'springer.com', 'mdpi.com']
      },
      recipe: {
        authoritative: ['allrecipes.com', 'foodnetwork.com', 'epicurious.com', 'bonappetit.com', 'seriouseats.com'],
        trending: ['tasty.co', 'pinchofyum.com', 'minimalistbaker.com', 'budgetbytes.com', 'thekitchn.com'],
        scientific: ['nutrition.gov', 'nih.gov', 'who.int', 'fda.gov', 'usda.gov']
      },
      realEstate: {
        authoritative: ['realtor.com', 'zillow.com', 'redfin.com', 'trulia.com', 'mls.com'],
        trending: ['biggerpockets.com', 'investopedia.com', 'nar.realtor', 'rismedia.com', 'inman.com'],
        scientific: ['census.gov', 'bls.gov', 'freddiemac.com', 'fanniemae.com', 'mortgagebankers.org']
      },
      mindfulness: {
        authoritative: ['mindful.org', 'headspace.com', 'calm.com', 'ten-percent-happier.com', 'dharma-ocean.org'],
        trending: ['mindfulness.com', 'palousemindfulness.com', 'mindfulschools.org', 'uclahealth.org', 'mindfulnessmuse.com'],
        scientific: ['ncbi.nlm.nih.gov', 'psycnet.apa.org', 'nature.com', 'sciencedirect.com', 'cambridge.org']
      },
      educational: {
        authoritative: ['khanacademy.org', 'coursera.org', 'edx.org', 'mit.edu', 'stanford.edu'],
        trending: ['ted.com', 'youtube.com/education', 'skillshare.com', 'udemy.com', 'masterclass.com'],
        scientific: ['scholar.google.com', 'researchgate.net', 'academia.edu', 'jstor.org', 'arxiv.org']
      },
      motivational: {
        authoritative: ['tonyrobbins.com', 'briantracy.com', 'zigziglar.com', 'johnmaxwell.com', 'robinsharma.com'],
        trending: ['goalcast.com', 'success.com', 'entrepreneur.com', 'inc.com', 'forbes.com'],
        scientific: ['psychologytoday.com', 'apa.org', 'harvard.edu', 'stanford.edu', 'yale.edu']
      },
      travel: {
        authoritative: ['lonelyplanet.com', 'tripadvisor.com', 'nationalgeographic.com', 'fodors.com', 'ricksteves.com'],
        trending: ['nomadicmatt.com', 'adventureblog.net', 'theplanetd.com', 'expertvagabond.com', 'worldnomads.com'],
        scientific: ['unwto.org', 'iata.org', 'who.int', 'state.gov', 'cdc.gov']
      },
      tech: {
        authoritative: ['techcrunch.com', 'wired.com', 'theverge.com', 'arstechnica.com', 'engadget.com'],
        trending: ['producthunt.com', 'hackernews.ycombinator.com', 'reddit.com/r/technology', 'slashgear.com', 'gizmodo.com'],
        scientific: ['ieee.org', 'acm.org', 'nature.com/subjects/computer-science', 'sciencedirect.com', 'arxiv.org']
      },
      finance: {
        authoritative: ['investopedia.com', 'morningstar.com', 'bloomberg.com', 'wsj.com', 'cnbc.com'],
        trending: ['nerdwallet.com', 'fool.com', 'mint.com', 'personalcapital.com', 'creditkarma.com'],
        scientific: ['federalreserve.gov', 'bls.gov', 'treasury.gov', 'sec.gov', 'imf.org']
      },
      beauty: {
        authoritative: ['sephora.com', 'ulta.com', 'allure.com', 'byrdie.com', 'beautypedia.com'],
        trending: ['glossier.com', 'fenty.com', 'rarebeauty.com', 'milkmakeup.com', 'tatcha.com'],
        scientific: ['ncbi.nlm.nih.gov', 'dermatology.org', 'aad.org', 'cosmeticsandtoiletries.com', 'personalcaremagazine.com']
      },
      parenting: {
        authoritative: ['whattoexpect.com', 'babycenter.com', 'parents.com', 'parenting.com', 'healthychildren.org'],
        trending: ['scarymommy.com', 'motherly.com', 'romper.com', 'popsugar.com/family', 'cafemom.com'],
        scientific: ['pediatrics.aappublications.org', 'zerotothree.org', 'childmind.org', 'developingchild.harvard.edu', 'cdc.gov/ncbddd']
      },
      business: {
        authoritative: ['harvard.edu/business-review', 'entrepreneur.com', 'inc.com', 'forbes.com', 'bloomberg.com'],
        trending: ['techcrunch.com', 'venturebeat.com', 'fastcompany.com', 'wired.com/business', 'medium.com'],
        scientific: ['mit.edu/sloan', 'wharton.upenn.edu', 'kellogg.northwestern.edu', 'gsb.stanford.edu', 'hbs.edu']
      },
      lifestyle: {
        authoritative: ['realsimple.com', 'goodhousekeeping.com', 'betterhomesandgardens.com', 'martha-stewart.com', 'oprah.com'],
        trending: ['cup-of-jo.com', 'theeverygirl.com', 'camillestyles.com', 'thechrisellefactor.com', 'songofstyle.com'],
        scientific: ['nih.gov', 'cdc.gov', 'who.int', 'psychologytoday.com', 'harvard.edu/health']
      }
    };

    // Extract keywords from user input to better match website suggestions
    const extractKeywords = (input) => {
      if (!input || typeof input !== 'object') return [];
      const text = JSON.stringify(input).toLowerCase();
      const keywords = [];
      
      // Extract meaningful words, skip common words
      const words = text.match(/[a-zA-Z]{3,}/g) || [];
      const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];
      
      words.forEach(word => {
        if (!commonWords.includes(word) && word.length > 3) {
          keywords.push(word);
        }
      });
      
      return keywords.slice(0, 5); // Return top 5 keywords
    };

    const keywords = extractKeywords(userInput);
    const suggestions = websiteSuggestions[contentType] || websiteSuggestions.lifestyle;
    
    // Choose website type based on content complexity and randomization
    let websiteType;
    if (contentComplexity === 'beginner') {
      websiteType = Math.random() > 0.7 ? 'trending' : 'authoritative';
    } else if (contentComplexity === 'intermediate') {
      websiteType = Math.random() > 0.5 ? 'authoritative' : 'trending';
    } else {
      websiteType = Math.random() > 0.6 ? 'scientific' : 'authoritative';
    }
    
    const websiteList = suggestions[websiteType];
    let selectedWebsite = websiteList[Math.floor(Math.random() * websiteList.length)];
    
    // Create a topically relevant URL path based on keywords and content type
    const createTopicalPath = (domain, keywords, contentType) => {
      if (domain.includes('pubmed') || domain.includes('ncbi')) {
        return `https://${domain}/?term=${keywords[0] || contentType}+${keywords[1] || 'research'}`;
      } else if (domain.includes('youtube')) {
        return `https://${domain}/results?search_query=${keywords[0] || contentType}+${keywords[1] || 'tutorial'}`;
      } else if (domain.includes('google')) {
        return `https://${domain}/search?q=${keywords[0] || contentType}+${keywords[1] || 'guide'}+${new Date().getFullYear()}`;
      } else {
        // Generate realistic article paths
        const pathSuggestions = {
          workout: ['/workouts/', '/fitness/', '/exercises/', '/training/', '/routines/'],
          recipe: ['/recipes/', '/cooking/', '/food/', '/kitchen/', '/meals/'],
          realEstate: ['/real-estate/', '/property/', '/housing/', '/market/', '/investing/'],
          mindfulness: ['/meditation/', '/mindfulness/', '/wellness/', '/mental-health/', '/peace/'],
          educational: ['/learn/', '/education/', '/courses/', '/tutorials/', '/guides/'],
          motivational: ['/motivation/', '/success/', '/goals/', '/inspiration/', '/achievement/'],
          travel: ['/travel/', '/destinations/', '/trips/', '/adventure/', '/explore/'],
          tech: ['/technology/', '/tech/', '/gadgets/', '/apps/', '/innovation/'],
          finance: ['/finance/', '/money/', '/investing/', '/budget/', '/savings/'],
          beauty: ['/beauty/', '/skincare/', '/makeup/', '/cosmetics/', '/style/'],
          parenting: ['/parenting/', '/kids/', '/family/', '/children/', '/motherhood/'],
          business: ['/business/', '/entrepreneur/', '/startup/', '/leadership/', '/success/'],
          lifestyle: ['/lifestyle/', '/living/', '/home/', '/wellness/', '/daily-life/']
        };
        
        const paths = pathSuggestions[contentType] || pathSuggestions.lifestyle;
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        const slug = keywords.length > 0 ? keywords.slice(0, 2).join('-') : `${contentType}-guide`;
        
        return `https://${domain}${randomPath}${slug}-${new Date().getFullYear()}`;
      }
    };
    
    const topicalUrl = createTopicalPath(selectedWebsite, keywords, contentType);
    
    console.log(`🌐 Generated topical website for ${contentType}:`, topicalUrl);
    console.log(`🔍 Keywords extracted:`, keywords);
    console.log(`📊 Website type selected:`, websiteType);
    
    return {
      url: topicalUrl,
      domain: selectedWebsite,
      keywords: keywords,
      websiteType: websiteType,
      contentType: contentType
    };
  };

  // Web Data Fetching Function
  const fetchWebData = async (url) => {
    try {
      console.log(`🔍 Fetching data from: ${url}`);
      
      // For demo purposes, we'll simulate web data fetching
      // In a production app, you'd use a web scraping service or API
      const simulateWebData = (url) => {
        const domain = new URL(url).hostname;
        const currentDate = new Date().toLocaleDateString();
        
        // Simulate realistic web content based on domain
        const mockData = {
          title: `Latest Insights: ${url.split('/').pop().replace(/-/g, ' ')} - ${currentDate}`,
          description: `Comprehensive guide covering the latest trends and expert insights. Updated ${currentDate} with current research and practical applications.`,
          keyPoints: [
            'Evidence-based approaches backed by recent studies',
            'Expert recommendations from industry leaders',
            'Practical tips for immediate implementation', 
            'Common mistakes to avoid based on real experiences',
            'Latest trends and future predictions'
          ],
          stats: `${Math.floor(Math.random() * 50) + 50}% improvement reported by users`,
          expertQuote: `"This approach represents a significant advancement in the field" - Leading Expert, ${new Date().getFullYear()}`,
          source: domain,
          fetchDate: currentDate,
          credibility: domain.includes('.edu') || domain.includes('.gov') || domain.includes('.org') ? 'High Authority' : 'Trusted Source'
        };
        
        return mockData;
      };
      
      const webData = simulateWebData(url);
      console.log(`✅ Successfully fetched web data:`, webData.title);
      return webData;
      
    } catch (error) {
      console.error('Error fetching web data:', error);
      return {
        title: 'Expert Insights',
        description: 'Current research and expert recommendations',
        keyPoints: ['Latest evidence-based approaches', 'Expert recommendations', 'Practical implementation tips'],
        stats: 'Proven results from multiple studies',
        source: 'Authoritative sources',
        fetchDate: new Date().toLocaleDateString()
      };
    }
  };

  // AI Content Generation Function
  const generateAIContent = async (contentType, data) => {
    try {
      console.log(`🤖 Generating AI content for ${contentType}...`, data);
      
      // Step 1: Generate topical website and fetch web data
      const topicalSite = generateTopicalWebsite(contentType, data);
      const webData = await fetchWebData(topicalSite.url);
      
      console.log(`📊 Integrating web insights from ${topicalSite.domain}:`, webData.title);
      
      // Platform-specific SEO and formatting requirements
      const platformSpecs = {
        instagram: {
          characterLimit: 2200,
          hashtagLimit: 30,
          seoElements: ['trending hashtags', 'location tags', 'alt text optimization'],
          engagement: ['questions', 'polls', 'story prompts', 'UGC encouragement'],
          influencerStyle: 'visual storytelling, behind-the-scenes, aspirational lifestyle'
        },
        tiktok: {
          characterLimit: 150,
          hashtagLimit: 100,
          seoElements: ['trending sounds', 'viral hashtags', 'algorithm optimization'],
          engagement: ['hooks in first 3 seconds', 'calls to action', 'trend participation'],
          influencerStyle: 'authentic, relatable, trend-aware, high energy'
        },
        linkedin: {
          characterLimit: 3000,
          hashtagLimit: 5,
          seoElements: ['industry keywords', 'professional hashtags', 'thought leadership'],
          engagement: ['professional insights', 'industry questions', 'networking'],
          influencerStyle: 'thought leadership, expertise sharing, professional storytelling'
        },
        twitter: {
          characterLimit: 280,
          hashtagLimit: 2,
          seoElements: ['trending topics', 'timely hashtags', 'thread optimization'],
          engagement: ['retweets', 'replies', 'quote tweets', 'trending participation'],
          influencerStyle: 'witty, timely, conversational, thought-provoking'
        },
        youtube: {
          characterLimit: 5000,
          hashtagLimit: 15,
          seoElements: ['keyword optimization', 'searchable titles', 'description SEO'],
          engagement: ['subscribe CTAs', 'comment prompts', 'notification bells'],
          influencerStyle: 'educational, entertaining, personality-driven, community building'
        },
        facebook: {
          characterLimit: 63206,
          hashtagLimit: 3,
          seoElements: ['local SEO', 'community hashtags', 'share optimization'],
          engagement: ['shares', 'comments', 'community building', 'event promotion'],
          influencerStyle: 'community-focused, personal stories, family-friendly, local connection'
        }
      };

      const currentPlatform = platformSpecs[selectedPlatform] || platformSpecs.instagram;
      
      // Current contextual data for relevance
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
      const currentSeason = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter'][currentDate.getMonth()];
      const dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' });
      const timeOfDay = currentDate.getHours() < 12 ? 'morning' : currentDate.getHours() < 17 ? 'afternoon' : 'evening';
      
      // Generate random personal elements for authenticity
      const personalTouches = [
        'struggled with this myself', 'learned this the hard way', 'wish someone told me this earlier',
        'obsessed with this lately', 'game-changer for my routine', 'completely transformed my approach',
        'my biggest mistake was ignoring this', 'secret I learned from a mentor', 'changed everything for me',
        'never thought I\'d be the person who', 'used to think this was overrated until', 'discovered this by complete accident'
      ];
      const randomPersonal = personalTouches[Math.floor(Math.random() * personalTouches.length)];
      
      const storyHooks = [
        `Last ${dayOfWeek}, something shifted for me...`, `Okay, real talk - I ${randomPersonal}...`,
        `Plot twist: what I thought I knew about this was completely wrong...`,
        `${currentMonth} vibes hit different when you discover this...`,
        `Storytime: Why I was doing this all wrong for years...`,
        `Can we normalize talking about this? Because I ${randomPersonal}...`,
        `Update: Remember when I posted about struggling with this?`,
        `Hot take that might be controversial but hear me out...`,
        `Three months ago I would've scrolled past this, but now...`
      ];
      const randomHook = storyHooks[Math.floor(Math.random() * storyHooks.length)];
      
      // Content variation algorithms to prevent repetition
      const contentAngles = [
        'Personal Journey Storytelling', 'Educational Expert Mode', 'Relatable Community Vibe', 
        'Behind-the-Scenes Reality', 'Myth-Busting Authority', 'Inspirational Transformation'
      ];
      const randomAngle = contentAngles[Math.floor(Math.random() * contentAngles.length)];
      
      const emotionalTones = [
        'enthusiastic and inspiring', 'authentic and vulnerable', 'confident and authoritative',
        'warm and community-focused', 'playful and conversational', 'passionate and knowledgeable'
      ];
      const randomTone = emotionalTones[Math.floor(Math.random() * emotionalTones.length)];
      
      const engagementStyles = [
        'Ask thought-provoking questions', 'Share surprising statistics', 'Create relatable scenarios',
        'Use interactive polls/challenges', 'Share personal vulnerabilities', 'Provide actionable takeaways'
      ];
      const randomEngagement = engagementStyles[Math.floor(Math.random() * engagementStyles.length)];

      // SEO-optimized prompt engineering for top influencer style
      let prompt = `You are a VIRAL ${selectedPlatform.toUpperCase()} CONTENT CREATOR with authentic personality and millions of engaged followers.

🗓️ CURRENT CONTEXT: ${currentMonth} ${currentDate.getFullYear()} | ${currentSeason} | ${dayOfWeek} ${timeOfDay}

PLATFORM: ${selectedPlatform.toUpperCase()}
- Character Limit: ${currentPlatform.characterLimit}
- Hashtag Limit: ${currentPlatform.hashtagLimit}  
- SEO Focus: ${currentPlatform.seoElements.join(', ')}
- Engagement Style: ${currentPlatform.engagement.join(', ')}
- Influencer Voice: ${currentPlatform.influencerStyle}

CONTENT COMPLEXITY: ${contentComplexity.toUpperCase()} level

🎯 PERSONALIZATION ELEMENTS TO WEAVE IN:
- Personal Story Hook: "${randomHook}"
- Content Angle: ${randomAngle} (vary the approach each time)
- Emotional Tone: ${randomTone} (match this energy throughout)
- Engagement Strategy: ${randomEngagement}
- Seasonal Context: ${currentSeason} themes, ${currentMonth} energy, timely relevance
- Community Connection: "my followers always ask about this", "you guys requested this"
- Vulnerability: Real struggles, honest mistakes, learning moments
- Specificity: Exact numbers, specific examples, detailed scenarios

🔄 CONTENT VARIATION RULES:
- Never use the same opening hook twice
- Rotate between personal story, educational tip, and community question
- Vary sentence structure (short punchy vs longer descriptive)
- Alternate between confident expertise and relatable vulnerability
- Mix statistical facts with emotional storytelling

SEO OPTIMIZATION REQUIREMENTS:
✅ Include 3-5 high-traffic, searchable keywords naturally
✅ Use trending hashtags (research-based, not generic)
✅ Optimize for ${selectedPlatform} algorithm preferences
✅ Include location-based keywords when relevant
✅ Use searchable phrases that people actually type
✅ Include question hooks that boost engagement metrics
✅ Add call-to-action that drives specific user behavior
✅ Use power words that increase shareability

INFLUENCER-LEVEL COPYWRITING:
🎯 Hook them in first 3 seconds (curiosity gap, shocking stat, personal story)
🎯 Use vulnerability + authority (relatable struggles + expert knowledge)
🎯 Include social proof naturally (follower success, community wins)
🎯 Create FOMO through scarcity or urgency (without being pushy)
🎯 Use conversational tone with strategic psychology
🎯 Include micro-storytelling elements
🎯 Add personality quirks that make you memorable
🎯 Use pattern interrupts to stop the scroll
🎯 Include community-building elements
🎯 End with engagement-driving questions

`;
      
      switch (contentType) {
        case 'workout':
          prompt += `🏋️ FITNESS CREATOR CONTENT for ${selectedPlatform.toUpperCase()}:

💪 WORKOUT SPECIFICS:
Title: "${data.title || 'Transformative Fitness Program'}"
Duration: ${data.duration || '20 minutes'} (mention exact timing)
Difficulty: ${data.difficulty || 'All levels'} (be specific about modifications)
Exercises: "${data.exercises || 'Full body strength circuit'}"

🔥 ${currentSeason.toUpperCase()} FITNESS CONTEXT:
${currentSeason === 'Winter' ? '• New Year motivation, indoor workouts, consistency goals' :
  currentSeason === 'Spring' ? '• Spring cleaning energy, outdoor activities, fresh start vibes' :
  currentSeason === 'Summer' ? '• Beach body confidence, outdoor fitness, vacation prep' :
  '• Back-to-routine energy, cozy home workouts, building habits'}
• ${currentMonth} specific: Reference current events, holidays, or seasonal activities
• ${dayOfWeek} energy: Match the day's typical energy (Monday motivation, Friday celebration, etc.)

🎯 SPECIFIC FITNESS STORYTELLING ANGLES:
1. Personal Journey: "6 months ago I couldn't do this move. Here's what changed..."
2. Real Results: "This exact routine helped my client lose 15lbs in 8 weeks..."  
3. Common Struggles: "If you're like me and hate [specific exercise], try this instead..."
4. Behind-the-Scenes: "What nobody tells you about ${data.difficulty || 'starting fitness'}..."
5. Community Success: "Sarah tried this and sent me the most amazing progress pic..."

💥 HYPER-SPECIFIC HOOKS (use exact details):
- "${data.duration || '15 minutes'} to completely change how your body feels"
- "This ${data.exercises ? data.exercises.split(',')[0] || 'move' : 'exercise'} targets exactly what you asked for"
- "Day 3 of doing this: my ${currentSeason === 'Summer' ? 'confidence' : 'energy'} is through the roof"
- "POV: You finally found a workout that doesn't feel like punishment"
- "The ${data.difficulty || 'beginner'}-friendly version that actually works"

🔄 SEASONAL MOTIVATION HOOKS:
${currentSeason === 'Winter' ? '"New year, same determination - but smarter approach"' :
  currentSeason === 'Spring' ? '"Spring cleaning your fitness routine hits different"' :
  currentSeason === 'Summer' ? '"Confidence season starts with consistency, not perfection"' :
  '"Fall fitness vibes: building something sustainable"'}

📱 PLATFORM-OPTIMIZED STORYTELLING:
${selectedPlatform === 'tiktok' ? 
  '• Quick transformation shots, trending audio, "Wait for the form check"' : 
  selectedPlatform === 'instagram' ? 
  '• Behind-the-scenes Stories, before/after progress, workout outfit flatlay' :
  selectedPlatform === 'linkedin' ? 
  '• Productivity benefits, leadership through wellness, workplace fitness' :
  '• Community challenges, accountability partnerships, family-friendly modifications'}

Generate content that feels like advice from a knowledgeable friend, not a generic fitness guru.`;

        break;
          break;
          
        case 'recipe':
          prompt += `🍳 FOOD CONTENT CREATOR for ${selectedPlatform.toUpperCase()}:

👩‍🍳 RECIPE SPECIFICS:
Title: "${data.title || 'Comfort Food Magic'}"
Key Ingredients: ${data.ingredients || 'Simple pantry staples'}
Cooking Method: ${data.instructions || 'Easy one-pot technique'}

🌱 ${currentSeason.toUpperCase()} FOOD STORYTELLING:
${currentSeason === 'Winter' ? '• Cozy comfort foods, soup season, warming spices, holiday leftovers' :
  currentSeason === 'Spring' ? '• Fresh herbs, lighter meals, farmers market finds, Easter brunch vibes' :
  currentSeason === 'Summer' ? '• No-cook recipes, grilling season, fresh fruit obsession, picnic foods' :
  '• Hearty soups, apple everything, back-to-school lunch prep, pumpkin spice reality'}
• ${currentMonth} cravings: What people are actually cooking right now
• ${dayOfWeek} meal energy: ${dayOfWeek === 'Sunday' ? 'Meal prep Sunday' : dayOfWeek === 'Friday' ? 'Weekend treats' : 'Weeknight solutions'}

🔥 SPECIFIC FOOD STORY ANGLES:
1. Childhood Memory: "This tastes exactly like my grandma's version, but I added..."
2. Cooking Disaster Fixed: "Last time I made this, I burned it. Here's what I learned..."
3. Ingredient Substitution Hero: "Don't have ${data.ingredients ? data.ingredients.split(',')[0] || 'butter' : 'eggs'}? I got you..."
4. Cultural Connection: "My ${randomPersonal.includes('learned') ? 'friend' : 'family'} taught me this technique..."
5. Accidental Discovery: "I was trying to make something else and accidentally created perfection..."

🤤 SENSORY-SPECIFIC HOOKS:
- "That moment when the ${data.ingredients ? data.ingredients.split(',')[0] || 'garlic' : 'onions'} hits the pan... *chef's kiss*"
- "The smell of this ${data.title || 'recipe'} is my love language"
- "${currentSeason} comfort food that hugs you from the inside"
- "When your kitchen smells this good, neighbors start knocking"
- "This ${data.title || 'dish'} is why I actually look forward to ${dayOfWeek}s"

🍽️ PERSONAL COOKING REALITY:
- "Real talk: I've made this 6 times this month and I'm not sorry"
- "My partner keeps requesting this and honestly, same"
- "Failed attempt #3 taught me the secret ingredient is patience"
- "Made this for my coworkers and suddenly I'm the office chef"
- "This is what I make when I want to feel like I have my life together"

📱 PLATFORM-OPTIMIZED FOOD CONTENT:
${selectedPlatform === 'tiktok' ? 
  '• Quick recipe hacks, satisfying stirring videos, "Rating my attempt" series' : 
  selectedPlatform === 'instagram' ? 
  '• Step-by-step carousel, ingredient flatlays, finished product hero shot' :
  selectedPlatform === 'linkedin' ? 
  '• Meal prep for productivity, cultural food conversations, work-life balance through cooking' :
  '• Family recipe sharing, cooking with kids content, budget-friendly meal solutions'}

🕐 TIME-SPECIFIC RELEVANCE:
- ${timeOfDay === 'morning' ? 'Perfect for meal prepping today' : timeOfDay === 'afternoon' ? 'Tonight\'s dinner sorted' : 'Tomorrow\'s lunch inspiration'}
- Reference current food trends, seasonal availability, or upcoming holidays
- Connect to real life: "Sunday reset vibes", "Monday motivation meals", "Friday treat yourself energy"

Generate content that makes followers immediately text their friends about trying this recipe.`;

        break;
          break;
          
        case 'realEstate':
          prompt += `🏡 REAL ESTATE EXPERT CONTENT for ${selectedPlatform.toUpperCase()}:

🏠 PROPERTY INSIGHT SPECIFICS:
Title: "${data.title || 'Market Intelligence Update'}"
Focus Area: ${data.description || 'Professional market analysis'}

📈 ${currentMonth.toUpperCase()} ${currentDate.getFullYear()} MARKET CONTEXT:
${currentSeason === 'Winter' ? '• Holiday market slowdown, New Year home goals, tax season prep' :
  currentSeason === 'Spring' ? '• Prime buying season, inventory increases, moving season begins' :
  currentSeason === 'Summer' ? '• Peak market activity, family relocations, vacation home interest' :
  '• Back-to-school relocations, market cooling, winter prep for properties'}
• Reference current interest rates, recent market shifts, local events affecting housing
• ${dayOfWeek} timing: ${dayOfWeek === 'Sunday' ? 'Open house energy' : dayOfWeek === 'Monday' ? 'New listing alerts' : 'Market update momentum'}

💡 REAL ESTATE STORY ANGLES WITH SPECIFICITY:
1. Client Success Story: "Last month, I helped Sarah get her offer accepted in THIS market by doing one thing..."
2. Market Prediction Accuracy: "I called this trend 6 months ago. Here's what's happening next..."
3. Behind-the-Scenes Reality: "What really happened during that bidding war I posted about..."
4. Mistake Prevention: "This $30K mistake is happening to buyers right now. Here's how to avoid it..."
5. Local Market Insider: "If you're buying in [specific area], you need to know this changed..."

🎯 HYPER-SPECIFIC VALUE HOOKS:
- "This ${currentMonth} market shift just saved my clients $25K"
- "The home inspection red flag 90% of buyers miss"
- "Why ${currentSeason} is actually the perfect time to [buy/sell] if you know this secret"
- "Today's interest rate means this for your buying power..."
- "The neighborhood indicator that predicts property value in 3 years"

🏘️ LOCAL MARKET EXPERTISE:
- Reference specific neighborhoods, school districts, commute patterns
- Mention local businesses, development projects, community events
- Use exact price ranges, average days on market, inventory numbers
- Connect to local lifestyle factors (coffee shops, parks, commute times)
- Address neighborhood-specific concerns or benefits

📊 AUTHORITY-BUILDING SPECIFICS:
- "In my ${Math.floor(Math.random() * 10) + 5} years selling in this area, I've seen..."
- "My client just closed on a property that appraised $15K over asking because we..."
- "The strategy that's gotten my last 12 buyers accepted in this competitive market..."
- "Data from my last 50 transactions shows this pattern..."
- "The inspection issue I see in 80% of homes built between [specific years]..."

📱 PLATFORM-OPTIMIZED REAL ESTATE CONTENT:
${selectedPlatform === 'tiktok' ? 
  '• Quick market updates, house walk-through highlights, "Red flag or normal?" series' : 
  selectedPlatform === 'instagram' ? 
  '• Beautiful home features, market infographics, client testimonial Stories' :
  selectedPlatform === 'linkedin' ? 
  '• Market analysis, investment insights, professional development for agents' :
  '• First-time buyer education, family home considerations, community spotlights'}

💰 CURRENT MARKET URGENCY (use actual context):
- Reference real interest rate changes, seasonal market patterns, inventory levels
- Create educated urgency: "With inventory at [X level], waiting could mean..."
- Connect to life events: "Spring move timeline means starting your search by..."
- Local urgency: "This development is changing our market dynamics because..."

Generate content that makes followers think "I need to call them RIGHT NOW" while providing genuine market insight.`;

        break;
          break;
          
        case 'mindfulness':
          prompt = `Create transformative, emotionally resonant mindfulness content using wellness psychology principles:

MINDFULNESS CONTENT:
Title: ${data.title || 'Inner Transformation Practice'}
Content: ${data.description || 'Consciousness-expanding technique'}

MINDFULNESS COPYWRITING PSYCHOLOGY:
• Use present-moment language and grounding words
• Include gentle but powerful transformation promises
• Apply emotional regulation triggers (calm, center, balance, clarity)
• Create safe space feeling (permission, acceptance, non-judgment)
• Use metaphorical and nature imagery
• Include accessibility (anyone can do this, start where you are)
• Blend ancient wisdom with modern science
• Create micro-moments of peace through the copy itself

WELLNESS MESSAGING TECHNIQUES:
- Permission Giving: Allow yourself to..., it's okay to...
- Gentle Challenge: What if you could..., imagine feeling...
- Scientific Backing: Research shows..., studies confirm...
- Personal Connection: You deserve..., your mind craves...
- Ritual Creation: Daily practice of..., morning moment of...

EMOTIONAL TRIGGERS FOR WELLNESS:
• Stress Relief (escape the chaos, find your calm)
• Self-Compassion (be gentle with yourself)
• Clarity & Focus (clear mental fog, sharpen awareness)
• Emotional Regulation (steady your emotions, inner stability)
• Spiritual Connection (deeper purpose, inner wisdom)
• Energy Renewal (recharge your spirit, revitalize your mind)

TONE VARIATIONS:
- Wise Guide: Gentle authority, experienced teacher, compassionate leader
- Scientific Wellness: Evidence-based, research-backed, practical
- Spiritual Mentor: Soul-focused, transformative, consciousness-expanding
- Accessible Friend: Relatable, everyday mindfulness, simple practices

Create content that provides immediate value while inspiring deeper practice.`;
          break;
          
        case 'educational':
          prompt = `Create compelling, knowledge-driven content using educational psychology and learning science principles:

EDUCATIONAL CONTENT:
Title: ${data.title || 'Mind-Expanding Discovery'}
Content: ${data.content || 'Research-backed insight'}
Category: ${data.category || 'Science & Wellness'}

EDUCATIONAL COPYWRITING FRAMEWORK:
• Use curiosity gap technique (Did you know...? Here's what most people don't realize...)
• Include surprising facts or counter-intuitive information
• Apply scaffolding (build from known to unknown)
• Use pattern interrupts (challenge assumptions)
• Include practical applications (Here's how this affects YOU)
• Cite credible sources and research
• Create "aha moments" through strategic revelation
• Use analogies and metaphors for complex concepts

ENGAGEMENT PSYCHOLOGY:
- Cognitive Dissonance: Challenge existing beliefs
- Social Learning: Show how others benefit from this knowledge
- Competence Need: Help audience feel smarter, more capable
- Autonomy: Give them tools to apply knowledge independently
- Curiosity Drive: Promise deeper understanding

EDUCATIONAL CONTENT TYPES:
• Myth Busting: "Everyone thinks X, but science shows Y"
• Behind the Scenes: "Here's what really happens when..."
• Practical Application: "Use this knowledge to improve your..."
- Research Reveal: "New studies discovered something surprising about..."
• Historical Context: "This ancient practice is now proven by modern science"

COMPLEXITY LEVELS:
- Beginner: Simple analogies, basic concepts, immediate relevance
- Intermediate: Deeper mechanisms, multiple factors, strategic thinking
- Advanced: Nuanced understanding, systems thinking, expert insights

Make complex information irresistibly digestible while maintaining scientific accuracy.`;
          break;
          
        case 'motivational':
          prompt = `Create high-impact motivational content using behavioral psychology and peak performance principles:

MOTIVATIONAL CONTENT:
Title: ${data.title || 'Breakthrough Mindset Shift'}
Content: ${data.content || 'Transformation catalyst'}
Theme: ${data.theme || 'Unleashing Potential'}

MOTIVATIONAL PSYCHOLOGY FRAMEWORK:
• Use identity-based language (You ARE, not you can be)
• Include obstacle reframing (challenges become opportunities)
• Apply growth mindset triggers (yet, progress, becoming)
• Create empowerment through choice (You decide, Your move, Your power)
• Use visualization and future-pacing (Imagine yourself, Picture this)
• Include urgency without pressure (Now is your moment, This is your time)
• Blend vulnerability with strength (authentic struggle + triumphant outcome)

PERSUASION TECHNIQUES FOR MOTIVATION:
- Social Proof: Others have overcome this, you can too
- Authority: Lessons from high achievers, proven principles
- Reciprocity: I believe in you, now believe in yourself
- Commitment: What will you commit to? Take the first step
- Contrast: Where you are vs. where you could be

EMOTIONAL ACTIVATION STRATEGIES:
• Pain Avoidance: Cost of staying stuck, regret prevention
• Pleasure Seeking: Vision of success, achievement satisfaction
• Progress Momentum: Small wins lead to big victories
• Identity Alignment: This is who you're becoming
• Legacy Thinking: Future self appreciation, impact on others

MOTIVATIONAL ARCHETYPES:
- Warrior: Battle through obstacles, conquer challenges, victory mindset
- Explorer: Discover new possibilities, venture beyond comfort zones
- Creator: Build your vision, craft your future, design your destiny  
- Sage: Wisdom through experience, learning from setbacks
- Hero: Journey of transformation, serving others through your growth

Create content that moves people from inspiration to specific action while honoring their individual journey.`;
          break;

        case 'travel':
          prompt += `✈️ TRAVEL CREATOR CONTENT for ${selectedPlatform.toUpperCase()}:

🌍 TRAVEL SPECIFICS:
Destination: "${data.destination || 'Amazing Hidden Gem'}"
Experience Type: ${data.category || 'Adventure Travel'}
Travel Story: ${data.content || 'Unforgettable journey details'}

🗺️ ${currentSeason.toUpperCase()} TRAVEL CONTEXT:
${currentSeason === 'Winter' ? '• Winter escape destinations, cozy retreats, holiday travel, ski season' :
  currentSeason === 'Spring' ? '• Spring break adventures, blooming destinations, shoulder season deals' :
  currentSeason === 'Summer' ? '• Peak travel season, beach destinations, festival travel, family vacations' :
  '• Fall foliage trips, harvest season travel, back-to-school getaways, off-season gems'}
• ${currentMonth} travel vibes: Reference current travel trends, seasonal destinations
• ${dayOfWeek} wanderlust: ${dayOfWeek === 'Monday' ? 'Monday blues cure' : dayOfWeek === 'Friday' ? 'Weekend escape planning' : 'Travel dreaming energy'}

🎯 TRAVEL STORYTELLING ANGLES:
1. Discovery Story: "Nobody told me about this hidden spot in ${data.destination || 'this destination'}..."
2. Cultural Immersion: "The locals taught me something that completely changed my perspective..."
3. Travel Hack Reveal: "This ${data.category || 'travel'} trick saved me $500 and countless headaches..."
4. Authentic Experience: "Tourist trap vs. the REAL ${data.destination || 'destination'} experience..."
5. Solo Travel Empowerment: "Traveling solo to ${data.destination || 'this place'} taught me..."

🌟 WANDERLUST-SPECIFIC HOOKS:
- "${data.destination || 'This destination'} wasn't even on my radar until I accidentally..."
- "Plot twist: The best part of ${data.destination || 'my trip'} wasn't what I planned"
- "${currentSeason} in ${data.destination || 'this place'} hits different when you know where locals go"
- "That moment when ${data.destination || 'travel'} changes your entire perspective on life"
- "Why ${data.destination || 'this destination'} should be your next ${currentSeason.toLowerCase()} escape"

📱 PLATFORM-OPTIMIZED TRAVEL CONTENT:
${selectedPlatform === 'tiktok' ? 
  '• Quick destination reveals, packing hacks, "day in my life" travel content' : 
  selectedPlatform === 'instagram' ? 
  '• Stunning destination shots, travel story highlights, wanderlust-inducing carousels' :
  selectedPlatform === 'linkedin' ? 
  '• Business travel insights, remote work destinations, professional networking travel' :
  '• Family travel tips, budget-friendly destinations, cultural travel education'}

Generate content that makes followers immediately start planning their next adventure.`;
          break;

        case 'tech':
          prompt += `📱 TECH CREATOR CONTENT for ${selectedPlatform.toUpperCase()}:

🔥 TECH SPECIFICS:
Product/Topic: "${data.title || 'Latest Tech Innovation'}"
Category: ${data.category || 'AI/ML'}
Content Focus: ${data.content || 'Cutting-edge technology insight'}

⚡ ${currentMonth.toUpperCase()} ${currentDate.getFullYear()} TECH LANDSCAPE:
${currentSeason === 'Winter' ? '• CES season, holiday tech gifts, year-end tech roundups, Q4 launches' :
  currentSeason === 'Spring' ? '• Spring product launches, developer conferences, startup funding season' :
  currentSeason === 'Summer' ? '• Tech internship insights, summer product demos, conference season' :
  '• Back-to-school tech, iPhone season, holiday tech prep, Q4 predictions'}
• ${currentMonth} tech trends: Reference latest product launches, updates, industry shifts
• ${dayOfWeek} tech energy: ${dayOfWeek === 'Monday' ? 'Weekly tech news roundup' : dayOfWeek === 'Friday' ? 'Weekend project tech' : 'Mid-week tech discoveries'}

🎯 TECH AUTHORITY ANGLES:
1. Early Adopter Insight: "I've been testing ${data.title || 'this tech'} for 3 weeks. Here's the truth..."
2. Developer Perspective: "As someone who builds ${data.category || 'AI'} systems, this changes everything..."
3. Real-World Testing: "I used ${data.title || 'this'} for my actual workflow. Results were shocking..."
4. Industry Prediction: "Mark my words: ${data.title || 'this technology'} will disrupt entire industries by 2026..."
5. Myth-Busting Tech: "Everyone's wrong about ${data.title || 'this tech trend'}. Here's what actually matters..."

🚀 TECH-SPECIFIC HOOKS:
- "This ${data.category || 'AI'} breakthrough just made 90% of current solutions obsolete"
- "I thought ${data.title || 'this tech'} was hype until I saw the actual benchmarks"
- "${data.title || 'This innovation'} is what everyone will be talking about in ${currentSeason === 'Fall' ? 'Q1 2026' : 'the next quarter'}"
- "Hot take: ${data.title || 'This tech'} solves the wrong problem. Here's what we actually need..."
- "The ${data.category || 'tech'} wars just got interesting. ${data.title || 'This'} changes the game"

📊 TECHNICAL CREDIBILITY ELEMENTS:
- Include specific specs, benchmarks, or technical details
- Reference actual testing methodologies and results  
- Compare to existing solutions with concrete metrics
- Predict practical applications and market impact
- Address technical limitations honestly

📱 PLATFORM-OPTIMIZED TECH CONTENT:
${selectedPlatform === 'tiktok' ? 
  '• Quick tech demos, before/after comparisons, "tech that blew my mind" series' : 
  selectedPlatform === 'instagram' ? 
  '• Setup showcases, tech lifestyle integration, aesthetic tech content' :
  selectedPlatform === 'linkedin' ? 
  '• Industry analysis, professional tech insights, career-relevant technology' :
  '• Family-friendly tech, educational technology, accessibility-focused reviews'}

Generate content that establishes you as the trusted tech authority who actually tests everything.`;
          break;

        case 'finance':
          prompt += `💰 FINANCE CREATOR CONTENT for ${selectedPlatform.toUpperCase()}:

💵 FINANCE SPECIFICS:
Topic: "${data.title || 'Smart Money Strategy'}"
Focus Area: ${data.type || 'Budgeting'}
Financial Insight: ${data.content || 'Practical money wisdom'}

📈 ${currentMonth.toUpperCase()} ${currentDate.getFullYear()} FINANCIAL CONTEXT:
${currentSeason === 'Winter' ? '• Tax season prep, New Year financial goals, holiday debt recovery, Q4 financial review' :
  currentSeason === 'Spring' ? '• Spring financial cleaning, tax refund strategies, Q1 investment opportunities' :
  currentSeason === 'Summer' ? '• Vacation budgeting, mid-year financial check-ins, summer investment strategies' :
  '• Back-to-school budgeting, Q4 financial planning, holiday spending prep, year-end tax strategies'}
• Current market conditions: Interest rates, inflation impact, economic trends affecting personal finance
• ${dayOfWeek} money mindset: ${dayOfWeek === 'Monday' ? 'Weekly budget planning' : dayOfWeek === 'Friday' ? 'Weekend money goals' : 'Mid-week financial check-in'}

🎯 FINANCIAL AUTHORITY ANGLES:
1. Personal Finance Journey: "2 years ago I was drowning in debt. Here's the exact strategy that saved me..."
2. Market Reality Check: "While everyone's panicking about ${data.type || 'budgeting'}, smart money is doing this..."
3. Myth-Busting Finance: "Financial advisors hate this, but ${data.title || 'this strategy'} actually works better..."
4. Generational Wealth: "The ${data.type || 'investing'} approach that builds wealth for your kids' kids..."
5. Economic Insider: "What the finance industry doesn't want you to know about ${data.title || 'money management'}..."

💡 FINANCE-SPECIFIC HOOKS:
- "This ${data.type || 'budgeting'} mistake costs the average person $${Math.floor(Math.random() * 50) + 10}K per year"
- "I tracked every dollar for ${Math.floor(Math.random() * 6) + 6} months. The results were shocking..."
- "${data.title || 'This money strategy'} is why ${currentSeason === 'Winter' ? '2025 will be' : 'this year is'} my best financially"
- "Plot twist: The 'risky' ${data.type || 'investment'} actually saved my financial future"
- "Why your parents' advice about ${data.title || 'money'} doesn't work in ${currentDate.getFullYear()}"

📊 FINANCIAL CREDIBILITY ELEMENTS:
- Include specific dollar amounts, percentages, and timeframes
- Reference current economic conditions and market realities
- Share actual results with concrete numbers (when appropriate)
- Address risk factors and limitations honestly
- Connect to real-world financial scenarios people face

📱 PLATFORM-OPTIMIZED FINANCE CONTENT:
${selectedPlatform === 'tiktok' ? 
  '• Quick money tips, "POV: you start budgeting" content, financial reality checks' : 
  selectedPlatform === 'instagram' ? 
  '• Budget breakdowns, financial goal tracking, money motivation quotes' :
  selectedPlatform === 'linkedin' ? 
  '• Professional financial insights, career money strategies, industry salary discussions' :
  '• Family financial planning, teaching kids about money, household budget tips'}

⚠️ FINANCIAL RESPONSIBILITY DISCLAIMER:
Always include appropriate disclaimers about financial advice and encourage consulting with financial professionals for personalized guidance.

Generate trustworthy financial content that builds wealth-building authority while being transparent about risks.`;
          break;

        case 'beauty':
          prompt += `✨ BEAUTY CREATOR CONTENT for ${selectedPlatform.toUpperCase()}:

💄 BEAUTY SPECIFICS:
Topic: "${data.title || 'Beauty Game-Changer'}"
Category: ${data.category || 'Skincare'}
Beauty Focus: ${data.content || 'Confidence-boosting beauty insight'}

🌸 ${currentSeason.toUpperCase()} BEAUTY CONTEXT:
${currentSeason === 'Winter' ? '• Winter skincare protection, holiday glam looks, cozy beauty routines, dry skin solutions' :
  currentSeason === 'Spring' ? '• Spring skin refresh, lighter makeup looks, seasonal allergies beauty, fresh beauty trends' :
  currentSeason === 'Summer' ? '• Summer-proof makeup, sun protection focus, sweat-resistant beauty, beach wave hair' :
  '• Fall skincare prep, rich autumn colors, back-to-work beauty, layered beauty looks'}
• ${currentMonth} beauty trends: Reference current product launches, seasonal beauty shifts
• ${dayOfWeek} beauty energy: ${dayOfWeek === 'Monday' ? 'Fresh week beauty prep' : dayOfWeek === 'Friday' ? 'Weekend glow-up' : 'Mid-week beauty boost'}

🎯 BEAUTY AUTHORITY ANGLES:
1. Real Results Story: "I tested ${data.title || 'this beauty trend'} for 30 days. Here's what actually happened..."
2. Ingredient Deep-Dive: "As someone with ${data.category || 'sensitive'} skin, I was skeptical about ${data.title || 'this product'}..."
3. Beauty Myth-Busting: "The beauty industry wants you to believe ${data.title || 'this'} is necessary. Here's the truth..."
4. Confidence Journey: "This ${data.category || 'skincare'} routine didn't just change my skin—it changed my confidence..."
5. Professional Insight: "After working with hundreds of clients, here's what actually works for ${data.category || 'skincare'}..."

💅 BEAUTY-SPECIFIC HOOKS:
- "This ${data.category || 'skincare'} ingredient everyone's afraid of actually saved my skin"
- "POV: You discover the ${data.title || 'beauty hack'} that changes everything about your routine"
- "The ${data.category || 'makeup'} technique that took me from invisible to unforgettable"
- "Why I threw away my entire ${data.category || 'skincare'} collection and started over"
- "${data.title || 'This beauty discovery'} is why strangers keep asking about my ${currentSeason.toLowerCase()} glow"

🔬 BEAUTY CREDIBILITY ELEMENTS:
- Include specific ingredients, application techniques, and timing
- Reference skin type compatibility and potential reactions
- Share before/after results with realistic timelines
- Address different skin tones and types inclusively
- Mention price points and accessibility options

📱 PLATFORM-OPTIMIZED BEAUTY CONTENT:
${selectedPlatform === 'tiktok' ? 
  '• Quick tutorials, transformation videos, "get ready with me" content, trending beauty challenges' : 
  selectedPlatform === 'instagram' ? 
  '• Step-by-step photo tutorials, product flat lays, before/after results, aesthetic beauty content' :
  selectedPlatform === 'linkedin' ? 
  '• Professional beauty for workplace, beauty industry insights, career-focused beauty content' :
  '• Accessible beauty tips, family-friendly beauty, budget-conscious beauty solutions'}

Generate authentic beauty content that celebrates individual beauty and builds genuine confidence.`;
          break;

        case 'parenting':
          prompt += `👨‍👩‍👧‍👦 PARENTING CREATOR CONTENT for ${selectedPlatform.toUpperCase()}:

💝 PARENTING SPECIFICS:
Topic: "${data.title || 'Real Parenting Insight'}"
Age Focus: ${data.ageGroup || 'All Ages'}
Parenting Area: ${data.content || 'Authentic family life wisdom'}

🏠 ${currentSeason.toUpperCase()} FAMILY CONTEXT:
${currentSeason === 'Winter' ? '• Holiday family traditions, indoor activities, cozy family time, winter break challenges' :
  currentSeason === 'Spring' ? '• Spring cleaning with kids, outdoor family activities, Easter/spring break planning' :
  currentSeason === 'Summer' ? '• Summer camp decisions, family vacations, keeping kids busy, screen time balance' :
  '• Back-to-school prep, new routines, homework strategies, fall family activities'}
• ${currentMonth} parenting focus: Age-appropriate seasonal activities and developmental milestones
• ${dayOfWeek} family dynamics: ${dayOfWeek === 'Monday' ? 'Weekly family planning' : dayOfWeek === 'Friday' ? 'Weekend family fun prep' : 'Mid-week parenting reality'}

🎯 PARENTING AUTHENTICITY ANGLES:
1. Vulnerable Mom/Dad Moment: "Yesterday I completely lost it over ${data.title || 'the simplest thing'}. Here's what I learned..."
2. Developmental Reality: "Nobody prepared me for how ${data.ageGroup || 'this age'} would challenge everything I thought I knew..."
3. Family Experiment: "We tried ${data.title || 'this parenting approach'} for 2 weeks. The results surprised everyone..."
4. Generational Shift: "My parents think I'm crazy for ${data.title || 'this parenting choice'}, but here's why it works..."
5. Special Needs Perspective: "Parenting a ${data.ageGroup || 'special needs'} child taught me this about resilience..."

💕 PARENTING-SPECIFIC HOOKS:
- "The parenting advice nobody gives you about ${data.ageGroup || 'toddlers'} that actually works"
- "That moment when your ${data.ageGroup || 'kid'} teaches YOU about ${data.title || 'patience'}"
- "Why I stopped following all the parenting 'rules' and started trusting my instincts"
- "The ${data.title || 'parenting mistake'} I made with my first child that I'll never repeat"
- "${data.ageGroup || 'This age'} is testing every parenting book I've ever read"

🧠 CHILD DEVELOPMENT ELEMENTS:
- Reference age-appropriate expectations and milestones
- Include developmental science when relevant
- Address different parenting styles and family structures
- Acknowledge socioeconomic and cultural diversity
- Focus on connection over perfection

📱 PLATFORM-OPTIMIZED PARENTING CONTENT:
${selectedPlatform === 'tiktok' ? 
  '• Quick parenting hacks, day-in-the-life family content, relatable parenting moments' : 
  selectedPlatform === 'instagram' ? 
  '• Family photo storytelling, milestone celebrations, parenting journey highlights' :
  selectedPlatform === 'linkedin' ? 
  '• Working parent insights, family-work balance, professional parent perspectives' :
  '• Extended family involvement, multi-generational parenting, community parenting support'}

Generate supportive parenting content that makes other parents feel less alone and more confident in their unique family journey.`;
          break;

        case 'business':
          prompt += `💼 BUSINESS CREATOR CONTENT for ${selectedPlatform.toUpperCase()}:

🚀 BUSINESS SPECIFICS:
Topic: "${data.title || 'Business Strategy Breakthrough'}"
Focus Area: ${data.category || 'Entrepreneurship'}
Business Insight: ${data.content || 'Practical business wisdom'}

📊 ${currentMonth.toUpperCase()} ${currentDate.getFullYear()} BUSINESS LANDSCAPE:
${currentSeason === 'Winter' ? '• Q4 business planning, year-end financial reviews, 2026 strategy prep, holiday business impacts' :
  currentSeason === 'Spring' ? '• Q1 goal execution, spring business launches, funding season, fresh business initiatives' :
  currentSeason === 'Summer' ? '• Mid-year business pivots, summer networking, conference season, vacation business planning' :
  '• Q3/Q4 business strategies, end-of-year push, holiday business prep, annual planning season'}
• Current business climate: Economic trends, market shifts, industry disruptions affecting entrepreneurs
• ${dayOfWeek} business energy: ${dayOfWeek === 'Monday' ? 'Weekly business planning' : dayOfWeek === 'Friday' ? 'Weekend business reflection' : 'Mid-week execution focus'}

🎯 BUSINESS AUTHORITY ANGLES:
1. Entrepreneur Journey: "3 years ago I was broke and desperate. Here's the exact business strategy that saved me..."
2. Industry Disruption: "While everyone's doing ${data.category || 'traditional business'}, smart entrepreneurs are pivoting to this..."
3. Failure-to-Success: "My ${data.title || 'business'} failed spectacularly. The lesson learned built my next $1M company..."
4. Mentor Wisdom: "After mentoring 200+ entrepreneurs, here's the pattern I see in every successful ${data.category || 'business'}..."
5. Market Reality: "The business world doesn't want you to know this about ${data.title || 'scaling'}..."

💡 BUSINESS-SPECIFIC HOOKS:
- "This ${data.category || 'business'} mistake costs entrepreneurs $${Math.floor(Math.random() * 100) + 50}K per year"
- "I scaled from $0 to $${Math.floor(Math.random() * 500) + 100}K using this exact ${data.title || 'strategy'}"
- "${data.title || 'This business principle'} is why ${currentSeason === 'Fall' ? '2026 will be' : 'this year is'} my breakthrough year"
- "Hot take: ${data.category || 'Traditional business'} advice is keeping entrepreneurs broke"
- "The ${data.title || 'business insight'} that every successful entrepreneur discovers eventually"

📈 BUSINESS CREDIBILITY ELEMENTS:
- Include specific revenue numbers, growth percentages, and timeframes
- Reference actual business metrics and KPIs
- Share real case studies and client results (with permission)
- Address market conditions and economic realities
- Connect to scalable, actionable business strategies

📱 PLATFORM-OPTIMIZED BUSINESS CONTENT:
${selectedPlatform === 'tiktok' ? 
  '• Quick business tips, entrepreneur day-in-the-life, business reality checks, success celebrations' : 
  selectedPlatform === 'instagram' ? 
  '• Behind-the-scenes business building, entrepreneur lifestyle, business milestone celebrations' :
  selectedPlatform === 'linkedin' ? 
  '• Professional business insights, industry thought leadership, B2B networking content' :
  '• Solopreneur strategies, family business balance, community-focused business building'}

Generate business content that builds entrepreneurial authority while providing genuine value to growing businesses.`;
          break;

        case 'lifestyle':
          prompt += `🌟 LIFESTYLE CREATOR CONTENT for ${selectedPlatform.toUpperCase()}:

✨ LIFESTYLE SPECIFICS:
Theme: "${data.title || 'Elevated Daily Living'}"
Category: ${data.category || 'Self Care'}
Lifestyle Focus: ${data.content || 'Intentional living inspiration'}

🍃 ${currentSeason.toUpperCase()} LIFESTYLE CONTEXT:
${currentSeason === 'Winter' ? '• Cozy home vibes, winter self-care rituals, hygge lifestyle, indoor wellness practices' :
  currentSeason === 'Spring' ? '• Spring cleaning energy, fresh routines, outdoor lifestyle shifts, renewal and growth' :
  currentSeason === 'Summer' ? '• Outdoor living, travel lifestyle, summer wellness routines, social lifestyle activities' :
  '• Autumn aesthetics, cozy routines, seasonal transitions, mindful lifestyle preparation'}
• ${currentMonth} lifestyle energy: Seasonal rituals, current lifestyle trends, timely life improvements
• ${dayOfWeek} life rhythm: ${dayOfWeek === 'Monday' ? 'Weekly reset and planning' : dayOfWeek === 'Friday' ? 'Weekend lifestyle prep' : 'Mid-week balance check'}

🎯 LIFESTYLE AUTHENTICITY ANGLES:
1. Life Transformation: "6 months ago my life was chaos. Here's the ${data.title || 'lifestyle shift'} that changed everything..."
2. Reality vs. Highlight Reel: "The unglamorous truth behind my 'perfect' ${data.category || 'morning routine'}..."
3. Minimalist Discovery: "I eliminated ${data.title || 'this lifestyle excess'} and gained so much more..."
4. Wellness Journey: "My relationship with ${data.category || 'self-care'} was toxic until I learned this approach..."
5. Intentional Living: "Why I chose ${data.title || 'slow living'} over hustle culture (and you should too)..."

🌸 LIFESTYLE-SPECIFIC HOOKS:
- "This ${data.category || 'lifestyle'} change costs $0 but transforms everything about your daily experience"
- "POV: You discover the ${data.title || 'routine'} that makes every day feel like self-care"
- "The lifestyle 'rule' I broke that actually improved my ${currentSeason.toLowerCase()} wellness"
- "Why my 'lazy' ${data.title || 'approach'} to ${data.category || 'productivity'} actually works better"
- "${data.title || 'This lifestyle shift'} is why I actually look forward to ${dayOfWeek}s now"

💫 LIFESTYLE INSPIRATION ELEMENTS:
- Focus on accessible, sustainable lifestyle improvements
- Include mental health and wellness considerations
- Address different life stages and circumstances
- Celebrate individual lifestyle choices and preferences
- Emphasize progress over perfection

📱 PLATFORM-OPTIMIZED LIFESTYLE CONTENT:
${selectedPlatform === 'tiktok' ? 
  '• Day-in-the-life content, lifestyle hacks, aesthetic routine videos, relatable lifestyle moments' : 
  selectedPlatform === 'instagram' ? 
  '• Lifestyle flat lays, home aesthetic shots, routine highlights, aspirational lifestyle content' :
  selectedPlatform === 'linkedin' ? 
  '• Work-life balance insights, professional lifestyle tips, career-wellness integration' :
  '• Family lifestyle content, budget-friendly lifestyle tips, community-focused living'}

Generate aspirational yet attainable lifestyle content that inspires followers to create their own version of intentional living.`;
          break;
          
        default:
          prompt = `Create engaging social media copy for this content:
Title: ${data.title || 'Interesting Content'}
Description: ${data.description || 'Valuable information'}

Write a compelling social media post that engages your audience and encourages interaction.`;
      }
      
      // Generate SEO-optimized, platform-specific content templates  
      const generatePlatformOptimizedContent = () => {
        const platformConfig = {
          instagram: { hashtags: ['#fitness', '#workout', '#health', '#motivation', '#fitnessmotivation', '#exercise', '#training', '#fitlife'], hashtagLimit: 8, charLimit: 2200 },
          tiktok: { hashtags: ['#fitnesstok', '#workoutvideo', '#fitnesscheck', '#gymtok', '#healthylifestyle', '#exerciseroutine'], hashtagLimit: 12, charLimit: 150 },
          linkedin: { hashtags: ['#fitness', '#wellness', '#productivity', '#leadership'], hashtagLimit: 3, charLimit: 1300 },
          twitter: { hashtags: ['#fitness', '#workout'], hashtagLimit: 2, charLimit: 280 },
          youtube: { hashtags: ['#fitness', '#workout', '#exercise', '#health', '#fitnessmotivation'], hashtagLimit: 6, charLimit: 1000 },
          facebook: { hashtags: ['#fitness', '#health', '#wellness'], hashtagLimit: 3, charLimit: 500 }
        };
        const config = platformConfig[selectedPlatform] || platformConfig.instagram;
        return { hashtags: config.hashtags.slice(0, config.hashtagLimit).join(' '), charLimit: config.charLimit };
      };

      const { hashtags, charLimit } = generatePlatformOptimizedContent();

      // SEO-Optimized Templates with Platform Specificity
      const templates = {
        workout: [
          // Authority Expert Approach
          `� BREAKTHROUGH: ${data.title || 'This scientifically-designed protocol'} leverages muscle confusion theory + progressive overload principles. ${data.difficulty === 'Beginner' ? 'Zero experience? Perfect.' : data.difficulty === 'Advanced' ? 'Elite-level intensity ahead.' : 'Scales with YOUR current fitness.'} ${data.duration ? `${data.duration} to complete transformation` : 'Results start week 1'}. 

What's stopping you from starting TODAY? 💪 #FitnessScience #TransformationTuesday #WorkoutProtocol #FitnessBreakthrough`,

          // Challenge Creator Approach  
          `⚡ THE GAUNTLET: ${data.title || 'This workout'} separates pretenders from contenders. ${data.exercises ? 'Every exercise designed to push your limits.' : 'Full-spectrum muscle domination.'} ${data.difficulty === 'Beginner' ? 'Think you\'re not ready? Wrong. You just need to start.' : 'Advanced? Prove it.'}

Tag someone who claims they're "too busy" for fitness. I dare you. 🎯 #FitnessChallenge #NoExcuses #BeastMode #WorkoutDare`,

          // Transformation Storyteller Approach
          `🌟 PLOT TWIST: 12 weeks ago, Sarah thought ${data.title || 'this workout'} looked "impossible." Today? She deadlifts more than her boyfriend. ${data.duration ? `${data.duration} changed everything` : 'Consistency changed everything'}.

Your transformation story starts with ONE decision. What's yours? 🔥 #TransformationStory #FitnessJourney #StrongIsBeautiful #NewChapter`
        ],
        recipe: [
          // Sensory Seduction Approach
          `🔥 KITCHEN CONFESSION: The aroma of ${data.title || 'this dish'} sizzling in my pan just made my neighbor knock on my door. Literally. ${data.ingredients ? 'The secret? Fresh ingredients that cost less than takeout.' : 'Simple ingredients, restaurant-quality results.'} 

That golden, crispy edge? *Chef's kiss* perfection. Who's brave enough to try it tonight? 👨‍🍳 #FoodieSecrets #HomeCooking #KitchenMagic #FlavorBomb`,

          // Emotional Connection Approach
          `💝 GRANDMOTHER'S WISDOM: She never wrote down recipes, just cooked with love. ${data.title || 'This dish'} captures that same soul-warming magic—but I'm sharing the measurements! ${data.instructions ? 'Each step feels like a warm hug' : 'Simple enough for Sunday, special enough for celebrations'}.

What's YOUR most treasured family recipe? Share below! 🏠 #FamilyRecipes #ComfortFood #FoodMemories #HomeCookedLove`,

          // Urgency + Social Proof Approach  
          `⏰ TRENDING: 47,000 home cooks can't stop making ${data.title || 'this viral recipe'}. The reason? It's dummy-proof AND Instagram-worthy. ${data.ingredients ? 'Pantry staples transform into gourmet magic' : '20 minutes from start to "OMG, did I really make this?"'}

But here's the catch—seasonal ingredients won't last forever. Make it THIS weekend! 📸 #ViralRecipe #WeekendCooking #FoodTrend #HomeCookingWin`
        ],
        realEstate: [
          // Authority + Market Intelligence
          `🚨 MARKET ALERT: While everyone's arguing about rates, smart investors are quietly applying ${data.title || 'this insider strategy'} to build generational wealth. I've used this same approach to help 127 families secure their dream properties—even in THIS market.

The window is closing faster than most realize. Are you positioned to act? 📈 #RealEstateInvesting #MarketInsider #PropertyStrategy #WealthBuilding`,

          // Problem/Solution + Urgency
          `💸 COSTLY MISTAKE: 73% of homebuyers overlook ${data.title || 'this crucial factor'} and lose $47,000+ in the first year alone. (I see it happen every month.) The good news? It's completely preventable when you know what to look for.

Free market report reveals all the red flags. Comment "REPORT" below 👇 #HomeBuyingTips #RealEstateMistakes #PropertyExpert #MarketReport`,

          // Social Proof + Exclusive Access
          `🏆 CLIENT WIN: "Sarah, your advice about ${data.title || 'the negotiation strategy'} just saved us $23,000 on closing costs!" - The Johnson Family, closed yesterday ✨ This isn't luck—it's 15 years of insider knowledge working for YOU.

Ready for your own success story? Limited consultation spots opening Monday. 📞 #ClientSuccess #RealEstateWins #PropertyNegotiation #ExpertAdvice`
        ],
        mindfulness: [
          // Scientific + Transformational
          `🧠 NEUROSCIENCE BREAKTHROUGH: Harvard research confirms ${data.title || 'this 5-minute practice'} literally rewires your brain for resilience. Gray matter density increases by 23% in just 8 weeks of consistent practice.

Your anxious mind isn't broken—it's just untrained. Ready to upgrade your mental operating system? 🌟 #Neuroscience #MindfulnessMeditaiton #BrainHealth #MentalFitness`,

          // Permission + Vulnerability  
          `💝 PERMISSION GRANTED: You don't have to carry the weight of the world today. ${data.title || 'This gentle practice'} reminds us that rest isn't laziness—it's radical self-care in a hustle-obsessed world.

What would change if you truly believed you were worthy of peace? (You are, by the way.) 🕊️ #SelfCompassion #MindfulRest #MentalWellness #InnerPeace`,

          // Practical + Immediate Relief
          `⚡ INSTANT CALM: Racing thoughts at 2 AM? ${data.title || 'This emergency mindfulness technique'} works when meditation feels impossible. No apps, no timer, no perfect posture required—just you and 60 seconds of science-backed relief.

Bookmark this for your next overwhelm moment. You'll thank yourself later. 🌙 #AnxietyRelief #MindfulnessTips #MentalHealthTools #StressManagement`
        ],
        educational: [
          // Myth-Busting + Counter-Intuitive  
          `🤯 MYTH SHATTERED: Everything you "know" about ${data.title || 'this health topic'} is backwards. ${data.category === 'Nutrition Science' ? 'Food industry marketing vs. actual biochemistry' : 'Popular belief vs. peer-reviewed research'} reveals stunning contradictions.

Plot twist: The "experts" got it wrong for 40 years. Here's what NEW science actually shows... 🔬 #MythBusting #ScienceFacts #HealthTruth #ResearchReveals`,

          // Pattern Interrupt + Practical Application
          `⚡ PARADIGM SHIFT: Your body doesn't respond to ${data.title || 'this stimulus'} the way textbooks claim. ${data.category ? `Latest ${data.category.toLowerCase()} research` : 'Cutting-edge studies'} reveal why 83% of people get opposite results.

This ONE insight could revolutionize your entire approach. Ready for the game-changer? 🎯 #ParadigmShift #HealthScience #BiohackingTips #OptimizationSecrets`,

          // Curiosity Gap + Authority
          `🔍 HIDDEN MECHANISM: Why does ${data.title || 'this phenomenon'} happen ONLY between 2-4 AM? The answer involves circadian biology, hormone cascades, and evolutionary psychology. ${data.category ? `${data.category} researchers` : 'Scientists'} were baffled for decades.

The discovery changes everything we thought we knew... (Details in comments) 🧬 #CircadianScience #HealthMystery #BiologySecrets #WellnessEducation`
        ],
        motivational: [
          // Identity-Based + Challenge
          `⚽ IDENTITY CHECK: ${data.title || 'Champions don\'t wait for motivation—they create momentum'} ${data.theme === 'Success & Achievement' ? 'Success isn\'t an event. It\'s an identity.' : data.theme === 'Perseverance' ? 'Quitters never know how close they were to breakthrough.' : 'Your current struggle is forging your future strength.'}

You're not someone who "tries" to succeed. You ARE someone who succeeds. What's your next championship move? 🏆 #ChampionMindset #IdentityShift #SuccessIdentity #WinnersTrain`,

          // Vulnerability + Reframe  
          `💔 BRUTAL TRUTH: I used to think ${data.title || 'failure meant I wasn\'t good enough'} ${data.theme === 'Overcoming Challenges' ? 'Every obstacle felt like evidence of my inadequacy.' : 'Every setback confirmed my fears.'} Then I learned the game-changing secret successful people know:

Failure isn't your enemy—it's your mentor in disguise. What's YOUR failure teaching you right now? 🎭 #FailureToSuccess #GrowthMindset #MentorMoments #BreakthroughStory`,

          // Future-Pacing + Urgency
          `⏰ TIME TRAVELER ALERT: It's December 2025. You're looking back at this exact moment—the day everything changed. ${data.title || 'The decision you make today'} ${data.theme === 'Goal Setting' ? 'becomes the foundation of your empire' : 'ripples through every area of your life'}. 

Your future self is either thanking you or wondering "what if?" Which version are you creating? 🚀 #FutureSelf #DecisionPoint #LifeChange #DestinyMoment`
        ]
      };
      
      // Enhanced content generation with comprehensive prompts
      const generateComprehensiveContent = () => {
        const platformLimits = {
          instagram: { minWords: 50, maxWords: 150, idealLength: '2-3 paragraphs with engaging hook' },
          tiktok: { minWords: 15, maxWords: 40, idealLength: 'punchy hook + CTA' },
          linkedin: { minWords: 100, maxWords: 200, idealLength: '3-4 paragraphs with professional insights' },
          twitter: { minWords: 20, maxWords: 45, idealLength: 'thread-worthy content with engagement hook' },
          youtube: { minWords: 80, maxWords: 180, idealLength: 'detailed description with timestamps and CTAs' },
          facebook: { minWords: 60, maxWords: 120, idealLength: 'community-focused storytelling' }
        };
        
        const currentLimit = platformLimits[selectedPlatform] || platformLimits.instagram;
        
        // Enhanced AI generation with web data integration
        const contentStructure = {
          hook: randomHook,
          personalStory: `I ${randomPersonal} when I discovered this approach to ${contentType}. `,
          valueProposition: `Here's what makes this different from everything else you've tried: `,
          specifics: `${JSON.stringify(data).replace(/[{}":]/g, '').replace(/,/g, ', ')}`,
          webInsights: `Latest research from ${webData.source} reveals: "${webData.keyPoints[0]}" and shows ${webData.stats}. `,
          expertBacking: `${webData.expertQuote} `,
          authorityProof: `According to ${webData.credibility} sources updated ${webData.fetchDate}, `,
          engagement: `${randomEngagement.toLowerCase()} - `,
          cta: `Drop a 💪 if you're ready to try this!`,
          sourceReference: `📚 Research source: ${topicalSite.domain}`,
          hashtags: hashtags
        };
        
        // Build comprehensive content based on platform and complexity
        let generatedContent = '';
        
        if (contentComplexity === 'beginner') {
          generatedContent = `${contentStructure.hook}

${contentStructure.personalStory}${contentStructure.valueProposition}

${contentStructure.webInsights}

${contentStructure.specifics}

${contentStructure.engagement}${contentStructure.cta}

${contentStructure.sourceReference}
${contentStructure.hashtags}`;
        } else if (contentComplexity === 'intermediate') {
          generatedContent = `${contentStructure.hook}

${contentStructure.personalStory}${contentStructure.valueProposition}

Here's exactly what I learned: ${contentStructure.specifics}

${contentStructure.authorityProof}${webData.keyPoints[1]} This works because it taps into ${currentSeason.toLowerCase()} energy and ${dayOfWeek} motivation patterns.

${contentStructure.webInsights}

${contentStructure.engagement}${contentStructure.cta}

Save this post for later 📌 and tag someone who needs to see this!

${contentStructure.sourceReference}
${contentStructure.hashtags}`;
        } else { // advanced
          generatedContent = `${contentStructure.hook}

Let me get vulnerable for a second: ${contentStructure.personalStory}

The breakthrough came when I realized: ${contentStructure.valueProposition}

Here's the exact framework: ${contentStructure.specifics}

🧠 The science behind why this works: ${contentStructure.authorityProof}${webData.description}

${contentStructure.expertBacking}

${contentStructure.webInsights}Plus, our brains are wired for ${currentSeason.toLowerCase()} patterns, and ${dayOfWeek}s specifically trigger ${randomTone} responses in our neural pathways.

Real talk: ${randomPersonal} until I discovered this approach changes everything about how you think about ${contentType}.

${contentStructure.engagement}${contentStructure.cta}

🔄 Share this with your story for maximum impact
📌 Save for when you need the reminder  
💬 Comment your biggest challenge with this
🧬 Check the source for deeper insights

${contentStructure.sourceReference}
${contentStructure.hashtags}`;
        }
        
        return generatedContent;
      };
      
      const comprehensiveContent = generateComprehensiveContent();
      
      console.log(`✅ Generated comprehensive AI content for ${contentType}:`, comprehensiveContent.substring(0, 100) + '...');
      console.log(`📝 Full content length:`, comprehensiveContent.length, 'characters');
      return comprehensiveContent;
      
    } catch (error) {
      console.error('Error generating AI content:', error);
      return `Check out ${data.title || 'this amazing content'}! 🚀 #Content #Social #Engagement`;
    }
  };

  // Handle URL change for recipes
  const handleRecipeUrlChange = async (url) => {
    setNewRecipe({...newRecipe, url});
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setIsFetchingUrl(prev => ({...prev, recipe: true}));
      
      try {
        const metadata = await fetchUrlMetadata(url);
        
        if (metadata && metadata.title) {
          setNewRecipe(prev => ({
            ...prev,
            title: prev.title || metadata.title,
            ingredients: prev.ingredients || metadata.ingredients || '',
            instructions: prev.instructions || metadata.instructions || metadata.description,
            url
          }));
        } else {
          console.log('No metadata found or empty response');
        }
      } catch (error) {
        console.error('Failed to fetch recipe metadata:', error);
      } finally {
        setIsFetchingUrl(prev => ({...prev, recipe: false}));
      }
    }
  };

  // Handle URL change for workouts
  const handleWorkoutUrlChange = async (url) => {
    setNewWorkout({...newWorkout, url});
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setIsFetchingUrl(prev => ({...prev, workout: true}));
      
      try {
        const metadata = await fetchUrlMetadata(url);
        
        if (metadata && metadata.title) {
          console.log('🎯 Assigning workout metadata to form:', {
            title: metadata.title,
            exercises: metadata.exercises ? metadata.exercises.substring(0, 100) + '...' : 'No exercises found',
            description: metadata.description,
            duration: metadata.duration
          });
          
          setNewWorkout(prev => ({
            ...prev,
            title: prev.title || metadata.title,
            exercises: prev.exercises || metadata.exercises || metadata.description || '',
            duration: prev.duration || metadata.duration || '',
            url
          }));
        }
      } catch (error) {
        console.error('Failed to fetch workout metadata:', error);
      } finally {
        setIsFetchingUrl(prev => ({...prev, workout: false}));
      }
    }
  };

  // Handle URL change for real estate
  const handleRealEstateUrlChange = async (url) => {
    setNewRealEstateTip({...newRealEstateTip, url});
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setIsFetchingUrl(prev => ({...prev, realEstate: true}));
      
      try {
        const metadata = await fetchUrlMetadata(url);
        
        if (metadata && metadata.title) {
          setNewRealEstateTip(prev => ({
            ...prev,
            title: prev.title || metadata.title,
            content: prev.content || metadata.description,
            url
          }));
        }
      } catch (error) {
        console.error('Failed to fetch real estate metadata:', error);
      } finally {
        setIsFetchingUrl(prev => ({...prev, realEstate: false}));
      }
    }
  };

  // Handle URL change for mindfulness
  const handleMindfulnessUrlChange = async (url) => {
    setNewMindfulness({...newMindfulness, url});
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setIsFetchingUrl(prev => ({...prev, mindfulness: true}));
      
      try {
        const metadata = await fetchUrlMetadata(url);
        
        if (metadata && metadata.title) {
          setNewMindfulness(prev => ({
            ...prev,
            title: prev.title || metadata.title,
            content: prev.content || metadata.description,
            url
          }));
        }
      } catch (error) {
        console.error('Failed to fetch mindfulness metadata:', error);
      } finally {
        setIsFetchingUrl(prev => ({...prev, mindfulness: false}));
      }
    }
  };

  // AI Generation Functions for each content type
  const generateWorkoutContent = async () => {
    try {
      const generatedContent = await generateAIContent('workout', {
        title: newWorkout.title,
        duration: newWorkout.duration,
        difficulty: newWorkout.difficulty,
        exercises: newWorkout.exercises
      });
      
      // Create generated content entry
      const generatedWorkout = {
        id: Date.now() + Math.random(),
        title: newWorkout.title || 'AI Generated Workout',
        exercises: newWorkout.exercises || 'Full body workout routine',
        duration: newWorkout.duration || 'Flexible',
        difficulty: newWorkout.difficulty || 'All levels',
        tags: newWorkout.tags || 'fitness,workout,motivation',
        url: newWorkout.url || '',
        content: generatedContent,
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setWorkouts(prev => [generatedWorkout, ...prev]);
      setNewWorkout({ title: '', exercises: '', duration: '', difficulty: '', tags: '', url: '' });
      
      console.log('✅ Generated workout content:', generatedWorkout);
    } catch (error) {
      console.error('Error generating workout content:', error);
    }
  };

  const generateRecipeContent = async () => {
    try {
      const generatedContent = await generateAIContent('recipe', {
        title: newRecipe.title,
        ingredients: newRecipe.ingredients,
        instructions: newRecipe.instructions
      });
      
      const generatedRecipe = {
        id: Date.now() + Math.random(),
        title: newRecipe.title || 'AI Generated Recipe',
        ingredients: newRecipe.ingredients || 'Fresh ingredients',
        instructions: newRecipe.instructions || 'Easy cooking steps',
        tags: newRecipe.tags || 'recipe,cooking,food',
        url: newRecipe.url || '',
        content: generatedContent,
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setRecipes(prev => [generatedRecipe, ...prev]);
      setNewRecipe({ title: '', ingredients: '', instructions: '', tags: '', url: '' });
      
      console.log('✅ Generated recipe content:', generatedRecipe);
    } catch (error) {
      console.error('Error generating recipe content:', error);
    }
  };

  const generateRealEstateContent = async () => {
    try {
      const generatedContent = await generateAIContent('realEstate', {
        title: newRealEstateTip.title,
        description: newRealEstateTip.description
      });
      
      const generatedTip = {
        id: Date.now() + Math.random(),
        title: newRealEstateTip.title || 'AI Generated Real Estate Tip',
        description: newRealEstateTip.description || 'Valuable real estate insight',
        tags: newRealEstateTip.tags || 'realestate,property,investment',
        url: newRealEstateTip.url || '',
        content: generatedContent,
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setRealEstateTips(prev => [generatedTip, ...prev]);
      setNewRealEstateTip({ title: '', description: '', tags: '', url: '' });
      
      console.log('✅ Generated real estate content:', generatedTip);
    } catch (error) {
      console.error('Error generating real estate content:', error);
    }
  };

  const generateMindfulnessContent = async () => {
    try {
      const generatedContent = await generateAIContent('mindfulness', {
        title: newMindfulness.title,
        description: newMindfulness.content
      });
      
      const generatedMindfulness = {
        id: Date.now() + Math.random(),
        title: newMindfulness.title || 'AI Generated Mindfulness Practice',
        content: newMindfulness.content || 'Peaceful mindfulness exercise',
        tags: newMindfulness.tags || 'mindfulness,meditation,wellness',
        url: newMindfulness.url || '',
        generatedContent: generatedContent,
        date: new Date().toLocaleDateString(),
        platform: 'AI Generated'
      };
      
      setMindfulnessPosts(prev => [generatedMindfulness, ...prev]);
      setNewMindfulness({ title: '', content: '', tags: '', url: '' });
      
      console.log('✅ Generated mindfulness content:', generatedMindfulness);
    } catch (error) {
      console.error('Error generating mindfulness content:', error);
    }
  };

  const generateEducationalContent = async () => {
    try {
      const generatedContent = await generateAIContent('educational', {
        title: newEducational.title,
        content: newEducational.content,
        category: newEducational.category
      });
      
      const generatedEducational = {
        id: Date.now() + Math.random(),
        title: newEducational.title || 'AI Generated Educational Content',
        content: newEducational.content || 'Valuable educational insight',
        category: newEducational.category || 'General Knowledge',
        tags: newEducational.tags || 'education,learning,knowledge',
        url: newEducational.url || '',
        generatedContent: generatedContent,
        date: new Date().toLocaleDateString(),
        platform: 'AI Generated'
      };
      
      setEducationalContent(prev => [generatedEducational, ...prev]);
      setNewEducational({ title: '', content: '', category: '', tags: '', url: '' });
      
      console.log('✅ Generated educational content:', generatedEducational);
    } catch (error) {
      console.error('Error generating educational content:', error);
    }
  };

  const generateMotivationalContent = async () => {
    try {
      const generatedContent = await generateAIContent('motivational', {
        title: newMotivational.title,
        content: newMotivational.content,
        theme: newMotivational.theme
      });
      
      const generatedMotivational = {
        id: Date.now() + Math.random(),
        title: newMotivational.title || 'AI Generated Motivational Content',
        content: newMotivational.content || 'Inspiring motivational message',
        theme: newMotivational.theme || 'Daily Inspiration',
        tags: newMotivational.tags || 'motivation,inspiration,mindset',
        url: newMotivational.url || '',
        generatedContent: generatedContent,
        date: new Date().toLocaleDateString(),
        platform: 'AI Generated'
      };
      
      setMotivationalContent(prev => [generatedMotivational, ...prev]);
      setNewMotivational({ title: '', content: '', theme: '', tags: '', url: '' });
      
      console.log('✅ Generated motivational content:', generatedMotivational);
    } catch (error) {
      console.error('Error generating motivational content:', error);
    }
  };

  // Generate Travel Content
  const generateTravelContent = async () => {
    console.log('🚀 Travel generation started');
    console.log('📊 Travel data:', { destination: newTravel.destination, content: newTravel.content, category: newTravel.category, title: newTravel.title });
    setIsGenerating(true);
    try {
      const generatedContent = await generateAIContent('travel', {
        destination: newTravel.destination,
        content: newTravel.content,
        category: newTravel.category,
        title: newTravel.title
      });
      console.log('✅ Generated travel content:', generatedContent);
      
      const generatedTravel = {
        id: Date.now(),
        title: newTravel.title || 'AI Generated Travel Content',
        destination: newTravel.destination || 'Amazing Destination',
        category: newTravel.category || 'Adventure',
        tags: newTravel.tags || 'travel,adventure,explore',
        url: newTravel.url || '',
        content: generatedContent,
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setTravelContent(prev => [generatedTravel, ...prev]);
      setNewTravel({ title: '', destination: '', content: '', category: '', tags: '', url: '' });
    } catch (error) {
      console.error('Error generating travel content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Tech Content
  const generateTechContent = async () => {
    setIsGenerating(true);
    try {
      const generatedContent = await generateAIContent('tech', {
        title: newTech.title,
        content: newTech.content,
        category: newTech.category
      });
      
      const generatedTech = {
        id: Date.now(),
        title: newTech.title || 'AI Generated Tech Content',
        content: newTech.content || 'Tech insight',
        category: newTech.category || 'Reviews',
        tags: newTech.tags || 'tech,innovation,review',
        url: newTech.url || '',
        content: generatedContent,
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setTechContent(prev => [generatedTech, ...prev]);
      setNewTech({ title: '', product: '', content: '', category: '', tags: '', url: '' });
    } catch (error) {
      console.error('Error generating tech content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Finance Content
  const generateFinanceContent = async () => {
    setIsGenerating(true);
    try {
      const generatedContent = await generateAIContent('finance', {
        type: newFinance.type,
        content: newFinance.content,
        title: newFinance.title
      });
      
      const generatedFinance = {
        id: Date.now(),
        title: newFinance.title || 'AI Generated Finance Content',
        type: newFinance.type || 'Financial Strategy',
        content: generatedContent,
        tags: newFinance.tags || 'finance,money,investing',
        url: newFinance.url || '',
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setFinanceContent(prev => [generatedFinance, ...prev]);
      setNewFinance({ title: '', content: '', type: '', tags: '', url: '' });
    } catch (error) {
      console.error('Error generating finance content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Beauty Content
  const generateBeautyContent = async () => {
    setIsGenerating(true);
    try {
      const generatedContent = await generateAIContent('beauty', {
        title: newBeauty.title,
        content: newBeauty.content,
        category: newBeauty.category
      });
      
      const generatedBeauty = {
        id: Date.now(),
        title: newBeauty.title || 'AI Generated Beauty Content',
        content: generatedContent,
        category: newBeauty.category || 'Beauty Tips',
        tags: newBeauty.tags || 'beauty,skincare,makeup',
        url: newBeauty.url || '',
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setBeautyContent(prev => [generatedBeauty, ...prev]);
      setNewBeauty({ title: '', content: '', category: '', tags: '', url: '' });
    } catch (error) {
      console.error('Error generating beauty content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Parenting Content
  const generateParentingContent = async () => {
    setIsGenerating(true);
    try {
      const generatedContent = await generateAIContent('parenting', {
        title: newParenting.title,
        content: newParenting.content,
        ageGroup: newParenting.ageGroup
      });
      
      const generatedParenting = {
        id: Date.now(),
        title: newParenting.title || 'AI Generated Parenting Content',
        content: generatedContent,
        ageGroup: newParenting.ageGroup || 'General',
        tags: newParenting.tags || 'parenting,family,kids',
        url: newParenting.url || '',
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setParentingContent(prev => [generatedParenting, ...prev]);
      setNewParenting({ title: '', content: '', ageGroup: '', tags: '', url: '' });
    } catch (error) {
      console.error('Error generating parenting content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Business Content
  const generateBusinessContent = async () => {
    setIsGenerating(true);
    try {
      const generatedContent = await generateAIContent('business', {
        title: newBusiness.title,
        content: newBusiness.content,
        category: newBusiness.category
      });
      
      const generatedBusiness = {
        id: Date.now(),
        title: newBusiness.title || 'AI Generated Business Content',
        content: generatedContent,
        category: newBusiness.category || 'Business Tips',
        tags: newBusiness.tags || 'business,entrepreneurship,success',
        url: newBusiness.url || '',
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setBusinessContent(prev => [generatedBusiness, ...prev]);
      setNewBusiness({ title: '', content: '', category: '', tags: '', url: '' });
    } catch (error) {
      console.error('Error generating business content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Lifestyle Content
  const generateLifestyleContent = async () => {
    setIsGenerating(true);
    try {
      const generatedContent = await generateAIContent('lifestyle', {
        title: newLifestyle.title,
        content: newLifestyle.content,
        category: newLifestyle.category
      });
      
      const generatedLifestyle = {
        id: Date.now(),
        title: newLifestyle.title || 'AI Generated Lifestyle Content',
        content: generatedContent,
        category: newLifestyle.category || 'Lifestyle Tips',
        tags: newLifestyle.tags || 'lifestyle,wellness,selfcare',
        url: newLifestyle.url || '',
        date: new Date().toLocaleDateString(),
        platform: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} | ${contentComplexity} | SEO Optimized`
      };
      
      setLifestyleContent(prev => [generatedLifestyle, ...prev]);
      setNewLifestyle({ title: '', content: '', category: '', tags: '', url: '' });
    } catch (error) {
      console.error('Error generating lifestyle content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Test function for debugging URL fetching
  const testUrlFetch = async (customUrl = null) => {
    const testUrl = customUrl || 'https://www.muscleandstrength.com/workouts/12-week-total-transformation-workout';
    console.log('Testing URL fetch with:', testUrl);
    
    try {
      const result = await fetchUrlMetadata(testUrl);
      console.log('URL fetch result:', result);
      alert(`Test result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Test failed:', error);
      alert(`Test failed: ${error.message}`);
    }
  };

  // Buffer Export Functions
  const exportToBufferCSV = () => {
    if (contentCalendar.length === 0) {
      alert('No content to export. Please generate some content first!');
      return;
    }

    // Buffer CSV format: Text, Profile, Date, Time, Link, Media
    const csvHeaders = ['Text', 'Profile', 'Date', 'Time', 'Link', 'Media'];
    const csvRows = [];

    contentCalendar.forEach(post => {
      Object.entries(platforms).forEach(([platform, config]) => {
        if (post.variations[platform]) {
          // Format the post content for Buffer
          let postText = post.variations[platform];
          
          // Clean up the text (remove excessive newlines, trim)
          postText = postText.replace(/\n+/g, ' ').trim();
          
          // Escape quotes for CSV
          postText = `"${postText.replace(/"/g, '""')}"`;
          
          // Set default time based on platform best practices
          const defaultTimes = {
            instagram: '14:00', // 2 PM - peak engagement
            linkedin: '09:00',  // 9 AM - professional hours
            facebook: '15:00'   // 3 PM - afternoon peak
          };

          const csvRow = [
            postText,
            config.name,
            post.date, // Already in MM/DD/YYYY format
            defaultTimes[platform] || '12:00',
            post.content.url || '', // Include URL if available
            '' // Media - empty for now, could be enhanced later
          ];
          
          csvRows.push(csvRow.join(','));
        }
      });
    });

    // Create CSV content
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `buffer-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToBufferJSON = () => {
    if (contentCalendar.length === 0) {
      alert('No content to export. Please generate some content first!');
      return;
    }

    // Buffer API format
    const bufferData = {
      posts: contentCalendar.map(post => ({
        text: post.variations.instagram || post.variations.linkedin || post.variations.facebook,
        profiles: Object.entries(platforms).map(([platform, config]) => ({
          platform: platform,
          name: config.name,
          text: post.variations[platform]
        })).filter(p => p.text),
        scheduled_at: `${post.date}T12:00:00Z`, // Default to noon UTC
        media: post.content.url ? [{ url: post.content.url }] : [],
        metadata: {
          title: post.content.title,
          contentType: post.contentType,
          tags: post.content.tags || '',
          generatedBy: 'Social Media Agent'
        }
      }))
    };

    // Create and download JSON
    const jsonContent = JSON.stringify(bufferData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `buffer-export-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportCalendarSummary = () => {
    if (contentCalendar.length === 0) {
      alert('No content to export. Please generate some content first!');
      return;
    }

    // Create a readable summary for review
    let summary = `Social Media Content Calendar Export\n`;
    summary += `Generated on: ${new Date().toLocaleDateString()}\n`;
    summary += `Total Posts: ${contentCalendar.length}\n\n`;
    
    contentCalendar.forEach((post, index) => {
      summary += `--- POST ${index + 1} ---\n`;
      summary += `Date: ${post.date} (${post.dayName})\n`;
      summary += `Type: ${contentTypes[post.contentType]?.name || post.contentType}\n`;
      summary += `Title: ${post.content.title}\n\n`;
      
      Object.entries(platforms).forEach(([platform, config]) => {
        if (post.variations[platform]) {
          summary += `${config.name}:\n${post.variations[platform]}\n\n`;
        }
      });
      
      summary += `${'='.repeat(50)}\n\n`;
    });

    // Download as text file
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `content-calendar-summary-${new Date().toISOString().split('T')[0]}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-comfort-tan/20 min-h-screen font-comfort">
      <input
        type="file"
        ref={recipeFileInputRef}
        accept=".json,.csv,.txt"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={workoutFileInputRef}
        accept=".json,.csv,.txt"
        style={{ display: 'none' }}
      />

      <div className="bg-comfort-white rounded-xl shadow-md mb-6 border border-comfort-tan/30">
        <div className="p-6 border-b border-comfort-tan bg-gradient-to-br from-comfort-white via-comfort-tan/20 to-comfort-white">
          <h1 className="text-3xl font-bold text-comfort-navy flex items-center">
            <Share className="mr-3 text-comfort-accent" />
            Pre-Buffer
          </h1>
          <p className="text-comfort-navy/70 mt-2">AI-powered content planning for Instagram, LinkedIn, and Facebook</p>
        </div>

        <div className="flex items-center border-b border-comfort-tan bg-comfort-white">
          {/* Main Navigation Tabs */}
          {['dashboard', 'recipes', 'workouts', 'realestate', 'mindfulness', 'calendar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-comfort-olive text-comfort-olive bg-comfort-tan/30' 
                  : 'text-comfort-navy/70 hover:text-comfort-navy hover:bg-comfort-tan/20'
              }`}
            >
              {tab === 'realestate' ? 'Real Estate' : 
               tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          {/* Specialized Categories Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowSpecializedDropdown(!showSpecializedDropdown)}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                ['educational', 'motivational', 'travel', 'tech', 'finance', 'beauty', 'parenting', 'business', 'lifestyle'].includes(activeTab)
                  ? 'border-b-2 border-comfort-accent text-comfort-accent bg-comfort-accent/10' 
                  : 'text-comfort-navy/70 hover:text-comfort-navy hover:bg-comfort-tan/20'
              }`}
            >
              Specialized
              <ChevronDown 
                size={16} 
                className={`transition-transform ${showSpecializedDropdown ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {showSpecializedDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-comfort-white border border-comfort-tan rounded-lg shadow-lg z-50 min-w-[200px]">
                <div className="py-2">
                  {[
                    { key: 'educational', label: 'Educational', icon: '🎓' },
                    { key: 'motivational', label: 'Motivational', icon: '💪' },
                    { key: 'travel', label: 'Travel', icon: '✈️' },
                    { key: 'tech', label: 'Technology', icon: '💻' },
                    { key: 'finance', label: 'Finance', icon: '💰' },
                    { key: 'beauty', label: 'Beauty', icon: '💄' },
                    { key: 'parenting', label: 'Parenting', icon: '👶' },
                    { key: 'business', label: 'Business', icon: '📈' },
                    { key: 'lifestyle', label: 'Lifestyle', icon: '☕' }
                  ].map((category) => (
                    <button
                      key={category.key}
                      onClick={() => {
                        setActiveTab(category.key);
                        setShowSpecializedDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-comfort-tan/20 flex items-center gap-3 transition-colors ${
                        activeTab === category.key ? 'bg-comfort-accent/10 text-comfort-accent font-medium' : 'text-comfort-navy'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generate Tab */}
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'generate'
                ? 'border-b-2 border-comfort-olive text-comfort-olive bg-comfort-olive/10' 
                : 'text-comfort-navy/70 hover:text-comfort-navy hover:bg-comfort-tan/20'
            }`}
          >
            🤖 Generate
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Main Categories Overview */}
          <div>
            <h3 className="text-lg font-semibold text-comfort-navy mb-4">📊 Main Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-comfort-tan/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-comfort-navy/70 text-sm">Recipes</p>
                    <p className="text-2xl font-bold text-comfort-accent">{recipes.length}</p>
                  </div>
                  <ChefHat className="text-comfort-accent" size={28} />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-comfort-tan/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-comfort-navy/70 text-sm">Workouts</p>
                    <p className="text-2xl font-bold text-comfort-olive">{workouts.length}</p>
                  </div>
                  <Dumbbell className="text-comfort-olive" size={28} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-comfort-tan/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-comfort-navy/70 text-sm">Real Estate</p>
                    <p className="text-2xl font-bold text-comfort-navy">{realEstateTips.length}</p>
                  </div>
                  <FileText className="text-comfort-navy" size={28} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-comfort-tan/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-comfort-navy/70 text-sm">Mindfulness</p>
                    <p className="text-2xl font-bold text-comfort-accent">{mindfulnessPosts.length}</p>
                  </div>
                  <Target className="text-comfort-accent" size={28} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-comfort-tan/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-comfort-navy/70 text-sm">Calendar</p>
                    <p className="text-2xl font-bold text-comfort-olive">{contentCalendar.length}</p>
                  </div>
                  <Calendar className="text-comfort-olive" size={28} />
                </div>
              </div>

              {/* Specialized Categories Combined */}
              <div className="bg-gradient-to-br from-comfort-tan/20 to-comfort-accent/20 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-comfort-tan">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-comfort-accent text-sm font-medium">Specialized</p>
                    <p className="text-2xl font-bold text-comfort-accent">
                      {educationalContent.length + motivationalContent.length + travelContent.length + 
                       techContent.length + financeContent.length + beautyContent.length + 
                       parentingContent.length + businessContent.length + lifestyleContent.length}
                    </p>
                  </div>
                  <div className="text-comfort-accent">
                    <Lightbulb size={28} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specialized Categories Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-comfort-navy mb-4">🎯 Specialized Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
              {[
                { name: 'Educational', count: educationalContent.length, color: 'text-comfort-navy', icon: '🎓' },
                { name: 'Motivational', count: motivationalContent.length, color: 'text-comfort-accent', icon: '💪' },
                { name: 'Travel', count: travelContent.length, color: 'text-comfort-olive', icon: '✈️' },
                { name: 'Tech', count: techContent.length, color: 'text-comfort-navy', icon: '💻' },
                { name: 'Finance', count: financeContent.length, color: 'text-comfort-olive', icon: '💰' },
                { name: 'Beauty', count: beautyContent.length, color: 'text-comfort-accent', icon: '💄' },
                { name: 'Parenting', count: parentingContent.length, color: 'text-comfort-accent', icon: '👶' },
                { name: 'Business', count: businessContent.length, color: 'text-comfort-navy', icon: '📈' },
                { name: 'Lifestyle', count: lifestyleContent.length, color: 'text-comfort-olive', icon: '☕' }
              ].map((category, index) => (
                <div key={index} className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all text-center border border-comfort-tan/30">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <p className="text-xs text-comfort-navy/70 mb-1 font-medium">{category.name}</p>
                  <p className={`text-lg font-bold ${category.color}`}>{category.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📈 Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {recipes.length + workouts.length + realEstateTips.length + mindfulnessPosts.length}
                </p>
                <p className="text-sm text-gray-600">Main Content</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {educationalContent.length + motivationalContent.length + travelContent.length + 
                   techContent.length + financeContent.length + beautyContent.length + 
                   parentingContent.length + businessContent.length + lifestyleContent.length}
                </p>
                <p className="text-sm text-gray-600">Specialized</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{contentCalendar.length}</p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {recipes.length + workouts.length + realEstateTips.length + mindfulnessPosts.length +
                   educationalContent.length + motivationalContent.length + travelContent.length + 
                   techContent.length + financeContent.length + beautyContent.length + 
                   parentingContent.length + businessContent.length + lifestyleContent.length + contentCalendar.length}
                </p>
                <p className="text-sm text-gray-600">Total Posts</p>
              </div>
            </div>
          </div>
        </div>
      )}      {activeTab === 'recipes' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-comfort-accent" />
            Recipe Management
          </h2>
          <div className="mb-4 p-4 bg-comfort-tan/20 rounded-xl border border-comfort-tan/30 shadow-sm">
            <p className="text-sm text-comfort-navy">
              💡 <strong>Tip:</strong> Paste any recipe URL (like from AllRecipes, Food Network, or YouTube cooking videos) to auto-populate the fields!
            </p>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Recipe title"
              value={newRecipe.title}
              onChange={(e) => setNewRecipe({...newRecipe, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Ingredients"
              value={newRecipe.ingredients}
              onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Instructions"
              value={newRecipe.instructions}
              onChange={(e) => setNewRecipe({...newRecipe, instructions: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <div className="relative">
              <input
                type="url"
                placeholder="Recipe URL (paste URL to auto-populate fields)"
                value={newRecipe.url}
                onChange={(e) => handleRecipeUrlChange(e.target.value)}
                className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
              />
              {isFetchingUrl.recipe && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-comfort-accent"></div>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newRecipe.tags}
              onChange={(e) => setNewRecipe({...newRecipe, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addRecipe}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-olive flex-1 transition-colors"
              >
                Add Recipe
              </button>
              <button
                onClick={generateRecipeContent}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{recipe.title}</div>
                    {recipe.url && (
                      <a 
                        href={recipe.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-comfort-olive hover:text-comfort-navy text-sm transition-colors"
                      >
                        🔗 View Recipe
                      </a>
                    )}
                  </div>
                  <button onClick={() => deleteRecipe(recipe.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-comfort-accent" />
            Workout Management
          </h2>
          
          {/* AI Settings Panel */}
          <div className="mb-6 p-4 bg-gradient-to-br from-comfort-tan/20 via-comfort-accent/10 to-comfort-tan/20 rounded-xl border border-comfort-tan/30 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-comfort-navy">🤖 AI Content Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-comfort-navy mb-2">Target Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
                >
                  <option value="instagram">📸 Instagram (Visual + Stories)</option>
                  <option value="tiktok">🎵 TikTok (Short + Viral)</option>
                  <option value="linkedin">💼 LinkedIn (Professional)</option>
                  <option value="twitter">🐦 Twitter (Concise + Trending)</option>
                  <option value="youtube">📺 YouTube (Educational + Community)</option>
                  <option value="facebook">👥 Facebook (Community + Family)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-comfort-navy mb-2">Content Complexity</label>
                <select
                  value={contentComplexity}
                  onChange={(e) => setContentComplexity(e.target.value)}
                  className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
                >
                  <option value="beginner">🌱 Beginner (Simple, Encouraging)</option>
                  <option value="intermediate">⚡ Intermediate (Engaging, Multi-angle)</option>
                  <option value="advanced">🎯 Advanced (Sophisticated Psychology)</option>
                </select>
              </div>
            </div>
            <div className="mt-3 text-sm text-comfort-navy/70">
              ✨ Content will be optimized for <strong className="text-comfort-olive">{selectedPlatform}</strong> with <strong className="text-comfort-accent">{contentComplexity}</strong>-level copywriting and SEO optimization
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-comfort-olive/10 rounded-lg border border-comfort-olive/30">
            <p className="text-sm text-comfort-navy mb-2">
              💡 <strong>Tip:</strong> Paste any workout URL (like from Muscle & Strength, Bodybuilding.com, or YouTube fitness videos) to auto-populate the fields!
            </p>
            <button 
              onClick={() => testUrlFetch('https://www.muscleandstrength.com/workouts/12-week-total-transformation-workout')}
              className="text-xs bg-comfort-olive/20 hover:bg-comfort-olive/30 text-comfort-navy px-3 py-1 rounded transition-colors"
            >
              🔧 Test M&S URL Parsing
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Workout title"
              value={newWorkout.title}
              onChange={(e) => setNewWorkout({...newWorkout, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Exercises"
              value={newWorkout.exercises}
              onChange={(e) => setNewWorkout({...newWorkout, exercises: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Duration"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newWorkout.difficulty}
              onChange={(e) => setNewWorkout({...newWorkout, difficulty: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <div className="relative">
              <input
                type="url"
                placeholder="Workout URL (paste URL to auto-populate fields)"
                value={newWorkout.url}
                onChange={(e) => handleWorkoutUrlChange(e.target.value)}
                className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
              />
              {isFetchingUrl.workout && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-comfort-olive"></div>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newWorkout.tags}
              onChange={(e) => setNewWorkout({...newWorkout, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addWorkout}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors"
              >
                Add Workout
              </button>
              <button
                onClick={generateWorkoutContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {workouts.map((workout) => (
              <div key={workout.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{workout.title}</div>
                    <div className="text-sm text-comfort-navy/70">
                      {workout.duration && <span>Duration: {workout.duration}</span>}
                      {workout.difficulty && <span className="ml-2">• {workout.difficulty}</span>}
                    </div>
                    {workout.url && (
                      <a 
                        href={workout.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-comfort-olive hover:text-comfort-navy text-sm transition-colors"
                      >
                        🔗 View Workout
                      </a>
                    )}
                    {workout.content && (
                      <div className="mt-2 p-2 bg-comfort-accent/10 rounded text-sm border border-comfort-accent/20">
                        <strong className="text-comfort-navy">AI Generated Content:</strong>
                        <div className="mt-1 text-comfort-navy/80">{workout.content}</div>
                      </div>
                    )}
                  </div>
                  <button onClick={() => deleteWorkout(workout.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'realestate' && (
        <div className="bg-comfort-white rounded-lg shadow p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Home className="w-5 h-5 text-comfort-accent" />
            Real Estate Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tip title"
              value={newRealEstateTip.title}
              onChange={(e) => setNewRealEstateTip({...newRealEstateTip, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Content"
              value={newRealEstateTip.content}
              onChange={(e) => setNewRealEstateTip({...newRealEstateTip, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newRealEstateTip.category}
              onChange={(e) => setNewRealEstateTip({...newRealEstateTip, category: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="Buying">Home Buying</option>
              <option value="Selling">Home Selling</option>
              <option value="Market">Market Updates</option>
              <option value="Investment">Investment</option>
              <option value="Financing">Financing</option>
            </select>
            <div className="relative">
              <input
                type="url"
                placeholder="Reference URL (paste URL to auto-populate fields)"
                value={newRealEstateTip.url}
                onChange={(e) => handleRealEstateUrlChange(e.target.value)}
                className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
              />
              {isFetchingUrl.realEstate && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-comfort-olive"></div>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newRealEstateTip.tags}
              onChange={(e) => setNewRealEstateTip({...newRealEstateTip, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addRealEstateTip}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors"
              >
                Add Real Estate Tip
              </button>
              <button
                onClick={generateRealEstateContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {realEstateTips.map((tip) => (
              <div key={tip.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{tip.title}</div>
                    {tip.category && (
                      <span className="text-xs bg-comfort-olive/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{tip.category}</span>
                    )}
                    {tip.url && (
                      <a 
                        href={tip.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-comfort-olive hover:text-comfort-navy text-sm block mt-1 transition-colors"
                      >
                        🔗 View Reference
                      </a>
                    )}
                  </div>
                  <button onClick={() => deleteRealEstate(tip.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mindfulness' && (
        <div className="bg-comfort-white rounded-lg shadow p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Heart className="w-5 h-5 text-comfort-accent" />
            Mindfulness Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Post title"
              value={newMindfulness.title}
              onChange={(e) => setNewMindfulness({...newMindfulness, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Content"
              value={newMindfulness.content}
              onChange={(e) => setNewMindfulness({...newMindfulness, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newMindfulness.practice}
              onChange={(e) => setNewMindfulness({...newMindfulness, practice: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select practice</option>
              <option value="Meditation">Meditation</option>
              <option value="Breathing">Breathing Exercise</option>
              <option value="Gratitude">Gratitude Practice</option>
              <option value="Mindful Movement">Mindful Movement</option>
              <option value="Body Scan">Body Scan</option>
            </select>
            <div className="relative">
              <input
                type="url"
                placeholder="Resource URL (paste URL to auto-populate fields)"
                value={newMindfulness.url}
                onChange={(e) => handleMindfulnessUrlChange(e.target.value)}
                className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
              />
              {isFetchingUrl.mindfulness && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-comfort-accent"></div>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newMindfulness.tags}
              onChange={(e) => setNewMindfulness({...newMindfulness, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addMindfulness}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors"
              >
                Add Mindfulness Post
              </button>
              <button
                onClick={generateMindfulnessContent}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {mindfulnessPosts.map((post) => (
              <div key={post.id} className="p-3 border rounded">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium">{post.title}</div>
                    {post.practice && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{post.practice}</span>
                    )}
                    {post.url && (
                      <a 
                        href={post.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm block mt-1"
                      >
                        🔗 View Resource
                      </a>
                    )}
                  </div>
                  <button onClick={() => deleteMindfulness(post.id)} className="text-red-500">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'educational' && (
        <div className="bg-comfort-white rounded-lg shadow p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-comfort-accent" />
            Educational Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Content title"
              value={newEducational.title}
              onChange={(e) => setNewEducational({...newEducational, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Educational content"
              value={newEducational.content}
              onChange={(e) => setNewEducational({...newEducational, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newEducational.category}
              onChange={(e) => setNewEducational({...newEducational, category: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Fitness Facts">Fitness Facts</option>
              <option value="Nutrition Science">Nutrition Science</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Research Insights">Research Insights</option>
              <option value="Tips & Tricks">Tips & Tricks</option>
            </select>
            <input
              type="url"
              placeholder="Source URL (paste URL to auto-populate fields)"
              value={newEducational.url}
              onChange={(e) => setNewEducational({...newEducational, url: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newEducational.tags}
              onChange={(e) => setNewEducational({...newEducational, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addEducational}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                Add Educational Content
              </button>
              <button
                onClick={generateEducationalContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {educationalContent.map((content) => (
              <div key={content.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{content.title}</div>
                    {content.category && (
                      <span className="text-xs bg-comfort-olive/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{content.category}</span>
                    )}
                    {content.url && (
                      <a 
                        href={content.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-comfort-olive hover:text-comfort-navy text-sm block mt-1 transition-colors"
                      >
                        🔗 View Source
                      </a>
                    )}
                  </div>
                  <button onClick={() => deleteEducational(content.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'motivational' && (
        <div className="bg-comfort-white rounded-lg shadow p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Zap className="w-5 h-5 text-comfort-accent" />
            Motivational Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Motivational title"
              value={newMotivational.title}
              onChange={(e) => setNewMotivational({...newMotivational, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Motivational message"
              value={newMotivational.content}
              onChange={(e) => setNewMotivational({...newMotivational, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newMotivational.theme}
              onChange={(e) => setNewMotivational({...newMotivational, theme: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select theme</option>
              <option value="Success & Achievement">Success & Achievement</option>
              <option value="Perseverance">Perseverance</option>
              <option value="Self-Belief">Self-Belief</option>
              <option value="Goal Setting">Goal Setting</option>
              <option value="Overcoming Challenges">Overcoming Challenges</option>
              <option value="Growth Mindset">Growth Mindset</option>
              <option value="Daily Inspiration">Daily Inspiration</option>
            </select>
            <input
              type="url"
              placeholder="Source URL (paste URL to auto-populate fields)"
              value={newMotivational.url}
              onChange={(e) => setNewMotivational({...newMotivational, url: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newMotivational.tags}
              onChange={(e) => setNewMotivational({...newMotivational, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addMotivational}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                Add Motivational Content
              </button>
              <button
                onClick={generateMotivationalContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {motivationalContent.map((content) => (
              <div key={content.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{content.title}</div>
                    {content.theme && (
                      <span className="text-xs bg-comfort-accent/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{content.theme}</span>
                    )}
                    {content.url && (
                      <a 
                        href={content.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-comfort-olive hover:text-comfort-navy text-sm block mt-1 transition-colors"
                      >
                        🔗 View Source
                      </a>
                    )}
                  </div>
                  <button onClick={() => deleteMotivational(content.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'travel' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Plane className="w-5 h-5 text-comfort-accent" />
            Travel Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Travel post title"
              value={newTravel.title}
              onChange={(e) => setNewTravel({...newTravel, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Travel content or experience"
              value={newTravel.content}
              onChange={(e) => setNewTravel({...newTravel, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Destination or location"
              value={newTravel.destination}
              onChange={(e) => setNewTravel({...newTravel, destination: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newTravel.category}
              onChange={(e) => setNewTravel({...newTravel, category: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select travel category</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Luxury">Luxury</option>
              <option value="Budget">Budget Travel</option>
              <option value="Solo Travel">Solo Travel</option>
              <option value="Family">Family Travel</option>
              <option value="Business">Business Travel</option>
            </select>
            <input
              type="url"
              placeholder="Reference URL (paste URL to auto-populate fields)"
              value={newTravel.url}
              onChange={(e) => setNewTravel({...newTravel, url: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newTravel.tags}
              onChange={(e) => setNewTravel({...newTravel, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addTravel}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                Add Travel Content
              </button>
              <button
                onClick={generateTravelContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {travelContent.map((content) => (
              <div key={content.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{content.title}</div>
                    {content.destination && (
                      <span className="text-xs bg-comfort-olive/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{content.destination}</span>
                    )}
                  </div>
                  <button onClick={() => deleteTravel(content.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tech' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-comfort-accent" />
            Technology Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tech post title"
              value={newTech.title}
              onChange={(e) => setNewTech({...newTech, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Tech content or review"
              value={newTech.content}
              onChange={(e) => setNewTech({...newTech, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newTech.category}
              onChange={(e) => setNewTech({...newTech, category: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select tech category</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Mobile">Mobile</option>
              <option value="Web Dev">Web Development</option>
              <option value="Gadgets">Gadgets</option>
              <option value="Software">Software</option>
            </select>
            <input
              type="url"
              placeholder="Reference URL (paste URL to auto-populate fields)"
              value={newTech.url}
              onChange={(e) => setNewTech({...newTech, url: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newTech.tags}
              onChange={(e) => setNewTech({...newTech, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addTech}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                Add Tech Content
              </button>
              <button
                onClick={generateTechContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {techContent.map((content) => (
              <div key={content.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{content.title}</div>
                    {content.category && (
                      <span className="text-xs bg-comfort-olive/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{content.category}</span>
                    )}
                  </div>
                  <button onClick={() => deleteTech(content.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-comfort-accent" />
            Finance Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Finance post title"
              value={newFinance.title}
              onChange={(e) => setNewFinance({...newFinance, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Finance advice or tip"
              value={newFinance.content}
              onChange={(e) => setNewFinance({...newFinance, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newFinance.type}
              onChange={(e) => setNewFinance({...newFinance, type: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select finance type</option>
              <option value="Budgeting">Budgeting</option>
              <option value="Investing">Investing</option>
              <option value="Saving">Saving</option>
              <option value="Credit">Credit</option>
              <option value="Planning">Financial Planning</option>
            </select>
            <input
              type="url"
              placeholder="Reference URL (paste URL to auto-populate fields)"
              value={newFinance.url}
              onChange={(e) => setNewFinance({...newFinance, url: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newFinance.tags}
              onChange={(e) => setNewFinance({...newFinance, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addFinance}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                Add Finance Content
              </button>
              <button
                onClick={generateFinanceContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {financeContent.map((content) => (
              <div key={content.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{content.title}</div>
                    {content.type && (
                      <span className="text-xs bg-comfort-olive/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{content.type}</span>
                    )}
                  </div>
                  <button onClick={() => deleteFinance(content.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'beauty' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-comfort-accent" />
            Beauty Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Beauty post title"
              value={newBeauty.title}
              onChange={(e) => setNewBeauty({...newBeauty, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Beauty tip or routine"
              value={newBeauty.content}
              onChange={(e) => setNewBeauty({...newBeauty, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newBeauty.category}
              onChange={(e) => setNewBeauty({...newBeauty, category: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select beauty category</option>
              <option value="Skincare">Skincare</option>
              <option value="Makeup">Makeup</option>
              <option value="Haircare">Haircare</option>
              <option value="Nails">Nails</option>
              <option value="Wellness">Wellness</option>
            </select>
            <input
              type="url"
              placeholder="Reference URL (paste URL to auto-populate fields)"
              value={newBeauty.url}
              onChange={(e) => setNewBeauty({...newBeauty, url: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newBeauty.tags}
              onChange={(e) => setNewBeauty({...newBeauty, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addBeauty}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                Add Beauty Content
              </button>
              <button
                onClick={generateBeautyContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {beautyContent.map((content) => (
              <div key={content.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{content.title}</div>
                    {content.category && (
                      <span className="text-xs bg-comfort-olive/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{content.category}</span>
                    )}
                  </div>
                  <button onClick={() => deleteBeauty(content.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'parenting' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Heart className="w-5 h-5 text-comfort-accent" />
            Parenting Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Parenting post title"
              value={newParenting.title}
              onChange={(e) => setNewParenting({...newParenting, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Parenting tip or experience"
              value={newParenting.content}
              onChange={(e) => setNewParenting({...newParenting, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newParenting.ageGroup}
              onChange={(e) => setNewParenting({...newParenting, ageGroup: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select age group</option>
              <option value="Newborn">Newborn (0-3 months)</option>
              <option value="Infant">Infant (3-12 months)</option>
              <option value="Toddler">Toddler (1-3 years)</option>
              <option value="Preschool">Preschool (3-5 years)</option>
              <option value="School Age">School Age (5-12 years)</option>
              <option value="Teen">Teen (13+ years)</option>
            </select>
            <input
              type="url"
              placeholder="Reference URL (paste URL to auto-populate fields)"
              value={newParenting.url}
              onChange={(e) => setNewParenting({...newParenting, url: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newParenting.tags}
              onChange={(e) => setNewParenting({...newParenting, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addParenting}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                Add Parenting Content
              </button>
              <button
                onClick={generateParentingContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {parentingContent.map((content) => (
              <div key={content.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{content.title}</div>
                    {content.ageGroup && (
                      <span className="text-xs bg-comfort-olive/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{content.ageGroup}</span>
                    )}
                  </div>
                  <button onClick={() => deleteParenting(content.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'business' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Building className="w-5 h-5 text-comfort-accent" />
            Business Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Business post title"
              value={newBusiness.title}
              onChange={(e) => setNewBusiness({...newBusiness, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Business tip or insight"
              value={newBusiness.content}
              onChange={(e) => setNewBusiness({...newBusiness, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newBusiness.category}
              onChange={(e) => setNewBusiness({...newBusiness, category: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select business category</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
              <option value="Marketing">Marketing</option>
              <option value="Leadership">Leadership</option>
              <option value="Productivity">Productivity</option>
              <option value="Networking">Networking</option>
            </select>
            <input
              type="url"
              placeholder="Reference URL (paste URL to auto-populate fields)"
              value={newBusiness.url}
              onChange={(e) => setNewBusiness({...newBusiness, url: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newBusiness.tags}
              onChange={(e) => setNewBusiness({...newBusiness, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addBusiness}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                Add Business Content
              </button>
              <button
                onClick={generateBusinessContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {businessContent.map((content) => (
              <div key={content.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{content.title}</div>
                    {content.category && (
                      <span className="text-xs bg-comfort-olive/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{content.category}</span>
                    )}
                  </div>
                  <button onClick={() => deleteBusiness(content.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'lifestyle' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <Coffee className="w-5 h-5 text-comfort-accent" />
            Lifestyle Content
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Lifestyle post title"
              value={newLifestyle.title}
              onChange={(e) => setNewLifestyle({...newLifestyle, title: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <textarea
              placeholder="Lifestyle tip or experience"
              value={newLifestyle.content}
              onChange={(e) => setNewLifestyle({...newLifestyle, content: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
            />
            <select
              value={newLifestyle.category}
              onChange={(e) => setNewLifestyle({...newLifestyle, category: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none"
            >
              <option value="">Select lifestyle category</option>
              <option value="Home & Decor">Home & Decor</option>
              <option value="Fashion">Fashion</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Hobbies">Hobbies</option>
              <option value="Self Care">Self Care</option>
            </select>
            <input
              type="url"
              placeholder="Reference URL (paste URL to auto-populate fields)"
              value={newLifestyle.url}
              onChange={(e) => setNewLifestyle({...newLifestyle, url: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newLifestyle.tags}
              onChange={(e) => setNewLifestyle({...newLifestyle, tags: e.target.value})}
              className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addLifestyle}
                className="px-4 py-2 bg-comfort-olive text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                Add Lifestyle Content
              </button>
              <button
                onClick={generateLifestyleContent}
                className="px-4 py-2 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-navy flex-1 transition-colors shadow"
              >
                🤖 Generate with AI
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {lifestyleContent.map((content) => (
              <div key={content.id} className="p-3 border border-comfort-tan/30 rounded-lg bg-comfort-tan/10">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium text-comfort-navy">{content.title}</div>
                    {content.category && (
                      <span className="text-xs bg-comfort-olive/20 text-comfort-navy px-2 py-1 rounded mt-1 inline-block">{content.category}</span>
                    )}
                  </div>
                  <button onClick={() => deleteLifestyle(content.id)} className="text-comfort-accent hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-comfort-navy flex items-center gap-2">
              <Calendar className="w-5 h-5 text-comfort-accent" />
              Content Calendar
            </h2>
            
            {/* Export Buttons */}
            {contentCalendar.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-comfort-navy/70">Export:</span>
                <button
                  onClick={exportToBufferCSV}
                  className="flex items-center gap-1 px-3 py-1.5 bg-comfort-olive text-comfort-white text-xs rounded hover:bg-comfort-navy transition-colors shadow"
                  title="Export as CSV for Buffer import"
                >
                  <Download size={14} />
                  CSV
                </button>
                <button
                  onClick={exportToBufferJSON}
                  className="flex items-center gap-1 px-3 py-1.5 bg-comfort-accent text-comfort-white text-xs rounded hover:bg-comfort-navy transition-colors shadow"
                  title="Export as JSON for Buffer API"
                >
                  <Download size={14} />
                  JSON
                </button>
              </div>
            )}
          </div>

          {contentCalendar.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-comfort-navy/50 mb-4">No content generated yet. Go to Generate tab!</p>
              <div className="bg-comfort-tan/20 border border-comfort-tan/50 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="font-medium text-comfort-navy mb-2">📅 Buffer Integration Ready</h4>
                <p className="text-sm text-comfort-navy/80">
                  Once you generate content, you can export it directly to Buffer for scheduling across all your social media platforms!
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Calendar Navigation */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  {/* View Selector */}
                  <div className="flex bg-comfort-tan/20 rounded-lg p-1">
                    {['day', 'week', 'month', 'list'].map((view) => (
                      <button
                        key={view}
                        onClick={() => setCalendarView(view)}
                        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                          calendarView === view
                            ? 'bg-comfort-navy text-comfort-white shadow'
                            : 'text-comfort-navy hover:bg-comfort-tan/30'
                        }`}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Navigation - Hidden for list view */}
                {calendarView !== 'list' && (
                  <>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigateCalendar('prev')}
                        className="p-2 hover:bg-comfort-tan/30 rounded-lg transition-colors text-comfort-navy"
                      >
                        <ChevronDown size={16} className="rotate-90" />
                      </button>
                      
                      <div className="text-lg font-semibold text-comfort-navy min-w-48 text-center">
                        {calendarView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        {calendarView === 'week' && `Week of ${formatDate(getCalendarDays(currentDate, 'week')[0], 'short')}`}
                        {calendarView === 'day' && formatDate(currentDate, 'full')}
                      </div>
                      
                      <button
                        onClick={() => navigateCalendar('next')}
                        className="p-2 hover:bg-comfort-tan/30 rounded-lg transition-colors text-comfort-navy"
                      >
                        <ChevronDown size={16} className="-rotate-90" />
                      </button>
                    </div>

                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 py-1.5 text-sm bg-comfort-accent text-comfort-white rounded hover:bg-comfort-olive transition-colors"
                    >
                      Today
                    </button>
                  </>
                )}

                {/* List View Header */}
                {calendarView === 'list' && (
                  <div className="text-lg font-semibold text-comfort-navy">
                    All Scheduled Content ({contentCalendar.length} posts)
                  </div>
                )}
              </div>

              {/* Calendar Grid */}
              {calendarView === 'month' && (
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {/* Week Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-comfort-navy/70 bg-comfort-tan/10 rounded">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {getCalendarDays(currentDate, 'month').map((date) => {
                    const content = getContentForDate(date);
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    
                    return (
                      <div
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`p-2 min-h-24 border rounded cursor-pointer transition-colors relative ${
                          isSelected ? 'bg-comfort-accent/20 border-comfort-accent' :
                          isToday ? 'bg-comfort-olive/10 border-comfort-olive' :
                          isCurrentMonth ? 'bg-comfort-white border-comfort-tan hover:bg-comfort-tan/10' :
                          'bg-comfort-tan/5 border-comfort-tan/50 text-comfort-navy/50'
                        }`}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-comfort-olive' : 
                          isCurrentMonth ? 'text-comfort-navy' : 'text-comfort-navy/40'
                        }`}>
                          {formatDate(date, 'day')}
                        </div>
                        
                        {content.length > 0 && (
                          <div className="space-y-1">
                            {content.slice(0, 3).map((post) => (
                              <div
                                key={post.id}
                                className={`text-xs p-1 rounded truncate ${
                                  post.contentType === 'recipe' ? 'bg-orange-100 text-orange-800' :
                                  post.contentType === 'workout' ? 'bg-green-100 text-green-800' :
                                  post.contentType === 'realEstate' ? 'bg-blue-100 text-blue-800' :
                                  post.contentType === 'mindfulness' ? 'bg-purple-100 text-purple-800' :
                                  post.contentType === 'motivational' ? 'bg-pink-100 text-pink-800' :
                                  'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {post.content.title}
                              </div>
                            ))}
                            {content.length > 3 && (
                              <div className="text-xs text-comfort-navy/60">+{content.length - 3} more</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Week View */}
              {calendarView === 'week' && (
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {getCalendarDays(currentDate, 'week').map((date) => {
                    const content = getContentForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={date.toISOString()} className="space-y-2">
                        <div className={`text-center p-2 rounded ${
                          isToday ? 'bg-comfort-olive text-comfort-white' : 'bg-comfort-tan/10 text-comfort-navy'
                        }`}>
                          <div className="text-xs font-medium">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-lg font-semibold">
                            {formatDate(date, 'day')}
                          </div>
                        </div>
                        
                        <div className="space-y-2 min-h-64">
                          {content.map((post) => (
                            <div
                              key={post.id}
                              className={`p-2 rounded text-xs border-l-4 ${
                                post.contentType === 'recipe' ? 'bg-orange-50 border-orange-400' :
                                post.contentType === 'workout' ? 'bg-green-50 border-green-400' :
                                post.contentType === 'realEstate' ? 'bg-blue-50 border-blue-400' :
                                post.contentType === 'mindfulness' ? 'bg-purple-50 border-purple-400' :
                                post.contentType === 'motivational' ? 'bg-pink-50 border-pink-400' :
                                'bg-indigo-50 border-indigo-400'
                              }`}
                            >
                              <div className="font-medium text-comfort-navy truncate">
                                {post.content.title}
                              </div>
                              <div className="text-comfort-navy/60 mt-1">
                                {contentTypes[post.contentType]?.name || post.contentType}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Day View */}
              {calendarView === 'day' && (
                <div className="space-y-4">
                  {getContentForDate(currentDate).length === 0 ? (
                    <div className="text-center py-12 bg-comfort-tan/10 rounded-lg">
                      <p className="text-comfort-navy/50">No content scheduled for this day</p>
                    </div>
                  ) : (
                    getContentForDate(currentDate).map((post) => (
                      <div key={post.id} className="border rounded-lg p-4 bg-comfort-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium text-comfort-navy">{post.content.title}</div>
                            <div className="text-sm text-comfort-navy/70">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                post.contentType === 'recipe' ? 'bg-orange-100 text-orange-800' :
                                post.contentType === 'workout' ? 'bg-green-100 text-green-800' :
                                post.contentType === 'realEstate' ? 'bg-blue-100 text-blue-800' :
                                post.contentType === 'mindfulness' ? 'bg-purple-100 text-purple-800' :
                                post.contentType === 'motivational' ? 'bg-pink-100 text-pink-800' :
                                'bg-indigo-100 text-indigo-800'
                              }`}>
                                {contentTypes[post.contentType]?.name || post.contentType}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {Object.entries(platforms).map(([platform, config]) => (
                            <div key={platform} className="border rounded p-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm">{config.icon} {config.name}</span>
                                <button
                                  onClick={() => copyToClipboard(post.variations[platform], config.name)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <Copy size={16} />
                                </button>
                              </div>
                              <div className="text-xs bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                                {post.variations[platform]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* List View */}
              {calendarView === 'list' && (
                <div className="space-y-6">
                  {/* Buffer Integration Info */}
                  <div className="bg-gradient-to-r from-comfort-olive/10 to-comfort-accent/10 border border-comfort-olive/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-comfort-olive text-comfort-white rounded-lg p-2">
                        <Download size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-comfort-navy mb-2">🚀 Ready for Buffer!</h4>
                        <p className="text-sm text-comfort-navy/80 mb-3">
                          Your content is optimized for Buffer import. Choose your export format:
                        </p>
                        <ul className="text-xs text-comfort-navy/70 space-y-1">
                          <li>• <strong>Buffer CSV:</strong> Import directly into Buffer's bulk upload</li>
                          <li>• <strong>Buffer JSON:</strong> Use with Buffer's API for advanced scheduling</li>
                          <li>• <strong>Summary:</strong> Human-readable format for review and planning</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Sorted Content List */}
                  <div className="space-y-4">
                    {contentCalendar
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((post) => (
                        <div key={post.id} className="border rounded-lg p-4 bg-comfort-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium text-comfort-navy">{post.content.title}</div>
                              <div className="text-sm text-comfort-navy/70">
                                {post.date} • <span className="capitalize">{post.dayName}</span> • 
                                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                                  post.contentType === 'recipe' ? 'bg-orange-100 text-orange-800' :
                                  post.contentType === 'workout' ? 'bg-green-100 text-green-800' :
                                  post.contentType === 'realEstate' ? 'bg-blue-100 text-blue-800' :
                                  post.contentType === 'mindfulness' ? 'bg-purple-100 text-purple-800' :
                                  post.contentType === 'motivational' ? 'bg-pink-100 text-pink-800' :
                                  post.contentType === 'travel' ? 'bg-cyan-100 text-cyan-800' :
                                  post.contentType === 'tech' ? 'bg-slate-100 text-slate-800' :
                                  post.contentType === 'finance' ? 'bg-emerald-100 text-emerald-800' :
                                  post.contentType === 'beauty' ? 'bg-rose-100 text-rose-800' :
                                  post.contentType === 'parenting' ? 'bg-yellow-100 text-yellow-800' :
                                  post.contentType === 'business' ? 'bg-gray-100 text-gray-800' :
                                  post.contentType === 'lifestyle' ? 'bg-teal-100 text-teal-800' :
                                  'bg-indigo-100 text-indigo-800'
                                }`}>
                                  {contentTypes[post.contentType]?.name || post.contentType}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedDate(new Date(post.date))}
                              className="text-xs px-2 py-1 bg-comfort-tan/30 hover:bg-comfort-tan/50 text-comfort-navy rounded transition-colors"
                              title="View in calendar"
                            >
                              View Date
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {Object.entries(platforms).map(([platform, config]) => (
                              <div key={platform} className="border rounded p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-sm">{config.icon} {config.name}</span>
                                  <button
                                    onClick={() => copyToClipboard(post.variations[platform], config.name)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <Copy size={16} />
                                  </button>
                                </div>
                                <div className="text-xs bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                                  {post.variations[platform]}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'generate' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Generate Weekly Content</h2>
          
          {/* Generation Mode Selector */}
          <div className="bg-comfort-tan/20 border border-comfort-tan/50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-comfort-navy mb-3">📊 Generation Mode</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  id="calendarMode"
                  name="generationMode"
                  value="calendar"
                  checked={generationMode === 'calendar'}
                  onChange={(e) => setGenerationMode(e.target.value)}
                  className="mt-1"
                />
                <label htmlFor="calendarMode" className="flex-1">
                  <div className="font-medium text-comfort-navy">📅 Standard Calendar Week</div>
                  <div className="text-sm text-comfort-navy/70">
                    Generate Sunday through Saturday (
                    {(() => {
                      const today = new Date();
                      const startOfWeek = new Date(today);
                      startOfWeek.setDate(today.getDate() - today.getDay());
                      const weekStart = today.getDay() === 0 ? startOfWeek : new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
                      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
                      return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
                    })()}
                    ). Perfect for calendar planning.
                  </div>
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  id="nextDayMode"
                  name="generationMode"
                  value="nextDay"
                  checked={generationMode === 'nextDay'}
                  onChange={(e) => setGenerationMode(e.target.value)}
                  className="mt-1"
                />
                <label htmlFor="nextDayMode" className="flex-1">
                  <div className="font-medium text-comfort-navy">🗓️ Starting Tomorrow</div>
                  <div className="text-sm text-comfort-navy/70">
                    Generate 7 days starting tomorrow (
                    {(() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const endDate = new Date(tomorrow);
                      endDate.setDate(tomorrow.getDate() + 6);
                      return `${tomorrow.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                    })()}
                    ). Great for immediate scheduling.
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-800 mb-3">
              📅 Weekly Schedule {generationMode === 'calendar' ? '(Sunday - Saturday)' : '(7 Days from Tomorrow)'}
            </h3>
            <p className="text-sm text-blue-600 mb-3">
              Set what content type to post on each day. 
              {(() => {
                const today = new Date();
                if (generationMode === 'calendar') {
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - today.getDay());
                  const weekStart = today.getDay() === 0 ? startOfWeek : new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
                  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
                  return ` Will generate calendar week: ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
                } else {
                  const tomorrow = new Date(today);
                  tomorrow.setDate(today.getDate() + 1);
                  const endDate = new Date(tomorrow);
                  endDate.setDate(tomorrow.getDate() + 6);
                  return ` Will generate 7 days: ${tomorrow.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                }
              })()}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <label className="text-sm font-medium capitalize w-24">{day}:</label>
                  <select
                    value={weeklySchedule[day]}
                    onChange={(e) => setWeeklySchedule({...weeklySchedule, [day]: e.target.value})}
                    className="flex-1 p-2 border rounded text-sm"
                  >
                    <option value="recipe">🍳 Recipe</option>
                    <option value="workout">💪 Workout</option>
                    <option value="realEstate">🏡 Real Estate</option>
                    <option value="mindfulness">🧘 Mindfulness</option>
                    <option value="motivational">✨ Motivational</option>
                    <option value="educational">📚 Educational</option>
                    <option value="travel">✈️ Travel</option>
                    <option value="tech">📱 Technology</option>
                    <option value="finance">💰 Finance</option>
                    <option value="beauty">✨ Beauty</option>
                    <option value="parenting">👨‍👩‍👧‍👦 Parenting</option>
                    <option value="business">💼 Business</option>
                    <option value="lifestyle">🌟 Lifestyle</option>
                    <option value="random">🎲 Random Mix</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-blue-100 rounded">
              <p className="text-xs text-blue-700">
                <strong>Tip:</strong> Select "Random Mix" for any day to automatically choose from available content. Make sure you have content added in each category you want to use!
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-green-800 mb-3">📊 Content Inventory</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.recipes}
                  onChange={(e) => setContentMix({...contentMix, recipes: e.target.checked})}
                />
                <span className="text-sm">🍳 Recipes ({recipes.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.workouts}
                  onChange={(e) => setContentMix({...contentMix, workouts: e.target.checked})}
                />
                <span className="text-sm">💪 Workouts ({workouts.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.realEstate}
                  onChange={(e) => setContentMix({...contentMix, realEstate: e.target.checked})}
                />
                <span className="text-sm">🏡 Real Estate ({realEstateTips.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.mindfulness}
                  onChange={(e) => setContentMix({...contentMix, mindfulness: e.target.checked})}
                />
                <span className="text-sm">🧘 Mindfulness ({mindfulnessPosts.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.motivational}
                  onChange={(e) => setContentMix({...contentMix, motivational: e.target.checked})}
                />
                <span className="text-sm">✨ Motivational</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.educational}
                  onChange={(e) => setContentMix({...contentMix, educational: e.target.checked})}
                />
                <span className="text-sm">📚 Educational</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.travel}
                  onChange={(e) => setContentMix({...contentMix, travel: e.target.checked})}
                />
                <span className="text-sm">✈️ Travel ({travelContent.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.tech}
                  onChange={(e) => setContentMix({...contentMix, tech: e.target.checked})}
                />
                <span className="text-sm">📱 Technology ({techContent.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.finance}
                  onChange={(e) => setContentMix({...contentMix, finance: e.target.checked})}
                />
                <span className="text-sm">💰 Finance ({financeContent.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.beauty}
                  onChange={(e) => setContentMix({...contentMix, beauty: e.target.checked})}
                />
                <span className="text-sm">✨ Beauty ({beautyContent.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.parenting}
                  onChange={(e) => setContentMix({...contentMix, parenting: e.target.checked})}
                />
                <span className="text-sm">👨‍👩‍👧‍👦 Parenting ({parentingContent.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.business}
                  onChange={(e) => setContentMix({...contentMix, business: e.target.checked})}
                />
                <span className="text-sm">💼 Business ({businessContent.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contentMix.lifestyle}
                  onChange={(e) => setContentMix({...contentMix, lifestyle: e.target.checked})}
                />
                <span className="text-sm">🌟 Lifestyle ({lifestyleContent.length})</span>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              These checkboxes control which content types are available for "Random Mix" days.
            </p>
          </div>

          <button
            onClick={generateWeeklyContent}
            disabled={isGenerating}
            className={`w-full px-6 py-3 text-comfort-white rounded-lg font-medium shadow transition ${
              isGenerating ? 'bg-gray-400' : 'bg-comfort-navy hover:bg-comfort-olive'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate Weekly Content'}
          </button>
        </div>
      )}
    </div>
  );
}

export default PreBuffer;