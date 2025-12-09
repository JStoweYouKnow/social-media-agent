/**
 * API Client for Mobile App
 * Connects to your existing Next.js API routes
 */

import Constants from 'expo-constants';
import type {
  GenerateContentRequest,
  GenerateContentResponse,
  HashtagsRequest,
  HashtagsResponse,
  ImageRecommendationsRequest,
  ImageRecommendationsResponse,
} from '@/lib/content-types';

// Get API URL from environment or use local development
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;
  private getAuthToken: (() => Promise<string | null>) | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set auth token provider (Clerk)
   */
  setAuthTokenProvider(provider: () => Promise<string | null>) {
    this.getAuthToken = provider;
  }

  /**
   * Make authenticated API request
   */
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const token = this.getAuthToken ? await this.getAuthToken() : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      // Log the full error for debugging
      console.error(`API Error [${response.status}]:`, errorMessage, `URL: ${this.baseUrl}${endpoint}`);
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // AI Endpoints

  async generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    return this.fetch('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateWeek(request: { prompt: string; tone?: string }) {
    return this.fetch('/api/ai/generate-week', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async improveContent(caption: string, platform?: string) {
    return this.fetch('/api/ai/improve', {
      method: 'POST',
      body: JSON.stringify({ caption, platform }),
    });
  }

  async generateVariation(baseCaption: string, tone: string) {
    return this.fetch('/api/ai/variation', {
      method: 'POST',
      body: JSON.stringify({ baseCaption, tone }),
    });
  }

  async generateHashtags(request: HashtagsRequest): Promise<HashtagsResponse> {
    return this.fetch('/api/ai/hashtags', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getImageRecommendations(
    request: ImageRecommendationsRequest
  ): Promise<ImageRecommendationsResponse> {
    return this.fetch('/api/ai/image-recommendations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Schedule Endpoints

  async getWeeklySchedule() {
    return this.fetch('/api/schedule/weekly');
  }

  async getDaySchedule(dayName: string) {
    return this.fetch(`/api/schedule/day/${dayName}`);
  }

  async generateDaySchedule(day: string, prompt: string) {
    return this.fetch('/api/schedule/generate-day', {
      method: 'POST',
      body: JSON.stringify({ day, prompt }),
    });
  }

  // Stripe Endpoints

  async createCheckoutSession(priceId: string) {
    return this.fetch('/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    });
  }

  async createPortalSession() {
    return this.fetch('/api/stripe/portal', {
      method: 'POST',
    });
  }

  // Analytics

  async trackEvent(event: string, properties?: any) {
    return this.fetch('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event,
        properties,
        timestamp: Date.now(),
      }),
    }).catch(err => {
      // Don't fail the app if analytics fails
      console.warn('Analytics tracking failed:', err);
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
