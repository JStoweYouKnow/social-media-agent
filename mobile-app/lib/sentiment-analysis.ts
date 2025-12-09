/**
 * Sentiment Analysis and Engagement Scoring
 * Analyzes content quality and predicts engagement
 */

import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export interface SentimentResult {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  comparative: number;
}

export interface EngagementMetrics {
  score: number; // 0-100
  factors: {
    length: number;
    hashtags: number;
    questions: number;
    callToAction: number;
    emojis: number;
    sentiment: number;
  };
  recommendations: string[];
}

/**
 * Analyze sentiment of text content
 */
export function analyzeSentiment(text: string): SentimentResult {
  const analysis = sentiment.analyze(text);

  let label: 'positive' | 'negative' | 'neutral';
  if (analysis.score > 0) {
    label = 'positive';
  } else if (analysis.score < 0) {
    label = 'negative';
  } else {
    label = 'neutral';
  }

  return {
    score: analysis.score,
    label,
    comparative: analysis.comparative,
  };
}

/**
 * Calculate engagement score based on multiple factors
 */
export function calculateEngagementScore(content: string): EngagementMetrics {
  const factors = {
    length: scoreLengthFactor(content),
    hashtags: scoreHashtagFactor(content),
    questions: scoreQuestionFactor(content),
    callToAction: scoreCallToActionFactor(content),
    emojis: scoreEmojisFactor(content),
    sentiment: scoreSentimentFactor(content),
  };

  // Weighted average
  const weights = {
    length: 0.15,
    hashtags: 0.15,
    questions: 0.2,
    callToAction: 0.2,
    emojis: 0.1,
    sentiment: 0.2,
  };

  const score = Math.round(
    factors.length * weights.length +
      factors.hashtags * weights.hashtags +
      factors.questions * weights.questions +
      factors.callToAction * weights.callToAction +
      factors.emojis * weights.emojis +
      factors.sentiment * weights.sentiment
  );

  const recommendations = generateRecommendations(factors, content);

  return {
    score: Math.min(100, Math.max(0, score)),
    factors,
    recommendations,
  };
}

// Scoring functions

function scoreLengthFactor(content: string): number {
  const length = content.length;
  // Optimal length for social media: 100-280 characters
  if (length >= 100 && length <= 280) return 100;
  if (length < 50) return 40;
  if (length < 100) return 70;
  if (length <= 500) return 80;
  return 60; // Too long
}

function scoreHashtagFactor(content: string): number {
  const hashtags = (content.match(/#\w+/g) || []).length;
  // Optimal: 3-5 hashtags
  if (hashtags >= 3 && hashtags <= 5) return 100;
  if (hashtags === 1 || hashtags === 2) return 60;
  if (hashtags >= 6 && hashtags <= 10) return 70;
  if (hashtags === 0) return 20;
  return 40; // Too many
}

function scoreQuestionFactor(content: string): number {
  const questions = (content.match(/\?/g) || []).length;
  // Questions encourage engagement
  if (questions === 1 || questions === 2) return 100;
  if (questions === 0) return 50;
  return 60; // Too many questions
}

function scoreCallToActionFactor(content: string): number {
  const ctaKeywords = [
    'click',
    'visit',
    'check out',
    'learn more',
    'shop now',
    'get started',
    'sign up',
    'subscribe',
    'follow',
    'share',
    'comment',
    'tag',
    'dm',
    'swipe up',
    'link in bio',
    'download',
    'join',
    'discover',
  ];

  const lowerContent = content.toLowerCase();
  const foundCTAs = ctaKeywords.filter((keyword) => lowerContent.includes(keyword));

  if (foundCTAs.length >= 1) return 100;
  return 40;
}

function scoreEmojisFactor(content: string): number {
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const emojis = (content.match(emojiRegex) || []).length;

  // Optimal: 1-3 emojis
  if (emojis >= 1 && emojis <= 3) return 100;
  if (emojis === 0) return 60;
  if (emojis <= 5) return 80;
  return 50; // Too many
}

function scoreSentimentFactor(content: string): number {
  const sentimentResult = analyzeSentiment(content);

  // Positive sentiment scores higher
  if (sentimentResult.label === 'positive') {
    return Math.min(100, 60 + sentimentResult.score * 10);
  }

  if (sentimentResult.label === 'neutral') {
    return 70;
  }

  // Negative sentiment can work for certain contexts
  return Math.max(40, 60 + sentimentResult.score * 5);
}

// Generate recommendations

function generateRecommendations(
  factors: EngagementMetrics['factors'],
  content: string
): string[] {
  const recommendations: string[] = [];

  if (factors.length < 70) {
    if (content.length < 100) {
      recommendations.push('Add more context - posts between 100-280 characters perform best');
    } else {
      recommendations.push('Consider shortening - concise posts often get more engagement');
    }
  }

  if (factors.hashtags < 70) {
    const hashtags = (content.match(/#\w+/g) || []).length;
    if (hashtags === 0) {
      recommendations.push('Add 3-5 relevant hashtags to increase discoverability');
    } else if (hashtags < 3) {
      recommendations.push('Add a few more hashtags (optimal: 3-5)');
    } else if (hashtags > 10) {
      recommendations.push('Reduce hashtag count - too many can look spammy');
    }
  }

  if (factors.questions < 70) {
    recommendations.push('Add a question to encourage comments and engagement');
  }

  if (factors.callToAction < 70) {
    recommendations.push(
      'Include a call-to-action (e.g., "Share your thoughts", "Link in bio")'
    );
  }

  if (factors.emojis < 70) {
    const emojis = (content.match(/[\u{1F600}-\u{1F64F}]/gu) || []).length;
    if (emojis === 0) {
      recommendations.push('Add 1-2 emojis to make your post more visual and engaging');
    }
  }

  if (factors.sentiment < 60) {
    recommendations.push('Consider using more positive language to boost engagement');
  }

  return recommendations;
}

/**
 * Get detailed sentiment breakdown
 */
export function getDetailedSentiment(content: string) {
  const analysis = sentiment.analyze(content);

  return {
    score: analysis.score,
    comparative: analysis.comparative,
    positive: analysis.positive,
    negative: analysis.negative,
    calculation: analysis.calculation,
  };
}
