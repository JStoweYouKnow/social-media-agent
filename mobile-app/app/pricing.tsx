/**
 * Pricing Screen
 * Display subscription tiers and Stripe integration
 */

import { useUser } from '@clerk/clerk-expo';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  getTierLimits,
  getTierDisplayName,
  getTierPrice,
  SubscriptionTier,
} from '@/lib/subscription-types';
import { apiClient } from '@/lib/api-client';

// Price IDs - These should match your Stripe configuration
// In production, these could be fetched from your backend
const TIER_PRICE_IDS: Record<SubscriptionTier, string | null> = {
  free: null,
  starter: null, // Will be set from backend or env
  pro: null, // Will be set from backend or env
  agency: null, // Will be set from backend or env
};

const TIERS: SubscriptionTier[] = ['free', 'starter', 'pro', 'agency'];

const TIER_FEATURES = {
  free: ['5 AI generations/month', '1 platform', 'Basic content library'],
  starter: ['50 AI generations/month', '3 platforms', 'Content export', 'Priority support'],
  pro: [
    '200 AI generations/month',
    'All platforms',
    'Content export',
    'Canva integration',
    '3 team members',
    'Priority support',
  ],
  agency: [
    'Unlimited AI generations',
    'All platforms',
    'Content export',
    'Canva integration',
    '10 team members',
    'API access',
    'Dedicated support',
  ],
};

export default function PricingScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Note: In production, fetch actual subscription data
  const currentTier: SubscriptionTier = 'free';

  const getPriceIdForTier = async (tier: SubscriptionTier): Promise<string | null> => {
    // In production, fetch price IDs from backend
    // For now, we'll need to get them from environment or backend API
    // The backend should handle price ID lookup based on tier
    return TIER_PRICE_IDS[tier];
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (tier === 'free') {
      Alert.alert('Free Plan', 'You are already on the free plan.');
      return;
    }

    if (tier === currentTier) {
      Alert.alert('Current Plan', 'You are already subscribed to this plan.');
      return;
    }

    setLoading(tier);
    try {
      // Get price ID for the tier (backend should handle this)
      // For now, we'll pass the tier name and let backend resolve price ID
      // In a real implementation, you'd fetch price IDs from backend or use env vars
      
      // Call backend to create checkout session
      // The backend API should accept tier name and return checkout URL
      const priceId = await getPriceIdForTier(tier);
      
      if (!priceId) {
        // Fallback: Backend should handle price ID lookup
        // For now, show a message that backend needs to be configured
        Alert.alert(
          'Configuration Needed',
          'Stripe price IDs need to be configured. Please contact support or configure your backend with Stripe price IDs.',
          [{ text: 'OK' }]
        );
        setLoading(null);
        return;
      }

      const result = await apiClient.createCheckoutSession(priceId);
      
      if (result.url) {
        // Open Stripe checkout in browser
        await WebBrowser.openBrowserAsync(result.url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        });
      } else {
        Alert.alert('Error', 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to start subscription process. Please try again.'
      );
    } finally {
      setLoading(null);
    }
  };

  const getPrice = (tier: SubscriptionTier) => {
    if (tier === 'free') {
      return 0;
    }
    // Use the period from billingPeriod state
    return getTierPrice(tier, billingPeriod);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(0)}`;
  };

  const isCurrentTier = (tier: SubscriptionTier) => tier === currentTier;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <Text style={styles.headerSubtitle}>
          Select the perfect plan for your content creation needs
        </Text>
      </View>

      {/* Billing Period Toggle */}
      <View style={styles.billingToggle}>
        <TouchableOpacity
          style={[styles.billingOption, billingPeriod === 'monthly' && styles.billingOptionActive]}
          onPress={() => setBillingPeriod('monthly')}
        >
          <Text
            style={[
              styles.billingOptionText,
              billingPeriod === 'monthly' && styles.billingOptionTextActive,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.billingOption, billingPeriod === 'yearly' && styles.billingOptionActive]}
          onPress={() => setBillingPeriod('yearly')}
        >
          <Text
            style={[
              styles.billingOptionText,
              billingPeriod === 'yearly' && styles.billingOptionTextActive,
            ]}
          >
            Yearly
            <Text style={styles.billingDiscount}> (Save 20%)</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pricing Cards */}
      <View style={styles.pricingGrid}>
        {TIERS.map((tier) => {
          const limits = getTierLimits(tier);
          const price = getPrice(tier);
          const isCurrent = isCurrentTier(tier);
          const isPopular = tier === 'pro';

          return (
            <View
              key={tier}
              style={[
                styles.pricingCard,
                isPopular && styles.pricingCardPopular,
                isCurrent && styles.pricingCardCurrent,
              ]}
            >
              {isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current Plan</Text>
                </View>
              )}

              <Text style={styles.tierName}>{getTierDisplayName(tier)}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{formatPrice(price)}</Text>
                {price > 0 && (
                  <Text style={styles.pricePeriod}>/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</Text>
                )}
              </View>

              <View style={styles.featuresList}>
                {TIER_FEATURES[tier].map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureIcon}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  isCurrent && styles.subscribeButtonCurrent,
                  isPopular && styles.subscribeButtonPopular,
                ]}
                onPress={() => handleSubscribe(tier)}
                disabled={loading === tier}
              >
                {loading === tier ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={[
                      styles.subscribeButtonText,
                      isCurrent && styles.subscribeButtonTextCurrent,
                    ]}
                  >
                    {isCurrent ? 'Current Plan' : 'Subscribe'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Feature Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feature Comparison</Text>
        <View style={styles.comparisonTable}>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>AI Generations</Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('free').aiGenerations === Infinity
                ? '∞'
                : getTierLimits('free').aiGenerations}
            </Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('starter').aiGenerations === Infinity
                ? '∞'
                : getTierLimits('starter').aiGenerations}
            </Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('pro').aiGenerations === Infinity
                ? '∞'
                : getTierLimits('pro').aiGenerations}
            </Text>
            <Text style={styles.comparisonValue}>∞</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Platforms</Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('free').platforms === Infinity
                ? '∞'
                : getTierLimits('free').platforms}
            </Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('starter').platforms === Infinity
                ? '∞'
                : getTierLimits('starter').platforms}
            </Text>
            <Text style={styles.comparisonValue}>∞</Text>
            <Text style={styles.comparisonValue}>∞</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>Canva Integration</Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('free').canvaIntegration ? '✓' : '✗'}
            </Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('starter').canvaIntegration ? '✓' : '✗'}
            </Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('pro').canvaIntegration ? '✓' : '✗'}
            </Text>
            <Text style={styles.comparisonValue}>✓</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>API Access</Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('free').apiAccess ? '✓' : '✗'}
            </Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('starter').apiAccess ? '✓' : '✗'}
            </Text>
            <Text style={styles.comparisonValue}>
              {getTierLimits('pro').apiAccess ? '✓' : '✗'}
            </Text>
            <Text style={styles.comparisonValue}>✓</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All plans include a 14-day free trial. Cancel anytime.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F3EE',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FAF9F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD5',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#C4A484',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3A3A3A',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  billingToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#FAF9F7',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  billingOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  billingOptionActive: {
    backgroundColor: '#C4A484',
  },
  billingOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  billingOptionTextActive: {
    color: '#fff',
  },
  billingDiscount: {
    fontSize: 12,
  },
  pricingGrid: {
    padding: 20,
    gap: 16,
  },
  pricingCard: {
    backgroundColor: '#FAF9F7',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E2DDD5',
    position: 'relative',
  },
  pricingCardPopular: {
    borderColor: '#C4A484',
    backgroundColor: '#FAF9F7',
  },
  pricingCardCurrent: {
    borderColor: '#4CAF50',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: '#C4A484',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  currentBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3A3A3A',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#C4A484',
  },
  pricePeriod: {
    fontSize: 18,
    color: '#666',
    marginLeft: 4,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#3A3A3A',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#C4A484',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  subscribeButtonCurrent: {
    backgroundColor: '#E2DDD5',
  },
  subscribeButtonPopular: {
    backgroundColor: '#C4A484',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subscribeButtonTextCurrent: {
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#3A3A3A',
  },
  comparisonTable: {
    backgroundColor: '#FAF9F7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD5',
  },
  comparisonLabel: {
    flex: 2,
    fontSize: 14,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  comparisonValue: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

