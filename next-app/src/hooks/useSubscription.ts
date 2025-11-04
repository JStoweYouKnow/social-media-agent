'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { PricingTierId } from '@/lib/pricing';

export interface SubscriptionData {
  tier: PricingTierId;
  customerId: string | null;
  subscriptionId: string | null;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'none';
  currentPeriodEnd: Date | null;
}

export function useSubscription() {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    tier: 'FREE',
    customerId: null,
    subscriptionId: null,
    status: 'none',
    currentPeriodEnd: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // In production, fetch from your database
        // const response = await fetch('/api/subscription');
        // const data = await response.json();

        // For now, check user metadata
        const tier = (user.publicMetadata?.tier as PricingTierId) || 'FREE';
        const customerId = user.publicMetadata?.stripeCustomerId as string | null;
        const subscriptionId = user.publicMetadata?.stripeSubscriptionId as string | null;

        setSubscription({
          tier,
          customerId: customerId || null,
          subscriptionId: subscriptionId || null,
          status: subscriptionId ? 'active' : 'none',
          currentPeriodEnd: null,
        });
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user]);

  const openCustomerPortal = async () => {
    if (!subscription.customerId) {
      window.location.href = '/pricing';
      return;
    }

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: subscription.customerId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      alert('Failed to open billing portal');
    }
  };

  return {
    subscription,
    loading,
    openCustomerPortal,
    isSubscribed: subscription.tier !== 'FREE',
    isPremium: ['PRO', 'AGENCY'].includes(subscription.tier),
  };
}
