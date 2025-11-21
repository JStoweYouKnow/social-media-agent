import { describe, it, expect, vi } from 'vitest';
import {
  formatDynamicDate,
  getRelativeTime,
  analyzeSentiment,
  CaptionResponseSchema,
  WeeklyContentSchema,
  getTimeContext,
  calculateEngagementScore,
  validateResponse,
} from '@/lib/dynamicContent';
import { addDays, subDays } from 'date-fns';

describe('Dynamic Content Utilities', () => {
  describe('formatDynamicDate', () => {
    it('should format date as "today" for relative context', () => {
      const today = new Date();
      const result = formatDynamicDate(today, 'relative');
      expect(result).toBe('today');
    });

    it('should format date as "tomorrow" for relative context', () => {
      const tomorrow = addDays(new Date(), 1);
      const result = formatDynamicDate(tomorrow, 'relative');
      expect(result).toBe('tomorrow');
    });

    it('should format date for post context', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatDynamicDate(date, 'post');
      expect(result).toContain('January');
      expect(result).toContain('15');
    });

    it('should format date in ISO format by default', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatDynamicDate(date);
      // Account for timezone differences - should be close to 2024-01-15
      expect(result).toMatch(/2024-01-1[45]/);
    });

    it('should handle past dates with relative formatting', () => {
      const pastDate = subDays(new Date(), 30);
      const result = formatDynamicDate(pastDate, 'relative');
      // Should return a non-empty string
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getRelativeTime', () => {
    it('should return relative time for recent dates', () => {
      const recentDate = subDays(new Date(), 2);
      const result = getRelativeTime(recentDate);
      expect(result).toContain('days ago');
    });

    it('should return relative time for very recent dates', () => {
      const veryRecent = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      const result = getRelativeTime(veryRecent);
      expect(result).toContain('minutes ago');
    });
  });

  describe('analyzeSentiment', () => {
    it('should detect positive sentiment', () => {
      const text = 'I love this amazing wonderful product! It is fantastic and great!';
      const result = analyzeSentiment(text);

      expect(result.positive).toBe(true);
      expect(result.negative).toBe(false);
      expect(result.neutral).toBe(false);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should detect negative sentiment', () => {
      const text = 'I hate this terrible awful product! It is horrible and bad!';
      const result = analyzeSentiment(text);

      expect(result.positive).toBe(false);
      expect(result.negative).toBe(true);
      expect(result.neutral).toBe(false);
      expect(result.score).toBeLessThan(0);
    });

    it('should detect neutral sentiment', () => {
      const text = 'The product exists. It is a thing.';
      const result = analyzeSentiment(text);

      expect(result.score).toBe(0);
      expect(result.neutral).toBe(true);
    });

    it('should return comparative score', () => {
      const text = 'This is great!';
      const result = analyzeSentiment(text);

      expect(typeof result.comparative).toBe('number');
    });
  });

  describe('CaptionResponseSchema', () => {
    it('should validate correct caption response', () => {
      const validData = {
        caption: 'This is a valid caption with enough characters',
        hashtags: ['test', 'validation'],
        sentiment: 'positive' as const,
        engagementScore: 8.5,
      };

      const result = CaptionResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject caption that is too short', () => {
      const invalidData = {
        caption: 'Short',
        hashtags: [],
      };

      const result = CaptionResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject caption that is too long', () => {
      const invalidData = {
        caption: 'a'.repeat(2201), // Over 2200 chars
      };

      const result = CaptionResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid sentiment', () => {
      const invalidData = {
        caption: 'Valid length caption here',
        sentiment: 'super-positive', // Invalid enum value
      };

      const result = CaptionResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject engagement score out of range', () => {
      const invalidData = {
        caption: 'Valid length caption here',
        engagementScore: 15, // Over 10
      };

      const result = CaptionResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should allow optional fields to be omitted', () => {
      const validData = {
        caption: 'Just a caption with valid length',
      };

      const result = CaptionResponseSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('WeeklyContentSchema', () => {
    it('should validate correct weekly content', () => {
      const validData = {
        posts: [
          {
            day: 'Monday',
            date: '2024-01-15',
            title: 'Test Post',
            content: 'This is test content',
            hashtags: '#test #validation',
            variations: {
              instagram: 'Instagram version',
              linkedin: 'LinkedIn version',
              facebook: 'Facebook version',
            },
          },
        ],
      };

      const result = WeeklyContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate without variations', () => {
      const validData = {
        posts: [
          {
            day: 'Monday',
            date: '2024-01-15',
            title: 'Test Post',
            content: 'This is test content',
            hashtags: '#test',
          },
        ],
      };

      const result = WeeklyContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid weekly content', () => {
      const invalidData = {
        posts: [
          {
            day: 'Monday',
            // missing required fields
          },
        ],
      };

      const result = WeeklyContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('getTimeContext', () => {
    it('should return context for morning', () => {
      const morningDate = new Date('2024-01-15T08:00:00');
      const result = getTimeContext(morningDate);

      expect(result.timeOfDay).toBe('morning');
      expect(result.dayOfWeek).toBeTruthy();
      expect(result.weekContext).toBeTruthy();
      expect(result.seasonalContext).toBeTruthy();
    });

    it('should return context for afternoon', () => {
      const afternoonDate = new Date('2024-01-15T14:00:00');
      const result = getTimeContext(afternoonDate);

      expect(result.timeOfDay).toBe('afternoon');
    });

    it('should return context for evening', () => {
      const eveningDate = new Date('2024-01-15T20:00:00');
      const result = getTimeContext(eveningDate);

      expect(result.timeOfDay).toBe('evening');
    });

    it('should determine week context correctly', () => {
      // Monday (early week)
      const monday = new Date('2024-01-15T12:00:00'); // Monday
      const resultEarly = getTimeContext(monday);
      expect(resultEarly.weekContext).toBe('early');

      // Thursday (mid week)
      const thursday = new Date('2024-01-18T12:00:00');
      const resultMid = getTimeContext(thursday);
      expect(resultMid.weekContext).toBe('mid');

      // Saturday (late week)
      const saturday = new Date('2024-01-20T12:00:00');
      const resultLate = getTimeContext(saturday);
      expect(resultLate.weekContext).toBe('late');
    });

    it('should determine seasonal context correctly', () => {
      const spring = new Date('2024-04-15T12:00:00');
      const summer = new Date('2024-07-15T12:00:00');
      const fall = new Date('2024-10-15T12:00:00');
      const winter = new Date('2024-12-15T12:00:00');

      expect(getTimeContext(spring).seasonalContext).toBe('spring');
      expect(getTimeContext(summer).seasonalContext).toBe('summer');
      expect(getTimeContext(fall).seasonalContext).toBe('fall');
      expect(getTimeContext(winter).seasonalContext).toBe('winter');
    });
  });

  describe('calculateEngagementScore', () => {
    it('should calculate score based on caption length', () => {
      const shortCaption = 'Short';
      const optimalCaption = 'This is a great post with optimal length and good hashtags';
      const hashtags = ['test', 'viral'];

      const shortScore = calculateEngagementScore(shortCaption, hashtags);
      const optimalScore = calculateEngagementScore(optimalCaption, hashtags);

      expect(optimalScore).toBeGreaterThan(shortScore);
    });

    it('should give higher score for optimal hashtag count', () => {
      const caption = 'Great post';
      const fewHashtags = ['one'];
      const optimalHashtags = ['one', 'two', 'three', 'four', 'five'];
      const tooManyHashtags = Array(20).fill('tag');

      const fewScore = calculateEngagementScore(caption, fewHashtags);
      const optimalScore = calculateEngagementScore(caption, optimalHashtags);
      const tooManyScore = calculateEngagementScore(caption, tooManyHashtags);

      expect(optimalScore).toBeGreaterThan(fewScore);
      expect(optimalScore).toBeGreaterThanOrEqual(tooManyScore);
    });

    it('should reward emojis but not too many', () => {
      const noEmojis = 'Great post without emojis';
      const someEmojis = 'Great post with 😊 emojis 🎉';
      const tooManyEmojis = '😊😊😊😊😊😊😊😊😊😊 post';

      const noEmojiScore = calculateEngagementScore(noEmojis, []);
      const someEmojiScore = calculateEngagementScore(someEmojis, []);
      const tooManyEmojiScore = calculateEngagementScore(tooManyEmojis, []);

      expect(someEmojiScore).toBeGreaterThan(noEmojiScore);
      expect(someEmojiScore).toBeGreaterThanOrEqual(tooManyEmojiScore);
    });

    it('should return score between 0 and 10', () => {
      const caption = 'Test caption';
      const score = calculateEngagementScore(caption, []);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(10);
    });
  });

  describe('validateResponse', () => {
    it('should validate correct response structure', () => {
      const data = {
        caption: 'Valid caption with enough length',
        hashtags: ['test'],
        sentiment: 'positive',
        engagementScore: 8,
      };

      const result = validateResponse(data, CaptionResponseSchema);
      expect(result.success).toBe(true);
    });

    it('should return error for invalid response', () => {
      const data = {
        caption: 'Short',
      };

      const result = validateResponse(data, CaptionResponseSchema);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});
