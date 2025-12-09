/**
 * Content types for API requests/responses
 * Used by api-client.ts
 */

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

// Re-export ContentItem from types.ts for compatibility
export type { ContentItem } from './types';






