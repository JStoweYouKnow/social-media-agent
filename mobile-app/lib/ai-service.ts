/**
 * AI Service for mobile app
 * Wraps OpenAI and Anthropic SDKs with React Native compatibility
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import Constants from 'expo-constants';
import { AIGenerationOptions, AIGenerationResult } from './types';

// Get API keys from environment
// Expo automatically makes EXPO_PUBLIC_ variables available via process.env
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || Constants.expoConfig?.extra?.openaiApiKey;
const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || Constants.expoConfig?.extra?.anthropicApiKey;

// Initialize clients
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

export type AIModel = 'openai' | 'anthropic';

interface InternalAIOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Generate content using OpenAI GPT-4o-mini
 */
async function generateWithOpenAI(options: InternalAIOptions): Promise<AIGenerationResult> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: options.systemPrompt || 'You are a creative social media content creator.',
      },
      { role: 'user', content: options.prompt },
    ],
    temperature: options.temperature ?? 0.8,
    max_tokens: options.maxTokens ?? 600,
  });

  return {
    content: response.choices[0]?.message?.content || '',
  };
}

/**
 * Generate content using Anthropic Claude 3 Haiku
 */
async function generateWithAnthropic(options: InternalAIOptions): Promise<AIGenerationResult> {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured');
  }

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: options.maxTokens ?? 600,
    temperature: options.temperature ?? 0.8,
    system: options.systemPrompt || 'You are a creative social media content creator.',
    messages: [{ role: 'user', content: options.prompt }],
  });

  return {
    content: response.content[0].type === 'text' ? response.content[0].text : '',
  };
}

/**
 * Generate content with automatic fallback
 */
export async function generateContent(
  options: AIGenerationOptions
): Promise<AIGenerationResult> {
  const systemPrompt = buildSystemPrompt(options);
  const prompt = buildPrompt(options);

  const internalOptions: InternalAIOptions = {
    prompt,
    systemPrompt,
    temperature: 0.8,
    maxTokens: 600,
  };

  // Try OpenAI first, fallback to Anthropic
  if (openai) {
    try {
      return await generateWithOpenAI(internalOptions);
    } catch (error) {
      console.error('OpenAI failed, trying Anthropic:', error);
    }
  }

  if (anthropic) {
    try {
      return await generateWithAnthropic(internalOptions);
    } catch (error) {
      console.error('Anthropic failed:', error);
      throw new Error('AI generation failed. Please try again.');
    }
  }

  throw new Error('No AI models configured. Please set API keys in environment.');
}

/**
 * Generate variations with different tones
 */
export async function generateVariation(
  content: string,
  tone: string
): Promise<AIGenerationResult> {
  const prompt = `Rewrite the following social media post with a ${tone} tone. Keep it engaging and platform-appropriate:\n\n${content}`;

  const systemPrompt = `You are a social media content expert. Create ${tone} variations while maintaining the core message.`;

  return await generateContent({
    prompt,
  });
}

/**
 * Improve existing caption
 */
export async function improveCaption(caption: string): Promise<AIGenerationResult> {
  const prompt = `Improve this social media caption to make it more engaging, clear, and impactful:\n\n${caption}\n\nProvide an enhanced version that maintains the original message but improves readability, engagement, and call-to-action.`;

  return await generateContent({
    prompt,
  });
}

/**
 * Generate hashtags for content
 */
export async function generateHashtags(
  content: string,
  count: number = 10
): Promise<string[]> {
  const prompt = `Generate ${count} relevant, trending hashtags for this social media post:\n\n${content}\n\nProvide ONLY the hashtags, one per line, with # symbol.`;

  const result = await generateContent({
    prompt,
  });

  return result.content
    .split('\n')
    .filter((line) => line.trim().startsWith('#'))
    .slice(0, count);
}

/**
 * Generate image recommendations
 */
export async function generateImageRecommendations(
  content: string
): Promise<AIGenerationResult> {
  const prompt = `Based on this social media content, suggest visual ideas for accompanying images or graphics:\n\n${content}\n\nProvide 3-5 specific image recommendations with search terms, style suggestions, and mood.`;

  return await generateContent({
    prompt,
  });
}

/**
 * Generate weekly content batch
 */
export async function generateWeeklyContent(
  topic: string,
  platforms: string[],
  contentType: string
): Promise<AIGenerationResult[]> {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const results: AIGenerationResult[] = [];

  for (const day of days) {
    const prompt = `Create a ${contentType} social media post for ${day} about: ${topic}\n\nPlatforms: ${platforms.join(', ')}\n\nMake it engaging, include a call-to-action, and optimize for ${platforms[0]}.`;

    try {
      const result = await generateContent({ prompt });
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate for ${day}:`, error);
      results.push({
        content: `Error generating content for ${day}`,
      });
    }
  }

  return results;
}

/**
 * Check which AI models are available
 */
export function getAvailableModels(): { openai: boolean; anthropic: boolean } {
  return {
    openai: !!openai,
    anthropic: !!anthropic,
  };
}

// Helper functions

function buildSystemPrompt(options: AIGenerationOptions): string {
  let prompt = 'You are a professional social media content creator.';

  if (options.tone) {
    prompt += ` Create content with a ${options.tone} tone.`;
  }

  if (options.platforms && options.platforms.length > 0) {
    prompt += ` Optimize for ${options.platforms.join(', ')}.`;
  }

  return prompt;
}

function buildPrompt(options: AIGenerationOptions): string {
  let prompt = options.prompt;

  if (options.contentType) {
    prompt = `Create a ${options.contentType} post about: ${prompt}`;
  }

  if (options.includeHashtags) {
    prompt += '\n\nInclude relevant hashtags at the end.';
  }

  if (options.includeImageRecommendations) {
    prompt += '\n\nSuggest 2-3 image ideas for this post.';
  }

  return prompt;
}
