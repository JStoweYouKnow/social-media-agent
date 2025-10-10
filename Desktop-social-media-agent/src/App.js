import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Copy, Share, Target, FileText, ChefHat, Dumbbell, Lightbulb, X, Plane, Smartphone, DollarSign, Sparkles, Heart, Building, Coffee, ChevronDown, Download, Home, GraduationCap, Zap, Trash2 } from 'lucide-react';

function PreBuffer() {
  // State initialization
  const [recipes, setRecipes] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [realEstateTips, setRealEstateTips] = useState([]);
  const [mindfulnessPosts, setMindfulnessPosts] = useState([]);
  const [educationalContent, setEducationalContent] = useState([]);
  const [motivationalContent, setMotivationalContent] = useState([]);
  const [contentCalendar, setContentCalendar] = useState([]);
  
  // Debug: Track contentCalendar changes
  React.useEffect(() => {
    console.log('📅 Content calendar updated:', contentCalendar.length, 'items');
  }, [contentCalendar]);
  
  // New specialized categories
  const [travelContent, setTravelContent] = useState([]);
  const [techContent, setTechContent] = useState([]);
  const [financeContent, setFinanceContent] = useState([]);
  const [beautyContent, setBeautyContent] = useState([]);
  const [parentingContent, setParentingContent] = useState([]);
  const [businessContent, setBusinessContent] = useState([]);
  const [lifestyleContent, setLifestyleContent] = useState([]);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Day-specific topic selections and content
  const [dayTopicSelections, setDayTopicSelections] = useState({
    monday: 'recipes',
    tuesday: 'workouts', 
    wednesday: 'realestate',
    thursday: 'mindfulness',
    friday: 'travel',
    saturday: 'tech',
    sunday: 'finance'
  });
  
  // Day-specific content arrays
  const [dayContent, setDayContent] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });
  
  // Topic bank for storing pre-written posts by topic (no day assignment needed)
  const [topicBank, setTopicBank] = useState({
    recipes: [],
    workouts: [],
    realEstate: [],
    mindfulness: [],
    educational: [],
    motivational: [],
    travel: [],
    tech: [],
    finance: [],
    beauty: [],
    parenting: [],
    business: [],
    lifestyle: []
  });

  // Topic bank dashboard management state
  const [selectedBankTopic, setSelectedBankTopic] = useState('recipes');
  const [bankInputs, setBankInputs] = useState({ 
    title: '', 
    content: '', 
    tags: '', 
    url: '', 
    inputMethod: 'manual',
    isUrlLoading: false,
    urlError: null
  });
  
  // Day-specific input states
  const [dayInputs, setDayInputs] = useState({
    monday: { title: '', content: '', url: '', field1: '', field2: '' },
    tuesday: { title: '', content: '', url: '', field1: '', field2: '' },
    wednesday: { title: '', content: '', url: '', field1: '', field2: '' },
    thursday: { title: '', content: '', url: '', field1: '', field2: '' },
    friday: { title: '', content: '', url: '', field1: '', field2: '' },
    saturday: { title: '', content: '', url: '', field1: '', field2: '' },
    sunday: { title: '', content: '', url: '', field1: '', field2: '' }
  });
  
  // Available topic options for each day
  const topicOptions = [
    { value: 'recipes', label: '🍳 Recipes', icon: ChefHat },
    { value: 'workouts', label: '💪 Workouts', icon: Dumbbell },
    { value: 'realestate', label: '🏡 Real Estate', icon: Building },
    { value: 'mindfulness', label: '🧘 Mindfulness', icon: Heart },
    { value: 'travel', label: '✈️ Travel', icon: Plane },
    { value: 'tech', label: '💻 Tech', icon: Smartphone },
    { value: 'finance', label: '💰 Finance', icon: DollarSign },
    { value: 'beauty', label: '✨ Beauty', icon: Sparkles },
    { value: 'parenting', label: '👶 Parenting', icon: Heart },
    { value: 'business', label: '📈 Business', icon: Target },
    { value: 'lifestyle', label: '☕ Lifestyle', icon: Coffee },
    { value: 'educational', label: '📚 Educational', icon: GraduationCap },
    { value: 'motivational', label: '⚡ Motivational', icon: Zap }
  ];
  
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
  const [previewRecipe, setPreviewRecipe] = useState(null);
  const [previewWorkout, setPreviewWorkout] = useState(null);
  
  // Navigation state
  const [currentView, setCurrentView] = useState('day');
  
  // Calendar view state
  const [calendarView, setCalendarView] = useState('month'); // 'day', 'week', 'month'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // AI settings
  const [isGenerating, setIsGenerating] = useState(false);
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
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  // Weekly schedule now syncs with day topic selections
  const weeklySchedule = {
    monday: dayTopicSelections.monday,
    tuesday: dayTopicSelections.tuesday,
    wednesday: dayTopicSelections.wednesday,
    thursday: dayTopicSelections.thursday,
    friday: dayTopicSelections.friday,
    saturday: dayTopicSelections.saturday,
    sunday: dayTopicSelections.sunday
  };
  
  // Generation mode: 'calendar' for Sunday-Saturday, 'nextDay' for starting tomorrow
  const [generationMode, setGenerationMode] = useState('calendar');
  
  // Refs
  const recipeFileInputRef = useRef(null);
  const workoutFileInputRef = useRef(null);



  // Debug contentCalendar changes
  useEffect(() => {
    console.log('🔄 Debug: contentCalendar updated, length:', contentCalendar.length);
    console.log('📊 Debug: contentCalendar content:', contentCalendar);
  }, [contentCalendar]);

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

  // Export Functions
  const exportToCSV = () => {
    if (contentCalendar.length === 0) {
      alert('No content to export!');
      return;
    }

    const headers = ['Date', 'Day', 'Title', 'Content', 'Type', 'Tags'];
    const csvContent = [
      headers.join(','),
      ...contentCalendar.map(item => [
        item.date,
        item.dayName,
        `"${item.content.title || ''}"`,
        `"${item.content.description || item.content.content || ''}"`,
        item.contentType,
        `"${item.content.tags || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-calendar-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    if (contentCalendar.length === 0) {
      alert('No content to export!');
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalPosts: contentCalendar.length,
      contentCalendar: contentCalendar
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-calendar-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const printCalendar = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Content Calendar</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
            .post { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .date { font-weight: bold; color: #e67e22; }
            .title { font-size: 16px; font-weight: bold; margin: 5px 0; }
            .content { color: #555; margin: 5px 0; }
            .meta { font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <h1>Content Calendar - Generated ${new Date().toLocaleDateString()}</h1>
          ${contentCalendar.length === 0 ? '<p>No content available to print.</p>' : 
            contentCalendar
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(item => `
                <div class="post">
                  <div class="date">${item.dayName}, ${new Date(item.date).toLocaleDateString()}</div>
                  <div class="title">${item.content.title || 'Untitled'}</div>
                  <div class="content">${item.content.description || item.content.content || 'No content'}</div>
                  <div class="meta">Type: ${item.contentType}${item.content.tags ? ` | Tags: ${item.content.tags}` : ''}</div>
                </div>
              `).join('')
          }
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
    
    const variations = {
      instagram: {},
      linkedin: {},
      facebook: {}
    };
    
    // Enhanced post generation with validation
    const instagramPost = generateEnhancedInstagramPost(content, type, currentSeason, randomPersonal);
    const linkedinPost = generateEnhancedLinkedInPost(content, type, currentSeason, dayOfWeek);
    const facebookPost = generateEnhancedFacebookPost(content, type, currentSeason, randomPersonal);
    
    // Validate posts and log quality scores
    const instagramValidation = validatePostContent(instagramPost, 'instagram');
    const linkedinValidation = validatePostContent(linkedinPost, 'linkedin');
    const facebookValidation = validatePostContent(facebookPost, 'facebook');
    
    console.log('📊 Post Quality Scores:', {
      instagram: instagramValidation.score,
      linkedin: linkedinValidation.score,
      facebook: facebookValidation.score
    });
    
    if (instagramValidation.issues.length > 0) {
      console.warn('⚠️ Instagram post issues:', instagramValidation.issues);
    }
    if (linkedinValidation.issues.length > 0) {
      console.warn('⚠️ LinkedIn post issues:', linkedinValidation.issues);
    }
    if (facebookValidation.issues.length > 0) {
      console.warn('⚠️ Facebook post issues:', facebookValidation.issues);
    }
    
    variations.instagram[type] = instagramPost;
    variations.linkedin[type] = linkedinPost;
    variations.facebook[type] = facebookPost;
    
    return variations;
  };
  
  const generateEnhancedInstagramPost = (content, type, season, personal) => {
    // Create more coherent post templates with better sentence flow
    const createPostTemplate = (content, type, season) => {
      const templates = {
        recipe: [
          `Just discovered an incredible recipe that's perfect for ${season.toLowerCase()}! ${content.title} has completely changed my meal prep game.`,
          `${season} calls for comfort food done right. This ${content.title.toLowerCase()} is exactly what I needed.`,
          `Found the perfect ${season.toLowerCase()} recipe! ${content.title} is now on repeat in my kitchen.`
        ],
        workout: [
          `That post-workout feeling hits different! Just finished ${content.title.toLowerCase()} and I'm already planning tomorrow's session.`,
          `${season} fitness motivation: ${content.title} reminded me why I love moving my body.`,
          `Tried something new today - ${content.title.toLowerCase()} and wow, what a game changer!`
        ],
        travel: [
          `Travel dreams activated! ${content.title} just made it to the top of my bucket list.`,
          `${season} wanderlust is real. ${content.title} looks absolutely incredible!`,
          `Adding ${content.title.toLowerCase()} to my travel wishlist immediately.`
        ],
        tech: [
          `Tech discovery of the day: ${content.title}! This is exactly what I've been looking for.`,
          `Just learned about ${content.title.toLowerCase()} and my productivity game is about to level up.`,
          `${season} tech update: ${content.title} is making my daily routine so much smoother.`
        ],
        finance: [
          `Financial wellness check! ${content.title} just opened my eyes to some serious money insights.`,
          `Building wealth in ${season} 2025: ${content.title.toLowerCase()} is the strategy I wish I knew earlier.`,
          `Money mindset shift happening! ${content.title} is exactly the guidance I needed.`
        ],
        beauty: [
          `Glow-up season continues! ${content.title} is the beauty secret I've been missing.`,
          `${season} skincare discovery: ${content.title.toLowerCase()} has me feeling radiant.`,
          `Self-care Sunday vibes with ${content.title.toLowerCase()}. My skin is already thanking me!`
        ],
        parenting: [
          `Parenting win! ${content.title} just made our family routine so much better.`,
          `Mom life update: ${content.title.toLowerCase()} is the game-changing advice every parent needs.`,
          `${season} parenting goals: implementing ${content.title.toLowerCase()} starting today!`
        ],
        business: [
          `Entrepreneur mindset shift! ${content.title} is the business insight that changed my perspective.`,
          `Building something amazing requires the right strategies. ${content.title} just became my new playbook.`,
          `${season} business goals: ${content.title.toLowerCase()} is exactly the direction I needed.`
        ],
        lifestyle: [
          `Living my best life in ${season}! ${content.title} is the lifestyle upgrade I didn't know I needed.`,
          `Wellness Wednesday wisdom: ${content.title.toLowerCase()} is transforming my daily routine.`,
          `${season} intentions setting in with ${content.title.toLowerCase()}. Feeling so aligned!`
        ],
        motivational: [
          `Monday motivation delivered! ${content.title} is exactly the mindset shift I needed.`,
          `${season} energy is all about growth. ${content.title} just reminded me of my potential.`,
          `Inspiration striking at the perfect time! ${content.title.toLowerCase()} speaks directly to my soul.`
        ],
        educational: [
          `Learning something new every day! ${content.title} just blew my mind with these insights.`,
          `Knowledge is power and ${content.title.toLowerCase()} is proof. This changes everything!`,
          `${season} learning goals: ${content.title} is exactly the educational content I was searching for.`
        ]
      };
      
      const typeTemplates = templates[type] || templates.lifestyle;
      return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
    };

    const typeConfigs = {
      recipe: {
        emoji: '🍽️', 
        cta: 'Save this for your next meal prep! What\'s your favorite comfort food recipe?', 
        hashtags: '#healthyeating #mealprep #foodie #recipe #homecooking'
      },
      workout: {
        emoji: '💪', 
        cta: 'Tag someone who needs this motivation! What\'s your favorite way to move your body?', 
        hashtags: '#fitness #workout #motivation #strong #wellness'
      },
      travel: {
        emoji: '✈️', 
        cta: 'Where\'s your next adventure taking you? Drop your dream destinations below!', 
        hashtags: '#travel #wanderlust #adventure #explore #bucketlist'
      },
      tech: {
        emoji: '📱', 
        cta: 'Anyone else loving this tech? Share your favorite productivity tools!', 
        hashtags: '#tech #innovation #gadgets #techtips #productivity'
      },
      finance: {
        emoji: '💰', 
        cta: 'What\'s your top financial goal right now? Let\'s support each other!', 
        hashtags: '#finance #money #investing #financialfreedom #wealthbuilding'
      },
      beauty: {
        emoji: '✨', 
        cta: 'Drop your favorite beauty tips below! What makes you feel most confident?', 
        hashtags: '#beauty #skincare #selfcare #glowup #confidence'
      },
      parenting: {
        emoji: '👨‍👩‍👧‍👦', 
        cta: 'Other parents - what\'s your best family tip? We\'re all in this together!', 
        hashtags: '#parenting #momlife #dadlife #family #parentingtips'
      },
      business: {
        emoji: '💼', 
        cta: 'What business lesson changed your game? Share your entrepreneur insights!', 
        hashtags: '#entrepreneur #business #mindset #success #growthmindset'
      },
      lifestyle: {
        emoji: '🌟', 
        cta: 'What\'s your latest lifestyle win? Celebrating the small victories!', 
        hashtags: '#lifestyle #wellness #selfcare #mindful #intentionalliving'
      },
      motivational: {
        emoji: '🌅', 
        cta: `What motivates you most? Share your ${season.toLowerCase()} intentions!`, 
        hashtags: `#motivation #mindset #inspiration #growth #${season.toLowerCase()}goals`
      },
      educational: {
        emoji: '📚', 
        cta: 'What\'s the most valuable thing you\'ve learned recently? Knowledge is power!', 
        hashtags: '#learning #education #growth #knowledge #personaldevelopment'
      }
    };
    
    const config = typeConfigs[type] || typeConfigs.lifestyle;
    
    // Generate coherent main content
    const mainContent = createPostTemplate(content, type, season);
    
    // Add content description if available and different from title
    const additionalContent = content.content && content.content !== content.title && !mainContent.includes(content.content) 
      ? `\n\n${content.content}` 
      : '';
    
    // Intelligently use rich content analysis for enhanced posts
    let enrichmentText = '';
    
    // Use insights, quotes, or statistics based on content analysis
    if (content.keyInsights && content.keyInsights.length > 0) {
      enrichmentText = `\n\n💡 ${content.keyInsights[0]}`;
    } else if (content.keyQuotes && content.keyQuotes.length > 0) {
      enrichmentText = `\n\n"${content.keyQuotes[0]}"`;
    } else if (content.statistics && content.statistics.length > 0) {
      enrichmentText = `\n\n� ${content.statistics[0]}`;
    }
    
    // Add sentiment-appropriate emoji based on analysis
    const sentimentEmoji = {
      'positive': ' ✨',
      'negative': ' 🤔',
      'neutral': ''
    };
    
    const moodEmoji = content.sentiment ? sentimentEmoji[content.sentiment] : '';
    
    // Include theme-based hashtags if detected
    const themeHashtags = content.themes ? content.themes.map(theme => `#${theme}`).join(' ') : '';
    const combinedHashtags = themeHashtags ? `${config.hashtags} ${themeHashtags}` : config.hashtags;
    
    // Include URL source attribution when available
    const sourceAttribution = content.source ? `\n\n📖 Via: ${content.source}` : '';
    const urlLink = content.url ? `\n🔗 ${content.url}` : '';
    
    return `${config.emoji} ${mainContent}${additionalContent}${enrichmentText}${moodEmoji}

${config.cta}${sourceAttribution}${urlLink}

${combinedHashtags}`;
  };
  
  const generateEnhancedLinkedInPost = (content, type, season, day) => {
    // Create professional LinkedIn templates with clear business value
    const createLinkedInTemplate = (content, type, season, day) => {
      const templates = {
        recipe: [
          `${day} leadership insight: Nutrition isn't just personal wellness—it's performance strategy.\n\n"${content.title}" reminded me that what fuels our bodies directly impacts how we lead, think, and execute.`,
          `Peak performance starts with what's on your plate.\n\n${content.title} highlights why smart leaders prioritize nutrition as a competitive advantage, not just a lifestyle choice.`,
          `Executive wellness insight: ${content.title}.\n\nThe most successful leaders I know understand that sustained performance requires intentional fuel choices.`
        ],
        workout: [
          `${day} reflection: The discipline that builds your body also builds your leadership capacity.\n\n"${content.title}" perfectly captures why fitness isn't separate from professional success—it's foundational to it.`,
          `Leadership lesson from the gym: ${content.title}.\n\nEvery rep teaches resilience. Every workout builds the mental toughness that shows up in boardrooms and tough decisions.`,
          `Physical discipline = Mental clarity.\n\n${content.title} reinforces why the most effective leaders I work with prioritize their physical health as much as their business strategy.`
        ],
        travel: [
          `Global perspective shifts everything in business.\n\n"${content.title}" reminded me why diverse experiences create better leaders and more innovative solutions.`,
          `${day} insight: Cultural intelligence is the new competitive advantage.\n\n${content.title} demonstrates why exposure to different markets and mindsets elevates strategic thinking.`,
          `Leadership development happens everywhere.\n\n${content.title} shows how stepping outside our comfort zones—geographically and mentally—expands our capacity to lead.`
        ],
        tech: [
          `Technology strategy insight: ${content.title}.\n\n${day} reminder that staying ahead means constantly evaluating how innovation can serve our goals, not just our gadgets.`,
          `Digital transformation isn't about tools—it's about mindset.\n\n"${content.title}" perfectly illustrates why successful leaders focus on solving problems, not just adopting technology.`,
          `Innovation leadership: ${content.title}.\n\nThe future belongs to leaders who can bridge human needs with technological possibilities.`
        ],
        finance: [
          `Financial leadership extends far beyond personal wealth.\n\n"${content.title}" highlights why understanding money psychology is crucial for anyone leading teams or organizations.`,
          `${day} strategic thinking: ${content.title}.\n\nThe best business decisions come from leaders who understand both numbers and human behavior around resources.`,
          `Executive insight: Financial literacy isn't optional for leaders.\n\n${content.title} demonstrates why money mindset directly impacts every business decision we make.`
        ],
        beauty: [
          `Professional presence matters more than we might admit.\n\n"${content.title}" reminds us that confidence and self-care directly impact how others receive our leadership.`,
          `Executive presence starts with how we show up for ourselves.\n\n${content.title} illustrates why personal care isn't vanity—it's professional strategy.`,
          `Leadership authenticity: ${content.title}.\n\nThe most compelling leaders I know understand that genuine confidence comes from taking care of themselves inside and out.`
        ],
        parenting: [
          `Parenting and leadership share more DNA than most realize.\n\n"${content.title}" perfectly captures skills that translate directly from family to boardroom.`,
          `${day} leadership lesson from home: ${content.title}.\n\nEvery parent develops patience, strategic thinking, and crisis management—all executive essentials.`,
          `Work-life integration insight: ${content.title}.\n\nThe best leaders I know apply family wisdom to business challenges and vice versa.`
        ],
        business: [
          `${day} strategic insight: ${content.title}.\n\nThis perfectly encapsulates the kind of thinking that separates good leaders from transformational ones.`,
          `Business growth principle: ${content.title}.\n\nSometimes the most powerful strategies are the ones that seem simple but require discipline to execute.`,
          `Leadership development: ${content.title}.\n\nThe marketplace rewards leaders who can see opportunities others miss and execute with consistency.`
        ],
        lifestyle: [
          `Sustainable leadership requires intentional design.\n\n"${content.title}" captures why high performers can't afford to leave wellness to chance.`,
          `Executive effectiveness: ${content.title}.\n\n${day} reminder that peak performance isn't about grinding harder—it's about creating systems that support sustained excellence.`,
          `Leadership longevity insight: ${content.title}.\n\nThe most successful leaders I work with treat their energy and focus as their most valuable business assets.`
        ],
        motivational: [
          `${day} mindset shift: ${content.title}.\n\nSometimes the breakthrough we need isn't a new strategy—it's a new way of thinking about existing possibilities.`,
          `Leadership psychology: ${content.title}.\n\nThe difference between good and great leaders often comes down to how they frame challenges and opportunities.`,
          `Peak performance principle: ${content.title}.\n\nEvery leader I admire has mastered the art of internal motivation that doesn't depend on external circumstances.`
        ],
        educational: [
          `Continuous learning isn't just professional development—it's competitive survival.\n\n"${content.title}" demonstrates why curiosity is a leadership superpower.`,
          `${day} learning insight: ${content.title}.\n\nThe most effective leaders I know are students first, experts second.`,
          `Knowledge application: ${content.title}.\n\nInformation is everywhere, but wisdom comes from leaders who can connect insights across disciplines.`
        ]
      };
      
      const typeTemplates = templates[type] || templates.business;
      return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
    };

    const typeConfigs = {
      recipe: { focus: 'nutrition strategy', hashtags: '#leadership #wellness #performance #nutrition' },
      workout: { focus: 'executive fitness', hashtags: '#leadership #fitness #mentalhealth #performance' },
      travel: { focus: 'cultural intelligence', hashtags: '#leadership #travel #globalthinking #culturalcompetence' },
      tech: { focus: 'digital leadership', hashtags: '#leadership #technology #innovation #digitalstrategy' },
      finance: { focus: 'financial strategy', hashtags: '#leadership #finance #strategy #businessacumen' },
      beauty: { focus: 'professional presence', hashtags: '#leadership #professionalimage #confidence #executivepresence' },
      parenting: { focus: 'leadership development', hashtags: '#leadership #parenting #worklifeintegration #management' },
      business: { focus: 'business strategy', hashtags: '#leadership #business #strategy #entrepreneurship' },
      lifestyle: { focus: 'sustainable performance', hashtags: '#leadership #wellness #sustainability #performance' },
      motivational: { focus: 'leadership mindset', hashtags: '#leadership #motivation #mindset #growthmindset' },
      educational: { focus: 'continuous learning', hashtags: '#leadership #learning #professionaldevelopment #growth' }
    };
    
    const config = typeConfigs[type] || typeConfigs.business;
    
    // Generate professional LinkedIn content
    const mainContent = createLinkedInTemplate(content, type, season, day);
    
    // Add content description if available and adds value
    const additionalContent = content.content && content.content !== content.title && !mainContent.includes(content.content)
      ? `\n\n${content.content}`
      : '';
    
    // Add key insights for professional context
    const professionalInsight = content.keyInsights && content.keyInsights.length > 0 
      ? `\n\n� Key insight: ${content.keyInsights[0]}` 
      : '';
    
    // Include URL source attribution when available
    const sourceAttribution = content.source ? `\n\nSource: ${content.source}` : '';
    const urlLink = content.url ? `\nRead more: ${content.url}` : '';
    
    return `${mainContent}${additionalContent}${professionalInsight}

What's your experience with ${config.focus}? How do you see this evolving in 2025?${sourceAttribution}${urlLink}

${config.hashtags}`;
  };
  
  const generateEnhancedFacebookPost = (content, type, season, personal) => {
    // Natural Facebook-style conversational templates
    const facebookTemplates = [
      `Friends! Just discovered something amazing and had to share: ${content.title}! 🎉`,
      `Okay, this is seriously cool - came across ${content.title} and I'm kind of obsessed! ✨`,
      `Community wisdom needed! Anyone else heard about ${content.title}? Because wow! 🤔`,
      `Real talk: ${content.title} just made my whole week better! 💕`,
      `Dropping this gem here because you all deserve to know about ${content.title}! 💎`,
      `Can we talk about ${content.title}? Because this is exactly what I needed! 🙌`,
      `Found something that completely changed my perspective: ${content.title}! 🌟`,
      `Hey everyone! Quick share - ${content.title} is absolutely worth your attention! 👀`,
      `This caught my eye and I couldn't stop thinking about it: ${content.title}! 🤯`,
      `Saturday wisdom drop: ${content.title} is the kind of thing that restores faith! 🌈`
    ];
    
    // Type-specific community engagement questions
    const communityQuestions = {
      food: [
        "Who else is trying to level up their cooking game this season? 🍳",
        "Anyone have similar recipe wins to share? Always looking for new ideas! 🥘",
        "What's your go-to when you want to impress with minimal effort? 👨‍🍳",
        "Does anyone else get way too excited about discovering new flavors? 😄"
      ],
      travel: [
        "Who's planning their next adventure? This got me inspired! ✈️",
        "Anyone else adding new places to their bucket list constantly? 🗺️",
        "What's the best travel tip you've ever received? Share the wisdom! 🎒",
        "Does anyone else love discovering hidden gems like this? 🌍"
      ],
      wellness: [
        "Anyone else on a wellness journey right now? We're in this together! 🌱",
        "What small changes have made the biggest difference in your life? 💚",
        "Who else believes that taking care of ourselves isn't selfish? 🧘‍♀️",
        "Anyone have wellness wins they want to celebrate? Let's cheer each other on! 🎊"
      ],
      tech: [
        "Fellow tech enthusiasts - what's blowing your mind lately? 🤖",
        "Anyone else fascinated by how quickly technology is evolving? 📱",
        "What's the coolest tech discovery you've made recently? Share! 💻",
        "Who else gets excited about innovations that actually solve real problems? 🚀"
      ],
      fitness: [
        "Who's keeping up with their fitness goals this season? You've got this! �",
        "Anyone else finding new ways to stay motivated with movement? 🏃‍♀️",
        "What's your favorite way to stay active when motivation is low? 🏋️‍♂️",
        "Does anyone else celebrate the small fitness wins? They add up! 🎯"
      ],
      fashion: [
        "Anyone else love discovering new style inspiration? Fashion is so fun! 👗",
        "What's your go-to confidence outfit when you need a boost? ✨",
        "Who else thinks personal style should be about feeling amazing? 💃",
        "Anyone have fashion tips that actually work in real life? 👠"
      ],
      beauty: [
        "Beauty lovers - what's your latest holy grail discovery? 💄",
        "Anyone else believe that self-care is the best kind of care? 🛁",
        "What beauty tip changed the game for you? Always learning! 💅",
        "Who else thinks confidence is the best accessory? 👑"
      ],
      parenting: [
        "Parents - anyone else winging it and hoping for the best? 👶",
        "What's the best parenting advice you've actually used? Share the wisdom! 🤱",
        "Anyone else amazed by what kids teach us every day? 👨‍👩‍👧‍👦",
        "Who else celebrates the small parenting wins? They matter so much! 🏆"
      ],
      business: [
        "Entrepreneurs - what's the best business lesson you learned the hard way? 💼",
        "Anyone else love connecting with fellow business minds? Let's network! 🤝",
        "What business advice do you wish you'd received sooner? 📈",
        "Who else thinks the entrepreneurial journey is wild but worth it? 🎢"
      ],
      lifestyle: [
        "Anyone else constantly trying to optimize their daily routines? 🌅",
        "What lifestyle change surprised you with how much it improved things? 🌺",
        "Who else believes that small improvements create big transformations? ✨",
        "Anyone have life hacks that actually work? Always collecting tips! 📝"
      ],
      motivational: [
        "Who needs some motivation today? Sending good vibes your way! 🌟",
        "Anyone else believe that we're all capable of amazing things? 💪",
        "What keeps you going when things get challenging? Share your secrets! 🔥",
        "Who else thinks celebrating progress is just as important as reaching goals? 🎊"
      ],
      educational: [
        "Lifelong learners - what's the most surprising thing you've discovered lately? �",
        "Anyone else love those 'aha!' moments when something clicks? 💡",
        "What's the best piece of knowledge that changed how you see things? 🧠",
        "Who else thinks learning never gets old? Always growing! 🌱"
      ]
    };
    
    const template = facebookTemplates[Math.floor(Math.random() * facebookTemplates.length)];
    const questions = communityQuestions[type] || communityQuestions.lifestyle;
    const question = questions[Math.floor(Math.random() * questions.length)];
    
    // Add content description if different from title
    const contentDescription = content.content && content.content !== content.title ? 
      `\n\nHere's what caught my attention: ${content.content.slice(0, 200)}${content.content.length > 200 ? '...' : ''}` : '';
    
    // Include source attribution when available
    const sourceAttribution = content.source ? `\n\n📚 Originally found this at: ${content.source}` : '';
    const urlLink = content.url ? `\n\n🔗 Check it out yourself: ${content.url}` : '';
    
    return `${template}${contentDescription}

${question}

Would love to hear your thoughts in the comments - this community always has the best insights! �${sourceAttribution}${urlLink}

#community #${type} #${season.toLowerCase()}discoveries #lifesharing`;
  };
  
  // Basic fallback variations as a final safety net
  const generateBasicFallbackVariations = (content, type) => {
    const variations = {
      instagram: {},
      linkedin: {},
      facebook: {}
    };
    
    // Natural fallback variations as backup
    const instagramFallbacks = [
      `Just discovered something incredible: ${content.title}! ✨\n\nThis completely changed my perspective 🙌\n\nWho else has experience with this?\n\n#discovery #${type} #inspiration`,
      `Sharing this gem because it's too good to keep to myself: ${content.title}! �\n\nSometimes the best finds come when you least expect them ✨\n\n#${type} #lifehacks #community`,
      `Found this and couldn't stop thinking about it: ${content.title}! 🤯\n\nAnyone else love discovering new perspectives?\n\n#mindblown #${type} #growth`
    ];
    
    const linkedinFallbacks = [
      `Valuable insight worth sharing: ${content.title}\n\nIn my experience, the best discoveries often come from staying curious and open to new ideas. This is one of those moments.\n\nWhat insights have surprised you lately?\n\n#professional #learning #${type}`,
      `Recently came across: ${content.title}\n\nThis serves as a great reminder that innovation often comes from unexpected places. Worth considering for anyone in our field.\n\n#insights #${type} #networking`,
      `Thought leadership moment: ${content.title}\n\nThis reinforces my belief that continuous learning drives success. Sharing with my network because great ideas deserve wider reach.\n\n#leadership #${type} #growth`
    ];
    
    const facebookFallbacks = [
      `Friends, had to share this discovery: ${content.title}! 🌟\n\nSometimes you come across something that just makes sense, you know?\n\nAnyone else have similar finds they want to share?\n\n#community #${type} #lifesharing`,
      `Quick share for my community: ${content.title}! 💕\n\nThis is exactly the kind of thing that makes my day better!\n\nWhat discoveries have brightened your week?\n\n#friends #${type} #positivity`,
      `Community wisdom drop: ${content.title}! 🎯\n\nLove how the best insights often come from the most unexpected places!\n\nWho else believes in the power of shared knowledge?\n\n#wisdom #${type} #together`
    ];
    
    variations.instagram[type] = instagramFallbacks[Math.floor(Math.random() * instagramFallbacks.length)];
    variations.linkedin[type] = linkedinFallbacks[Math.floor(Math.random() * linkedinFallbacks.length)];
    variations.facebook[type] = facebookFallbacks[Math.floor(Math.random() * facebookFallbacks.length)];
    
    return variations;
  };

  // Content validation function to ensure quality
  const validatePostContent = (post, platform) => {
    if (!post || typeof post !== 'string') {
      return { isValid: false, issues: ['Post content is empty or invalid'] };
    }
    
    const issues = [];
    const warnings = [];
    
    // Basic structure validation
    if (post.length < 50) {
      issues.push('Post is too short for meaningful engagement');
    }
    
    if (post.length > 2000) {
      warnings.push('Post might be too long for optimal engagement');
    }
    
    // Check for broken placeholder patterns
    const brokenPatterns = [
      /\$\{[^}]+\}/g, // Unresolved template literals
      /undefined/gi,
      /null/gi,
      /\[object Object\]/gi,
      /NaN/gi
    ];
    
    brokenPatterns.forEach(pattern => {
      if (pattern.test(post)) {
        issues.push(`Contains unresolved template or broken content: ${pattern}`);
      }
    });
    
    // Check for nonsensical sentence construction
    const nonsensicalPatterns = [
      /\w+ hits different when you \w+/gi, // "cooking hits different when you..."
      /\w+ cooking hits different/gi,
      /when you discover \$\{/gi,
      /\w+ game is \w+ this/gi // Incomplete sentences
    ];
    
    nonsensicalPatterns.forEach(pattern => {
      if (pattern.test(post)) {
        issues.push('Contains potentially nonsensical sentence construction');
      }
    });
    
    // Platform-specific validation
    if (platform === 'linkedin') {
      if (!post.includes('#')) {
        warnings.push('LinkedIn posts typically perform better with hashtags');
      }
      if (!/\?/.test(post)) {
        warnings.push('LinkedIn posts often benefit from engagement questions');
      }
    }
    
    if (platform === 'instagram') {
      const hashtagCount = (post.match(/#\w+/g) || []).length;
      if (hashtagCount < 3) {
        warnings.push('Instagram posts typically benefit from more hashtags (3-10)');
      }
    }
    
    // Check for complete sentences
    const sentences = post.split(/[.!?]+/).filter(s => s.trim().length > 5);
    const incompleteSentences = sentences.filter(sentence => {
      const words = sentence.trim().split(/\s+/).filter(word => word.length > 0);
      return words.length < 3; // Very short "sentences" might be incomplete
    });
    
    if (incompleteSentences.length > 0) {
      warnings.push('Contains potentially incomplete sentences');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      wordCount: post.split(/\s+/).length,
      characterCount: post.length,
      hashtagCount: (post.match(/#\w+/g) || []).length,
      score: Math.max(0, 100 - (issues.length * 25) - (warnings.length * 5))
    };
  };

  // Generate detailed, influencer-style content for each type
  const generateDetailedContentByType = (contentType, dayName, date, weekNumber, dayIndex) => {
    const contentLibrary = {
      recipes: [
        {
          title: "15-Minute Mediterranean Power Bowl",
          content: "This game-changing bowl has become my go-to when I need something nutritious but don't have time to cook. Quinoa, roasted chickpeas, cucumber, cherry tomatoes, feta, and my signature tahini dressing. The secret? Meal prepping the components on Sunday so you can literally throw this together in minutes during busy weekdays.",
          ingredients: "quinoa, chickpeas, cucumber, cherry tomatoes, feta cheese, tahini, lemon juice, olive oil",
          tips: "Toast the quinoa before cooking for extra nutty flavor. Make the dressing in bulk - it keeps for 2 weeks!",
          nutrition: "High in plant protein, healthy fats, and fiber. Perfect post-workout fuel."
        },
        {
          title: "Comfort Food Makeover: Creamy Mushroom Risotto",
          content: "Y'all asked for healthier comfort food, so here's my lightened-up risotto that doesn't sacrifice any of that creamy, soul-warming goodness. Using cauliflower rice mixed with arborio rice cuts calories while adding nutrients, and nutritional yeast brings that umami depth.",
          ingredients: "arborio rice, cauliflower rice, mushrooms, onion, garlic, vegetable broth, nutritional yeast, white wine",
          tips: "The key is patience - stir constantly and add broth slowly. Trust the process!",
          nutrition: "50% fewer calories than traditional risotto, packed with B-vitamins from nutritional yeast."
        },
        {
          title: "Viral TikTok Protein Pancakes (But Make Them Actually Good)",
          content: "Okay, I tried those viral protein pancakes and they were... not it. So I spent weeks perfecting this recipe that actually tastes like pancakes while sneaking in 25g of protein. The secret ingredients? Greek yogurt and a touch of vanilla protein powder.",
          ingredients: "oats, Greek yogurt, eggs, vanilla protein powder, banana, cinnamon, baking powder",
          tips: "Let the batter rest for 5 minutes before cooking - it makes them fluffier!",
          nutrition: "25g protein, naturally gluten-free, and satisfying enough to keep you full until lunch."
        }
      ],
      workouts: [
        {
          title: "Morning Movement: 20-Minute Energy Boost Routine",
          content: "This is the exact routine that transformed my mornings from sluggish to superhuman. No equipment needed, just your body and 20 minutes. I've been doing this for 6 months and the energy it gives me lasts ALL DAY. The secret is the specific sequence - it activates your nervous system and gets blood flowing to all the right places.",
          exercises: "dynamic warm-up, bodyweight squats, push-ups, mountain climbers, plank variations, stretching flow",
          benefits: "Boosts metabolism, improves mood, increases energy, enhances focus",
          tips: "Do this before coffee for maximum effect. Your body will thank you!"
        },
        {
          title: "Desk Warrior Workout: Combat the 9-5 Slump",
          content: "Calling all my desk job friends! This workout is designed specifically for those of us who sit all day. It targets the muscles that get tight and weak from prolonged sitting, and you can literally do it in your office clothes. I do this during my lunch break 3x a week.",
          exercises: "hip flexor stretches, shoulder blade squeezes, wall push-ups, calf raises, spinal twists",
          benefits: "Reduces back pain, improves posture, combats afternoon fatigue, increases productivity",
          tips: "Set a reminder to do this every 2 hours during your workday. Small consistent actions = big results!"
        },
        {
          title: "HIIT Different: Low-Impact High Intensity",
          content: "Who said HIIT has to destroy your joints? This low-impact version gives you all the cardiovascular and metabolic benefits without the jumping and pounding. Perfect for apartment dwellers, people with joint issues, or anyone who wants effective workouts without the high impact.",
          exercises: "marching in place, arm circles, modified burpees, wall sits, resistance band exercises",
          benefits: "Burns calories, improves cardiovascular health, builds strength, joint-friendly",
          tips: "Focus on intensity through speed and resistance, not impact. Quality over quantity!"
        }
      ],
      motivational: [
        {
          title: "The 5AM Club Changed My Life (And It Might Change Yours)",
          content: "I used to be a night owl who hit snooze 6 times every morning. Then I read about the 5AM club and thought 'absolutely not.' But after trying it for 30 days, I'm never going back. The quiet hours before the world wakes up have become my sacred time for growth, planning, and peace.",
          insights: "Early mornings aren't about productivity - they're about reclaiming your power before life gets chaotic.",
          tips: "Start with 6AM, then gradually move earlier. The transition is everything.",
          impact: "Increased focus, better mood, more accomplished goals, deeper sense of control over my day."
        },
        {
          title: "Stop Waiting for Monday: The Power of Starting Now",
          content: "How many times have you said 'I'll start Monday'? I used to be the queen of Monday starts until I realized Monday never feels different than Tuesday. The magic happens when you start right now, in this imperfect moment, with whatever you have available.",
          insights: "Perfect timing is a myth. Imperfect action beats perfect inaction every single time.",
          tips: "Choose one small action you can take in the next 5 minutes. Do that instead of planning for Monday.",
          impact: "Builds momentum, creates confidence, proves to yourself that you can follow through."
        },
        {
          title: "Your Comfort Zone is Keeping You Comfortable (And Small)",
          content: "Comfort zones aren't evil - they're necessary for rest and recovery. But living there permanently? That's where dreams go to die. I spent years playing it safe until I realized that the discomfort of growth is temporary, but the regret of not trying lasts forever.",
          insights: "Growth lives in the space between 'I can't do this' and 'I did it.' That space is uncomfortable for a reason.",
          tips: "Start with micro-challenges. Say yes to one thing that scares you this week.",
          impact: "Expanded confidence, new opportunities, proof that you're capable of more than you think."
        }
      ],
      educational: [
        {
          title: "The Science of Sleep: Why Your Brain Needs 7-9 Hours",
          content: "Your brain literally cleans itself while you sleep. During deep sleep, your glymphatic system flushes out toxins and waste products that build up during the day. This includes amyloid-beta, the protein linked to Alzheimer's disease. Poor sleep isn't just about feeling tired - it's about long-term brain health.",
          science: "During sleep, brain cells shrink by 60%, creating space for cerebrospinal fluid to wash away metabolic waste.",
          tips: "Cool room (65-68°F), dark environment, no screens 1 hour before bed, consistent sleep schedule.",
          sources: "Research from University of Rochester, published in Science journal."
        },
        {
          title: "Neuroplasticity: Your Brain Can Change at Any Age",
          content: "The old belief that adult brains are fixed? Completely false. Neuroplasticity research shows that our brains continue forming new neural pathways throughout life. Every time you learn something new, practice a skill, or challenge your thinking, you're literally reshaping your brain structure.",
          science: "London taxi drivers have enlarged hippocampi from memorizing city streets. Musicians have enhanced motor cortexes.",
          tips: "Learn a new language, play an instrument, practice meditation, challenge yourself with puzzles.",
          sources: "Studies from Harvard Medical School, University College London."
        },
        {
          title: "The Gut-Brain Connection: How Your Microbiome Affects Mood",
          content: "95% of your serotonin is produced in your gut, not your brain. Your gut bacteria communicate directly with your brain via the vagus nerve, influencing mood, anxiety, and decision-making. This is why you get 'gut feelings' and why stress affects digestion.",
          science: "The gut contains 500 million neurons - more than the spinal cord. It's called the 'second brain' for good reason.",
          tips: "Eat fermented foods, reduce sugar, manage stress, include prebiotic fiber, consider probiotic supplements.",
          sources: "Research from Harvard T.H. Chan School of Public Health, Johns Hopkins Medicine."
        }
      ]
    };

    // Get content from library or generate new content
    const typeLibrary = contentLibrary[contentType] || contentLibrary.motivational;
    const selectedContent = typeLibrary[dayIndex % typeLibrary.length];
    
    // Add variety based on day and week
    const dayVariations = {
      sunday: "Sunday Reset",
      monday: "Monday Motivation", 
      tuesday: "Transformation Tuesday",
      wednesday: "Wisdom Wednesday",
      thursday: "Throwback Thursday",
      friday: "Feel-Good Friday",
      saturday: "Saturday Vibes"
    };
    
    const weekVariation = weekNumber > 0 ? ` (Week ${weekNumber + 1})` : '';
    
    return {
      ...selectedContent,
      title: `${dayVariations[dayName]}: ${selectedContent.title}${weekVariation}`,
      dayTheme: dayVariations[dayName],
      weekNumber: weekNumber + 1,
      date: date.toISOString().split('T')[0]
    };
  };

  // Generate rich, platform-specific variations
  const generateRichPlatformVariations = (content, contentType, dayName) => {
    const currentSeason = getCurrentSeason();
    const dayEmojis = {
      sunday: '🌅', monday: '💪', tuesday: '🔥', wednesday: '💡', 
      thursday: '✨', friday: '🎉', saturday: '🌟'
    };
    
    const platformVariations = {
      instagram: generateInstagramPost(content, contentType, dayName, dayEmojis[dayName], currentSeason),
      linkedin: generateLinkedInPost(content, contentType, dayName, currentSeason),
      facebook: generateFacebookPost(content, contentType, dayName, currentSeason)
    };
    
    return platformVariations;
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  const generateInstagramPost = (content, contentType, dayName, emoji, season) => {
    const personalTouches = [
      "Honestly, this changed my entire perspective",
      "I wish I had known this years ago",
      "This has been a game-changer for me",
      "Can't stop thinking about this",
      "Had to share this with you all",
      "This hit different today"
    ];
    
    const engagementHooks = [
      "Save this for later!",
      "Share with someone who needs this",
      "Tag a friend who would love this",
      "Drop a ❤️ if you agree",
      "Comment your thoughts below",
      "Which part resonates most with you?"
    ];
    
    const platformSpecificHashtags = {
      recipes: '#foodie #healthyeating #mealprep #nutrition #homecooking #wellness #food #healthy #recipe #cooking #plantbased #wholefood #cleaneating #foodlover #healthyfood #kitchenlife #nourishyourbody #eatwell #foodblog #realfood',
      workouts: '#fitness #workout #motivation #wellness #strong #fitfam #exercise #health #movement #selfcare #fitnessmotivation #trainhard #gymlife #workoutmotivation #fitnessjourney #healthylifestyle #getstrong #moveyourbody #fitnessgoals #sweatlife',
      motivational: '#motivation #mindset #growth #inspiration #selfcare #positivity #mentalhealth #goals #wellness #life #personaldevelopment #mindfulness #growthmindset #selfimprovement #lifequotes #inspirationalquotes #mentalhealthawareness #selfworth #empowerment #successmindset',
      educational: '#learning #knowledge #wellness #health #science #facts #education #growth #mindful #awareness #healthfacts #didyouknow #healthscience #educationalcontent #learnwithme #healthtips #brainfood #personalgrowthtips #healthylifestyle #wellnesswisdom'
    };
    
    const hook = personalTouches[Math.floor(Math.random() * personalTouches.length)];
    const cta = engagementHooks[Math.floor(Math.random() * engagementHooks.length)];
    const hashtags = platformSpecificHashtags[contentType] || platformSpecificHashtags.motivational;
    
    let post = `${emoji} ${content.title}\n\n${hook}! ${content.content}`;
    
    // Add content-specific details
    if (content.tips) {
      post += `\n\n💡 Pro tip: ${content.tips}`;
    }
    if (content.benefits) {
      post += `\n\n✨ Benefits: ${content.benefits}`;
    }
    if (content.insights) {
      post += `\n\n🎯 Key insight: ${content.insights}`;
    }
    
    post += `\n\n${cta}\n\n${hashtags}`;
    
    return post;
  };

  const generateLinkedInPost = (content, contentType, dayName, season) => {
    const professionalFrameworks = {
      recipes: "Workplace wellness starts with what we fuel our bodies with.",
      workouts: "Physical fitness directly impacts professional performance and leadership capacity.", 
      motivational: "Mindset shifts that transform not just personal life, but professional impact.",
      educational: "Continuous learning is the competitive advantage that never gets outdated."
    };
    
    const businessConnections = {
      recipes: "When we prioritize nutrition, we show up more focused, energized, and ready for complex decision-making.",
      workouts: "The discipline built through fitness translates directly to business discipline and resilience.",
      motivational: "The most successful leaders I know invest as much in their mindset as they do in their business strategy.",
      educational: "In our rapidly changing economy, the ability to learn and adapt isn't optional—it's essential."
    };
    
    const linkedInHashtags = {
      recipes: '#leadership #wellness #nutrition #productivity #workplacehealth #executivewellness #performance #healthylifestyle #professionaldevelopment #worklifebalance',
      workouts: '#leadership #fitness #productivity #wellness #performance #executivehealth #resilience #discipline #professionaldevelopment #workoutmotivation',
      motivational: '#leadership #mindset #motivation #growth #success #professionaldevelopment #resilience #inspiration #careeradvice #executivemindset',
      educational: '#learning #professionaldevelopment #growth #leadership #knowledge #innovation #careeradvice #skillsdevelopment #continuouslearning #expertise'
    };
    
    const framework = professionalFrameworks[contentType] || professionalFrameworks.motivational;
    const connection = businessConnections[contentType] || businessConnections.motivational;
    const hashtags = linkedInHashtags[contentType] || linkedInHashtags.motivational;
    
    let post = `${content.title}\n\n${framework}\n\n${content.content}\n\n${connection}`;
    
    // Add professional insights
    if (content.science) {
      post += `\n\nThe research: ${content.science}`;
    }
    if (content.impact) {
      post += `\n\nReal-world impact: ${content.impact}`;
    }
    
    post += `\n\nWhat's one insight from this that you'd apply to your work or leadership?\n\n${hashtags}`;
    
    return post;
  };

  const generateFacebookPost = (content, contentType, dayName, season) => {
    const conversationalStarters = [
      "Okay friends, can we talk about this for a second?",
      "Y'all, I had to share this because it's been on my mind all week.",
      "Real talk - this completely shifted how I think about things.",
      "I've been wanting to have this conversation with you all.",
      "Can I share something that's been a total game-changer?",
      "Let's dive into something that's been fascinating me lately."
    ];
    
    const communityQuestions = [
      "Has anyone else experienced this?",
      "What are your thoughts on this?",
      "Who else can relate to this?",
      "What's been your experience with this?",
      "Am I the only one who finds this fascinating?",
      "What would you add to this conversation?"
    ];
    
    const facebookHashtags = {
      recipes: '#healthyeating #familymeals #cooking #nutrition #foodie #wellness #homecooking #healthyfood #mealprep #kitchentips',
      workouts: '#fitness #wellness #healthylifestyle #exercise #motivation #selfcare #strong #fitfam #workout #movement',
      motivational: '#motivation #inspiration #mindset #positivity #selfcare #growth #mentalhealth #wellness #personaldevelopment #mindfulness',
      educational: '#learning #knowledge #health #wellness #education #facts #science #personalgrowth #mindful #awareness'
    };
    
    const starter = conversationalStarters[Math.floor(Math.random() * conversationalStarters.length)];
    const question = communityQuestions[Math.floor(Math.random() * communityQuestions.length)];
    const hashtags = facebookHashtags[contentType] || facebookHashtags.motivational;
    
    let post = `${starter}\n\n${content.title}\n\n${content.content}`;
    
    // Add community-building elements
    if (content.tips) {
      post += `\n\nHere's what I've learned: ${content.tips}`;
    }
    if (content.benefits) {
      post += `\n\nWhy this matters: ${content.benefits}`;
    }
    
    post += `\n\n${question} Drop a comment below - I love hearing your perspectives! 💬\n\n${hashtags}`;
    
    return post;
  };

  const generateWeeklyContent = async () => {
    console.log('🔥 DEBUG: generateWeeklyContent function called!');
    setIsGenerating(true);
    console.log('🔥 DEBUG: isGenerating set to true');
    
    try {
      console.log(`🚀 Starting enhanced ${numberOfWeeks}-week content generation in ${generationMode} mode...`);
      const allWeeksContent = [];
      const today = new Date();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      // Generate content for multiple weeks
      for (let weekNumber = 0; weekNumber < numberOfWeeks; weekNumber++) {
        console.log(`📅 Generating Week ${weekNumber + 1} of ${numberOfWeeks}...`);
        
        let weekStart;
        
        if (generationMode === 'calendar') {
          // Standard Sunday-Saturday calendar week
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          weekStart = today.getDay() === 0 ? 
            new Date(startOfWeek.getTime() + (weekNumber * 7 * 24 * 60 * 60 * 1000)) : 
            new Date(startOfWeek.getTime() + ((weekNumber + 1) * 7 * 24 * 60 * 60 * 1000));
          console.log(`📅 Calendar Mode - Week ${weekNumber + 1}: ${weekStart.toLocaleDateString()} - ${new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
        } else {
          // Next day mode - start from tomorrow + weeks offset for 7 days
          weekStart = new Date(today);
          weekStart.setDate(today.getDate() + 1 + (weekNumber * 7));
          const endDate = new Date(weekStart);
          endDate.setDate(weekStart.getDate() + 6);
          console.log(`🗓️ Next Day Mode - Week ${weekNumber + 1}: ${weekStart.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
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
        
        // Generate content for each day of this week
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
        
        // Generate rich, detailed content specific to each content type and day
        if (availableContent[contentType] && availableContent[contentType].length > 0) {
          content = availableContent[contentType][Math.floor(Math.random() * availableContent[contentType].length)];
        } else {
          // Generate detailed, influencer-style content for each type
          content = generateDetailedContentByType(contentType, dayName, date, weekNumber, i);
        }

        console.log(`📝 Generating enhanced ${contentType} content for ${dayName}:`, content.title);
        
        // Generate platform-specific variations with rich content
        const platformVariations = generateRichPlatformVariations(content, contentType, dayName);
        
        const postData = {
          id: Date.now() + i + Math.random() * 1000,
          date: date.toISOString().split('T')[0],
          dayName: dayName,
          contentType,
          content,
          platforms: ['instagram', 'linkedin', 'facebook'],
          status: 'draft',
          variations: platformVariations
        };

          allWeeksContent.push(postData);
        }
        
        console.log(`✅ Generated 7 posts for Week ${weekNumber + 1}`);
      }
      
      console.log(`✅ Generated ${allWeeksContent.length} total posts for ${numberOfWeeks} week(s)`);
      console.log('📅 Updating content calendar with:', allWeeksContent);
      setContentCalendar(allWeeksContent);
      console.log('🔧 DEBUG: setContentCalendar called with array length:', allWeeksContent.length);
      
      // Force a state update check
      setTimeout(() => {
        console.log('🔧 DEBUG: Delayed check - contentCalendar should now be updated');
      }, 100);
      
    } catch (error) {
      console.error('Error generating enhanced weekly content:', error);
      
      // Fallback to basic generation if AI fails
      const allWeeksFallback = [];
      const today = new Date();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      // Generate fallback content for multiple weeks
      for (let weekNumber = 0; weekNumber < numberOfWeeks; weekNumber++) {
        let weekStart;
        if (generationMode === 'calendar') {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          weekStart = today.getDay() === 0 ? 
            new Date(startOfWeek.getTime() + (weekNumber * 7 * 24 * 60 * 60 * 1000)) : 
            new Date(startOfWeek.getTime() + ((weekNumber + 1) * 7 * 24 * 60 * 60 * 1000));
          console.log(`📅 Fallback Calendar Mode - Week ${weekNumber + 1}: ${weekStart.toLocaleDateString()} - ${new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
        } else {
          weekStart = new Date(today);
          weekStart.setDate(today.getDate() + 1 + (weekNumber * 7));
          const endDate = new Date(weekStart);
          endDate.setDate(weekStart.getDate() + 6);
          console.log(`🗓️ Fallback Next Day Mode - Week ${weekNumber + 1}: ${weekStart.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
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

        allWeeksFallback.push(postData);
      }
      
      console.log(`✅ Fallback generated 7 posts for Week ${weekNumber + 1}`);
    }
      
      console.log('📅 Fallback: Updating content calendar with:', allWeeksFallback);
      setContentCalendar(allWeeksFallback);
      console.log('🔧 DEBUG: Fallback setContentCalendar called with array length:', allWeeksFallback.length);
    }
    
    console.log('🔄 Generation complete, setting isGenerating to false');
    setIsGenerating(false);
  };

  const copyToClipboard = (text, platform) => {
    navigator.clipboard.writeText(text);
    alert(`${platform} content copied!`);
  };

  // Add content to specific day
  const addContentToDay = (day, content) => {
    setDayContent(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), content]
    }));
  };

  // Generate AI content for specific day
  const generateDayAIContent = async (day) => {
    const selectedTopic = dayTopicSelections[day];
    // Use existing generateAIContent function with the selected topic
    try {
      const generatedContent = await generateAIContent(selectedTopic, {
        title: `AI Generated ${selectedTopic} for ${day}`,
        content: `Dynamic ${selectedTopic} content`
      });
      
      const newContent = {
        id: Date.now(),
        title: `AI Generated ${selectedTopic}`,
        content: generatedContent,
        topic: selectedTopic,
        day: day
      };
      
      // Add to day content for the day tabs
      addContentToDay(day, newContent);
      
      // Also add to content calendar for dashboard calendar view
      const today = new Date();
      const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day);
      const targetDate = new Date(today);
      
      // Calculate the next occurrence of this day
      const currentDayIndex = today.getDay();
      let daysToAdd = dayIndex - currentDayIndex;
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Next week if the day has already passed this week
      }
      targetDate.setDate(today.getDate() + daysToAdd);
      
      const calendarPost = {
        id: Date.now() + Math.random(),
        date: targetDate.toISOString().split('T')[0],
        dayName: day,
        contentType: selectedTopic,
        content: {
          title: newContent.title,
          content: generatedContent,
          description: `AI Generated ${selectedTopic} content for ${day}`
        },
        platforms: ['instagram', 'linkedin', 'facebook'],
        status: 'draft',
        variations: {
          instagram: generatedContent,
          linkedin: generatedContent,
          facebook: generatedContent
        }
      };
      
      setContentCalendar(prev => [...prev, calendarPost]);
      console.log(`✅ Generated AI content for ${day} and added to calendar:`, newContent);
      console.log(`📅 Calendar post scheduled for ${targetDate.toLocaleDateString()}`);
    } catch (error) {
      console.error(`❌ Error generating AI content for ${day}:`, error);
    }
  };

  // Delete/discard a generated post from the calendar
  const deleteGeneratedPost = (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to discard this generated post? This action cannot be undone.');
    if (confirmDelete) {
      setContentCalendar(prevCalendar => prevCalendar.filter(post => post.id !== postId));
      console.log(`🗑️ Deleted post with ID: ${postId}`);
    }
  };

  // Topic Bank Functions
  const addToTopicBank = (topic, postData) => {
    const newPost = {
      id: Date.now() + Math.random(),
      title: postData.title,
      content: postData.content,
      description: postData.description || '',
      tags: postData.tags || '',
      createdAt: new Date().toISOString(),
      status: 'banked'
    };
    
    setTopicBank(prev => ({
      ...prev,
      [topic]: [...(prev[topic] || []), newPost]
    }));
    
    console.log(`🏦 Added post to topic bank: ${topic}`, newPost);
  };
  
  const removeFromTopicBank = (topic, postId) => {
    setTopicBank(prev => ({
      ...prev,
      [topic]: prev[topic].filter(post => post.id !== postId)
    }));
    
    console.log(`🗑️ Removed post from topic bank: ${topic} - ${postId}`);
  };
  
  const movePostFromTopicBank = (topic, postId, targetDay = null) => {
    const post = topicBank[topic].find(p => p.id === postId);
    if (post) {
      // If no target day specified, use current active tab (if it's a day)
      const dayToUse = targetDay || (activeTab !== 'dashboard' ? activeTab : 'monday');
      
      // Add to day content
      addContentToDay(dayToUse, {
        ...post,
        id: Date.now(), // New ID for active content
        usedFrom: 'topicBank'
      });
      
      console.log(`📤 Used post from topic bank: ${topic} → ${dayToUse}`, post);
    }
  };

  // Handle URL fetch for topic bank
  const handleBankUrlFetch = async (url) => {
    if (!url.trim()) {
      setBankInputs({ ...bankInputs, urlError: 'Please enter a valid URL' });
      return;
    }

    setBankInputs({ ...bankInputs, isUrlLoading: true, urlError: null });

    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=false&video=false`);
      const data = await response.json();

      if (data.status === 'success' && data.data) {
        const { title, description, image } = data.data;
        
        setBankInputs({
          ...bankInputs,
          title: title || 'Untitled',
          content: description || `Content from: ${url}`,
          tags: extractTagsFromUrl(url),
          isUrlLoading: false,
          urlError: null
        });
      } else {
        // Fallback to intelligent content generation
        const fallbackContent = generateIntelligentFallback(url, data.data);
        setBankInputs({
          ...bankInputs,
          title: fallbackContent.title,
          content: fallbackContent.content,
          tags: fallbackContent.tags,
          isUrlLoading: false,
          urlError: null
        });
      }
    } catch (error) {
      console.error('URL fetch error:', error);
      // Generate intelligent fallback on error
      const fallbackContent = generateIntelligentFallback(url, null);
      setBankInputs({
        ...bankInputs,
        title: fallbackContent.title,
        content: fallbackContent.content,
        tags: fallbackContent.tags,
        isUrlLoading: false,
        urlError: null
      });
    }
  };

  // Extract tags from URL for topic bank
  const extractTagsFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Domain-specific tag suggestions
      const domainTags = {
        'youtube.com': 'video, tutorial',
        'youtu.be': 'video, tutorial',
        'instagram.com': 'social, visual',
        'pinterest.com': 'inspiration, visual',
        'medium.com': 'article, blog',
        'substack.com': 'newsletter, article',
        'github.com': 'code, development',
        'stackoverflow.com': 'programming, help',
        'wikipedia.org': 'reference, facts',
        'reddit.com': 'discussion, community',
        'twitter.com': 'social, news',
        'x.com': 'social, news',
        'linkedin.com': 'professional, business',
        'tiktok.com': 'video, entertainment',
        'amazon.com': 'product, shopping',
        'etsy.com': 'handmade, creative'
      };

      for (const [domainKey, tags] of Object.entries(domainTags)) {
        if (domain.includes(domainKey)) {
          return tags;
        }
      }

      return `${selectedBankTopic}, link`;
    } catch (error) {
      return `${selectedBankTopic}, link`;
    }
  };

  // Intelligent fallback content generator for failed URL fetches
  const generateIntelligentFallback = (url, urlInfo) => {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Domain-specific intelligent fallbacks
      const domainInsights = {
        'medium.com': {
          type: 'article',
          title: 'Thought-Provoking Article',
          description: 'An insightful piece that challenges conventional thinking and offers fresh perspectives.',
          themes: ['business', 'lifestyle', 'education'],
          sentiment: 'positive'
        },
        'linkedin.com': {
          type: 'professional',
          title: 'Professional Insight',
          description: 'Industry expertise and career wisdom from experienced professionals.',
          themes: ['business', 'education'],
          sentiment: 'positive'
        },
        'harvard.edu': {
          type: 'research',
          title: 'Research-Based Insights',
          description: 'Evidence-based findings from academic research that inform better decision-making.',
          themes: ['education', 'business'],
          sentiment: 'neutral'
        },
        'youtube.com': {
          type: 'video',
          title: 'Educational Video Content',
          description: 'Engaging visual content that simplifies complex topics and inspires action.',
          themes: ['education', 'motivational'],
          sentiment: 'positive'
        },
        'github.com': {
          type: 'technical',
          title: 'Technical Innovation',
          description: 'Cutting-edge development and technological solutions for modern challenges.',
          themes: ['tech', 'education'],
          sentiment: 'positive'
        }
      };
      
      // Check for domain match
      let fallback = null;
      for (const [domainPattern, content] of Object.entries(domainInsights)) {
        if (domain.includes(domainPattern)) {
          fallback = { ...content };
          break;
        }
      }
      
      // Generic fallback based on URL structure
      if (!fallback) {
        const hasYear = /20\d{2}/.test(url);
        const hasArticleWords = /article|post|blog|story|news|guide|tip|hack/.test(url.toLowerCase());
        const hasBusinessWords = /business|startup|entrepreneur|company|strategy/.test(url.toLowerCase());
        const hasTechWords = /tech|development|programming|software|app/.test(url.toLowerCase());
        
        if (hasArticleWords || hasYear) {
          fallback = {
            type: 'article',
            title: 'Valuable Content Discovery',
            description: 'An informative piece that provides practical insights and actionable advice.',
            themes: ['lifestyle', 'education'],
            sentiment: 'positive'
          };
        } else if (hasBusinessWords) {
          fallback = {
            type: 'business',
            title: 'Business Strategy Insights',
            description: 'Strategic thinking and business wisdom for professional growth.',
            themes: ['business', 'education'],
            sentiment: 'positive'
          };
        } else if (hasTechWords) {
          fallback = {
            type: 'tech',
            title: 'Technology Innovation',
            description: 'Technical insights and innovation that shape the future.',
            themes: ['tech', 'education'],
            sentiment: 'positive'
          };
        } else {
          fallback = {
            type: 'general',
            title: 'Interesting Discovery',
            description: 'A fascinating find that broadens perspectives and sparks curiosity.',
            themes: ['lifestyle', 'motivational'],
            sentiment: 'positive'
          };
        }
      }
      
      // Generate intelligent title variations
      const titleVariations = [
        `${fallback.title} Worth Exploring`,
        `Discovering ${fallback.title}`,
        `${fallback.title} That Matters`,
        `Essential ${fallback.title}`,
        `${fallback.title} for Growth`
      ];
      
      const intelligentTitle = titleVariations[Math.floor(Math.random() * titleVariations.length)];
      
      // Enhanced fallback with URL info
      return {
        title: urlInfo.title || intelligentTitle,
        description: fallback.description,
        originalDescription: fallback.description,
        articleContent: fallback.description,
        keyInsights: [`This content offers ${fallback.type} insights that can enhance your understanding.`],
        contentLength: fallback.description.length,
        hasRichContent: true,
        contentAnalysis: {
          insights: [{ text: `Valuable ${fallback.type} content for personal growth.`, types: ['insight'] }],
          themes: fallback.themes,
          sentiment: fallback.sentiment,
          readingLevel: 'intermediate',
          statistics: [],
          keyQuotes: [],
          actionItems: [`Explore this ${fallback.type} content for new perspectives.`]
        },
        themes: fallback.themes,
        sentiment: fallback.sentiment,
        readingLevel: 'intermediate',
        statistics: [],
        keyQuotes: [],
        actionItems: [`Explore this ${fallback.type} content for new perspectives.`],
        usedProxy: 'intelligent-fallback',
        domain: domain,
        url: url,
        source: domain,
        isFallback: true,
        fallbackReason: 'URL fetch failed - generated intelligent content based on domain and URL structure'
      };
      
    } catch (error) {
      console.warn('⚠️ Fallback generation failed, using basic fallback:', error.message);
      
      // Ultra-safe basic fallback
      return {
        title: urlInfo.title || 'Interesting Content Discovery',
        description: 'A valuable resource that offers fresh insights and perspectives worth exploring.',
        originalDescription: 'Generated content',
        articleContent: 'A valuable resource that offers fresh insights and perspectives worth exploring.',
        keyInsights: ['This content provides valuable insights for personal growth.'],
        contentLength: 85,
        hasRichContent: false,
        contentAnalysis: {
          insights: [{ text: 'This content provides valuable insights for personal growth.', types: ['insight'] }],
          themes: ['lifestyle'],
          sentiment: 'positive',
          readingLevel: 'basic',
          statistics: [],
          keyQuotes: [],
          actionItems: ['Explore this content for new perspectives.']
        },
        themes: ['lifestyle'],
        sentiment: 'positive',
        readingLevel: 'basic',
        statistics: [],
        keyQuotes: [],
        actionItems: ['Explore this content for new perspectives.'],
        usedProxy: 'basic-fallback',
        domain: 'unknown',
        url: url,
        source: 'Generated',
        isFallback: true,
        fallbackReason: 'Complete fetch failure - using basic generated content'
      };
    }
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

          // Enhanced error handling for different HTTP status codes
          if (response.status === 404) {
            console.warn(`🚫 ${proxy.name}: URL not found (404) - ${url}`);
            continue; // Try next proxy
          } else if (response.status === 403) {
            console.warn(`🔒 ${proxy.name}: Access forbidden (403) - may need different proxy`);
            continue; // Try next proxy
          } else if (response.status === 429) {
            console.warn(`⏰ ${proxy.name}: Rate limited (429) - trying next proxy`);
            continue; // Try next proxy
          } else if (!response.ok) {
            console.warn(`❌ ${proxy.name}: HTTP error ${response.status} - ${response.statusText}`);
            continue; // Try next proxy
          }

          // Handle different response formats with enhanced error handling
          try {
            if (proxy.name.includes('allorigins') && !proxy.name.includes('raw')) {
              const jsonResponse = await response.json();
              htmlContent = jsonResponse.contents || jsonResponse.data || '';
              
              // Check if AllOrigins detected an error from the target site
              if (jsonResponse.status && jsonResponse.status.http_code === 404) {
                console.warn(`🚫 AllOrigins reports 404 for target URL: ${url}`);
                continue; // Try next proxy
              } else if (jsonResponse.status && jsonResponse.status.http_code >= 400) {
                console.warn(`❌ AllOrigins reports HTTP ${jsonResponse.status.http_code} for target URL: ${url}`);
                continue; // Try next proxy
              }
              
              console.log('📄 AllOrigins response keys:', Object.keys(jsonResponse));
              console.log('📄 AllOrigins status:', jsonResponse.status);
            } else {
              htmlContent = await response.text();
            }
            
            // Enhanced content validation with error detection
            const containsErrorPage = htmlContent.toLowerCase().includes('404') || 
                                    htmlContent.toLowerCase().includes('not found') ||
                                    htmlContent.toLowerCase().includes('page not found') ||
                                    htmlContent.toLowerCase().includes('error 404');
            
            const isValidHtml = htmlContent.includes('<html') || htmlContent.includes('<head') || htmlContent.includes('<body');
            const hasMetaTags = htmlContent.includes('<meta') || htmlContent.includes('<title');
            const minLength = htmlContent && htmlContent.length > 200;
            
            if (containsErrorPage) {
              console.warn(`🚫 ${proxy.name}: Content appears to be a 404 error page`);
              continue; // Try next proxy
            }
            
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
      
      // Advanced content analysis for complex articles and blogs
      const analyzeComplexContent = (content, title, doc) => {
        if (!content || content.length < 100) return { insights: [], themes: [], sentiment: 'neutral', readingLevel: 'basic' };
        
        const analysis = {
          insights: [],
          themes: [],
          sentiment: 'neutral',
          readingLevel: 'basic',
          keyQuotes: [],
          arguments: [],
          statistics: [],
          actionItems: []
        };
        
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        
        // Enhanced insight detection with more sophisticated patterns
        const insightPatterns = [
          { pattern: /research (shows?|reveals?|indicates?|suggests?)/i, weight: 3, type: 'research' },
          { pattern: /studies? (show|indicate|suggest|find|reveal)/i, weight: 3, type: 'research' },
          { pattern: /according to (experts?|studies?|research)/i, weight: 2, type: 'authority' },
          { pattern: /experts? (say|believe|recommend|suggest|argue)/i, weight: 2, type: 'expert' },
          { pattern: /key (finding|insight|takeaway|point|conclusion)/i, weight: 3, type: 'key_point' },
          { pattern: /(importantly?|significantly?|notably?|remarkably?)/i, weight: 2, type: 'emphasis' },
          { pattern: /(surprisingly?|unexpectedly?|interestingly?)/i, weight: 2, type: 'surprising' },
          { pattern: /(tip|advice|recommendation|strategy|approach)/i, weight: 2, type: 'actionable' },
          { pattern: /the (secret|key|solution) (to|is|lies in)/i, weight: 3, type: 'solution' },
          { pattern: /(proven|effective|successful) (method|approach|strategy|way)/i, weight: 2, type: 'method' }
        ];
        
        // Extract insights with scoring
        const scoredInsights = [];
        sentences.forEach((sentence, index) => {
          const trimmed = sentence.trim();
          let totalScore = 0;
          let matchedTypes = [];
          
          insightPatterns.forEach(({ pattern, weight, type }) => {
            if (pattern.test(trimmed)) {
              totalScore += weight;
              matchedTypes.push(type);
            }
          });
          
          if (totalScore > 0) {
            scoredInsights.push({
              text: trimmed + '.',
              score: totalScore,
              types: matchedTypes,
              position: index
            });
          }
        });
        
        analysis.insights = scoredInsights
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(item => ({ text: item.text, types: item.types }));
        
        // Extract statistics and numbers
        sentences.forEach(sentence => {
          const stats = sentence.match(/\b\d+\.?\d*\s*(percent|%|times|x|fold|million|billion|thousand|studies?|participants?|years?|months?|days?)\b/gi);
          if (stats && stats.length > 0) {
            analysis.statistics.push(sentence.trim() + '.');
          }
        });
        
        // Extract quotes (content in quotation marks)
        const quoteMatches = content.match(/"([^"]{20,200})"/g);
        if (quoteMatches) {
          analysis.keyQuotes = quoteMatches.slice(0, 3).map(quote => quote.replace(/"/g, ''));
        }
        
        // Detect main themes and topics
        const themeKeywords = {
          health: ['health', 'wellness', 'fitness', 'diet', 'nutrition', 'exercise', 'medical', 'doctor', 'treatment'],
          business: ['business', 'entrepreneur', 'startup', 'company', 'revenue', 'profit', 'market', 'strategy', 'leadership'],
          technology: ['technology', 'AI', 'software', 'digital', 'internet', 'app', 'platform', 'innovation', 'tech'],
          lifestyle: ['lifestyle', 'life', 'personal', 'happiness', 'productivity', 'habits', 'routine', 'balance'],
          education: ['learn', 'education', 'study', 'research', 'knowledge', 'skill', 'training', 'course', 'academic'],
          finance: ['money', 'financial', 'investment', 'savings', 'budget', 'wealth', 'income', 'economy', 'financial'],
          relationships: ['relationship', 'family', 'friends', 'social', 'communication', 'love', 'marriage', 'parenting'],
          travel: ['travel', 'trip', 'vacation', 'destination', 'journey', 'adventure', 'explore', 'culture']
        };
        
        const lowerContent = content.toLowerCase();
        const detectedThemes = [];
        
        Object.entries(themeKeywords).forEach(([theme, keywords]) => {
          const matches = keywords.filter(keyword => lowerContent.includes(keyword)).length;
          if (matches >= 2) {
            detectedThemes.push({ theme, relevance: matches });
          }
        });
        
        analysis.themes = detectedThemes
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 3)
          .map(item => item.theme);
        
        // Sentiment analysis (basic)
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'success', 'benefit', 'improvement', 'effective', 'powerful', 'valuable'];
        const negativeWords = ['bad', 'terrible', 'awful', 'negative', 'problem', 'issue', 'challenge', 'difficult', 'fail', 'wrong', 'harmful', 'dangerous'];
        
        const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
        
        if (positiveCount > negativeCount + 2) {
          analysis.sentiment = 'positive';
        } else if (negativeCount > positiveCount + 2) {
          analysis.sentiment = 'negative';
        } else {
          analysis.sentiment = 'neutral';
        }
        
        // Reading level assessment (basic)
        const avgWordsPerSentence = content.split(/[.!?]+/).reduce((sum, sentence) => {
          return sum + sentence.trim().split(/\s+/).length;
        }, 0) / sentences.length;
        
        if (avgWordsPerSentence > 20) {
          analysis.readingLevel = 'advanced';
        } else if (avgWordsPerSentence > 15) {
          analysis.readingLevel = 'intermediate';
        } else {
          analysis.readingLevel = 'basic';
        }
        
        // Extract actionable items
        const actionPatterns = [
          /you (should|can|need to|must|have to)/i,
          /(try|consider|start|begin|implement)/i,
          /(step|method|way|approach|strategy)/i,
          /how to/i,
          /(tips?|advice|recommendations?)/i
        ];
        
        sentences.forEach(sentence => {
          if (actionPatterns.some(pattern => pattern.test(sentence))) {
            analysis.actionItems.push(sentence.trim() + '.');
          }
        });
        
        analysis.actionItems = analysis.actionItems.slice(0, 3);
        
        return analysis;
      };
      
      // Perform comprehensive content analysis
      const contentAnalysis = analyzeComplexContent(articleContent, title, doc);
      const keyInsights = contentAnalysis.insights.map(insight => insight.text);
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
        // Enhanced analysis data
        contentAnalysis: contentAnalysis, // Complete analysis object
        themes: contentAnalysis.themes, // Main content themes
        sentiment: contentAnalysis.sentiment, // Content sentiment
        readingLevel: contentAnalysis.readingLevel, // Complexity level
        statistics: contentAnalysis.statistics, // Numbers and data points
        keyQuotes: contentAnalysis.keyQuotes, // Important quotes
        actionItems: contentAnalysis.actionItems, // Actionable takeaways
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
      
      // Enhanced fallback logic with intelligent content generation
      console.log('🔄 Activating enhanced fallback system...');
      
      // First, try to extract basic info from URL structure
      const urlInfo = extractInfoFromUrl(url);
      
      // Generate intelligent fallback content based on URL domain and structure
      const fallbackContent = generateIntelligentFallback(url, urlInfo);
      
      console.log('✨ Generated intelligent fallback:', fallbackContent);
      return fallbackContent;
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
          idealLength: 125, // First 125 characters most visible, optimal under 180
          optimalRange: '125-180',
          hashtagLimit: 30,
          seoElements: ['trending hashtags', 'location tags', 'alt text optimization'],
          engagement: ['questions', 'polls', 'story prompts', 'UGC encouragement'],
          influencerStyle: 'visual storytelling, behind-the-scenes, aspirational lifestyle'
        },
        tiktok: {
          characterLimit: 4000,
          idealLength: 100, // First 100 visible
          optimalRange: '80-100',
          hashtagLimit: 100,
          seoElements: ['trending sounds', 'viral hashtags', 'algorithm optimization'],
          engagement: ['hooks in first 3 seconds', 'calls to action', 'trend participation'],
          influencerStyle: 'authentic, relatable, trend-aware, high energy'
        },
        linkedin: {
          characterLimit: 3000, // Posts limit, 125000 for articles
          idealLength: 1500, // 1200-1800 characters optimal
          optimalRange: '1200-1800',
          titleLength: 37, // 25-49 for short post titles
          hashtagLimit: 5,
          seoElements: ['industry keywords', 'professional hashtags', 'thought leadership'],
          engagement: ['professional insights', 'industry questions', 'networking'],
          influencerStyle: 'thought leadership, expertise sharing, professional storytelling'
        },
        twitter: {
          characterLimit: 280,
          idealLength: 250, // 240-259 characters optimal
          optimalRange: '240-259',
          hashtagLimit: 2,
          seoElements: ['trending topics', 'timely hashtags', 'thread optimization'],
          engagement: ['retweets', 'replies', 'quote tweets', 'trending participation'],
          influencerStyle: 'witty, timely, conversational, thought-provoking'
        },
        youtube: {
          characterLimit: 5000, // Description limit
          titleLimit: 100,
          idealLength: 125, // First 100-150 in description most visible
          optimalRange: '100-150',
          hashtagLimit: 15,
          seoElements: ['keyword optimization', 'searchable titles', 'description SEO'],
          engagement: ['subscribe CTAs', 'comment prompts', 'notification bells'],
          influencerStyle: 'educational, entertaining, personality-driven, community building'
        },
        facebook: {
          characterLimit: 63206,
          idealLength: 60, // 40-80 characters optimal
          optimalRange: '40-80',
          hashtagLimit: 3,
          seoElements: ['local SEO', 'community hashtags', 'share optimization'],
          engagement: ['shares', 'comments', 'community building', 'event promotion'],
          influencerStyle: 'community-focused, personal stories, family-friendly, local connection'
        },
        pinterest: {
          characterLimit: 500, // Pin descriptions
          idealLength: 125, // 100-150 characters optimal
          optimalRange: '100-150',
          hashtagLimit: 20,
          seoElements: ['keyword optimization', 'seasonal hashtags', 'board SEO'],
          engagement: ['save prompts', 'board organization', 'seasonal content'],
          influencerStyle: 'inspirational, aspirational, visually-driven, seasonal'
        }
      };

      const currentPlatform = platformSpecs[selectedPlatform] || platformSpecs.instagram;
      
      // Current contextual data for relevance
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
      const currentSeason = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter'][currentDate.getMonth()];
      const dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' });
      const timeOfDay = currentDate.getHours() < 12 ? 'morning' : currentDate.getHours() < 17 ? 'afternoon' : 'evening';
      
      // DYNAMIC TRENDING TOPICS & SEASONAL RELEVANCE
      const seasonalThemes = {
        'Winter': ['cozy vibes', 'self-care', 'goal setting', 'comfort', 'reflection', 'planning ahead', 'indoor activities', 'warm feelings'],
        'Spring': ['fresh starts', 'renewal', 'energy boost', 'decluttering', 'growth mindset', 'outdoor adventures', 'motivation', 'new habits'],
        'Summer': ['vacation mode', 'fun adventures', 'outdoor living', 'freedom', 'relaxation', 'social gatherings', 'active lifestyle', 'sunshine'],
        'Fall': ['back to routine', 'productivity', 'organization', 'preparation', 'gratitude', 'transformation', 'learning season', 'cozy comfort']
      };
      
      const monthlyTrends = {
        'January': ['New Year goals', 'fresh starts', 'detox', 'organization', 'mindful beginnings'],
        'February': ['self-love', 'relationships', 'heart health', 'winter comfort', 'love yourself'],
        'March': ['spring cleaning', 'renewal', 'women\'s history', 'growth', 'fresh energy'],
        'April': ['spring vibes', 'Easter renewal', 'outdoor activities', 'fresh starts', 'blooming'],
        'May': ['mental health awareness', 'mothers', 'graduation', 'outdoor season', 'growth'],
        'June': ['summer prep', 'fathers', 'pride', 'vacation planning', 'sunshine'],
        'July': ['summer fun', 'independence', 'freedom', 'vacation mode', 'outdoor adventures'],
        'August': ['back to school prep', 'late summer', 'productivity', 'preparation', 'transition'],
        'September': ['back to routine', 'fall prep', 'productivity', 'organization', 'learning'],
        'October': ['transformation', 'change', 'gratitude', 'cozy vibes', 'reflection'],
        'November': ['gratitude', 'thanksgiving', 'reflection', 'preparation', 'appreciation'],
        'December': ['holiday season', 'year-end reflection', 'celebration', 'gratitude', 'planning ahead']
      };
      
      const daySpecificVibes = {
        'Monday': ['motivation', 'fresh start', 'goal crushing', 'momentum building', 'week planning'],
        'Tuesday': ['productivity', 'focus mode', 'getting things done', 'consistency', 'progress'],
        'Wednesday': ['midweek check-in', 'hump day motivation', 'persistence', 'staying strong', 'halfway there'],
        'Thursday': ['almost there', 'pushing through', 'determination', 'finishing strong', 'preparation'],
        'Friday': ['celebration', 'accomplishment', 'weekend prep', 'reflection', 'fun anticipation'],
        'Saturday': ['self-care', 'adventures', 'relaxation', 'fun activities', 'personal time'],
        'Sunday': ['reflection', 'preparation', 'planning', 'reset', 'mindfulness']
      };
      
      // Current contextual elements
      const seasonalVibe = seasonalThemes[currentSeason][Math.floor(Math.random() * seasonalThemes[currentSeason].length)];
      const monthlyVibe = monthlyTrends[currentMonth][Math.floor(Math.random() * monthlyTrends[currentMonth].length)];
      const dayVibe = daySpecificVibes[dayOfWeek][Math.floor(Math.random() * daySpecificVibes[dayOfWeek].length)];
      
      // EXPANDED random personal elements for authenticity
      const personalTouches = [
        'struggled with this myself', 'learned this the hard way', 'wish someone told me this earlier',
        'obsessed with this lately', 'game-changer for my routine', 'completely transformed my approach',
        'my biggest mistake was ignoring this', 'secret I learned from a mentor', 'changed everything for me',
        'never thought I\'d be the person who', 'used to think this was overrated until', 'discovered this by complete accident',
        'had a complete breakdown over this', 'cried happy tears when this finally clicked', 'felt like a fraud until I mastered this',
        'embarrassingly ignored this for months', 'randomly stumbled upon this goldmine', 'was skeptical until I tried it myself',
        'made every mistake in the book with this', 'finally understood why everyone raves about this', 'wish I could go back and tell myself this',
        'had an epiphany about this at 2am', 'was gatekeeping this from my own self', 'realized I was overcomplicating everything'
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
        `Three months ago I would've scrolled past this, but now...`,
        `Nobody talks about this part, but here's the truth...`,
        `I used to roll my eyes at people who said this, until...`,
        `The thing that surprised me most about this journey was...`,
        `Unpopular opinion: everyone's doing this backwards and here's why...`,
        `I'm about to share something that might sound crazy, but...`,
        `For the longest time, I thought I was the only one who...`,
        `You know that feeling when everything finally clicks? That happened to me with...`,
        `I was today years old when I realized...`,
        `This is your sign to stop scrolling and pay attention because...`,
        `I need to get something off my chest about...`,
        `Breaking: I just discovered I've been living life wrong and...`,
        `PSA: If you're anything like me, you need to hear this...`,
        `Reality check time - let's talk about what nobody mentions...`,
        `*Controversial take incoming* but I stand by this...`,
        `Friends don't let friends continue doing this wrong, so...`,
        `I'm calling myself out publicly because...`
      ];
      const randomHook = storyHooks[Math.floor(Math.random() * storyHooks.length)];
      
      // EXPANDED content variation algorithms to prevent repetition
      const contentAngles = [
        'Personal Journey Storytelling', 'Educational Expert Mode', 'Relatable Community Vibe', 
        'Behind-the-Scenes Reality', 'Myth-Busting Authority', 'Inspirational Transformation',
        'Controversial Truth-Telling', 'Beginner-Friendly Guide', 'Advanced Pro Tips', 'Nostalgic Reflection',
        'Future-Focused Vision', 'Problem-Solution Framework', 'Before & After Comparison', 'Step-by-Step Breakdown',
        'Common Mistakes Analysis', 'Seasonal Relevance', 'Trending Topic Connection', 'Personal Challenge',
        'Community Celebration', 'Honest Confession', 'Expert Interview Style', 'Data-Driven Insights'
      ];
      const randomAngle = contentAngles[Math.floor(Math.random() * contentAngles.length)];
      
      const emotionalTones = [
        'enthusiastic and inspiring', 'authentic and vulnerable', 'confident and authoritative',
        'warm and community-focused', 'playful and conversational', 'passionate and knowledgeable',
        'empathetic and supportive', 'bold and provocative', 'calm and reassuring', 'excited and energetic',
        'thoughtful and reflective', 'direct and no-nonsense', 'encouraging and uplifting', 'curious and explorative',
        'grateful and appreciative', 'determined and motivated', 'honest and transparent', 'creative and innovative'
      ];
      const randomTone = emotionalTones[Math.floor(Math.random() * emotionalTones.length)];
      
      const engagementStyles = [
        'Ask thought-provoking questions', 'Share surprising statistics', 'Create relatable scenarios',
        'Use interactive polls/challenges', 'Share personal vulnerabilities', 'Provide actionable takeaways',
        'Create before/after comparisons', 'Challenge common assumptions', 'Share failure stories',
        'Offer exclusive behind-the-scenes content', 'Create urgency with limited-time insights', 'Use humor and self-deprecation',
        'Share mentor quotes and wisdom', 'Create community challenges', 'Use storytelling cliffhangers',
        'Provide controversial hot takes', 'Share transformation timelines', 'Create "fill in the blank" engagement',
        'Use seasonal or trending references', 'Share mistake confessions', 'Create prediction content',
        'Use comparison posts (this vs that)', 'Share resource recommendations', 'Create myth-busting content',
        'Use "day in the life" format', 'Share goal-setting strategies', 'Create educational carousels',
        'Use "unpopular opinion" format', 'Share gratitude and appreciation', 'Create tutorial walkthroughs'
      ];
      const randomEngagement = engagementStyles[Math.floor(Math.random() * engagementStyles.length)];
      
      // VIRAL CONTENT FORMATS & POP CULTURE REFERENCES
      const viralFormats = [
        'Plot twist format', 'This or that comparison', 'Unpopular opinion', 'Day in my life',
        'Things I wish I knew', 'Red flags to avoid', 'Green flags to look for', 'Rate my setup',
        'Get ready with me', 'What I eat in a day', 'Storytime format', 'Transformation timeline',
        'Before and after', 'Mistakes I made', 'Lessons learned', 'Hot takes only',
        'POV: You\'re someone who', 'Tell me you\'re X without telling me', 'If you know, you know',
        'Main character energy', 'That girl aesthetic', 'Soft life vibes', 'Glow up journey'
      ];
      
      const popCultureRefs = [
        'giving main character energy', 'living my best life', 'no cap', 'periodt',
        'it\'s giving...', 'the way I...', 'not me...', 'please tell me I\'m not the only one',
        'this is so random but', 'nobody asked but', 'hear me out', 'I said what I said',
        'and I oop', 'the audacity', 'the way this', 'I\'m obsessed', 'it hits different'
      ];
      
      const interactiveElements = [
        'Drop a 🔥 if you agree', 'Comment your favorite tip', 'Tag someone who needs this',
        'Save this for later', 'Share your experience below', 'What would you add to this list?',
        'Rate this from 1-10', 'Yes or no in the comments', 'Tell me I\'m wrong',
        'Who can relate?', 'This or that?', 'Agree or disagree?', 'Your turn - share yours!'
      ];
      
      // Random selections for dynamic content
      const randomFormat = viralFormats[Math.floor(Math.random() * viralFormats.length)];
      const randomPopRef = popCultureRefs[Math.floor(Math.random() * popCultureRefs.length)];
      const randomInteractive = interactiveElements[Math.floor(Math.random() * interactiveElements.length)];
      
      // CREATOR PERSONALITY ARCHETYPES
      const creatorPersonalities = [
        {
          type: 'The Authentic Storyteller',
          voice: 'vulnerable, honest, relatable',
          style: 'shares personal struggles and victories',
          signature: 'deep emotional connection through raw honesty'
        },
        {
          type: 'The Energetic Motivator',
          voice: 'high-energy, inspiring, action-oriented', 
          style: 'pumps people up and gets them moving',
          signature: 'infectious enthusiasm and motivational catchphrases'
        },
        {
          type: 'The Wise Mentor',
          voice: 'calm, authoritative, nurturing',
          style: 'shares knowledge and guides followers',
          signature: 'thoughtful advice with gentle wisdom'
        },
        {
          type: 'The Relatable Friend',
          voice: 'casual, conversational, supportive',
          style: 'feels like your bestie giving advice',
          signature: 'makes everything feel achievable and normal'
        },
        {
          type: 'The Bold Disruptor',
          voice: 'confident, provocative, truth-telling',
          style: 'challenges norms and speaks uncomfortable truths',
          signature: 'controversial takes that spark important conversations'
        },
        {
          type: 'The Creative Innovator',
          voice: 'artistic, imaginative, trend-setting',
          style: 'creates new approaches and unique perspectives',
          signature: 'fresh ideas and creative problem-solving'
        },
        {
          type: 'The Empathetic Healer',
          voice: 'gentle, understanding, supportive',
          style: 'creates safe spaces for growth and healing',
          signature: 'makes people feel seen and validated'
        },
        {
          type: 'The Fun Entertainer',
          voice: 'playful, humorous, lighthearted',
          style: 'makes learning and growth enjoyable',
          signature: 'educational content that feels like entertainment'
        }
      ];
      
      const randomPersonality = creatorPersonalities[Math.floor(Math.random() * creatorPersonalities.length)];
      
      // POWER WORDS AND DYNAMIC ELEMENTS
      const powerWords = [
        'transform', 'breakthrough', 'unlock', 'discover', 'reveal', 'master', 'accelerate', 'amplify',
        'elevate', 'optimize', 'revolutionize', 'ignite', 'unleash', 'dominate', 'conquer', 'crush',
        'skyrocket', 'explode', 'magnetize', 'captivate', 'mesmerize', 'electrify', 'energize', 'supercharge'
      ];
      
      const surprisingStats = [
        '92% of people never achieve their goals', 'Only 3% of people write down their goals',
        '80% of success comes from 20% of efforts', 'People make decisions in 7 seconds',
        '65% of communication is body language', '90% of startups fail in first year',
        '70% of millionaires read books regularly', 'Average person checks phone 96 times daily',
        '85% of job positions are filled through networking', '95% of purchasing decisions are emotional'
      ];
      
      const socialProofElements = [
        'my community has been asking about this', 'thousands of you requested this topic',
        'after seeing your DMs about this', 'based on your feedback in the comments',
        'so many of you have shared similar stories', 'my most successful clients do this',
        'every person I mentor struggles with this', 'the most common question I get is'
      ];
      
      // Random selections for enhanced elements
      const randomPowerWord = powerWords[Math.floor(Math.random() * powerWords.length)];
      const randomStat = surprisingStats[Math.floor(Math.random() * surprisingStats.length)];
      const randomSocialProof = socialProofElements[Math.floor(Math.random() * socialProofElements.length)];

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

🎯 DYNAMIC PERSONALIZATION ELEMENTS TO WEAVE IN:
- Personal Story Hook: "${randomHook}"
- Content Angle: ${randomAngle} (vary the approach each time)
- Emotional Tone: ${randomTone} (match this energy throughout)
- Engagement Strategy: ${randomEngagement}
- Viral Format Style: ${randomFormat}
- Pop Culture Vibe: ${randomPopRef}
- Interactive Element: ${randomInteractive}

📅 CONTEXTUAL RELEVANCE:
- Seasonal Energy: ${seasonalVibe} (${currentSeason} themes)
- Monthly Focus: ${monthlyVibe} (${currentMonth} energy)
- Day-of-Week Vibe: ${dayVibe} (perfect for ${dayOfWeek}s)
- Time Context: ${timeOfDay} scrollers (adjust energy accordingly)

💫 AUTHENTICITY BUILDERS:
- Community Connection: "my followers always ask about this", "you guys requested this"
- Vulnerability: Real struggles, honest mistakes, learning moments  
- Specificity: Exact numbers, specific examples, detailed scenarios
- Personal Touch: I ${randomPersonal}
- Relatability: Make it feel like a conversation with a best friend

🎭 CREATOR PERSONALITY ARCHETYPE:
- Role: ${randomPersonality.type}
- Voice Style: ${randomPersonality.voice}
- Content Approach: ${randomPersonality.style}
- Signature Element: ${randomPersonality.signature}
- Embody this personality completely throughout the content

🔥 ENHANCED DYNAMIC ELEMENTS:
- Power Word Focus: ${randomPowerWord} (weave this naturally throughout)
- Surprising Stat: ${randomStat} (use if relevant to topic)
- Social Proof Angle: ${randomSocialProof}
- Trending References: Connect to current events or cultural moments naturally
- Urgency/Scarcity: Create natural momentum without being pushy  
- Pattern Interrupts: Break expected content flow to maintain attention
- Micro-Moments: Capture small, relatable daily experiences
- Future-Pacing: Help audience visualize their transformed future state

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
          instagram: { 
            hashtags: ['#fitness', '#workout', '#health', '#motivation', '#fitnessmotivation', '#exercise', '#training', '#fitlife'], 
            hashtagLimit: 8, 
            charLimit: 2200,
            idealLength: 125,
            optimalRange: '125-180'
          },
          tiktok: { 
            hashtags: ['#fitnesstok', '#workoutvideo', '#fitnesscheck', '#gymtok', '#healthylifestyle', '#exerciseroutine'], 
            hashtagLimit: 12, 
            charLimit: 4000,
            idealLength: 100,
            optimalRange: '80-100'
          },
          linkedin: { 
            hashtags: ['#fitness', '#wellness', '#productivity', '#leadership'], 
            hashtagLimit: 3, 
            charLimit: 3000,
            idealLength: 1500,
            optimalRange: '1200-1800'
          },
          twitter: { 
            hashtags: ['#fitness', '#workout'], 
            hashtagLimit: 2, 
            charLimit: 280,
            idealLength: 250,
            optimalRange: '240-259'
          },
          youtube: { 
            hashtags: ['#fitness', '#workout', '#exercise', '#health', '#fitnessmotivation'], 
            hashtagLimit: 6, 
            charLimit: 5000,
            idealLength: 125,
            optimalRange: '100-150'
          },
          facebook: { 
            hashtags: ['#fitness', '#health', '#wellness'], 
            hashtagLimit: 3, 
            charLimit: 63206,
            idealLength: 60,
            optimalRange: '40-80'
          },
          pinterest: { 
            hashtags: ['#fitness', '#health', '#wellness', '#lifestyle'], 
            hashtagLimit: 20, 
            charLimit: 500,
            idealLength: 125,
            optimalRange: '100-150'
          }
        };
        const config = platformConfig[selectedPlatform] || platformConfig.instagram;
        return { 
          hashtags: config.hashtags.slice(0, config.hashtagLimit).join(' '), 
          charLimit: config.charLimit,
          idealLength: config.idealLength,
          optimalRange: config.optimalRange
        };
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
      
      // Platform-specific content limits for optimization
      const platformLimits = {
        instagram: { 
          targetChars: 125, maxChars: 180, 
          minWords: 20, maxWords: 30, 
          idealLength: 'First 125 characters optimized, keep under 180 total'
        },
        tiktok: { 
          targetChars: 100, maxChars: 100, 
          minWords: 15, maxWords: 20, 
          idealLength: 'First 100 characters visible, punchy hook essential'
        },
        linkedin: { 
          targetChars: 1500, maxChars: 1800, 
          minWords: 200, maxWords: 300, 
          idealLength: '1200-1800 characters optimal, professional storytelling'
        },
        twitter: { 
          targetChars: 250, maxChars: 259, 
          minWords: 40, maxWords: 45, 
          idealLength: '240-259 characters ideal, thread-worthy content'
        },
        youtube: { 
          targetChars: 125, maxChars: 150, 
          minWords: 20, maxWords: 25, 
          idealLength: 'First 100-150 characters visible in description'
        },
        facebook: { 
          targetChars: 60, maxChars: 80, 
          minWords: 8, maxWords: 12, 
          idealLength: '40-80 characters optimal for engagement'
        },
        pinterest: { 
          targetChars: 125, maxChars: 150, 
          minWords: 15, maxWords: 25, 
          idealLength: '100-150 characters for title/description'
        }
      };
      
      // Enhanced content generation with comprehensive prompts
      const generateComprehensiveContent = () => {
        
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
      
      let comprehensiveContent = generateComprehensiveContent();
      
      // Platform-specific content optimization based on ideal character limits
      const currentLimit = platformLimits[selectedPlatform] || platformLimits.instagram;
      
      // Smart content trimming that preserves quality while meeting platform requirements
      if (comprehensiveContent.length > currentLimit.maxChars) {
        // For short-form platforms, prioritize the hook and main message
        if (selectedPlatform === 'facebook') {
          // Facebook: Keep only the most engaging hook (40-80 chars)
          const sentences = comprehensiveContent.split('.');
          comprehensiveContent = sentences[0].substring(0, currentLimit.maxChars) + (sentences[0].length > currentLimit.maxChars ? '...' : '');
        } else if (selectedPlatform === 'twitter') {
          // Twitter: Optimize for 240-259 character sweet spot
          comprehensiveContent = comprehensiveContent.substring(0, currentLimit.maxChars);
          // Ensure we don't cut off mid-word
          const lastSpaceIndex = comprehensiveContent.lastIndexOf(' ');
          if (lastSpaceIndex > currentLimit.targetChars - 20) {
            comprehensiveContent = comprehensiveContent.substring(0, lastSpaceIndex) + '...';
          }
        } else if (selectedPlatform === 'instagram') {
          // Instagram: Optimize first 125 characters, allow up to 180
          const firstPart = comprehensiveContent.substring(0, currentLimit.targetChars);
          const remainingContent = comprehensiveContent.substring(currentLimit.targetChars, currentLimit.maxChars);
          comprehensiveContent = firstPart + (remainingContent ? remainingContent : '');
        } else if (selectedPlatform === 'tiktok') {
          // TikTok: Focus on first 100 characters only
          comprehensiveContent = comprehensiveContent.substring(0, currentLimit.targetChars);
          const lastSpaceIndex = comprehensiveContent.lastIndexOf(' ');
          if (lastSpaceIndex > 80) {
            comprehensiveContent = comprehensiveContent.substring(0, lastSpaceIndex) + '...';
          }
        } else if (selectedPlatform === 'youtube') {
          // YouTube: Optimize first 100-150 characters of description
          const lines = comprehensiveContent.split('\n');
          const firstLine = lines[0].substring(0, currentLimit.maxChars);
          comprehensiveContent = firstLine + (lines.length > 1 ? '\n\n' + lines.slice(1).join('\n') : '');
        } else if (selectedPlatform === 'linkedin') {
          // LinkedIn: Keep 1200-1800 characters for optimal engagement
          if (comprehensiveContent.length > currentLimit.maxChars) {
            comprehensiveContent = comprehensiveContent.substring(0, currentLimit.maxChars);
            const lastSentenceIndex = comprehensiveContent.lastIndexOf('.');
            if (lastSentenceIndex > currentLimit.targetChars - 100) {
              comprehensiveContent = comprehensiveContent.substring(0, lastSentenceIndex + 1);
            }
          }
        }
      }
      
      console.log(`✅ Generated ${selectedPlatform} optimized content for ${contentType}:`, comprehensiveContent.substring(0, 100) + '...');
      console.log(`📝 Final content length: ${comprehensiveContent.length} characters (target: ${currentLimit.targetChars}, max: ${currentLimit.maxChars})`);
      console.log(`🎯 Platform optimization: ${currentLimit.idealLength}`);
      
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

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen font-comfort transition-colors duration-300 bg-comfort-tan/20 text-comfort-navy">
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

      {/* Calendar-Inspired Header */}
      <div className="rounded-xl shadow-lg mb-6 border overflow-hidden transition-colors duration-300 bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white border-comfort-tan/30">
        {/* Calendar Header Bar */}
        <div className="p-6 border-b transition-colors duration-300 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            {/* CACHE TEST VERSION 2.0 - If you see this, cache is cleared! */}
            {/* Left Calendar Icon */}
            <div className="flex items-center justify-center w-20 h-20">
              <Calendar className="w-12 h-12 text-amber-700" />
            </div>
            
            {/* App Title - Centered */}
            <div className="text-center text-amber-900 flex-1">
              <h1 className="text-3xl font-bold leading-tight mb-1">
                Content Calendar ⚡ V2.0
              </h1>
              <p className="text-base font-medium text-amber-800/80">AI-Powered Social Media Planner</p>
            </div>
            
            {/* Current Week Display */}
            <div className="text-right text-amber-900 w-20">
              <div className="text-xs text-amber-700/70 uppercase tracking-wide font-medium mb-1">This Week</div>
              <div className="text-sm font-semibold leading-tight">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid Navigation */}
        <div className="p-4 bg-comfort-tan/10">
          <div className="grid grid-cols-8 gap-2">
            {['dashboard', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((tab, index) => {
              const isActive = activeTab === tab;
              const isDashboard = tab === 'dashboard';
              
              // Calculate dates for the current week
              const today = new Date();
              const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
              
              let dayDate = null;
              let isToday = false;
              
              if (!isDashboard) {
                // Calculate the date for this day tab
                const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(tab);
                
                if (tab === 'sunday') {
                  // For Sunday, show next Sunday (October 12, 2025)
                  const nextSunday = new Date(today);
                  const daysUntilNextSunday = (7 - currentDay) % 7;
                  nextSunday.setDate(today.getDate() + (daysUntilNextSunday === 0 ? 7 : daysUntilNextSunday));
                  dayDate = nextSunday;
                } else {
                  // For other days, calculate from this week's Monday
                  const mondayOfWeek = new Date(today);
                  const daysFromMonday = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday being 0
                  mondayOfWeek.setDate(today.getDate() + daysFromMonday);
                  
                  // Calculate days from Monday (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5)
                  const mondayBasedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Sunday becomes 6, others shift down
                  dayDate = new Date(mondayOfWeek);
                  dayDate.setDate(mondayOfWeek.getDate() + mondayBasedIndex);
                }
                
                isToday = dayDate.toDateString() === today.toDateString();
              }
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative p-4 rounded-xl font-medium transition-all duration-200 min-h-16 ${
                    isActive
                      ? 'bg-comfort-navy text-white shadow-xl transform scale-105 border-2 border-comfort-accent'
                      : isToday && !isDashboard
                      ? 'bg-comfort-olive/20 text-comfort-olive hover:bg-comfort-olive/30 border-2 border-comfort-olive shadow-md'
                      : 'bg-white text-comfort-navy hover:bg-comfort-accent/10 hover:text-comfort-accent border border-comfort-tan/40 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isDashboard ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-xl mb-1">📊</div>
                      <div className="text-xs uppercase tracking-wide font-bold">Dashboard</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-xs uppercase tracking-wide font-medium opacity-70 mb-1">
                        {tab.slice(0, 3)}
                      </div>
                      <div className="text-xl font-bold mb-1">
                        {dayDate ? dayDate.getDate() : '•'}
                      </div>
                      
                      {/* Today indicator */}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-comfort-olive rounded-full border-2 border-white"></div>
                      )}
                      
                      {/* Content indicator dot */}
                      {dayContent[tab]?.length > 0 && (
                        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                          isActive ? 'bg-white' : 'bg-comfort-accent'
                        }`}></div>
                      )}
                      
                      {/* Content count badge */}
                      {dayContent[tab]?.length > 0 && (
                        <div className={`absolute -top-2 -left-2 min-w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActive ? 'bg-comfort-accent text-white' : 'bg-comfort-navy text-white'
                        }`}>
                          {dayContent[tab].length}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
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
          
          {/* Weekly Content Generation */}
          <div className="bg-gradient-to-br from-comfort-accent/10 via-comfort-olive/5 to-comfort-navy/10 p-6 rounded-xl border border-comfort-tan/30">
            <h3 className="text-lg font-semibold text-comfort-navy mb-4 flex items-center gap-2">
              📅 Generate Weekly Content
            </h3>
            <p className="text-sm text-comfort-navy/70 mb-6">
              Generate a complete week of content using your day-specific topic selections. Content will appear in the calendar below.
            </p>
            
            {/* Week Generation Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Number of Weeks */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-comfort-accent" />
                  <label className="text-sm font-medium text-comfort-navy">Generate Content For:</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={numberOfWeeks}
                    onChange={(e) => setNumberOfWeeks(Math.max(1, Math.min(4, parseInt(e.target.value) || 1)))}
                    className="w-16 px-2 py-1 border border-comfort-tan/50 rounded text-center text-sm focus:border-comfort-olive focus:outline-none"
                  />
                  <span className="text-sm text-comfort-navy">
                    {numberOfWeeks === 1 ? 'week' : 'weeks'} 
                    <span className="text-comfort-navy/60 ml-1">
                      ({numberOfWeeks * 7} posts total)
                    </span>
                  </span>
                </div>
              </div>

              {/* Generation Mode */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-comfort-navy">Generation Mode:</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="generationMode"
                      value="nextDay"
                      checked={generationMode === 'nextDay'}
                      onChange={(e) => setGenerationMode(e.target.value)}
                      className="text-comfort-accent"
                    />
                    <div>
                      <div className="text-sm font-medium text-comfort-navy">Next 7 Days</div>
                      <div className="text-xs text-comfort-navy/70">
                        Start tomorrow and generate for the next 7 days
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="generationMode"
                      value="calendar"
                      checked={generationMode === 'calendar'}
                      onChange={(e) => setGenerationMode(e.target.value)}
                      className="text-comfort-accent"
                    />
                    <div>
                      <div className="text-sm font-medium text-comfort-navy">Calendar Week</div>
                      <div className="text-xs text-comfort-navy/70">
                        Generate for Sunday through Saturday
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Topic Schedule Preview */}
            <div className="bg-comfort-white/50 border border-comfort-tan/30 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-comfort-navy mb-3">Current Topic Schedule:</h4>
              <div className="grid grid-cols-7 gap-2 text-xs">
                {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                  <div key={day} className="text-center">
                    <div className="font-medium text-comfort-navy capitalize mb-1">{day.slice(0, 3)}</div>
                    <div className={`px-2 py-1 rounded text-xs capitalize ${
                      dayTopicSelections[day] === 'recipes' ? 'bg-orange-100 text-orange-800' :
                      dayTopicSelections[day] === 'workouts' ? 'bg-green-100 text-green-800' :
                      dayTopicSelections[day] === 'realestate' ? 'bg-blue-100 text-blue-800' :
                      dayTopicSelections[day] === 'mindfulness' ? 'bg-purple-100 text-purple-800' :
                      dayTopicSelections[day] === 'travel' ? 'bg-indigo-100 text-indigo-800' :
                      dayTopicSelections[day] === 'tech' ? 'bg-gray-100 text-gray-800' :
                      dayTopicSelections[day] === 'finance' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-comfort-tan/20 text-comfort-navy'
                    }`}>
                      {dayTopicSelections[day]}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-comfort-navy/60 mt-3">
                💡 Modify topic selections in the individual day tabs if needed
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateWeeklyContent}
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isGenerating ? `Generating ${numberOfWeeks} ${numberOfWeeks === 1 ? 'week' : 'weeks'}...` : `🚀 Generate ${numberOfWeeks} ${numberOfWeeks === 1 ? 'Week' : 'Weeks'} of Content`}
            </button>
          </div>

          {/* Calendar Section */}
          <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-comfort-navy flex items-center gap-2">
                <Calendar className="w-5 h-5 text-comfort-accent" />
                Content Calendar
              </h3>
              
              <div className="flex items-center gap-3">
                {/* Export Options */}
                {contentCalendar.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportToCSV}
                      className="px-3 py-1.5 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                      title="Export as CSV"
                    >
                      📊 CSV
                    </button>
                    <button
                      onClick={exportToJSON}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                      title="Export as JSON"
                    >
                      📄 JSON
                    </button>
                    <button
                      onClick={printCalendar}
                      className="px-3 py-1.5 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors flex items-center gap-1"
                      title="Print Calendar"
                    >
                      🖨️ Print
                    </button>
                  </div>
                )}
                
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
            </div>

            {/* Calendar Navigation */}
            {calendarView !== 'list' && (
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => navigateCalendar('prev')}
                  className="p-2 hover:bg-comfort-tan/30 rounded-lg transition-colors text-comfort-navy"
                >
                  <ChevronDown size={16} className="rotate-90" />
                </button>
                
                <div className="text-lg font-semibold text-comfort-navy">
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
            )}

            {/* Today Button */}
            {calendarView !== 'list' && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 text-sm bg-comfort-accent text-comfort-white rounded hover:bg-comfort-olive transition-colors"
                >
                  Go to Today
                </button>
              </div>
            )}

            {/* Calendar Display */}
            {contentCalendar.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-comfort-tan/20 border border-comfort-tan/50 rounded-lg p-6 max-w-md mx-auto">
                  <Calendar className="w-12 h-12 text-comfort-accent mx-auto mb-4" />
                  <h4 className="font-medium text-comfort-navy mb-2">📅 Your Content Calendar</h4>
                  <p className="text-sm text-comfort-navy/80 mb-4">
                    Generate content from the day tabs to see it appear in this calendar view.
                  </p>
                  <p className="text-xs text-comfort-navy/60">
                    Switch between day, week, month, and list views to organize your content
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {/* Month View */}
                {calendarView === 'month' && (
                  <div className="grid grid-cols-7 gap-1">
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
                              {content.slice(0, 2).map((post) => (
                                <div
                                  key={post.id}
                                  className={`text-xs p-1 rounded border-l-2 ${
                                    post.contentType === 'recipe' ? 'bg-orange-50 border-orange-400' :
                                    post.contentType === 'workout' ? 'bg-green-50 border-green-400' :
                                    post.contentType === 'realEstate' ? 'bg-blue-50 border-blue-400' :
                                    post.contentType === 'mindfulness' ? 'bg-purple-50 border-purple-400' :
                                    post.contentType === 'travel' ? 'bg-indigo-50 border-indigo-400' :
                                    post.contentType === 'tech' ? 'bg-gray-50 border-gray-400' :
                                    post.contentType === 'finance' ? 'bg-emerald-50 border-emerald-400' :
                                    'bg-comfort-tan/20 border-comfort-accent'
                                  }`}
                                >
                                  {post.content.title.substring(0, 20)}...
                                </div>
                              ))}
                              {content.length > 2 && (
                                <div className="text-xs text-comfort-navy/60">+{content.length - 2} more</div>
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
                  <div className="grid grid-cols-7 gap-2">
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
                          
                          <div className="space-y-2 min-h-32">
                            {content.map((post) => (
                              <div
                                key={post.id}
                                className={`p-2 rounded text-xs border-l-4 cursor-pointer hover:shadow-sm transition-all ${
                                  post.contentType === 'recipe' ? 'bg-orange-50 border-orange-400 hover:bg-orange-100' :
                                  post.contentType === 'workout' ? 'bg-green-50 border-green-400 hover:bg-green-100' :
                                  post.contentType === 'realEstate' ? 'bg-blue-50 border-blue-400 hover:bg-blue-100' :
                                  post.contentType === 'mindfulness' ? 'bg-purple-50 border-purple-400 hover:bg-purple-100' :
                                  post.contentType === 'travel' ? 'bg-indigo-50 border-indigo-400 hover:bg-indigo-100' :
                                  post.contentType === 'tech' ? 'bg-gray-50 border-gray-400 hover:bg-gray-100' :
                                  post.contentType === 'finance' ? 'bg-emerald-50 border-emerald-400 hover:bg-emerald-100' :
                                  'bg-comfort-tan/20 border-comfort-accent hover:bg-comfort-tan/30'
                                }`}
                              >
                                <div className="font-medium truncate">{post.content.title}</div>
                                <div className="text-comfort-navy/60 mt-1 capitalize">{post.contentType}</div>
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
                              <div className="text-sm text-comfort-navy/70 capitalize">{post.contentType} • {post.dayName}</div>
                            </div>
                          </div>
                          
                          {/* Platform Variations with Hashtags */}
                          {post.variations ? (
                            <div className="space-y-3">
                              {['instagram', 'linkedin', 'facebook'].map(platform => (
                                <div key={platform} className="border-l-4 border-comfort-accent/30 pl-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold text-comfort-accent uppercase">{platform}</span>
                                    <div className="h-1 w-1 bg-comfort-accent/50 rounded-full"></div>
                                    <span className="text-xs text-comfort-navy/60">{post.variations[platform]?.length || 0} characters</span>
                                  </div>
                                  <div className="text-sm text-comfort-navy/80 bg-comfort-tan/10 p-3 rounded whitespace-pre-wrap">
                                    {post.variations[platform] || `No ${platform} content available`}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-comfort-navy/80 bg-comfort-tan/10 p-3 rounded">
                              {post.content.description || post.content.content || 'No description available'}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* List View */}
                {calendarView === 'list' && (
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-comfort-navy mb-4">
                      All Scheduled Content ({contentCalendar.length} posts)
                    </div>
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
                                  post.contentType === 'travel' ? 'bg-indigo-100 text-indigo-800' :
                                  post.contentType === 'tech' ? 'bg-gray-100 text-gray-800' :
                                  post.contentType === 'finance' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-comfort-accent/20 text-comfort-accent'
                                }`}>
                                  {post.contentType}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Platform Variations with Hashtags */}
                          {post.variations ? (
                            <div className="space-y-3">
                              {['instagram', 'linkedin', 'facebook'].map(platform => (
                                <div key={platform} className="border-l-4 border-comfort-accent/30 pl-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold text-comfort-accent uppercase">{platform}</span>
                                    <div className="h-1 w-1 bg-comfort-accent/50 rounded-full"></div>
                                    <span className="text-xs text-comfort-navy/60">{post.variations[platform]?.length || 0} characters</span>
                                  </div>
                                  <div className="text-sm text-comfort-navy/80 bg-comfort-tan/10 p-3 rounded whitespace-pre-wrap">
                                    {post.variations[platform] || `No ${platform} content available`}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-comfort-navy/80 bg-comfort-tan/10 p-3 rounded">
                              {post.content.description || post.content.content || 'No description available'}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Topic Bank */}
          <div className="bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-amber-50/50 p-6 rounded-xl border border-amber-200/50 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-amber-800 flex items-center gap-2">
                🏦 Topic Bank
              </h3>
              <div className="text-sm text-amber-700/80">
                Store and reuse pre-written posts by topic
              </div>
            </div>

            {/* Topic Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-amber-800 mb-2">Select Topic:</label>
              <select
                value={selectedBankTopic}
                onChange={(e) => setSelectedBankTopic(e.target.value)}
                className="w-full max-w-md p-3 border border-amber-300 rounded-lg focus:border-amber-500 focus:outline-none bg-white"
              >
                <option value="recipes">Recipes</option>
                <option value="workouts">Workouts</option>
                <option value="realEstate">Real Estate</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="educational">Educational</option>
                <option value="motivational">Motivational</option>
                <option value="travel">Travel</option>
                <option value="tech">Tech</option>
                <option value="finance">Finance</option>
                <option value="beauty">Beauty</option>
                <option value="parenting">Parenting</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            {/* Add to Topic Bank Form */}
            <div className="bg-white p-5 rounded-lg border border-amber-300 mb-6">
              <h4 className="text-sm font-semibold text-amber-800 mb-4 flex items-center gap-2">
                💾 Save New Post to Topic Bank
              </h4>
              
              {/* Input Method Tabs */}
              <div className="flex bg-amber-50 rounded-lg p-1 mb-4">
                <button
                  onClick={() => setBankInputs({ ...bankInputs, inputMethod: 'manual' })}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    (bankInputs.inputMethod || 'manual') === 'manual'
                      ? 'bg-white text-amber-800 shadow-sm'
                      : 'text-amber-600 hover:text-amber-800'
                  }`}
                >
                  ✏️ Manual Entry
                </button>
                <button
                  onClick={() => setBankInputs({ ...bankInputs, inputMethod: 'url' })}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    bankInputs.inputMethod === 'url'
                      ? 'bg-white text-amber-800 shadow-sm'
                      : 'text-amber-600 hover:text-amber-800'
                  }`}
                >
                  🔗 From URL
                </button>
              </div>

              <div className="space-y-4">
                {/* URL Input Section */}
                {bankInputs.inputMethod === 'url' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Enter URL to parse content"
                        value={bankInputs.url || ''}
                        onChange={(e) => setBankInputs({ ...bankInputs, url: e.target.value })}
                        className="flex-1 p-3 border border-amber-300/50 rounded-lg focus:border-amber-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleBankUrlFetch(bankInputs.url)}
                        disabled={!bankInputs.url || bankInputs.isUrlLoading}
                        className="px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {bankInputs.isUrlLoading ? '⏳' : '🔍 Parse'}
                      </button>
                    </div>
                    {bankInputs.urlError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {bankInputs.urlError}
                      </div>
                    )}
                  </div>
                )}

                {/* Manual/Parsed Content Fields */}
                <input
                  type="text"
                  placeholder="Post title"
                  value={bankInputs.title || ''}
                  onChange={(e) => setBankInputs({ ...bankInputs, title: e.target.value })}
                  className="w-full p-3 border border-amber-300/50 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                <textarea
                  placeholder="Post content"
                  value={bankInputs.content || ''}
                  onChange={(e) => setBankInputs({ ...bankInputs, content: e.target.value })}
                  className="w-full p-3 border border-amber-300/50 rounded-lg h-24 focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Tags (optional)"
                  value={bankInputs.tags || ''}
                  onChange={(e) => setBankInputs({ ...bankInputs, tags: e.target.value })}
                  className="w-full p-3 border border-amber-300/50 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (bankInputs.title && bankInputs.content) {
                      addToTopicBank(selectedBankTopic, {
                        title: bankInputs.title,
                        content: bankInputs.content,
                        tags: bankInputs.tags || '',
                        source: bankInputs.url ? 'url' : 'manual',
                        sourceUrl: bankInputs.url || undefined
                      });
                      setBankInputs({ 
                        title: '', 
                        content: '', 
                        tags: '', 
                        url: '', 
                        inputMethod: bankInputs.inputMethod,
                        urlError: null 
                      });
                    }
                  }}
                  disabled={!bankInputs.title || !bankInputs.content}
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Save to {selectedBankTopic.charAt(0).toUpperCase() + selectedBankTopic.slice(1)} Bank
                </button>
              </div>
            </div>

            {/* Current Posts in Selected Bank */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-amber-800">
                  📚 {selectedBankTopic.charAt(0).toUpperCase() + selectedBankTopic.slice(1)} Posts
                </h4>
                <div className="text-sm text-amber-700/80">
                  {topicBank[selectedBankTopic]?.length || 0} posts saved
                </div>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {topicBank[selectedBankTopic]?.length > 0 ? (
                  topicBank[selectedBankTopic].map((post, index) => (
                    <div key={post.id} className="p-4 bg-gradient-to-r from-white to-amber-50/50 border border-amber-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-amber-900 mb-1">{post.title}</div>
                          <div className="text-sm text-amber-800/80 mb-2">{post.content}</div>
                          {post.tags && (
                            <div className="text-xs text-amber-700/60 mb-2">Tags: {post.tags}</div>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            {post.source === 'url' && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                🔗 From URL
                              </span>
                            )}
                            {post.source === 'manual' && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                ✏️ Manual
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-amber-600/50">
                            Saved: {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                          {post.sourceUrl && (
                            <div className="text-xs text-blue-600/70 mt-1">
                              Source: <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{post.sourceUrl}</a>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => movePostFromTopicBank(selectedBankTopic, post.id)}
                            className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 transition-colors"
                            title="Use this post (will be added to current day tab)"
                          >
                            Use
                          </button>
                          <button
                            onClick={() => removeFromTopicBank(selectedBankTopic, post.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                            title="Delete from bank"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 bg-amber-50/30 border border-amber-200/50 rounded-lg text-center text-amber-700/70">
                    <div className="text-4xl mb-3">🏪</div>
                    <p className="font-medium mb-2">No posts in this topic bank yet</p>
                    <p className="text-sm text-amber-600/80">
                      Save posts above to build your {selectedBankTopic} content library
                    </p>
                    <p className="text-xs text-amber-600/60 mt-2">
                      Posts can be used on any day of the week
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day-based Content Tabs */}
      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(activeTab) && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-comfort-navy flex items-center gap-2">
              📅 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content
            </h2>
            
            {/* Topic Selector for this day */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-comfort-navy">Topic:</label>
              <select
                value={dayTopicSelections[activeTab]}
                onChange={(e) => setDayTopicSelections({
                  ...dayTopicSelections,
                  [activeTab]: e.target.value
                })}
                className="px-3 py-1.5 border border-comfort-tan/50 rounded-lg bg-comfort-white focus:border-comfort-olive focus:outline-none text-sm"
              >
                {topicOptions.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Content Settings */}
          <div className="bg-gradient-to-r from-comfort-olive/10 to-comfort-navy/10 p-4 rounded-lg mb-6 border border-comfort-tan/30">
            <h3 className="font-medium text-comfort-navy mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-comfort-accent" />
              AI Content Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-comfort-navy/80 mb-1">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full p-2 border border-comfort-tan/50 rounded-lg text-sm focus:border-comfort-olive focus:outline-none"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="pinterest">Pinterest</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-comfort-navy/80 mb-1">Complexity</label>
                <select
                  value={contentComplexity}
                  onChange={(e) => setContentComplexity(e.target.value)}
                  className="w-full p-2 border border-comfort-tan/50 rounded-lg text-sm focus:border-comfort-olive focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-comfort-navy/60 mt-2">
              Content will be optimized for {selectedPlatform} with {contentComplexity} level complexity
            </p>
          </div>

          {/* Dynamic Content Input based on selected topic */}
          {(() => {
            const currentSelectedTopic = dayTopicSelections[activeTab];
            const currentTopicOption = topicOptions.find(t => t.value === currentSelectedTopic);
            const IconComponent = currentTopicOption?.icon || FileText;
            
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-comfort-tan/10 rounded-lg border border-comfort-tan/20">
                  <IconComponent className="w-5 h-5 text-comfort-accent" />
                  <span className="font-medium text-comfort-navy">
                    Creating {currentTopicOption?.label} content for {activeTab}
                  </span>
                </div>
                
                {/* URL Input Section */}
                <div className="mb-4 p-4 bg-comfort-tan/20 rounded-xl border border-comfort-tan/30">
                  <p className="text-sm text-comfort-navy mb-3">
                    💡 <strong>Quick Add:</strong> Paste a URL to auto-populate content fields
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Enter ${dayTopicSelections[activeTab]} URL (blog, video, recipe, etc.)`}
                      value={dayInputs[activeTab]?.url || ''}
                      onChange={(e) => setDayInputs({
                        ...dayInputs,
                        [activeTab]: { ...(dayInputs[activeTab] || {}), url: e.target.value }
                      })}
                      className="flex-1 p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        // TODO: Implement URL fetching functionality
                        alert('URL fetching functionality will be implemented next!');
                      }}
                      disabled={!dayInputs[activeTab]?.url}
                      className="px-4 py-3 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Fetch
                    </button>
                  </div>
                </div>

                {/* Manual Content Input */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder={`${dayTopicSelections[activeTab]} title`}
                    value={dayInputs[activeTab]?.title || ''}
                    onChange={(e) => setDayInputs({
                      ...dayInputs,
                      [activeTab]: { ...(dayInputs[activeTab] || {}), title: e.target.value }
                    })}
                    className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                  />
                  <textarea
                    placeholder={`${dayTopicSelections[activeTab]} description or content`}
                    value={dayInputs[activeTab]?.content || ''}
                    onChange={(e) => setDayInputs({
                      ...dayInputs,
                      [activeTab]: { ...(dayInputs[activeTab] || {}), content: e.target.value }
                    })}
                    className="w-full p-3 border border-comfort-tan/50 rounded-lg h-24 focus:border-comfort-olive focus:outline-none"
                  />
                  
                  {/* Topic-specific additional fields */}
                  {currentSelectedTopic === 'recipes' && (
                    <>
                      <input
                        type="text"
                        placeholder="Ingredients (comma separated)"
                        value={dayInputs[activeTab]?.field1 || ''}
                        onChange={(e) => setDayInputs({
                          ...dayInputs,
                          [activeTab]: { ...(dayInputs[activeTab] || {}), field1: e.target.value }
                        })}
                        className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Cooking time (e.g., 30 minutes)"
                        value={dayInputs[activeTab]?.field2 || ''}
                        onChange={(e) => setDayInputs({
                          ...dayInputs,
                          [activeTab]: { ...(dayInputs[activeTab] || {}), field2: e.target.value }
                        })}
                        className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                      />
                    </>
                  )}
                  
                  {currentSelectedTopic === 'workouts' && (
                    <>
                      <input
                        type="text"
                        placeholder="Duration (e.g., 20 minutes)"
                        value={dayInputs[activeTab]?.field1 || ''}
                        onChange={(e) => setDayInputs({
                          ...dayInputs,
                          [activeTab]: { ...dayInputs[activeTab], field1: e.target.value }
                        })}
                        className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Difficulty (Beginner/Intermediate/Advanced)"
                        value={dayInputs[activeTab]?.field2 || ''}
                        onChange={(e) => setDayInputs({
                          ...dayInputs,
                          [activeTab]: { ...(dayInputs[activeTab] || {}), field2: e.target.value }
                        })}
                        className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                      />
                    </>
                  )}
                  
                  {currentSelectedTopic === 'realestate' && (
                    <>
                      <input
                        type="text"
                        placeholder="Property type or market area"
                        value={dayInputs[activeTab]?.field1 || ''}
                        onChange={(e) => setDayInputs({
                          ...dayInputs,
                          [activeTab]: { ...dayInputs[activeTab], field1: e.target.value }
                        })}
                        className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Tips category (buying/selling/investing)"
                        value={dayInputs[activeTab]?.field2 || ''}
                        onChange={(e) => setDayInputs({
                          ...dayInputs,
                          [activeTab]: { ...(dayInputs[activeTab] || {}), field2: e.target.value }
                        })}
                        className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                      />
                    </>
                  )}
                  
                  {currentSelectedTopic === 'travel' && (
                    <>
                      <input
                        type="text"
                        placeholder="Destination"
                        value={dayInputs[activeTab]?.field1 || ''}
                        onChange={(e) => setDayInputs({
                          ...dayInputs,
                          [activeTab]: { ...dayInputs[activeTab], field1: e.target.value }
                        })}
                        className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Category (adventure/budget/luxury/family)"
                        value={dayInputs[activeTab]?.field2 || ''}
                        onChange={(e) => setDayInputs({
                          ...dayInputs,
          [activeTab]: { ...(dayInputs[activeTab] || {}), field2: e.target.value }
                        })}
                        className="w-full p-3 border border-comfort-tan/50 rounded-lg focus:border-comfort-olive focus:outline-none"
                      />
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => {
                      const inputs = dayInputs[activeTab];
                      if (inputs.title || inputs.content) {
                        const newContent = {
                          id: Date.now(),
                          title: inputs.title || `${dayTopicSelections[activeTab]} content`,
                          content: inputs.content || 'Manual content entry',
                          topic: dayTopicSelections[activeTab],
                          day: activeTab,
                          field1: inputs.field1,
                          field2: inputs.field2
                        };
                        addContentToDay(activeTab, newContent);
                        
                        // Also add to content calendar for dashboard calendar view
                        const today = new Date();
                        const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(activeTab);
                        const targetDate = new Date(today);
                        
                        // Calculate the next occurrence of this day
                        const currentDayIndex = today.getDay();
                        let daysToAdd = dayIndex - currentDayIndex;
                        if (daysToAdd <= 0) {
                          daysToAdd += 7; // Next week if the day has already passed this week
                        }
                        targetDate.setDate(today.getDate() + daysToAdd);
                        
                        const calendarPost = {
                          id: Date.now() + Math.random(),
                          date: targetDate.toISOString().split('T')[0],
                          dayName: activeTab,
                          contentType: dayTopicSelections[activeTab],
                          content: {
                            title: newContent.title,
                            content: newContent.content,
                            description: `Manual ${dayTopicSelections[activeTab]} content for ${activeTab}`
                          },
                          platforms: ['instagram', 'linkedin', 'facebook'],
                          status: 'draft',
                          variations: {
                            instagram: newContent.content,
                            linkedin: newContent.content,
                            facebook: newContent.content
                          }
                        };
                        
                        setContentCalendar(prev => [...prev, calendarPost]);
                        console.log(`✅ Added manual content for ${activeTab} and added to calendar`);
                        console.log(`📅 Calendar post scheduled for ${targetDate.toLocaleDateString()}`);
                        
                        // Clear inputs
                        setDayInputs({
                          ...dayInputs,
                          [activeTab]: { title: '', content: '', url: '', field1: '', field2: '' }
                        });
                      }
                    }}
                    disabled={!dayInputs[activeTab]?.title && !dayInputs[activeTab]?.content}
                    className="flex-1 px-4 py-3 bg-comfort-navy text-comfort-white rounded-lg hover:bg-comfort-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </button>
                  <button 
                    onClick={() => generateDayAIContent(activeTab)}
                    disabled={isGenerating}
                    className="flex-1 px-4 py-3 bg-comfort-accent text-comfort-white rounded-lg hover:bg-comfort-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate AI Content'}
                  </button>
                </div>

                {/* Content List */}
                <div className="mt-6">
                  <h3 className="font-medium text-comfort-navy mb-3">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content ({dayContent[activeTab]?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {dayContent[activeTab]?.length > 0 ? (
                      dayContent[activeTab].map((item, index) => (
                        <div key={index} className="p-3 bg-comfort-white border border-comfort-tan/30 rounded-lg">
                          <div className="font-medium text-comfort-navy">{item.title}</div>
                          <div className="text-sm text-comfort-navy/70 mt-1">{item.content}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-comfort-tan/10 rounded-lg text-center text-comfort-navy/60">
                        No {currentSelectedTopic} content added yet. Add some content above!
                      </div>
                    )}
                  </div>
                </div>


              </div>
            );
          })()}
        </div>
      )}

      {/* Keep existing specialized tabs for now */}
      {activeTab === 'recipes-old' && (
        <div className="bg-gradient-to-br from-comfort-white via-comfort-tan/10 to-comfort-white rounded-xl shadow-md p-6 border border-comfort-tan/30">
          <h2 className="text-xl font-semibold mb-4 text-comfort-navy flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-comfort-accent" />
            Recipe Management
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
          
          {/* AI Content Settings */}
          <div className="bg-gradient-to-r from-comfort-olive/10 to-comfort-navy/10 p-4 rounded-lg mb-6 border border-comfort-tan/30">
            <h3 className="font-medium text-comfort-navy mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-comfort-accent" />
              AI Content Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-comfort-navy/80 mb-1">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full p-2 border border-comfort-tan/50 rounded-lg text-sm focus:border-comfort-olive focus:outline-none"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="pinterest">Pinterest</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-comfort-navy/80 mb-1">Complexity</label>
                <select
                  value={contentComplexity}
                  onChange={(e) => setContentComplexity(e.target.value)}
                  className="w-full p-2 border border-comfort-tan/50 rounded-lg text-sm focus:border-comfort-olive focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-comfort-navy/60 mt-2">
              Content will be optimized for {selectedPlatform} with {contentComplexity} level complexity
            </p>
          </div>
          
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



      {activeTab === 'generate' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">📅 Content Calendar & Generation</h2>
          
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
                    onChange={(e) => setDayTopicSelections({...dayTopicSelections, [day]: e.target.value})}
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

          {/* Week Selection */}
          <div className="bg-gradient-to-r from-comfort-accent/10 to-comfort-olive/10 p-4 rounded-xl border border-comfort-tan/30 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-comfort-accent" />
                <label className="text-sm font-medium text-comfort-navy">Generate Content For:</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={numberOfWeeks}
                  onChange={(e) => setNumberOfWeeks(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                  className="w-16 px-2 py-1 border border-comfort-tan/50 rounded text-center text-sm focus:border-comfort-olive focus:outline-none"
                />
                <span className="text-sm text-comfort-navy">
                  {numberOfWeeks === 1 ? 'week' : 'weeks'} 
                  <span className="text-comfort-navy/60 ml-1">
                    ({numberOfWeeks * 7} posts total)
                  </span>
                </span>
              </div>
            </div>
            <p className="text-xs text-comfort-navy/60 mt-2">
              ✨ Generate content for multiple weeks in advance. Each week follows your daily schedule above.
              {numberOfWeeks > 1 && (
                <span className="block mt-1 text-comfort-accent">
                  📅 Will generate {numberOfWeeks * 7} posts spanning {numberOfWeeks} consecutive weeks
                </span>
              )}
            </p>
          </div>

          <button
            onClick={generateWeeklyContent}
            disabled={isGenerating}
            className={`w-full px-6 py-3 text-comfort-white rounded-lg font-medium shadow transition ${
              isGenerating ? 'bg-gray-400' : 'bg-comfort-navy hover:bg-comfort-olive'
            }`}
          >
            {isGenerating ? `Generating ${numberOfWeeks} ${numberOfWeeks === 1 ? 'week' : 'weeks'}...` : `Generate ${numberOfWeeks} ${numberOfWeeks === 1 ? 'Week' : 'Weeks'} of Content`}
          </button>

          {/* Calendar View Section - Always Visible */}
          <div className="mt-8 pt-8 border-t border-comfort-tan/30">
              {/* Calendar Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-comfort-navy flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-comfort-accent" />
                  Generated Content Calendar
                </h3>
                
                {/* Export and Management Buttons - Only show when content exists */}
                {contentCalendar.length > 0 && (
                  <div className="flex items-center gap-3">
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
                    
                    <div className="border-l border-comfort-tan/30 pl-3">
                      <button
                        onClick={() => {
                          const confirmClear = window.confirm(`Are you sure you want to discard ALL ${contentCalendar.length} generated posts? This action cannot be undone.`);
                          if (confirmClear) {
                            setContentCalendar([]);
                            console.log('🗑️ Cleared all generated content');
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors shadow"
                        title="Discard all generated posts"
                      >
                        <Trash2 size={14} />
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Calendar Navigation - Always show view selector */}
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

                {/* Content Status */}
                <div className="text-sm text-comfort-navy/70">
                  {contentCalendar.length === 0 
                    ? 'No content generated yet' 
                    : `${contentCalendar.length} posts scheduled`
                  }
                </div>
              </div>

              {/* Calendar Navigation with Date Controls - Only show when there's content */}
              {contentCalendar.length > 0 && (
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
              )}

              {/* Content Calendar Display */}
              {contentCalendar.length === 0 ? (
                <div key="empty-state" className="text-center py-12">
                  <div className="bg-comfort-tan/20 border border-comfort-tan/50 rounded-lg p-6 max-w-md mx-auto">
                    <Calendar className="w-12 h-12 text-comfort-accent mx-auto mb-4" />
                    <h4 className="font-medium text-comfort-navy mb-2">📅 Your Content Calendar</h4>
                    <p className="text-sm text-comfort-navy/80 mb-4">
                      Generate your weekly content above to see it appear in this calendar. You can then view, organize, and export it for scheduling.
                    </p>
                    <div className="text-xs text-comfort-navy/60">
                      ✨ Ready for Buffer integration once content is generated
                    </div>
                    <div className="text-xs text-red-500 mt-2">
                      Debug: Calendar length = {contentCalendar.length}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={`calendar-${contentCalendar.length}`} className="calendar-content">
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
                                className={`group relative text-xs p-1 rounded truncate cursor-pointer ${
                                  post.contentType === 'recipe' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                                  post.contentType === 'workout' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                  post.contentType === 'realEstate' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                  post.contentType === 'mindfulness' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                                  post.contentType === 'motivational' ? 'bg-pink-100 text-pink-800 hover:bg-pink-200' :
                                  'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                                }`}
                                title={`${post.content.title} - Click to discard`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteGeneratedPost(post.id);
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate flex-1">{post.content.title}</span>
                                  <Trash2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0" />
                                </div>
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
              {contentCalendar.length > 0 && calendarView === 'week' && (
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
                              className={`group relative p-2 rounded text-xs border-l-4 cursor-pointer hover:shadow-sm transition-all ${
                                post.contentType === 'recipe' ? 'bg-orange-50 border-orange-400 hover:bg-orange-100' :
                                post.contentType === 'workout' ? 'bg-green-50 border-green-400 hover:bg-green-100' :
                                post.contentType === 'realEstate' ? 'bg-blue-50 border-blue-400 hover:bg-blue-100' :
                                post.contentType === 'mindfulness' ? 'bg-purple-50 border-purple-400 hover:bg-purple-100' :
                                post.contentType === 'motivational' ? 'bg-pink-50 border-pink-400 hover:bg-pink-100' :
                                'bg-indigo-50 border-indigo-400 hover:bg-indigo-100'
                              }`}
                              title={`${post.content.title} - Click to discard`}
                              onClick={() => deleteGeneratedPost(post.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-comfort-navy truncate">
                                    {post.content.title}
                                  </div>
                                  <div className="text-comfort-navy/60 mt-1">
                                    {contentTypes[post.contentType]?.name || post.contentType}
                                  </div>
                                </div>
                                <Trash2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0 text-red-500" />
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
              {contentCalendar.length > 0 && calendarView === 'day' && (
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
                          <button
                            onClick={() => deleteGeneratedPost(post.id)}
                            className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                            title="Discard this generated post"
                          >
                            <Trash2 size={16} />
                            Discard
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
                    ))
                  )}
                </div>
              )}

              {/* List View */}
              {contentCalendar.length > 0 && calendarView === 'list' && (
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
                            onClick={() => deleteGeneratedPost(post.id)}
                            className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm"
                            title="Discard this generated post"
                          >
                            <Trash2 size={16} />
                            Discard
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
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PreBuffer;
