/**
 * Shared types for the Post Planner mobile app
 */

// Content types - matching web app categories
export type ContentType =
  | 'recipes'
  | 'workouts'
  | 'realEstateTips'
  | 'mindfulness'
  | 'travel'
  | 'tech'
  | 'finance'
  | 'beauty'
  | 'parenting'
  | 'business'
  | 'lifestyle'
  | 'educational'
  | 'motivational';

export interface ContentItem {
  id: string;
  caption: string;
  hashtags?: string;
  platform?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface ImageRecommendation {
  description: string;
  searchTerms: string[];
  style?: string;
  mood?: string;
}

export interface Post {
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
  items?: ContentItem[];
  imageRecommendations?: ImageRecommendation[];
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  engagementScore?: number;
}

export interface ScheduledContent {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  platform: string[];
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  imageUrl?: string;
  tags?: string;
}

export interface PlannerPost {
  id: string;
  day: string;
  title: string;
  content: string;
  platforms: string[];
  time: string;
  type: string;
  variations?: ContentItem[];
}

export interface Preset {
  id: number;
  name: string;
  description: string;
  schedule: Record<
    string,
    { enabled: boolean; topic: string; time: string; platforms: string[] }
  >;
  platforms: {
    instagram: boolean;
    linkedin: boolean;
    facebook: boolean;
    twitter: boolean;
  };
  createdAt: string;
}

// Subscription types
export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'agency';

export interface TierLimits {
  aiGenerations: number;
  scheduledPosts: number;
  canvaDesigns: number;
  customCategories: number;
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

export interface UsageTracking {
  userId: string;
  aiGenerations: number;
  scheduledPosts: number;
  canvaDesigns: number;
  periodStart: Date;
  periodEnd: Date;
}

// AI generation types
export interface AIGenerationOptions {
  prompt: string;
  tone?: 'professional' | 'casual' | 'funny' | 'inspiring' | 'educational';
  platforms?: string[];
  includeHashtags?: boolean;
  includeImageRecommendations?: boolean;
  contentType?: ContentType;
}

export interface AIGenerationResult {
  content: string;
  hashtags?: string;
  imageRecommendations?: ImageRecommendation[];
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  engagementScore?: number;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Stats types
export interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  usedPosts: number;
  categoriesCount: number;
  thisWeekPosts: number;
  aiGenerationsUsed: number;
  aiGenerationsLimit: number;
}

// Custom category
export interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  userId: string;
  posts: Post[];
  createdAt: string;
}

// Platform types
export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'twitter';

export const PLATFORMS: Record<SocialPlatform, { name: string; icon: string; color: string }> = {
  instagram: { name: 'Instagram', icon: '📷', color: '#E1306C' },
  facebook: { name: 'Facebook', icon: '👥', color: '#1877F2' },
  linkedin: { name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  twitter: { name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
};

// Content library categories
export const CONTENT_CATEGORIES: Record<ContentType, { name: string; icon: string }> = {
  recipes: { name: 'Recipes', icon: '🍳' },
  workouts: { name: 'Workouts', icon: '💪' },
  realEstateTips: { name: 'Real Estate', icon: '🏠' },
  mindfulness: { name: 'Mindfulness', icon: '🧘' },
  travel: { name: 'Travel', icon: '✈️' },
  tech: { name: 'Tech', icon: '💻' },
  finance: { name: 'Finance', icon: '💰' },
  beauty: { name: 'Beauty', icon: '💄' },
  parenting: { name: 'Parenting', icon: '👶' },
  business: { name: 'Business', icon: '💼' },
  lifestyle: { name: 'Lifestyle', icon: '🌟' },
  educational: { name: 'Educational', icon: '📚' },
  motivational: { name: 'Motivational', icon: '🚀' },
};
