'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Calendar, Copy, Target, FileText, ChefHat, Dumbbell, Lightbulb, X, Plane, Smartphone, DollarSign, Sparkles, Heart, Building, Coffee, ChevronDown, Download, Home, GraduationCap, Zap, Trash2, Menu, Plus, CalendarDays } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import WeeklyPresetsManager from '@/components/WeeklyPresetsManager';
import ContentManager from '@/components/ContentManager';
import CalendarComponent from '@/components/CalendarComponent';
import DayPlannerView from '@/components/DayPlannerView';
import { contentLibrary } from '@/lib/contentLibrary';

// API Base URL - uses environment variable in production, empty for dev (uses proxy)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Debug utility - only logs in development mode
const DEBUG = process.env.NODE_ENV === 'development';
const debug = (...args: any[]) => DEBUG && console.log(...args);

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string;
  url?: string;
  field1?: string;
  field2?: string;
  createdAt: string;
  used?: boolean;
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
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [generationMode, setGenerationMode] = useState('calendar');
  const [weeklyPrompt, setWeeklyPrompt] = useState('');
  const [dayTopicSelections, setDayTopicSelections] = useState({
    monday: 'recipes',
    tuesday: 'workouts', 
    wednesday: 'realestate',
    thursday: 'mindfulness',
    friday: 'travel',
    saturday: 'tech',
    sunday: 'finance'
  });
  
  // API Integration states
  const [selectedTone, setSelectedTone] = useState('Casual');
  const [baseCaption, setBaseCaption] = useState('');
  const [currentCaption, setCurrentCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [canvaTemplateId, setCanvaTemplateId] = useState('');
  const [weeklyPosts, setWeeklyPosts] = useState<any[]>([]);
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
      setWeeklyPosts(data.posts || []);
    } catch (error) {
      console.error('Error generating weekly content:', error);
    } finally {
      setIsGeneratingWeek(false);
    }
  }, [weeklyPrompt]);

  const markContentAsUsed = useCallback((postId: string) => {
    // This would update the post's used status across all content arrays
    // For now, we'll just log it
    console.log('Marking content as used:', postId);
  }, []);

  // Load sample content on mount
  useEffect(() => {
    // Load sample content from contentLibrary
    const sampleRecipes = contentLibrary.workouts.map((item, index) => ({
      id: `recipe-${index}`,
      title: item.title,
      content: item.content,
      tags: item.benefits || '',
      createdAt: new Date().toISOString(),
      used: false
    }));
    
    const sampleMotivational = contentLibrary.motivational.map((item, index) => ({
      id: `motivational-${index}`,
      title: item.title,
      content: item.content,
      tags: item.insights || '',
      createdAt: new Date().toISOString(),
      used: false
    }));
    
    const sampleEducational = contentLibrary.educational.map((item, index) => ({
      id: `educational-${index}`,
      title: item.title,
      content: item.content,
      tags: item.science || '',
      createdAt: new Date().toISOString(),
      used: false
    }));

    setRecipes(sampleRecipes);
    setMotivationalContent(sampleMotivational);
    setEducationalContent(sampleEducational);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-amber-600" />
                <h1 className="text-2xl font-bold text-gray-900">Post Planner</h1>
              </div>
            </div>

            {/* Navigation Tabs and User Button */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'planner', label: 'Day Planner', icon: CalendarDays },
                { id: 'presets', label: 'Presets', icon: Calendar },
                { id: 'content', label: 'Content', icon: FileText },
                { id: 'calendar', label: 'Calendar', icon: Calendar },
                { id: 'ai', label: 'AI Tools', icon: Sparkles }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
              </div>

              {/* User Profile Button */}
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-400">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-amber-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Used Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.usedPosts}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
                <div className="flex items-center">
                  <Copy className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.availablePosts}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-400">
                <div className="flex items-center">
                  <Lightbulb className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-400">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.scheduledPosts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day Planner */}
            <div className="mt-6">
              <h4 className="text-base sm:text-lg font-semibold text-amber-900 mb-2">Weekly Day Planner</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {demoSchedule.map((item) => (
                  <div key={item.day} className="bg-white rounded-lg shadow p-3 flex flex-col items-center border-l-4 border-amber-400">
                    <span className="font-bold text-amber-700 text-sm mb-1">{item.day}</span>
                    <span className="text-xs text-gray-600">Posts: {item.posts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Boxes */}
            <div className="mt-6">
              <h4 className="text-base sm:text-lg font-semibold text-amber-900 mb-2">Categories</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {demoCategories.map((cat) => (
                  <div key={cat.value} className="bg-amber-100 rounded-lg shadow p-3 flex flex-col items-center border-l-4 border-amber-400">
                    <div className="mb-1">{React.createElement(cat.icon, { className: "w-5 h-5" })}</div>
                    <span className="font-medium text-amber-900 text-xs">{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <WeeklyPresetsManager presets={presets} setPresets={setPresets} />
        )}

        {activeTab === 'planner' && (
          <DayPlannerView
            contentCalendar={weeklyPosts}
            setContentCalendar={setWeeklyPosts}
          />
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Content Type Selector */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Select Content Type</h2>
                <button
                  onClick={() => setIsAddingCategory(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Category</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Built-in categories */}
                {topicOptions.map((topic) => (
                  <button
                    key={topic.value}
                    onClick={() => setSelectedContentType(topic.value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedContentType === topic.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {React.createElement(topic.icon, { className: "w-6 h-6" })}
                      <span className="text-sm font-medium">{topic.label}</span>
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
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">{newCategoryIcon}</span>
                        <span className="text-sm font-medium capitalize">{key}</span>
                        <span className="text-xs text-gray-500">{posts.length} items</span>
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
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
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

            {/* Content Manager */}
            {contentCollections[selectedContentType] && (
              <ContentManager
                content={contentCollections[selectedContentType].data}
                setContent={contentCollections[selectedContentType].setter}
                contentType={selectedContentType}
              />
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarComponent
            scheduledContent={scheduledContent}
            setScheduledContent={setScheduledContent}
          />
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* Content Mix Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Content Types to Generate</h2>
              <p className="text-sm text-gray-600 mb-4">Select which types of content you want to include in your weekly generation</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {topicOptions.map((topic) => (
                  <label
                    key={topic.value}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      contentMix[topic.value as keyof typeof contentMix]
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={contentMix[topic.value as keyof typeof contentMix]}
                      onChange={(e) => setContentMix({
                        ...contentMix,
                        [topic.value]: e.target.checked
                      })}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <div className="flex items-center space-x-1">
                      {React.createElement(topic.icon, { className: "w-4 h-4" })}
                      <span className="text-sm font-medium">{topic.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Generation */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Content Generation</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Prompt</label>
                  <textarea
                    value={weeklyPrompt}
                    onChange={(e) => setWeeklyPrompt(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={3}
                    placeholder="Describe what you want to post about this week..."
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Selected content types:</strong> {
                      Object.entries(contentMix)
                        .filter(([_, enabled]) => enabled)
                        .map(([type]) => topicOptions.find(t => t.value === type)?.label)
                        .join(', ') || 'None selected'
                    }
                  </p>
                </div>

                <button
                  onClick={generateWeeklyContent}
                  disabled={isGeneratingWeek || Object.values(contentMix).every(v => !v)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingWeek ? 'Generating...' : 'Generate Weekly Content'}
                </button>
                {Object.values(contentMix).every(v => !v) && (
                  <p className="text-sm text-red-600">Please select at least one content type above</p>
                )}
              </div>
            </div>

            {weeklyPosts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Generated Weekly Posts</h3>
                <div className="space-y-4">
                  {weeklyPosts.map((post, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{post.day} - {post.title}</h4>
                      <p className="text-gray-700 mb-2">{post.content}</p>
                      <p className="text-sm text-gray-500">{post.tags}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}