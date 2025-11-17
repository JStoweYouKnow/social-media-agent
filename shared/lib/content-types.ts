/**
 * Shared content types
 * Used by both web and mobile apps
 */

export interface ContentItem {
  id?: string;
  title: string;
  content: string;
  tags: string;
  url: string;
  imageUrl?: string;
  field1?: string;
  field2?: string;
  platform?: Platform;
  scheduledDate?: string;
  status?: 'draft' | 'scheduled' | 'published';
  createdAt?: number;
  updatedAt?: number;
}

export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'all';

export type ContentType = 'recipes' | 'workouts' | 'quotes' | 'tips' | 'events' | 'general';

export type ToneType = 'casual' | 'professional' | 'friendly' | 'inspirational' | 'humorous';

export interface GenerateContentRequest {
  prompt: string;
  day?: string;
  tone?: ToneType;
  platform?: Platform;
  contentType?: ContentType;
}

export interface GenerateContentResponse {
  success: boolean;
  caption?: string;
  content?: string;
  hashtags?: string;
  message?: string;
}

export interface HashtagsRequest {
  content: string;
  count?: number;
}

export interface HashtagsResponse {
  success: boolean;
  hashtags: string[];
  count: number;
}

export interface ImageRecommendationsRequest {
  title: string;
  content: string;
  contentType?: ContentType;
  platform?: Platform;
}

export interface ImageRecommendation {
  type: string;
  elements: string;
  style: string;
  colors: string;
  textOverlay: string;
}

export interface ImageRecommendationsResponse {
  success: boolean;
  recommendations: ImageRecommendation[];
}

export interface WeeklySchedule {
  [day: string]: ContentItem[];
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

export const PLATFORMS: Platform[] = ['instagram', 'facebook', 'twitter', 'linkedin'];

export const PLATFORM_LIMITS: Record<Platform | 'all', { chars: number; hashtags: number }> = {
  instagram: { chars: 2200, hashtags: 30 },
  facebook: { chars: 63206, hashtags: 0 },
  twitter: { chars: 280, hashtags: 0 },
  linkedin: { chars: 3000, hashtags: 0 },
  all: { chars: 280, hashtags: 0 }, // Use Twitter's limit as default
};

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform: Platform): string {
  const names: Record<Platform, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    all: 'All Platforms',
  };
  return names[platform];
}

/**
 * Get platform icon name (for icon libraries)
 */
export function getPlatformIcon(platform: Platform): string {
  const icons: Record<Platform, string> = {
    instagram: 'instagram',
    facebook: 'facebook',
    twitter: 'twitter',
    linkedin: 'linkedin',
    all: 'share-2',
  };
  return icons[platform];
}

/**
 * Validate content length for platform
 */
export function validateContentLength(content: string, platform: Platform): {
  valid: boolean;
  message?: string;
  limit: number;
  current: number;
} {
  const limit = PLATFORM_LIMITS[platform].chars;
  const current = content.length;

  return {
    valid: current <= limit,
    message: current > limit ? `Content exceeds ${platform} limit of ${limit} characters` : undefined,
    limit,
    current,
  };
}
