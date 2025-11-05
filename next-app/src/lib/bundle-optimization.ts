// Bundle optimization utilities
// Use these to reduce bundle size and improve performance

/**
 * Lazy load a module with a minimum delay for better UX
 * Prevents flashing of loading states for fast networks
 */
export function lazyWithMinDelay<T>(
  importFn: () => Promise<{ default: T }>,
  minDelay: number = 300
): Promise<{ default: T }> {
  return Promise.all([
    importFn(),
    new Promise((resolve) => setTimeout(resolve, minDelay)),
  ]).then(([module]) => module);
}

/**
 * Preload a dynamic import when user hovers
 * Reduces perceived load time for interactive elements
 */
export function preloadOnHover(importFn: () => Promise<any>) {
  let preloadPromise: Promise<any> | null = null;

  const preload = () => {
    if (!preloadPromise) {
      preloadPromise = importFn();
    }
    return preloadPromise;
  };

  return {
    preload,
    onMouseEnter: preload,
    onTouchStart: preload,
  };
}

/**
 * Preload a route when it enters viewport
 * Great for next page predictions
 */
export function preloadOnVisible(
  importFn: () => Promise<any>,
  threshold: number = 0.1
) {
  if (typeof window === 'undefined') return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          importFn();
          observer.disconnect();
        }
      });
    },
    { threshold }
  );

  return (element: HTMLElement | null) => {
    if (element) observer.observe(element);
  };
}

/**
 * Check if code splitting is working
 * Run in browser console to see loaded chunks
 */
export function analyzeChunks() {
  if (typeof window === 'undefined') return;

  const scripts = Array.from(document.scripts);
  const nextChunks = scripts.filter((s) => s.src.includes('/_next/'));

  console.group('📦 Next.js Chunks Analysis');
  console.log('Total scripts:', scripts.length);
  console.log('Next.js chunks:', nextChunks.length);

  const chunkSizes = nextChunks.map((script) => ({
    name: script.src.split('/').pop(),
    src: script.src,
  }));

  console.table(chunkSizes);
  console.groupEnd();
}

/**
 * Monitor bundle size in development
 */
export function monitorBundleSize() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development')
    return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('/_next/static/chunks/')) {
        const size = (entry as any).transferSize || 0;
        const sizeKB = (size / 1024).toFixed(2);

        if (size > 100000) {
          // > 100KB
          console.warn(
            `⚠️ Large chunk detected: ${entry.name} (${sizeKB} KB)`
          );
        }
      }
    }
  });

  observer.observe({ entryTypes: ['resource'] });
}

/**
 * Tree-shakeable imports helper
 * Use for libraries that support tree-shaking
 */
export const TreeShakeable = {
  // Example: Only import what you need
  lucide: {
    async Calendar() {
      const { Calendar } = await import('lucide-react');
      return Calendar;
    },
    async Check() {
      const { Check } = await import('lucide-react');
      return Check;
    },
    async Sparkles() {
      const { Sparkles } = await import('lucide-react');
      return Sparkles;
    },
  },
};

/**
 * Defer non-critical scripts
 * Load analytics, chat widgets, etc. after page is interactive
 */
export function deferScript(
  src: string,
  onLoad?: () => void,
  delay: number = 3000
) {
  if (typeof window === 'undefined') return;

  setTimeout(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;

    if (onLoad) {
      script.onload = onLoad;
    }

    document.body.appendChild(script);
  }, delay);
}

/**
 * Detect slow network and adjust bundle strategy
 */
export function getNetworkQuality(): 'slow' | 'fast' | 'unknown' {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return 'unknown';
  }

  const connection = (navigator as any).connection;

  if (connection.saveData || connection.effectiveType === '2g') {
    return 'slow';
  }

  return 'fast';
}

/**
 * Conditional import based on network
 */
export async function importIfFastNetwork<T>(
  importFn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  const quality = getNetworkQuality();

  if (quality === 'slow' && fallback) {
    return fallback;
  }

  return importFn();
}

// Development helpers
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).bundleUtils = {
    analyzeChunks,
    monitorBundleSize,
    getNetworkQuality,
  };

  console.log(
    '💡 Bundle utils available: window.bundleUtils.analyzeChunks()'
  );
}
