'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Calendar, Copy, Target, FileText, ChefHat, Dumbbell, Lightbulb, X, Plane, Smartphone, DollarSign, Sparkles, Heart, Building, Coffee, ChevronDown, Download, Home, GraduationCap, Zap, Trash2, Menu, Plus, CalendarDays, Loader2 } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import Tooltip from '@/components/Tooltip';
// contentLibrary removed - was unused and can be dynamically imported if needed in the future

// Dynamic imports for tab-specific components to reduce initial bundle size
const WeeklyPresetsManager = dynamic(() => import('@/components/WeeklyPresetsManager'), {
  loading: () => <ComponentLoader />,
  ssr: true,
});

const ContentManager = dynamic(() => import('@/components/ContentManager'), {
  loading: () => <ComponentLoader />,
  ssr: true,
});

const CalendarComponent = dynamic(() => import('@/components/CalendarComponent'), {
  loading: () => <ComponentLoader />,
  ssr: true,
});

const DayPlannerView = dynamic(() => import('@/components/DayPlannerView'), {
  loading: () => <ComponentLoader />,
  ssr: true,
});

// Loading component for dynamic imports
function ComponentLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-planner-accent animate-spin" />
        <p className="text-sm text-planner-text-muted">Loading...</p>
      </div>
    </div>
  );
}

// API Base URL - uses environment variable in production, empty for dev (uses proxy)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Debug utility - only logs in development mode
const DEBUG = process.env.NODE_ENV === 'development';
const debug = (...args: any[]) => DEBUG && console.log(...args);

interface ImageRecommendation {
  type: string;
  elements: string;
  style: string;
  colors: string;
  textOverlay: string;
}

interface ContentItem {
  id: string;
  title: string;
  content: string;
  tags: string;
  url?: string;
  imageUrl?: string;
  field1?: string;
  field2?: string;
  imageRecommendations?: ImageRecommendation[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string;
  url?: string;
  imageUrl?: string;
  field1?: string;
  field2?: string;
  createdAt: string;
  used?: boolean;
  items?: ContentItem[]; // Multiple content items per post
  imageRecommendations?: ImageRecommendation[];
}

interface Preset {
  id: number;
  name: string;
  description: string;
  schedule: {
    [key: string]: {
      enabled: boolean;
      topic: string;
      time: string;
    };
  };
  platforms: {
    instagram: boolean;
    linkedin: boolean;
    facebook: boolean;
  };
  createdAt: string;
}

interface ScheduledContent {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  items?: ContentItem[]; // Multiple content items per scheduled post
  imageRecommendations?: ImageRecommendation[];
}

interface PlannerPost {
  id: string | number;
  date: string;
  dayName: string;
  contentType: string;
  content: {
    title: string;
    description?: string;
  };
  variations: {
    instagram: string;
    linkedin: string;
    facebook: string;
  };
  status: string;
}

export default function SocialMediaAgent() {
  // State initialization
  const [recipes, setRecipes] = useState<Post[]>([]);
  const [workouts, setWorkouts] = useState<Post[]>([]);
  const [realEstateTips, setRealEstateTips] = useState<Post[]>([]);
  const [mindfulnessPosts, setMindfulnessPosts] = useState<Post[]>([]);
  const [educationalContent, setEducationalContent] = useState<Post[]>([]);
  const [motivationalContent, setMotivationalContent] = useState<Post[]>([]);
  const [travelContent, setTravelContent] = useState<Post[]>([]);
  const [techContent, setTechContent] = useState<Post[]>([]);
  const [financeContent, setFinanceContent] = useState<Post[]>([]);
  const [beautyContent, setBeautyContent] = useState<Post[]>([]);
  const [parentingContent, setParentingContent] = useState<Post[]>([]);
  const [businessContent, setBusinessContent] = useState<Post[]>([]);
  const [lifestyleContent, setLifestyleContent] = useState<Post[]>([]);
  const [events, setEvents] = useState<Post[]>([]);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  
  // Weekly presets state (single source of truth)
  const [presets, setPresets] = useState<Preset[]>([]);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedContentType, setSelectedContentType] = useState('recipes');

  // Custom categories
  const [customCategories, setCustomCategories] = useState<{[key: string]: Post[]}>({});
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📝');
  
  // AI generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [generationMode, setGenerationMode] = useState('calendar');
  const [weeklyPrompt, setWeeklyPrompt] = useState('');
  
  // Multi-content state
  const [multiContentMode, setMultiContentMode] = useState(false);
  const [contentItemCount, setContentItemCount] = useState(1);
  const [generatedItems, setGeneratedItems] = useState<ContentItem[]>([]);
  const [dayTopicSelections, setDayTopicSelections] = useState({
    monday: 'recipes',
    tuesday: 'workouts',
    wednesday: 'realestate',
    thursday: 'mindfulness',
    friday: 'travel',
    saturday: 'tech',
    sunday: 'finance'
  });
  const [generationType, setGenerationType] = useState<'week' | 'individual'>('week');
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    instagram: true,
    facebook: false,
    linkedin: false,
    twitter: false
  });
  
  // API Integration states
  const [selectedTone, setSelectedTone] = useState('Casual');
  const [baseCaption, setBaseCaption] = useState('');
  const [currentCaption, setCurrentCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [canvaTemplateId, setCanvaTemplateId] = useState('');
  const [weeklyPosts, setWeeklyPosts] = useState<PlannerPost[]>([]);
  const [isChangingTone, setIsChangingTone] = useState(false);
  const [isCreatingDesign, setIsCreatingDesign] = useState(false);
  const [weeklyGenMode, setWeeklyGenMode] = useState('ai'); // 'ai' or 'template'

  // Content mix for generation
  const [contentMix, setContentMix] = useState({
    recipes: true,
    workouts: true,
    realestate: true,
    mindfulness: true,
    travel: true,
    tech: true,
    finance: true,
    beauty: true,
    parenting: true,
    business: true,
    lifestyle: true,
    educational: true,
    motivational: true
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

  // Content collections (including custom categories)
  const contentCollections = useMemo(() => {
    const baseCollections: any = {
      recipes: { data: recipes, setter: setRecipes },
      workouts: { data: workouts, setter: setWorkouts },
      realestate: { data: realEstateTips, setter: setRealEstateTips },
      mindfulness: { data: mindfulnessPosts, setter: setMindfulnessPosts },
      travel: { data: travelContent, setter: setTravelContent },
      tech: { data: techContent, setter: setTechContent },
      finance: { data: financeContent, setter: setFinanceContent },
      beauty: { data: beautyContent, setter: setBeautyContent },
      parenting: { data: parentingContent, setter: setParentingContent },
      business: { data: businessContent, setter: setBusinessContent },
      lifestyle: { data: lifestyleContent, setter: setLifestyleContent },
      educational: { data: educationalContent, setter: setEducationalContent },
      motivational: { data: motivationalContent, setter: setMotivationalContent },
      events: { data: events, setter: setEvents }
    };

    // Add custom categories
    Object.keys(customCategories).forEach(key => {
      baseCollections[key] = {
        data: customCategories[key],
        setter: (newData: Post[]) => {
          setCustomCategories(prev => ({
            ...prev,
            [key]: newData
          }));
        }
      };
    });

    return baseCollections;
  }, [recipes, workouts, realEstateTips, mindfulnessPosts, travelContent, techContent, financeContent, beautyContent, parentingContent, businessContent, lifestyleContent, educationalContent, motivationalContent, events, customCategories]);

  // Stats calculation
  const stats = useMemo(() => {
    const allContent = Object.values(contentCollections).reduce((acc: number, collection: any) => acc + collection.data.length, 0);
    const usedPosts = Object.values(contentCollections).reduce((acc: number, collection: any) =>
      acc + collection.data.filter((post: Post) => post.used).length, 0);

    return {
      totalPosts: allContent,
      usedPosts: usedPosts,
      availablePosts: allContent - usedPosts,
      categories: topicOptions.length + Object.keys(customCategories).length,
      scheduledPosts: scheduledContent.length
    };
  }, [contentCollections, scheduledContent, customCategories]);

  // Example categories and schedule for demo purposes
  const demoCategories = topicOptions.slice(0, 8);
  const demoSchedule = [
    { day: 'Monday', posts: 2 },
    { day: 'Tuesday', posts: 1 },
    { day: 'Wednesday', posts: 3 },
    { day: 'Thursday', posts: 2 },
    { day: 'Friday', posts: 1 },
    { day: 'Saturday', posts: 2 },
    { day: 'Sunday', posts: 1 },
  ];

  // API Functions
  const generateAIContent = useCallback(async (prompt: string, tone: string = 'casual') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tone })
      });
      
      if (!response.ok) throw new Error('Failed to generate content');
      
      const data = await response.json();
      return data.caption;
    } catch (error) {
      console.error('Error generating AI content:', error);
      return 'Error generating content. Please try again.';
    }
  }, []);

  // Generate multiple content items at once
  const generateMultipleContent = useCallback(async (prompt: string, count: number, tone: string = 'casual') => {
    setIsGenerating(true);
    try {
      const items: ContentItem[] = [];
      
      for (let i = 0; i < count; i++) {
        const itemPrompt = `${prompt} (Item ${i + 1} of ${count} - make each unique and different)`;
        const content = await generateAIContent(itemPrompt, tone);
        
        items.push({
          id: `item-${Date.now()}-${i}`,
          title: `${selectedContentType} ${i + 1}`,
          content,
          tags: `#${selectedContentType} #content${i + 1}`,
        });
      }
      
      setGeneratedItems(items);
      return items;
    } catch (error) {
      console.error('Error generating multiple content:', error);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [generateAIContent, selectedContentType]);

  // Generate image recommendations
  const generateImageRecommendations = useCallback(async (title: string, content: string, contentType: string, platform: string = 'instagram') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/image-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, contentType, platform })
      });
      
      if (!response.ok) throw new Error('Failed to generate image recommendations');
      
      const data = await response.json();
      return data.recommendations || [];
    } catch (error) {
      console.error('Error generating image recommendations:', error);
      return [];
    }
  }, []);

  // Update content with proper date references
  const updateContentWithDate = useCallback((content: string, targetDate: Date) => {
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const fullDate = targetDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Replace common date placeholders
    let updatedContent = content
      .replace(/\[DAY\]/g, dayName)
      .replace(/\[DATE\]/g, monthDay)
      .replace(/\[FULL_DATE\]/g, fullDate)
      .replace(/today/gi, `this ${dayName}`)
      .replace(/tomorrow/gi, `${dayName}`)
      .replace(/this week/gi, `this ${dayName}`);

    return updatedContent;
  }, []);

  // Add multiple items to a content collection
  const addMultipleItemsToCollection = useCallback((items: ContentItem[], contentType: string) => {
    const collection = contentCollections[contentType];
    if (!collection) return;

    const newPost: Post = {
      id: `multi-${Date.now()}`,
      title: `Multiple ${contentType}`,
      content: `Collection of ${items.length} ${contentType}`,
      tags: items.map(item => item.tags).join(' '),
      createdAt: new Date().toISOString(),
      used: false,
      items: items
    };

    collection.setter([...collection.data, newPost]);
  }, [contentCollections]);

  const changeTone = useCallback(async (caption: string, tone: string) => {
    setIsChangingTone(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/variation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseCaption: caption, tone })
      });
      
      if (!response.ok) throw new Error('Failed to change tone');
      
      const data = await response.json();
      setCurrentCaption(data.caption);
    } catch (error) {
      console.error('Error changing tone:', error);
    } finally {
      setIsChangingTone(false);
    }
  }, []);

  const generateWeeklyContent = useCallback(async () => {
    setIsGeneratingWeek(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-week`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: weeklyPrompt || 'Create engaging social media content for Project Comfort',
          tone: 'casual'
        })
      });

      if (!response.ok) throw new Error('Failed to generate weekly content');

      const data = await response.json();
      const generatedPosts = data.posts || [];

      const groupedByDay = generatedPosts.reduce((acc: Record<string, any[]>, post: any) => {
        const day = post.day || new Date(post.date).toLocaleDateString('en-us', { weekday: 'long' });
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(post);
        return acc;
      }, {});

      const newPlannerPosts: PlannerPost[] = Object.keys(groupedByDay).map(day => {
        const postsForDay = groupedByDay[day];
        const firstPost = postsForDay[0];

        const variations = postsForDay.reduce((acc: Record<string, string>, post: any) => {
          acc[post.platform] = post.caption;
          return acc;
        }, { instagram: '', linkedin: '', facebook: '', twitter: '' });

        return {
          id: `ai-${day}-${Date.now()}`,
          date: firstPost.date || new Date().toISOString().split('T')[0],
          dayName: day,
          contentType: firstPost.tags || 'AI Generated',
          content: {
            title: firstPost.title || `${day} - AI Generated`,
            description: firstPost.content || firstPost.caption,
          },
          variations,
          status: 'draft',
        };
      });

      // Update weekly posts for the Day Planner view
      setWeeklyPosts(prev => [...prev, ...newPlannerPosts]);

      // Also populate the calendar with scheduled content
      const newScheduledContent: ScheduledContent[] = newPlannerPosts.map(post => {
        // Calculate the next occurrence of this day
        const today = new Date();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDayIndex = dayNames.indexOf(post.dayName.toLowerCase());
        const currentDayIndex = today.getDay();
        
        let daysUntilTarget = targetDayIndex - currentDayIndex;
        if (daysUntilTarget <= 0) {
          daysUntilTarget += 7; // Next week
        }
        
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilTarget);

        return {
          id: `ai-scheduled-${post.id}`,
          title: post.content.title,
          content: updateContentWithDate(post.content.description || '', targetDate),
          date: targetDate.toISOString().split('T')[0],
          time: '09:00', // Default time
          platform: 'instagram', // Default platform
          status: 'draft' as const,
          createdAt: new Date().toISOString(),
        };
      });

      setScheduledContent(prev => [...prev, ...newScheduledContent]);

    } catch (error) {
      console.error('Error generating weekly content:', error);
    } finally {
      setIsGeneratingWeek(false);
    }
  }, [weeklyPrompt]);

  const generateIndividualDays = useCallback(async () => {
    const daysToGenerate = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day);

    const platformsToGenerate = Object.entries(selectedPlatforms)
      .filter(([_, isSelected]) => isSelected)
      .map(([platform]) => platform);

    if (daysToGenerate.length === 0) {
      alert('Please select at least one day to generate content for');
      return;
    }

    if (platformsToGenerate.length === 0) {
      alert('Please select at least one platform to generate content for');
      return;
    }

    setIsGeneratingWeek(true);
    try {
      const dayPrompts: Record<string, string> = {
        monday: 'Create an engaging social media post for Monday - focus on motivation, fresh starts, and weekly planning',
        tuesday: 'Create an engaging social media post for Tuesday - focus on productivity, momentum, and getting things done',
        wednesday: 'Create an engaging social media post for Wednesday - focus on midweek energy, staying focused, and progress',
        thursday: 'Create an engaging social media post for Thursday - focus on perseverance, almost there, and finishing strong',
        friday: 'Create an engaging social media post for Friday - focus on achievements, celebration, and weekend anticipation',
        saturday: 'Create an engaging social media post for Saturday - focus on relaxation, fun activities, and personal time',
        sunday: 'Create an engaging social media post for Sunday - focus on reflection, preparation, and self-care'
      };

      const generatedContent: Record<string, Record<string, string>> = {};

      for (const day of daysToGenerate) {
        generatedContent[day] = {};
        for (const platform of platformsToGenerate) {
          const prompt = weeklyPrompt || dayPrompts[day] || 'Create engaging social media content';

          const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, tone: 'casual' })
          });

          if (response.ok) {
            const data = await response.json();
            generatedContent[day][platform] = data.caption || '';
          }
        }
      }

      const newPlannerPosts: PlannerPost[] = Object.keys(generatedContent).map(day => {
        const variations = {
          instagram: generatedContent[day]['instagram'] || '',
          linkedin: generatedContent[day]['linkedin'] || '',
          facebook: generatedContent[day]['facebook'] || '',
          twitter: generatedContent[day]['twitter'] || ''
        };

        return {
          id: `ai-${day}-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          dayName: day.charAt(0).toUpperCase() + day.slice(1),
          contentType: dayTopicSelections[day as keyof typeof dayTopicSelections],
          content: {
            title: `${day.charAt(0).toUpperCase() + day.slice(1)} - AI Generated`,
            description: variations.instagram || variations.linkedin || variations.facebook || variations.twitter,
          },
          variations,
          status: 'draft',
        };
      });

      setWeeklyPosts(prev => [...prev, ...newPlannerPosts]);

      // Clear selected days after generation
      setSelectedDays({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      });

    } catch (error) {
      console.error('Error generating individual day content:', error);
    } finally {
      setIsGeneratingWeek(false);
    }
  }, [selectedDays, selectedPlatforms, weeklyPrompt, dayTopicSelections]);

  const markContentAsUsed = useCallback((postId: string) => {
    // This would update the post's used status across all content arrays
    // For now, we'll just log it
    console.log('Marking content as used:', postId);
  }, []);

  // Load sample content on mount - COMMENTED OUT TO START WITH EMPTY STATE
  // useEffect(() => {
  //   // Load sample content from contentLibrary
  //   const sampleRecipes = contentLibrary.workouts.map((item, index) => ({
  //     id: `recipe-${index}`,
  //     title: item.title,
  //     content: item.content,
  //     tags: item.benefits || '',
  //     createdAt: new Date().toISOString(),
  //     used: false
  //   }));
  //
  //   const sampleMotivational = contentLibrary.motivational.map((item, index) => ({
  //     id: `motivational-${index}`,
  //     title: item.title,
  //     content: item.content,
  //     tags: item.insights || '',
  //     createdAt: new Date().toISOString(),
  //     used: false
  //   }));
  //
  //   const sampleEducational = contentLibrary.educational.map((item, index) => ({
  //     id: `educational-${index}`,
  //     title: item.title,
  //     content: item.content,
  //     tags: item.science || '',
  //     createdAt: new Date().toISOString(),
  //     used: false
  //   }));

  //   setRecipes(sampleRecipes);
  //   setMotivationalContent(sampleMotivational);
  //   setEducationalContent(sampleEducational);
  // }, []);

  return (
    <div className="min-h-screen bg-planner-page" style={{ backgroundImage: 'url(/paper-fibers.png)' }}>
      {/* Top Header with Logo and User */}
      <div className="bg-planner-paper shadow-planner border-b border-planner-border backdrop-blur-sm" style={{ backgroundImage: 'url(/paper-fibers.png)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-planner-accent/10 rounded-lg">
                <CalendarDays className="w-6 h-6 text-planner-accent" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-planner-text">Post Planner</h1>
            </div>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Planner Layout - Side Tabs + Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row bg-planner-page shadow-planner-xl rounded-2xl overflow-hidden border border-planner-border relative min-h-[calc(100vh-12rem)] transition-all duration-300" style={{ backgroundImage: 'url(/paper-fibers.png)' }}>
          {/* Bookmark Ribbon */}
          <div className="absolute right-6 top-0 w-3 h-16 bg-planner-accent rounded-b-md shadow-planner-lg z-10"></div>

          {/* Side Tabs Navigation */}
          <div className="flex md:flex-col bg-planner-sidebar border-b md:border-b-0 md:border-r border-planner-border-dark overflow-x-auto md:overflow-x-visible scrollbar-hide" style={{ backgroundImage: 'url(/paper-fibers.png)' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home, tooltip: 'Dashboard - View stats and overview' },
              { id: 'content', label: 'Daily Content', icon: FileText, tooltip: 'Daily Content - Create and manage your daily content' },
              { id: 'presets', label: 'Daily Topic Presets', icon: Calendar, tooltip: 'Daily Topic Presets - Manage daily posting schedules' },
              { id: 'calendar', label: 'Calendar', icon: Calendar, tooltip: 'Calendar - Schedule and view posts' },
              { id: 'ai', label: 'AI Content Generator', icon: Sparkles, tooltip: 'AI Content Generator - Generate content with AI' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 md:px-6 py-4 font-medium transition-all duration-200 ease-smooth relative whitespace-nowrap group flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-planner-page border-l-4 md:border-l-4 border-b-4 md:border-b-0 border-planner-accent-dark text-planner-text shadow-inner-planner'
                    : 'text-planner-text-muted hover:bg-planner-hover hover:text-planner-text'
                }`}
              >
                <tab.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Page Content Area */}
          <div className="flex-1 bg-planner-paper p-6 md:p-10 relative overflow-auto" style={{ backgroundImage: 'url(/paper-fibers.png)' }}>
            {/* Subtle paper texture overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-planner-shadow/20 rounded-xl"></div>

            <div className="relative z-10">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-planner-text mb-2">Welcome Back!</h2>
              <p className="text-planner-text-medium">Here's what's happening with your content today</p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Posts */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-planner-accent/10 via-planner-page to-planner-page border border-planner-border shadow-planner-lg hover:shadow-planner-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-planner-accent/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-planner-accent/20 rounded-xl">
                      <FileText className="w-6 h-6 text-planner-accent" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-planner-text-medium mb-1">Total Posts</h3>
                  <p className="text-3xl font-bold text-planner-text mb-2">{stats.totalPosts}</p>
                  <div className="w-full bg-planner-border rounded-full h-1.5">
                    <div className="bg-planner-accent h-1.5 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              {/* Used Posts */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-planner-page to-planner-page border border-planner-border shadow-planner-lg hover:shadow-planner-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <h3 className="text-sm font-medium text-planner-text-medium mb-1">Used Posts</h3>
                  <p className="text-3xl font-bold text-planner-text mb-2">{stats.usedPosts}</p>
                  <div className="w-full bg-planner-border rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: stats.totalPosts > 0 ? `${(stats.usedPosts / stats.totalPosts) * 100}%` : '0%' }}></div>
                  </div>
                </div>
              </div>

              {/* Available Posts */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-planner-page to-planner-page border border-planner-border shadow-planner-lg hover:shadow-planner-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Copy className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">Ready</span>
                  </div>
                  <h3 className="text-sm font-medium text-planner-text-medium mb-1">Available</h3>
                  <p className="text-3xl font-bold text-planner-text mb-2">{stats.availablePosts}</p>
                  <div className="w-full bg-planner-border rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: stats.totalPosts > 0 ? `${(stats.availablePosts / stats.totalPosts) * 100}%` : '0%' }}></div>
                  </div>
                </div>
              </div>

              {/* Scheduled Posts */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-planner-page to-planner-page border border-planner-border shadow-planner-lg hover:shadow-planner-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-full">This Week</span>
                  </div>
                  <h3 className="text-sm font-medium text-planner-text-medium mb-1">Scheduled</h3>
                  <p className="text-3xl font-bold text-planner-text mb-2">{stats.scheduledPosts}</p>
                  <div className="w-full bg-planner-border rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Overview */}
              <div className="lg:col-span-2 card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-semibold text-planner-text">Weekly Overview</h3>
                  <button className="text-xs text-planner-accent hover:text-planner-accent-dark font-medium">View All →</button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {demoSchedule.map((item, idx) => {
                    const heights = ['h-12', 'h-8', 'h-16', 'h-12', 'h-6', 'h-14', 'h-10'];
                    const colors = ['bg-planner-accent', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-yellow-400'];
                    return (
                      <div key={item.day} className="flex flex-col items-center gap-2">
                        <div className="text-xs font-medium text-planner-text-medium">{item.day.slice(0, 3)}</div>
                        <div className="w-full bg-planner-sidebar/30 rounded-lg h-24 flex items-end p-1 relative group cursor-pointer">
                          <div className={`w-full ${heights[idx]} ${colors[idx]} rounded transition-all duration-300 group-hover:opacity-80`}></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-white">{item.posts}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-xl font-serif font-semibold text-planner-text mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('content')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-planner-page hover:bg-planner-hover border border-planner-border transition-all group"
                  >
                    <div className="p-2 bg-planner-accent/10 rounded-lg group-hover:bg-planner-accent/20 transition-colors">
                      <Plus className="w-4 h-4 text-planner-accent" />
                    </div>
                    <span className="text-sm font-medium text-planner-text">Add New Content</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-planner-page hover:bg-planner-hover border border-planner-border transition-all group"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-planner-text">Schedule Post</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-planner-page hover:bg-planner-hover border border-planner-border transition-all group"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-planner-text">Generate with AI</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('presets')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-planner-page hover:bg-planner-hover border border-planner-border transition-all group"
                  >
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Target className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-planner-text">Manage Presets</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Categories Overview */}
            <div className="card">
              <h3 className="text-xl font-serif font-semibold text-planner-text mb-6">Content Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {demoCategories.map((cat) => {
                  const count = contentCollections[cat.value]?.data?.length || 0;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedContentType(cat.value);
                        setActiveTab('content');
                      }}
                      className="group relative overflow-hidden rounded-xl bg-planner-page hover:bg-planner-hover border border-planner-border p-4 transition-all hover:shadow-planner-lg"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="p-3 bg-planner-accent/10 rounded-xl group-hover:bg-planner-accent/20 transition-colors">
                          {React.createElement(cat.icon, { className: "w-6 h-6 text-planner-accent" })}
                        </div>
                        <span className="font-medium text-planner-text text-sm text-center">{cat.label}</span>
                        <span className="text-xs text-planner-text-muted">{count} items</span>
                      </div>
                      {count > 0 && (
                        <div className="absolute top-2 right-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-planner-accent text-white text-xs font-bold">
                            {count}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div>
            <WeeklyPresetsManager presets={presets} setPresets={setPresets} />
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Daily Planner Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-planner-text tracking-wide">Generated Content Schedule</h2>
              
              {/* Content Calendar View */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-planner-border">
                <DayPlannerView
                  contentCalendar={weeklyPosts}
                  setContentCalendar={setWeeklyPosts}
                />
              </div>
            </div>

            {/* Content Library Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-planner-text tracking-wide">Content Library</h2>

            {/* Content Type Selector */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-planner-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-planner-text">Select Content Type</h3>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={multiContentMode}
                      onChange={(e) => setMultiContentMode(e.target.checked)}
                      className="rounded border-planner-border text-planner-accent focus:ring-planner-accent"
                    />
                    <span className="text-planner-text">Multi-Content Mode</span>
                  </label>
                  <button
                    onClick={() => setIsAddingCategory(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-planner-accent hover:bg-planner-accent-dark text-white rounded-lg transition-colors text-sm shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Custom Category</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Built-in categories */}
                {topicOptions.map((topic) => (
                  <button
                    key={topic.value}
                    onClick={() => setSelectedContentType(topic.value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedContentType === topic.value
                        ? 'border-planner-accent bg-planner-sidebar/50'
                        : 'border-planner-border hover:border-planner-accent/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {React.createElement(topic.icon, { className: `w-6 h-6 ${selectedContentType === topic.value ? 'text-planner-accent' : 'text-planner-text-muted'}` })}
                      <span className="text-sm font-medium text-planner-text">{topic.label}</span>
                    </div>
                  </button>
                ))}

                {/* Custom categories */}
                {Object.entries(customCategories).map(([key, posts]) => (
                  <div key={key} className="relative">
                    <button
                      onClick={() => setSelectedContentType(key)}
                      className={`p-3 rounded-lg border-2 transition-colors w-full ${
                        selectedContentType === key
                          ? 'border-comfort-accent bg-comfort-accent/10'
                          : 'border-comfort-tan/30 hover:border-comfort-tan'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">{newCategoryIcon}</span>
                        <span className="text-sm font-medium capitalize text-comfort-navy">{key}</span>
                        <span className="text-xs text-comfort-navy/60">{posts.length} items</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${key}" category and all its content?`)) {
                          const newCategories = { ...customCategories };
                          delete newCategories[key];
                          setCustomCategories(newCategories);
                          if (selectedContentType === key) {
                            setSelectedContentType('recipes');
                          }
                        }
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      title="Delete category"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Custom Category Modal */}
            {isAddingCategory && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Add Custom Category</h3>
                    <button
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                        setNewCategoryIcon('📝');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter category name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                      <input
                        type="text"
                        value={newCategoryIcon}
                        onChange={(e) => setNewCategoryIcon(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="📝"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => {
                        if (newCategoryName.trim()) {
                          const categoryKey = newCategoryName.toLowerCase().replace(/\s+/g, '');
                          if (!customCategories[categoryKey]) {
                            setCustomCategories({
                              ...customCategories,
                              [categoryKey]: []
                            });
                            setSelectedContentType(categoryKey);
                            setIsAddingCategory(false);
                            setNewCategoryName('');
                            setNewCategoryIcon('📝');
                          } else {
                            alert('A category with this name already exists!');
                          }
                        }
                      }}
                      disabled={!newCategoryName.trim()}
                      className="flex-1 bg-comfort-accent hover:bg-comfort-accent/90 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Add Category
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                        setNewCategoryIcon('📝');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Multi-Content Generation */}
            {multiContentMode && (
              <div className="planner-section p-6 mb-6">
                <h3 className="planner-header text-xl mb-4">Generate Multiple Content Items</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-planner-text">Number of items:</label>
                    <select
                      value={contentItemCount}
                      onChange={(e) => setContentItemCount(Number(e.target.value))}
                      className="input-planner w-20"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => generateMultipleContent(`Generate ${contentItemCount} unique ${selectedContentType}`, contentItemCount)}
                    disabled={isGenerating}
                    className="btn-primary"
                  >
                    {isGenerating ? 'Generating...' : `Generate ${contentItemCount} ${selectedContentType}`}
                  </button>

                  {generatedItems.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-planner-text">Generated Items ({generatedItems.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {generatedItems.map((item, index) => (
                          <div key={item.id} className="border border-planner-text/20 rounded-sm p-3 bg-planner-page/50">
                            <h5 className="font-semibold text-sm text-planner-text mb-2">{item.title}</h5>
                            <p className="text-xs text-planner-text-muted mb-2">{item.content}</p>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                                <span key={tagIndex} className="bg-planner-accent/20 text-planner-accent px-1.5 py-0.5 rounded text-xs">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => addMultipleItemsToCollection(generatedItems, selectedContentType)}
                        className="btn-primary"
                      >
                        Add All to {selectedContentType} Collection
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Manager */}
            {contentCollections[selectedContentType] && (
              <ContentManager
                content={contentCollections[selectedContentType].data}
                setContent={contentCollections[selectedContentType].setter}
                contentType={selectedContentType}
                scheduledContent={scheduledContent}
                setScheduledContent={setScheduledContent}
              />
            )}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <CalendarComponent
              scheduledContent={scheduledContent}
              setScheduledContent={setScheduledContent}
              onDateClick={(date) => {
                // Navigate to content planner tab
                setActiveTab('content');
                // Could also set the specific day in the planner view here if needed
              }}
            />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-planner-text tracking-wide">AI Content Generator</h2>

            {/* Content Mix Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-planner-border">
              <h3 className="text-lg font-semibold text-planner-text mb-4">Content Types to Generate</h3>
              <p className="text-sm text-planner-text-medium mb-4">Select which types of content you want to include in your weekly generation</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {topicOptions.map((topic) => (
                  <label
                    key={topic.value}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      contentMix[topic.value as keyof typeof contentMix]
                        ? 'border-planner-accent bg-planner-sidebar/50'
                        : 'border-planner-border hover:border-planner-accent/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={contentMix[topic.value as keyof typeof contentMix]}
                      onChange={(e) => setContentMix({
                        ...contentMix,
                        [topic.value]: e.target.checked
                      })}
                      className="w-4 h-4 text-planner-accent border-planner-border rounded focus:ring-planner-accent"
                    />
                    <div className="flex items-center space-x-1">
                      {React.createElement(topic.icon, { className: `w-4 h-4 ${contentMix[topic.value as keyof typeof contentMix] ? 'text-planner-accent' : 'text-planner-text-muted'}` })}
                      <span className="text-sm font-medium text-planner-text">{topic.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Generation */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Content Generator</h2>

              <div className="space-y-4">
                {/* Generation Type Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setGenerationType('week')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                      generationType === 'week'
                        ? 'bg-white text-planner-text shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Full Week
                  </button>
                  <button
                    onClick={() => setGenerationType('individual')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                      generationType === 'individual'
                        ? 'bg-white text-planner-text shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Individual Days
                  </button>
                </div>

                {/* Individual Day Selection */}
                {generationType === 'individual' && (
                  <div className="bg-planner-sidebar/30 border border-planner-border rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Days</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                        <label
                          key={day}
                          className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-colors ${
                            selectedDays[day as keyof typeof selectedDays]
                              ? 'border-planner-accent bg-planner-accent/10'
                              : 'border-gray-200 hover:border-planner-accent/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedDays[day as keyof typeof selectedDays]}
                            onChange={(e) => setSelectedDays({
                              ...selectedDays,
                              [day]: e.target.checked
                            })}
                            className="w-4 h-4 text-planner-accent border-gray-300 rounded focus:ring-planner-accent"
                          />
                          <span className="text-sm font-medium capitalize">{day.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platform Selection */}
                {generationType === 'individual' && (
                  <div className="bg-planner-sidebar/30 border border-planner-border rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Platforms</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { key: 'instagram', label: 'Instagram', emoji: '📷' },
                        { key: 'facebook', label: 'Facebook', emoji: '👍' },
                        { key: 'linkedin', label: 'LinkedIn', emoji: '💼' },
                        { key: 'twitter', label: 'Twitter', emoji: '🐦' }
                      ].map((platform) => (
                        <label
                          key={platform.key}
                          className={`flex items-center space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-colors ${
                            selectedPlatforms[platform.key as keyof typeof selectedPlatforms]
                              ? 'border-planner-accent bg-planner-accent/10'
                              : 'border-gray-200 hover:border-planner-accent/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPlatforms[platform.key as keyof typeof selectedPlatforms]}
                            onChange={(e) => setSelectedPlatforms({
                              ...selectedPlatforms,
                              [platform.key]: e.target.checked
                            })}
                            className="w-4 h-4 text-planner-accent border-gray-300 rounded focus:ring-planner-accent"
                          />
                          <span className="text-sm font-medium">{platform.emoji} {platform.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {generationType === 'week' ? 'Weekly Prompt' : 'Prompt for Selected Days'}
                  </label>
                  <textarea
                    value={weeklyPrompt}
                    onChange={(e) => setWeeklyPrompt(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={3}
                    placeholder={
                      generationType === 'week'
                        ? 'Describe what you want to post about this week...'
                        : 'Describe what you want to post about (or leave blank for day-specific prompts)...'
                    }
                  />
                </div>

                {generationType === 'week' && (
                  <div className="bg-planner-sidebar/50 border border-planner-border rounded-lg p-4">
                    <p className="text-sm text-planner-text">
                      <strong>Selected content types:</strong> {
                        Object.entries(contentMix)
                          .filter(([_, enabled]) => enabled)
                          .map(([type]) => topicOptions.find(t => t.value === type)?.label)
                          .join(', ') || 'None selected'
                      }
                    </p>
                  </div>
                )}

                <button
                  onClick={generationType === 'week' ? generateWeeklyContent : generateIndividualDays}
                  disabled={
                    isGeneratingWeek ||
                    (generationType === 'week' && Object.values(contentMix).every(v => !v)) ||
                    (generationType === 'individual' && (Object.values(selectedDays).every(v => !v) || Object.values(selectedPlatforms).every(v => !v)))
                  }
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingWeek ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Generating...
                    </span>
                  ) : generationType === 'week' ? 'Generate Weekly Content' : 'Generate Selected Days'}
                </button>
                {generationType === 'week' && Object.values(contentMix).every(v => !v) && (
                  <p className="text-sm text-red-600">Please select at least one content type above</p>
                )}
                {generationType === 'individual' && Object.values(selectedDays).every(v => !v) && (
                  <p className="text-sm text-red-600">Please select at least one day to generate content for</p>
                )}
                {generationType === 'individual' && Object.values(selectedPlatforms).every(v => !v) && (
                  <p className="text-sm text-red-600">Please select at least one platform to generate content for</p>
                )}
              </div>
            </div>

            {weeklyPosts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Generated Weekly Posts</h3>
                <div className="space-y-4">
                  {weeklyPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{post.dayName} - {post.content.title}</h4>
                      <p className="text-gray-700 mb-2">{post.content.description}</p>
                      <p className="text-sm text-gray-500">{post.contentType}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
