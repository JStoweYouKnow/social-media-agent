'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Save, Trash2, Edit, Eye, Copy, Check, ChefHat, Dumbbell, Building, Heart, Plane, Smartphone, DollarSign, Sparkles, Target, Coffee, GraduationCap, Zap, X, Link, Loader2, Hash, Wand2, Image as ImageIcon, Palette } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

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
  createdAt?: string;
  used?: boolean;
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

interface ContentManagerProps {
  content: Post[];
  setContent: (content: Post[]) => void;
  contentType: string;
  scheduledContent?: ScheduledContent[];
  setScheduledContent?: (content: ScheduledContent[]) => void;
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
  items?: ContentItem[];
  imageRecommendations?: ImageRecommendation[];
}

const topicOptions = [
  { value: 'recipes', label: '🍳 Recipes', icon: ChefHat, fields: ['Ingredients', 'Cooking Time'], suggestedTags: ['healthy', 'quick', 'easy', 'vegan', 'glutenfree', 'dessert', 'dinner', 'breakfast'] },
  { value: 'workouts', label: '💪 Workouts', icon: Dumbbell, fields: ['Duration', 'Difficulty'], suggestedTags: ['fitness', 'strength', 'cardio', 'hiit', 'yoga', 'athome', 'gym', 'beginner'] },
  { value: 'realestate', label: '🏡 Real Estate', icon: Building, fields: ['Property Type', 'Market Area'], suggestedTags: ['property', 'investment', 'home', 'apartment', 'luxury', 'firsthome', 'rental', 'commercial'] },
  { value: 'mindfulness', label: '🧘 Mindfulness', icon: Heart, fields: ['Practice Type', 'Duration'], suggestedTags: ['meditation', 'wellness', 'selfcare', 'mentalhealth', 'relaxation', 'breathing', 'mindful', 'peace'] },
  { value: 'travel', label: '✈️ Travel', icon: Plane, fields: ['Destination', 'Trip Type'], suggestedTags: ['adventure', 'vacation', 'destination', 'wanderlust', 'explore', 'beach', 'mountains', 'culture'] },
  { value: 'tech', label: '💻 Tech', icon: Smartphone, fields: ['Category', 'Skill Level'], suggestedTags: ['technology', 'coding', 'software', 'tutorial', 'ai', 'webdev', 'mobile', 'productivity'] },
  { value: 'finance', label: '💰 Finance', icon: DollarSign, fields: ['Type', 'Amount Range'], suggestedTags: ['money', 'investing', 'savings', 'budget', 'wealth', 'stocks', 'crypto', 'financial'] },
  { value: 'beauty', label: '✨ Beauty', icon: Sparkles, fields: ['Category', 'Skin Type'], suggestedTags: ['skincare', 'makeup', 'beauty', 'routine', 'natural', 'antiaging', 'glowing', 'selfcare'] },
  { value: 'business', label: '📈 Business', icon: Target, fields: ['Industry', 'Business Stage'], suggestedTags: ['entrepreneur', 'startup', 'marketing', 'growth', 'strategy', 'leadership', 'success', 'innovation'] },
  { value: 'lifestyle', label: '☕ Lifestyle', icon: Coffee, fields: ['Category', 'Season'], suggestedTags: ['lifestyle', 'home', 'organization', 'productivity', 'homedecor', 'minimalist', 'cozy', 'inspiration'] },
  { value: 'educational', label: '📚 Educational', icon: GraduationCap, fields: ['Subject', 'Level'], suggestedTags: ['learning', 'education', 'tutorial', 'tips', 'howto', 'knowledge', 'study', 'skills'] },
  { value: 'motivational', label: '⚡ Motivational', icon: Zap, fields: ['Theme', 'Audience'], suggestedTags: ['motivation', 'inspiration', 'mindset', 'goals', 'success', 'positivity', 'growth', 'believe'] }
];

export default function ContentManager({ content, setContent, contentType, scheduledContent, setScheduledContent }: ContentManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseUrl, setParseUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  
  // Multi-content state
  const [multiContentMode, setMultiContentMode] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  
  // Image recommendations state
  const [imageRecommendations, setImageRecommendations] = useState<ImageRecommendation[]>([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [showImageRecommendations, setShowImageRecommendations] = useState(false);
  
  // Day assignment state
  const [assignToDay, setAssignToDay] = useState<string>('');
  const [assignTime, setAssignTime] = useState('09:00');
  const [assignPlatform, setAssignPlatform] = useState('instagram');

  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    tags: '',
    url: '',
    imageUrl: '',
    field1: '',
    field2: ''
  });

  const currentTopic = topicOptions.find(topic => topic.value === contentType);

  const scheduleToCalendar = useCallback((post: Post) => {
    if (!assignToDay || !setScheduledContent || !scheduledContent) return;

    // Calculate the next occurrence of the selected day
    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDayIndex = dayNames.indexOf(assignToDay.toLowerCase());
    const currentDayIndex = today.getDay();
    
    let daysUntilTarget = targetDayIndex - currentDayIndex;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // Next week
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    
    const scheduledItem: ScheduledContent = {
      id: `scheduled-${Date.now()}`,
      title: post.title,
      content: post.content,
      date: targetDate.toISOString().split('T')[0],
      time: assignTime,
      platform: assignPlatform,
      status: 'draft',
      createdAt: new Date().toISOString(),
      items: post.items,
      imageRecommendations: post.imageRecommendations
    };

    setScheduledContent([...scheduledContent, scheduledItem]);
  }, [assignToDay, assignTime, assignPlatform, scheduledContent, setScheduledContent]);

  const handleSave = useCallback(() => {
    if (!newItem.title.trim()) return;

    let savedPost: Post;

    if (multiContentMode) {
      // Save as multiple items in a single post
      savedPost = {
        id: editingId || `multi-${Date.now()}`,
        title: `Multiple ${contentType}`,
        content: `Collection of ${contentItems.length} ${contentType}`,
        tags: contentItems.map(item => item.tags).join(' '),
        createdAt: new Date().toISOString(),
        used: false,
        items: contentItems,
        imageRecommendations: imageRecommendations.length > 0 ? imageRecommendations : undefined
      };

      if (editingId) {
        setContent(content.map(c => c.id === editingId ? savedPost : c));
        setEditingId(null);
      } else {
        setContent([...content, savedPost]);
      }

      setContentItems([]);
      setMultiContentMode(false);
    } else {
      // Save as single item
      savedPost = {
        id: editingId || Date.now().toString(),
        title: newItem.title,
        content: newItem.content,
        tags: newItem.tags,
        url: newItem.url,
        imageUrl: newItem.imageUrl,
        field1: newItem.field1,
        field2: newItem.field2,
        createdAt: new Date().toISOString(),
        used: false,
        imageRecommendations: imageRecommendations.length > 0 ? imageRecommendations : undefined
      };

      if (editingId) {
        setContent(content.map(c => c.id === editingId ? savedPost : c));
        setEditingId(null);
      } else {
        setContent([...content, savedPost]);
      }
    }

    // Schedule to calendar if day is assigned
    if (assignToDay && !editingId) {
      scheduleToCalendar(savedPost);
    }

    setNewItem({ title: '', content: '', tags: '', url: '', imageUrl: '', field1: '', field2: '' });
    setImageRecommendations([]);
    setShowImageRecommendations(false);
    setAssignToDay('');
    setAssignTime('09:00');
    setAssignPlatform('instagram');
    setIsAdding(false);
  }, [newItem, editingId, content, setContent, multiContentMode, contentItems, contentType, imageRecommendations, assignToDay, scheduleToCalendar]);

  const handleEdit = useCallback((post: Post) => {
    if (post.items && post.items.length > 0) {
      // Multi-content post
      setMultiContentMode(true);
      setContentItems(post.items);
      setCurrentItemIndex(0);
      // Set form to first item
      const firstItem = post.items[0];
      setNewItem({
        title: firstItem.title,
        content: firstItem.content,
        tags: firstItem.tags,
        url: firstItem.url || '',
        imageUrl: firstItem.imageUrl || '',
        field1: firstItem.field1 || '',
        field2: firstItem.field2 || ''
      });
      const itemTags = firstItem.tags ? firstItem.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t) : [];
      setTags(itemTags);
    } else {
      // Single content post
      setMultiContentMode(false);
      setNewItem({
        title: post.title,
        content: post.content,
        tags: post.tags,
        url: post.url || '',
        imageUrl: post.imageUrl || '',
        field1: post.field1 || '',
        field2: post.field2 || ''
      });
      const itemTags = post.tags ? post.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t) : [];
      setTags(itemTags);
    }
    setEditingId(post.id);
    setIsAdding(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setContent(content.filter(c => c.id !== id));
    }
  }, [content, setContent]);

  const handleCopy = useCallback((post: Post) => {
    let text = `${post.title}\n\n${post.content}\n\n${post.tags}`;
    
    if (post.items && post.items.length > 0) {
      text += '\n\nItems:\n';
      post.items.forEach((item, index) => {
        text += `\n${index + 1}. ${item.title}\n${item.content}\n${item.tags}\n`;
      });
    }
    
    navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleMarkUsed = useCallback((id: string) => {
    setContent(content.map(c => c.id === id ? { ...c, used: !c.used } : c));
  }, [content, setContent]);

  const addTag = useCallback((tag: string) => {
    const cleanTag = tag.trim().toLowerCase().replace(/\s+/g, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      const newTags = [...tags, cleanTag];
      setTags(newTags);
      setNewItem({ ...newItem, tags: newTags.join(', ') });
    }
    setTagInput('');
  }, [tags, newItem]);

  const removeTag = useCallback((tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setNewItem({ ...newItem, tags: newTags.join(', ') });
  }, [tags, newItem]);

  const handleTagInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }, [tagInput, tags, addTag, removeTag]);

  // Multi-content functions
  const addContentItem = useCallback(() => {
    if (!newItem.title.trim()) return;

    const item: ContentItem = {
      id: `item-${Date.now()}`,
      title: newItem.title,
      content: newItem.content,
      tags: newItem.tags,
      url: newItem.url,
      imageUrl: newItem.imageUrl,
      field1: newItem.field1,
      field2: newItem.field2,
    };

    setContentItems([...contentItems, item]);
    setNewItem({ title: '', content: '', tags: '', url: '', imageUrl: '', field1: '', field2: '' });
    setTags([]);
  }, [newItem, contentItems]);

  const removeContentItem = useCallback((index: number) => {
    setContentItems(contentItems.filter((_, i) => i !== index));
  }, [contentItems]);

  const editContentItem = useCallback((index: number) => {
    const item = contentItems[index];
    setNewItem({
      title: item.title,
      content: item.content,
      tags: item.tags,
      url: item.url || '',
      imageUrl: item.imageUrl || '',
      field1: item.field1 || '',
      field2: item.field2 || ''
    });
    const itemTags = item.tags ? item.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t) : [];
    setTags(itemTags);
    setCurrentItemIndex(index);
    // Remove the item so it can be re-added when saved
    removeContentItem(index);
  }, [contentItems, removeContentItem]);

  const generateAITags = useCallback(async () => {
    if (!newItem.title && !newItem.content) {
      alert('Please add a title or content first to generate tags');
      return;
    }

    setIsGeneratingTags(true);
    try {
      const response = await fetch('/api/ai/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newItem.title,
          content: newItem.content,
          contentType: contentType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate tags');
      }

      const data = await response.json();
      const generatedTags = data.tags || [];

      // Add generated tags to existing tags
      const uniqueTags = [...new Set([...tags, ...generatedTags.map((t: string) => t.toLowerCase())])];
      setTags(uniqueTags);
      setNewItem({ ...newItem, tags: uniqueTags.join(', ') });
    } catch (error) {
      console.error('Error generating tags:', error);
      alert('Failed to generate tags. Please try again.');
    } finally {
      setIsGeneratingTags(false);
    }
  }, [newItem, tags, contentType]);

  const generateImageRecommendations = useCallback(async () => {
    if (!newItem.title && !newItem.content) {
      alert('Please add a title or content first to generate image recommendations');
      return;
    }

    setIsGeneratingImages(true);
    try {
      const response = await fetch('/api/ai/image-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newItem.title,
          content: newItem.content,
          contentType: contentType,
          platform: 'instagram' // Default platform
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image recommendations');
      }

      const data = await response.json();
      setImageRecommendations(data.recommendations || []);
      setShowImageRecommendations(true);
    } catch (error) {
      console.error('Error generating image recommendations:', error);
      alert('Failed to generate image recommendations. Please try again.');
    } finally {
      setIsGeneratingImages(false);
    }
  }, [newItem, contentType]);

  const handleParseUrl = useCallback(async () => {
    if (!parseUrl.trim()) return;

    setIsParsing(true);
    try {
      const response = await fetch('/api/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: parseUrl,
          contentType: contentType
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to parse URL');
        return;
      }

      const data = await response.json();

      // Auto-fill the form with parsed data
      setNewItem({
        title: data.title || newItem.title,
        content: data.description || data.content || newItem.content,
        tags: data.siteName ? `${data.siteName}, web content` : newItem.tags,
        url: data.url || parseUrl,
        imageUrl: data.image || newItem.imageUrl,
        field1: data.field1 || newItem.field1,
        field2: data.field2 || newItem.field2,
      });

      setParseUrl(''); // Clear the parse URL input

      // Show success message with what was detected
      if (data.detectedType) {
        const typeLabel = topicOptions.find(t => t.value === data.detectedType)?.label || data.detectedType;
        console.log(`✓ Detected ${typeLabel} content and extracted specialized data`);
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
      alert('Failed to parse URL. Please try again.');
    } finally {
      setIsParsing(false);
    }
  }, [parseUrl, newItem, contentType]);

  const IconComponent = currentTopic?.icon || Plus;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="planner-section p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-planner-accent/10 rounded-md border border-planner-text/10">
              <IconComponent className="w-6 h-6 text-planner-accent" />
            </div>
            <h2 className="planner-header text-2xl !mb-0 !pb-0 !border-0">
              {currentTopic?.label || 'Content'} Library
            </h2>
            <span className="bg-planner-accent/20 text-planner-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-planner-accent/30">
              {content.length} items
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMultiContentMode(false);
                setIsAdding(true);
              }}
              className="px-4 py-2 bg-planner-text text-white rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-planner-text/90 transition-colors border-2 border-planner-text flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Single</span>
            </button>
            <button
              onClick={() => {
                setMultiContentMode(true);
                setContentItems([]);
                setIsAdding(true);
              }}
              className="px-4 py-2 bg-planner-accent text-white rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-planner-accent/90 transition-colors border-2 border-planner-accent flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Multiple</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="planner-section p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="planner-header text-2xl !mb-0">
              {editingId ? 'Edit' : 'Add New'} {multiContentMode ? 'Multiple' : 'Single'} {currentTopic?.label || 'Content'}
            </h3>
            {multiContentMode && (
              <div className="flex items-center gap-2 text-sm text-planner-text-medium">
                <span className="bg-planner-accent/20 text-planner-accent px-3 py-1 rounded-full font-medium">
                  {contentItems.length} items added
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* URL Parser Section */}
            {!editingId && (
              <div className="border-2 border-planner-text rounded-sm p-4 bg-planner-page">
                <div className="flex items-start gap-3">
                  <Link className="w-5 h-5 text-planner-text mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="planner-subheader !mb-2">Quick Import from URL</h4>
                    <p className="text-xs text-planner-text-muted mb-3 leading-relaxed">
                      {contentType === 'recipes' && 'Paste a recipe URL to extract ingredients and cooking time'}
                      {contentType === 'workouts' && 'Paste a workout URL to extract duration and difficulty'}
                      {contentType !== 'recipes' && contentType !== 'workouts' && 'Paste a URL to automatically extract title, description, and metadata'}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={parseUrl}
                        onChange={(e) => setParseUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleParseUrl()}
                        className="input-planner flex-1"
                        placeholder={
                          contentType === 'recipes' ? 'https://allrecipes.com/...' :
                          contentType === 'workouts' ? 'https://bodybuilding.com/...' :
                          'https://example.com/article'
                        }
                        disabled={isParsing}
                      />
                      <button
                        onClick={handleParseUrl}
                        disabled={!parseUrl.trim() || isParsing}
                        className="px-4 py-2 bg-planner-text text-white rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-planner-text/90 transition-colors border-2 border-planner-text flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isParsing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Parsing...</span>
                          </>
                        ) : (
                          <>
                            <Link className="w-4 h-4" />
                            <span>Parse</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="planner-divider"></div>

            <div className="planner-line">
              <label className="block text-xs font-bold text-planner-text mb-3 uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full border-b-2 border-planner-text bg-transparent px-0 py-2 text-planner-text text-lg focus:outline-none focus:border-planner-accent transition-colors font-serif"
                placeholder={`Enter ${currentTopic?.label || 'content'} title`}
              />
            </div>

            <div className="planner-line">
              <label className="block text-xs font-bold text-planner-text mb-3 uppercase tracking-wider">Content</label>
              <textarea
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                className="textarea-planner planner-ruled-bg h-32"
                placeholder={`Enter ${currentTopic?.label || 'content'} description`}
              />
            </div>

            {currentTopic?.fields && (
              <div className="planner-grid grid-cols-1 md:grid-cols-2">
                <div className="planner-cell planner-line">
                  <label className="block text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">{currentTopic.fields[0]}</label>
                  <input
                    type="text"
                    value={newItem.field1}
                    onChange={(e) => setNewItem({ ...newItem, field1: e.target.value })}
                    className="w-full border-b border-planner-text/50 bg-transparent px-0 py-2 text-planner-text focus:outline-none focus:border-planner-accent transition-colors"
                    placeholder={`Enter ${currentTopic.fields[0].toLowerCase()}`}
                  />
                </div>
                <div className="planner-cell planner-line">
                  <label className="block text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">{currentTopic.fields[1]}</label>
                  <input
                    type="text"
                    value={newItem.field2}
                    onChange={(e) => setNewItem({ ...newItem, field2: e.target.value })}
                    className="w-full border-b border-planner-text/50 bg-transparent px-0 py-2 text-planner-text focus:outline-none focus:border-planner-accent transition-colors"
                    placeholder={`Enter ${currentTopic.fields[1].toLowerCase()}`}
                  />
                </div>
              </div>
            )}

            <div className="planner-divider"></div>

            {/* Enhanced Tags Section */}
            <div className="planner-line">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-planner-text uppercase tracking-wider">Tags</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={generateImageRecommendations}
                    disabled={isGeneratingImages || (!newItem.title && !newItem.content)}
                    className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-sm bg-planner-accent text-white hover:bg-planner-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider border-2 border-planner-accent"
                    title="Generate image recommendations with AI"
                  >
                    {isGeneratingImages ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3 h-3" />
                        <span>AI Images</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={generateAITags}
                    disabled={isGeneratingTags || (!newItem.title && !newItem.content)}
                    className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-sm bg-planner-text text-white hover:bg-planner-text/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider border-2 border-planner-text"
                    title="Generate tags with AI"
                  >
                    {isGeneratingTags ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3 h-3" />
                        <span>AI Tags</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tag Input with Chips */}
              <div className="input-planner !p-2 min-h-[44px] flex flex-wrap gap-1.5 items-center">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-planner-accent/20 text-planner-accent px-2.5 py-1 rounded-full text-xs font-medium border border-planner-accent/30"
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-planner-accent/30 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                  placeholder={tags.length === 0 ? "Type and press Enter or comma to add tags" : "Add more..."}
                />
              </div>

              {/* Suggested Tags */}
              {currentTopic?.suggestedTags && currentTopic.suggestedTags.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-planner-text-muted mb-2 uppercase tracking-wider">Suggested:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTopic.suggestedTags
                      .filter(tag => !tags.includes(tag))
                      .slice(0, 8)
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className="inline-flex items-center gap-1 bg-white text-planner-text px-2 py-1 rounded-sm text-xs font-medium border border-planner-text hover:bg-planner-text hover:text-white transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          {tag}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Image Recommendations Section */}
            {showImageRecommendations && imageRecommendations.length > 0 && (
              <div className="planner-line">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-planner-text uppercase tracking-wider">AI Image Recommendations</label>
                  <button
                    type="button"
                    onClick={() => setShowImageRecommendations(false)}
                    className="p-1 text-planner-text-muted hover:text-planner-text rounded"
                    title="Hide recommendations"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {imageRecommendations.map((rec, index) => (
                    <div key={index} className="border border-planner-text/20 rounded-sm p-4 bg-planner-page/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-planner-accent/10 rounded-sm">
                          <Palette className="w-4 h-4 text-planner-accent" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h5 className="font-semibold text-planner-text text-sm">{rec.type}</h5>
                          
                          {rec.elements && (
                            <div>
                              <span className="text-xs font-medium text-planner-text-medium">Visual Elements:</span>
                              <p className="text-xs text-planner-text-muted mt-1">{rec.elements}</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {rec.style && (
                              <div>
                                <span className="font-medium text-planner-text-medium">Style:</span>
                                <p className="text-planner-text-muted">{rec.style}</p>
                              </div>
                            )}
                            {rec.colors && (
                              <div>
                                <span className="font-medium text-planner-text-medium">Colors:</span>
                                <p className="text-planner-text-muted">{rec.colors}</p>
                              </div>
                            )}
                          </div>
                          
                          {rec.textOverlay && (
                            <div>
                              <span className="text-xs font-medium text-planner-text-medium">Text Overlay:</span>
                              <p className="text-xs text-planner-text-muted mt-1">{rec.textOverlay}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="planner-line">
              <label className="block text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">URL (optional)</label>
              <input
                type="url"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                className="w-full border-b border-planner-text/50 bg-transparent px-0 py-2 text-planner-text focus:outline-none focus:border-planner-accent transition-colors"
                placeholder="https://example.com"
              />
            </div>

            {/* Day Assignment Section */}
            {!editingId && (
              <div className="planner-line">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-planner-text uppercase tracking-wider">Schedule to Calendar (optional)</label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-planner-text-medium mb-2">Day of Week</label>
                    <select
                      value={assignToDay}
                      onChange={(e) => setAssignToDay(e.target.value)}
                      className="w-full border border-planner-text/30 rounded-sm px-3 py-2 text-planner-text bg-white focus:outline-none focus:border-planner-accent transition-colors"
                    >
                      <option value="">Don't schedule</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                  
                  {assignToDay && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-planner-text-medium mb-2">Time</label>
                        <input
                          type="time"
                          value={assignTime}
                          onChange={(e) => setAssignTime(e.target.value)}
                          className="w-full border border-planner-text/30 rounded-sm px-3 py-2 text-planner-text bg-white focus:outline-none focus:border-planner-accent transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-planner-text-medium mb-2">Platform</label>
                        <select
                          value={assignPlatform}
                          onChange={(e) => setAssignPlatform(e.target.value)}
                          className="w-full border border-planner-text/30 rounded-sm px-3 py-2 text-planner-text bg-white focus:outline-none focus:border-planner-accent transition-colors"
                        >
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">Twitter</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
                
                {assignToDay && (
                  <p className="text-xs text-planner-text-muted mt-2">
                    Content will be scheduled for next {assignToDay} at {assignTime} on {assignPlatform}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="planner-divider"></div>

          {/* Multi-content items display */}
          {multiContentMode && contentItems.length > 0 && (
            <div className="space-y-4">
              <div className="planner-divider"></div>
              <h4 className="planner-subheader">Added Items ({contentItems.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contentItems.map((item, index) => (
                  <div key={item.id} className="border border-planner-text/20 rounded-sm p-3 bg-planner-page/50">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-sm text-planner-text">{item.title}</h5>
                      <div className="flex gap-1">
                        <button
                          onClick={() => editContentItem(index)}
                          className="p-1 text-planner-text-muted hover:text-planner-text rounded"
                          title="Edit"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeContentItem(index)}
                          className="p-1 text-planner-text-muted hover:text-red-600 rounded"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-planner-text-muted line-clamp-2 mb-2">{item.content}</p>
                    {item.tags && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-planner-accent/20 text-planner-accent px-1.5 py-0.5 rounded text-xs">
                            {tag.trim()}
                          </span>
                        ))}
                        {item.tags.split(',').length > 3 && (
                          <span className="text-xs text-planner-text-muted">+{item.tags.split(',').length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="planner-divider"></div>
            </div>
          )}

          <div className="flex gap-3">
            {multiContentMode ? (
              <>
                <button
                  onClick={addContentItem}
                  disabled={!newItem.title.trim()}
                  className="px-6 py-2 bg-planner-accent text-white rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-planner-accent/90 transition-colors border-2 border-planner-accent flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={contentItems.length === 0}
                  className="px-6 py-2 bg-planner-text text-white rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-planner-text/90 transition-colors border-2 border-planner-text flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Collection ({contentItems.length} items)</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleSave}
                disabled={!newItem.title.trim()}
                className="px-6 py-2 bg-planner-text text-white rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-planner-text/90 transition-colors border-2 border-planner-text flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Update' : 'Save'}</span>
              </button>
            )}
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setNewItem({ title: '', content: '', tags: '', url: '', imageUrl: '', field1: '', field2: '' });
                setTags([]);
                setTagInput('');
                setParseUrl('');
                setMultiContentMode(false);
                setContentItems([]);
                setCurrentItemIndex(0);
                setImageRecommendations([]);
                setShowImageRecommendations(false);
              }}
              className="px-6 py-2 bg-white text-planner-text rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-planner-page transition-colors border-2 border-planner-text"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((post) => (
          <div key={post.id} className={`planner-section p-4 transition-all duration-200 ${
            post.used
              ? 'bg-green-50/50'
              : 'bg-white'
          }`}>
            <div className="flex items-start justify-between mb-3 pb-3 border-b-2 border-planner-text">
              <div className="flex-1">
                <h3 className="font-serif font-bold text-planner-text text-base">{post.title}</h3>
                <div className="flex gap-2 mt-1">
                  {post.items && post.items.length > 0 && (
                    <span className="inline-block bg-planner-accent/20 text-planner-accent px-2 py-0.5 rounded-full text-xs font-medium">
                      {post.items.length} items
                    </span>
                  )}
                  {post.imageRecommendations && post.imageRecommendations.length > 0 && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {post.imageRecommendations.length} image ideas
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-0.5">
                <button
                  onClick={() => setPreviewId(previewId === post.id ? null : post.id)}
                  className="p-1.5 text-planner-text hover:bg-planner-page rounded-sm transition-all"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(post)}
                  className="p-1.5 text-planner-text hover:bg-planner-page rounded-sm transition-all"
                  title="Copy"
                >
                  {copiedId === post.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="p-1.5 text-planner-text hover:bg-planner-page rounded-sm transition-all"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 text-planner-text hover:bg-red-50 rounded-sm transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Display image if available */}
            {post.imageUrl && (
              <div className="mb-3 rounded-lg overflow-hidden border border-planner-border">
                <OptimizedImage
                  src={post.imageUrl}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-auto"
                  objectFit="cover"
                />
              </div>
            )}

            <p className="text-planner-text-muted text-sm mb-3 line-clamp-2">{post.content}</p>

            {/* Show multiple items if they exist */}
            {post.items && post.items.length > 0 ? (
              <div className="space-y-2 mb-3">
                {post.items.slice(0, 2).map((item, index) => (
                  <div key={item.id} className="border-l-2 border-planner-accent/30 pl-3">
                    <h4 className="text-xs font-semibold text-planner-text">{item.title}</h4>
                    <p className="text-xs text-planner-text-muted line-clamp-1">{item.content}</p>
                  </div>
                ))}
                {post.items.length > 2 && (
                  <p className="text-xs text-planner-text-muted italic">+{post.items.length - 2} more items...</p>
                )}
              </div>
            ) : (
              <>
                {post.field1 && (
                  <p className="text-xs text-planner-text-muted mb-1.5">
                    <strong className="text-planner-text-medium">{currentTopic?.fields?.[0]}:</strong> {post.field1}
                  </p>
                )}
                {post.field2 && (
                  <p className="text-xs text-planner-text-muted mb-1.5">
                    <strong className="text-planner-text-medium">{currentTopic?.fields?.[1]}:</strong> {post.field2}
                  </p>
                )}
              </>
            )}

            {post.tags && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.split(',').map((tag, index) => (
                  <span key={index} className="bg-planner-accent/20 text-planner-accent px-2.5 py-1 rounded-full text-xs font-medium">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-planner-text/30">
              <button
                onClick={() => handleMarkUsed(post.id)}
                className={`text-xs px-3 py-1.5 rounded-sm font-bold uppercase tracking-wider transition-all border-2 ${
                  post.used
                    ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                    : 'bg-white text-planner-text border-planner-text hover:bg-planner-text hover:text-white'
                }`}
              >
                {post.used ? '✓ Used' : 'Mark Used'}
              </button>
              <span className="text-xs text-planner-text-muted font-mono">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Preview Modal */}
            {previewId === post.id && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="planner-section p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-planner-text">
                    <h3 className="planner-header text-2xl !mb-0 !pb-0 !border-0">{post.title}</h3>
                    <button
                      onClick={() => setPreviewId(null)}
                      className="p-2 text-planner-text hover:bg-planner-page rounded-sm transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {/* Display image if available */}
                    {post.imageUrl && (
                      <div className="rounded-lg overflow-hidden border border-planner-border">
                        <OptimizedImage
                          src={post.imageUrl}
                          alt={post.title}
                          width={800}
                          height={500}
                          className="w-full h-auto"
                          objectFit="cover"
                        />
                      </div>
                    )}
                    
                    <p className="text-planner-text text-base leading-relaxed">{post.content}</p>
                    
                    {/* Show multiple items if they exist */}
                    {post.items && post.items.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-planner-text">Items ({post.items.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {post.items.map((item, index) => (
                            <div key={item.id} className="border border-planner-text/20 rounded-sm p-4 bg-planner-page/30">
                              <h5 className="font-semibold text-planner-text mb-2">{item.title}</h5>
                              <p className="text-planner-text-medium text-sm mb-3">{item.content}</p>
                              {item.field1 && (
                                <p className="text-xs text-planner-text-muted mb-1">
                                  <strong>{currentTopic?.fields?.[0]}:</strong> {item.field1}
                                </p>
                              )}
                              {item.field2 && (
                                <p className="text-xs text-planner-text-muted mb-1">
                                  <strong>{currentTopic?.fields?.[1]}:</strong> {item.field2}
                                </p>
                              )}
                              {item.tags && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.tags.split(',').map((tag, tagIndex) => (
                                    <span key={tagIndex} className="bg-planner-accent/20 text-planner-accent px-2 py-0.5 rounded text-xs">
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {post.field1 && (
                          <p className="text-planner-text-medium">
                            <strong className="text-planner-text">{currentTopic?.fields?.[0]}:</strong> {post.field1}
                          </p>
                        )}
                        {post.field2 && (
                          <p className="text-planner-text-medium">
                            <strong className="text-planner-text">{currentTopic?.fields?.[1]}:</strong> {post.field2}
                          </p>
                        )}
                      </>
                    )}
                    
                    {post.tags && (
                      <div>
                        <strong className="text-planner-text">Tags:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.tags.split(',').map((tag, index) => (
                            <span key={index} className="bg-planner-accent/20 text-planner-accent px-3 py-1.5 rounded-full text-sm font-medium">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {post.url && (
                      <p className="text-planner-text-medium">
                        <strong className="text-planner-text">URL:</strong>{' '}
                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-planner-accent hover:text-planner-accent-dark underline">
                          {post.url}
                        </a>
                      </p>
                    )}

                    {/* Image Recommendations in Preview */}
                    {post.imageRecommendations && post.imageRecommendations.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-planner-text flex items-center gap-2">
                          <ImageIcon className="w-5 h-5" />
                          Image Recommendations ({post.imageRecommendations.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {post.imageRecommendations.map((rec, index) => (
                            <div key={index} className="border border-planner-text/20 rounded-sm p-4 bg-planner-page/30">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-planner-accent/10 rounded-sm">
                                  <Palette className="w-4 h-4 text-planner-accent" />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <h5 className="font-semibold text-planner-text text-sm">{rec.type}</h5>
                                  
                                  {rec.elements && (
                                    <div>
                                      <span className="text-xs font-medium text-planner-text-medium">Visual Elements:</span>
                                      <p className="text-xs text-planner-text-muted mt-1">{rec.elements}</p>
                                    </div>
                                  )}
                                  
                                  <div className="grid grid-cols-1 gap-2 text-xs">
                                    {rec.style && (
                                      <div>
                                        <span className="font-medium text-planner-text-medium">Style:</span>
                                        <p className="text-planner-text-muted">{rec.style}</p>
                                      </div>
                                    )}
                                    {rec.colors && (
                                      <div>
                                        <span className="font-medium text-planner-text-medium">Colors:</span>
                                        <p className="text-planner-text-muted">{rec.colors}</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {rec.textOverlay && (
                                    <div>
                                      <span className="text-xs font-medium text-planner-text-medium">Text Overlay:</span>
                                      <p className="text-xs text-planner-text-muted mt-1">{rec.textOverlay}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {content.length === 0 && (
        <div className="planner-section p-16 text-center">
          <div className="p-4 bg-planner-page rounded-sm w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-planner-text">
            <IconComponent className="w-8 h-8 text-planner-text" />
          </div>
          <h3 className="planner-header text-2xl !border-0">No {currentTopic?.label || 'content'} yet</h3>
          <p className="text-planner-text-muted mb-6 max-w-md mx-auto text-sm">Get started by adding your first {currentTopic?.label || 'content'} item.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-planner-text text-white rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-planner-text/90 transition-colors border-2 border-planner-text inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add {currentTopic?.label || 'Content'}
          </button>
        </div>
      )}
    </div>
  );
}
