/**
 * PremiumFeature Component
 * Wrapper for tier-restricted features
 */

import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import type { SubscriptionTier } from '@/lib/subscription-types';

interface PremiumFeatureProps {
  children: React.ReactNode;
  currentTier: SubscriptionTier;
  requiredTier: SubscriptionTier;
  featureName: string;
  locked?: boolean;
}

const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  agency: 3,
};

export default function PremiumFeature({
  children,
  currentTier,
  requiredTier,
  featureName,
  locked = true,
}: PremiumFeatureProps) {
  const hasAccess = TIER_HIERARCHY[currentTier] >= TIER_HIERARCHY[requiredTier];

  if (hasAccess) {
    return <>{children}</>;
  }

  if (!locked) {
    return <>{children}</>;
  }

  const handleUpgrade = () => {
    Alert.alert(
      'Premium Feature',
      `This feature requires a ${requiredTier} plan or higher. Would you like to upgrade?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upgrade', onPress: () => {
          // Navigate to pricing page
          // router.push('/pricing');
          Alert.alert('Upgrade', 'Navigate to pricing page');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.lockBadge}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockText}>Premium Feature</Text>
          <Text style={styles.lockDescription}>
            Upgrade to {requiredTier} to access {featureName}
          </Text>
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.blurredContent} pointerEvents="none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  blurredContent: {
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: 12,
  },
  lockBadge: {
    alignItems: 'center',
    padding: 24,
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  lockText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  lockDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
