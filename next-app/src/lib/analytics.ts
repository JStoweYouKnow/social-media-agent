// Analytics tracking for monetization insights

export type AnalyticsEvent =
  | 'page_view'
  | 'sign_up'
  | 'sign_in'
  | 'content_generated'
  | 'content_scheduled'
  | 'export_calendar'
  | 'upgrade_clicked'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'limit_reached'
  | 'feature_used';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: Record<string, string | number | boolean>;
  userId?: string;
  timestamp?: number;
}

// Track events (integrate with your analytics provider)
export function trackEvent(data: AnalyticsEventData): void {
  const eventData = {
    ...data,
    timestamp: data.timestamp || Date.now(),
  };

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventData);
  }

  // Google Analytics (if gtag is available)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', data.event, {
      ...data.properties,
      user_id: data.userId,
    });
  }

  // PostHog (if available)
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(data.event, {
      ...data.properties,
      user_id: data.userId,
    });
  }

  // Plausible (if available)
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(data.event, {
      props: data.properties,
    });
  }

  // Send to custom analytics endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    }).catch((error) => {
      console.error('Failed to track analytics:', error);
    });
  }
}

// Track page views
export function trackPageView(path: string, userId?: string): void {
  trackEvent({
    event: 'page_view',
    properties: { path },
    userId,
  });
}

// Track conversions
export function trackConversion(
  type: 'signup' | 'subscription' | 'upgrade',
  value?: number,
  userId?: string
): void {
  trackEvent({
    event:
      type === 'signup'
        ? 'sign_up'
        : type === 'subscription'
        ? 'subscription_started'
        : 'upgrade_clicked',
    properties: {
      conversion_type: type,
      value: value || 0,
    },
    userId,
  });
}

// Track feature usage
export function trackFeatureUsage(
  feature: string,
  metadata?: Record<string, string | number | boolean>,
  userId?: string
): void {
  trackEvent({
    event: 'feature_used',
    properties: {
      feature,
      ...metadata,
    },
    userId,
  });
}

// Track limit reached (important for upselling)
export function trackLimitReached(
  limitType: string,
  currentTier: string,
  userId?: string
): void {
  trackEvent({
    event: 'limit_reached',
    properties: {
      limit_type: limitType,
      current_tier: currentTier,
    },
    userId,
  });
}

// Calculate Monthly Recurring Revenue (MRR)
export function calculateMRR(subscriptions: Array<{ price: number; interval: string }>): number {
  return subscriptions.reduce((total, sub) => {
    if (sub.interval === 'month') {
      return total + sub.price;
    } else if (sub.interval === 'year') {
      return total + sub.price / 12;
    }
    return total;
  }, 0);
}

// Calculate Customer Lifetime Value (CLV)
export function calculateCLV(params: {
  averageRevenuePerUser: number;
  averageLifetimeMonths: number;
  grossMargin: number;
}): number {
  const { averageRevenuePerUser, averageLifetimeMonths, grossMargin } = params;
  return averageRevenuePerUser * averageLifetimeMonths * grossMargin;
}

// Track user engagement score
export function calculateEngagementScore(metrics: {
  contentGenerated: number;
  postsScheduled: number;
  loginDays: number;
  featuresUsed: number;
}): number {
  const weights = {
    contentGenerated: 0.3,
    postsScheduled: 0.3,
    loginDays: 0.2,
    featuresUsed: 0.2,
  };

  // Normalize and calculate
  const score =
    Math.min(metrics.contentGenerated / 10, 1) * weights.contentGenerated +
    Math.min(metrics.postsScheduled / 20, 1) * weights.postsScheduled +
    Math.min(metrics.loginDays / 30, 1) * weights.loginDays +
    Math.min(metrics.featuresUsed / 10, 1) * weights.featuresUsed;

  return Math.round(score * 100);
}
