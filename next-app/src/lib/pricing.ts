// Pricing tiers configuration for Post Planner
export const PRICING_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    interval: 'month',
    features: [
      '5 AI-generated posts per month',
      '1 social platform',
      'Basic content library',
      '7-day content calendar',
      'Community support',
    ],
    limits: {
      aiGenerations: 5,
      platforms: 1,
      scheduledPosts: 10,
      contentLibrary: 50,
      canExport: false,
      canvaIntegration: false,
      teamMembers: 1,
    },
  },
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 19,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    interval: 'month',
    popular: false,
    features: [
      '50 AI-generated posts per month',
      '3 social platforms',
      'Full content library access',
      '30-day content calendar',
      'CSV export',
      'Email support',
    ],
    limits: {
      aiGenerations: 50,
      platforms: 3,
      scheduledPosts: 100,
      contentLibrary: 500,
      canExport: true,
      canvaIntegration: false,
      teamMembers: 1,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    interval: 'month',
    popular: true,
    features: [
      '200 AI-generated posts per month',
      'Unlimited platforms',
      'Advanced content library',
      '90-day content calendar',
      'CSV & PDF export',
      'Canva integration',
      'Priority support',
      '3 team members',
    ],
    limits: {
      aiGenerations: 200,
      platforms: Infinity,
      scheduledPosts: 500,
      contentLibrary: 2000,
      canExport: true,
      canvaIntegration: true,
      teamMembers: 3,
    },
  },
  AGENCY: {
    id: 'agency',
    name: 'Agency',
    price: 149,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
    interval: 'month',
    popular: false,
    features: [
      'Unlimited AI-generated posts',
      'Unlimited platforms',
      'White-label options',
      'Unlimited content calendar',
      'Advanced analytics',
      'API access',
      'Canva Pro integration',
      'Dedicated support',
      '10 team members',
      'Client management',
    ],
    limits: {
      aiGenerations: Infinity,
      platforms: Infinity,
      scheduledPosts: Infinity,
      contentLibrary: Infinity,
      canExport: true,
      canvaIntegration: true,
      teamMembers: 10,
      apiAccess: true,
      whiteLabel: true,
    },
  },
} as const;

export type PricingTierId = keyof typeof PRICING_TIERS;
export type PricingTier = typeof PRICING_TIERS[PricingTierId];

// Get tier limits for a user
export function getTierLimits(tierId: PricingTierId) {
  return PRICING_TIERS[tierId].limits;
}

// Check if user can perform action based on their tier
export function canPerformAction(
  tierId: PricingTierId,
  action: keyof PricingTier['limits'],
  currentUsage: number
): boolean {
  const limit = PRICING_TIERS[tierId].limits[action];

  if (typeof limit === 'boolean') return limit;
  if (limit === Infinity) return true;

  return currentUsage < (limit as number);
}

// Get upgrade message for limits
export function getUpgradeMessage(tierId: PricingTierId): string {
  const messages: Record<PricingTierId, string> = {
    FREE: 'Upgrade to Starter to unlock more AI generations and platforms',
    STARTER: 'Upgrade to Pro for unlimited platforms and Canva integration',
    PRO: 'Upgrade to Agency for unlimited everything and white-label options',
    AGENCY: 'You are on the highest tier!',
  };

  return messages[tierId];
}
