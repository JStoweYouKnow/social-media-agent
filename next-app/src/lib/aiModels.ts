import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

export type AIModel = 'openai' | 'anthropic' | 'both';

export interface AIGenerationOptions {
  prompt: string;
  systemPrompt?: string;
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  tone?: string;
}

export interface AIGenerationResult {
  content: string;
  model: 'openai' | 'anthropic';
  tokens?: number;
  finishReason?: string;
}

/**
 * Generate content using OpenAI
 */
async function generateWithOpenAI(options: AIGenerationOptions): Promise<AIGenerationResult> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: options.systemPrompt || 'You are a creative social media content creator.' },
      { role: 'user', content: options.prompt }
    ],
    temperature: options.temperature ?? 0.8,
    max_tokens: options.maxTokens ?? 600,
  });

  return {
    content: response.choices[0]?.message?.content || '',
    model: 'openai',
    tokens: response.usage?.total_tokens,
    finishReason: response.choices[0]?.finish_reason || undefined,
  };
}

/**
 * Generate content using Anthropic Claude
 */
async function generateWithAnthropic(options: AIGenerationOptions): Promise<AIGenerationResult> {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured');
  }

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: options.maxTokens ?? 600,
    temperature: options.temperature ?? 0.8,
    system: options.systemPrompt || 'You are a creative social media content creator.',
    messages: [
      { role: 'user', content: options.prompt }
    ],
  });

  return {
    content: response.content[0].type === 'text' ? response.content[0].text : '',
    model: 'anthropic',
    tokens: response.usage?.input_tokens && response.usage?.output_tokens 
      ? response.usage.input_tokens + response.usage.output_tokens 
      : undefined,
    finishReason: response.stop_reason || undefined,
  };
}

/**
 * Generate content with multiple models for variety
 */
export async function generateWithMultipleModels(
  options: AIGenerationOptions
): Promise<AIGenerationResult[]> {
  const results: AIGenerationResult[] = [];

  if (openai) {
    try {
      const openaiResult = await generateWithOpenAI(options);
      results.push(openaiResult);
    } catch (error) {
      console.error('OpenAI generation error:', error);
    }
  }

  if (anthropic) {
    try {
      const anthropicResult = await generateWithAnthropic(options);
      results.push(anthropicResult);
    } catch (error) {
      console.error('Anthropic generation error:', error);
    }
  }

  return results;
}

/**
 * Generate content with fallback support
 */
export async function generateWithFallback(options: AIGenerationOptions): Promise<AIGenerationResult> {
  const preferredModel = options.model || 'openai';

  // Try preferred model first
  if (preferredModel === 'openai' && openai) {
    try {
      return await generateWithOpenAI(options);
    } catch (error) {
      console.error('OpenAI failed, trying Anthropic:', error);
    }
  }

  if (preferredModel === 'anthropic' && anthropic) {
    try {
      return await generateWithAnthropic(options);
    } catch (error) {
      console.error('Anthropic failed, trying OpenAI:', error);
    }
  }

  // Fallback to whichever is available
  if (openai) {
    return await generateWithOpenAI(options);
  }

  if (anthropic) {
    return await generateWithAnthropic(options);
  }

  throw new Error('No AI models configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY');
}

/**
 * Generate content with specified model
 */
export async function generateContent(options: AIGenerationOptions): Promise<AIGenerationResult> {
  const model = options.model || 'openai';

  if (model === 'both') {
    const results = await generateWithMultipleModels(options);
    if (results.length === 0) {
      throw new Error('No AI models available');
    }
    // Return the first result (can be enhanced to merge or select best)
    return results[0];
  }

  if (model === 'openai') {
    return await generateWithOpenAI(options);
  }

  if (model === 'anthropic') {
    return await generateWithAnthropic(options);
  }

  // Default to fallback
  return await generateWithFallback(options);
}

/**
 * Check which models are available
 */
export function getAvailableModels(): { openai: boolean; anthropic: boolean } {
  return {
    openai: !!openai,
    anthropic: !!anthropic,
  };
}










