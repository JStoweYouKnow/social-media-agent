'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log Web Vitals for monitoring
    console.log('Web Vitals:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });

    // Send to analytics
    if (typeof window !== 'undefined') {
      // Google Analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(
            metric.name === 'CLS' ? metric.value * 1000 : metric.value
          ),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }

      // Custom analytics endpoint
      fetch('/api/analytics/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        }),
      }).catch((error) => {
        console.error('Failed to report Web Vitals:', error);
      });
    }
  });

  // Monitor performance budget
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (perfData) {
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          ttfb: perfData.responseStart - perfData.requestStart,
          download: perfData.responseEnd - perfData.responseStart,
          domInteractive: perfData.domInteractive - perfData.fetchStart,
          domComplete: perfData.domComplete - perfData.fetchStart,
          loadComplete: perfData.loadEventEnd - perfData.fetchStart,
        };

        console.log('Performance Metrics:', metrics);

        // Alert if performance is degraded
        if (metrics.ttfb > 600) {
          console.warn('⚠️ Slow TTFB detected:', metrics.ttfb, 'ms');
        }

        if (metrics.loadComplete > 3000) {
          console.warn('⚠️ Slow page load detected:', metrics.loadComplete, 'ms');
        }
      }
    }
  }, []);

  return null;
}
