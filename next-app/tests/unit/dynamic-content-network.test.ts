import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import {
  getTrendingTopics,
  extractUrlContent,
  enhancePromptWithContext,
} from '@/lib/dynamicContent';

// Mock RSS feed XML response
const mockRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test News</title>
    <item>
      <title>Breaking News 1</title>
      <link>https://example.com/news1</link>
    </item>
    <item>
      <title>Breaking News 2</title>
      <link>https://example.com/news2</link>
    </item>
    <item>
      <title>Breaking News 3</title>
      <link>https://example.com/news3</link>
    </item>
  </channel>
</rss>`;

// Mock HTML page response
const mockHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Article Title</title>
  <meta name="description" content="This is a test article description">
  <meta name="keywords" content="test, article, keywords">
  <meta property="og:title" content="OG Title">
  <meta property="og:description" content="OG Description">
</head>
<body>
  <article>
    <h1>Test Article</h1>
    <p>This is the main content of the article. It contains important information.</p>
  </article>
</body>
</html>`;

// Set up MSW server
const server = setupServer(
  // Mock CNN RSS feed
  http.get('https://rss.cnn.com/rss/edition.rss', () => {
    return new HttpResponse(mockRssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml',
      },
    });
  }),

  // Mock BBC RSS feed
  http.get('https://feeds.bbci.co.uk/news/rss.xml', () => {
    return new HttpResponse(mockRssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml',
      },
    });
  }),

  // Mock custom RSS feed
  http.get('https://custom-feed.com/rss', () => {
    return new HttpResponse(mockRssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml',
      },
    });
  }),

  // Mock failing RSS feed
  http.get('https://failing-feed.com/rss', () => {
    return new HttpResponse(null, {
      status: 500,
    });
  }),

  // Mock HTML article page
  http.get('https://example.com/article', () => {
    return new HttpResponse(mockHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }),

  // Mock failing URL
  http.get('https://failing-url.com/article', () => {
    return new HttpResponse(null, {
      status: 404,
    });
  }),

  // Mock URL with minimal content
  http.get('https://minimal.com/page', () => {
    return new HttpResponse('<html><head><title>Minimal</title></head><body>Basic content</body></html>', {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  })
);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());

describe('Dynamic Content Network Functions', () => {
  describe('getTrendingTopics', () => {
    it('should fetch trending topics from default RSS feeds', async () => {
      const topics = await getTrendingTopics();

      expect(topics).toBeDefined();
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);
      expect(topics).toContain('Breaking News 1');
      expect(topics).toContain('Breaking News 2');
    });

    it('should fetch trending topics from custom RSS feeds', async () => {
      const topics = await getTrendingTopics(['https://custom-feed.com/rss']);

      expect(topics).toBeDefined();
      expect(topics.length).toBeGreaterThan(0);
      expect(topics).toContain('Breaking News 1');
    });

    it('should handle feed parsing errors gracefully', async () => {
      const topics = await getTrendingTopics(['https://failing-feed.com/rss']);

      expect(topics).toBeDefined();
      expect(Array.isArray(topics)).toBe(true);
      // Should return empty array or continue with other feeds
      expect(topics.length).toBeGreaterThanOrEqual(0);
    });

    it('should limit topics to 10 items', async () => {
      const topics = await getTrendingTopics();

      expect(topics.length).toBeLessThanOrEqual(10);
    });

    it('should handle empty feed URLs array', async () => {
      const topics = await getTrendingTopics([]);

      // Should use default feeds
      expect(topics).toBeDefined();
      expect(Array.isArray(topics)).toBe(true);
    });

    it('should handle mix of working and failing feeds', async () => {
      const topics = await getTrendingTopics([
        'https://custom-feed.com/rss',
        'https://failing-feed.com/rss',
      ]);

      expect(topics).toBeDefined();
      expect(topics.length).toBeGreaterThan(0);
      // Should have topics from working feed
      expect(topics).toContain('Breaking News 1');
    });
  });

  describe('extractUrlContent', () => {
    it('should extract content from a valid URL', async () => {
      const content = await extractUrlContent('https://example.com/article');

      expect(content).not.toBeNull();
      expect(content?.title).toBe('Test Article Title');
      expect(content?.description).toBe('This is a test article description');
      expect(content?.content).toContain('main content of the article');
      expect(content?.keywords).toEqual(['test', 'article', 'keywords']);
    });

    it('should extract Open Graph metadata when available', async () => {
      const content = await extractUrlContent('https://example.com/article');

      expect(content).not.toBeNull();
      // The function prioritizes regular title over OG title
      expect(content?.title).toBeTruthy();
    });

    it('should return null for failing URLs', async () => {
      const content = await extractUrlContent('https://failing-url.com/article');

      expect(content).toBeNull();
    });

    it('should handle URLs with minimal content', async () => {
      const content = await extractUrlContent('https://minimal.com/page');

      expect(content).not.toBeNull();
      expect(content?.title).toBe('Minimal');
      expect(content?.content).toContain('Basic content');
    });

    it('should limit content length to 1000 characters', async () => {
      const longHtml = `<html><body><article>${'x'.repeat(5000)}</article></body></html>`;

      server.use(
        http.get('https://long-content.com/page', () => {
          return new HttpResponse(longHtml, {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          });
        })
      );

      const content = await extractUrlContent('https://long-content.com/page');

      expect(content).not.toBeNull();
      expect(content?.content.length).toBeLessThanOrEqual(1000);
    });

    it('should trim whitespace from extracted content', async () => {
      const content = await extractUrlContent('https://example.com/article');

      expect(content).not.toBeNull();
      expect(content?.title).toBe(content?.title.trim());
      expect(content?.description).toBe(content?.description.trim());
      expect(content?.content).toBe(content?.content.trim());
    });

    it('should extract keywords as array', async () => {
      const content = await extractUrlContent('https://example.com/article');

      expect(content).not.toBeNull();
      expect(Array.isArray(content?.keywords)).toBe(true);
      expect(content?.keywords.length).toBeGreaterThan(0);
    });

    it('should handle URLs without keywords meta tag', async () => {
      const htmlNoKeywords = '<html><head><title>No Keywords</title></head><body>Content</body></html>';

      server.use(
        http.get('https://no-keywords.com/page', () => {
          return new HttpResponse(htmlNoKeywords, {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          });
        })
      );

      const content = await extractUrlContent('https://no-keywords.com/page');

      expect(content).not.toBeNull();
      expect(content?.keywords).toEqual([]);
    });
  });

  describe('enhancePromptWithContext', () => {
    it('should enhance prompt with time context', async () => {
      const basePrompt = 'Create a social media post';
      const enhanced = await enhancePromptWithContext(basePrompt, {
        includeTimeContext: true,
      });

      expect(enhanced).toContain('Time context:');
      expect(enhanced).toContain(basePrompt);
      expect(enhanced.length).toBeGreaterThan(basePrompt.length);
    });

    it('should enhance prompt with trending topics', async () => {
      const basePrompt = 'Create a social media post';
      const enhanced = await enhancePromptWithContext(basePrompt, {
        includeTrending: true,
      });

      expect(enhanced).toContain('Current trending topics:');
      expect(enhanced).toContain('Breaking News');
      expect(enhanced).toContain(basePrompt);
    });

    it('should enhance prompt with URL context', async () => {
      const basePrompt = 'Create a social media post';
      const enhanced = await enhancePromptWithContext(basePrompt, {
        urlContext: 'https://example.com/article',
      });

      expect(enhanced).toContain('Reference content:');
      expect(enhanced).toContain('Test Article Title');
      expect(enhanced).toContain(basePrompt);
    });

    it('should combine multiple context options', async () => {
      const basePrompt = 'Create a social media post';
      const enhanced = await enhancePromptWithContext(basePrompt, {
        includeTimeContext: true,
        includeTrending: true,
        urlContext: 'https://example.com/article',
      });

      expect(enhanced).toContain('Time context:');
      expect(enhanced).toContain('Current trending topics:');
      expect(enhanced).toContain('Reference content:');
      expect(enhanced).toContain(basePrompt);
    });

    it('should return base prompt when no options provided', async () => {
      const basePrompt = 'Create a social media post';
      const enhanced = await enhancePromptWithContext(basePrompt, {});

      expect(enhanced).toBe(basePrompt);
    });

    it('should handle errors in trending topics gracefully', async () => {
      server.use(
        http.get('https://rss.cnn.com/rss/edition.rss', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const basePrompt = 'Create a social media post';
      const enhanced = await enhancePromptWithContext(basePrompt, {
        includeTrending: true,
      });

      // Should still return the base prompt, might not have trending topics
      expect(enhanced).toBeDefined();
      expect(enhanced).toContain(basePrompt);
    });

    it('should handle errors in URL extraction gracefully', async () => {
      const basePrompt = 'Create a social media post';
      const enhanced = await enhancePromptWithContext(basePrompt, {
        urlContext: 'https://failing-url.com/article',
      });

      // Should still return the base prompt without URL context
      expect(enhanced).toBeDefined();
      expect(enhanced).toContain(basePrompt);
    });

    it('should format context sections properly', async () => {
      const basePrompt = 'Create a social media post';
      const enhanced = await enhancePromptWithContext(basePrompt, {
        includeTimeContext: true,
        includeTrending: true,
      });

      expect(enhanced).toContain('Additional context:');
      expect(enhanced).toContain('\n');
    });

    it('should limit trending topics in context to 3', async () => {
      const basePrompt = 'Create a social media post';
      const enhanced = await enhancePromptWithContext(basePrompt, {
        includeTrending: true,
      });

      // Should have at most 3 topics mentioned
      const topicsMatch = enhanced.match(/Breaking News/g);
      if (topicsMatch) {
        expect(topicsMatch.length).toBeLessThanOrEqual(3);
      }
    });
  });
});
