/**
 * Profile Screen
 * User profile, subscription, and settings
 */

import { useUser, useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getTierDisplayName, getTierLimits } from '@shared/lib/subscription-types';
import { apiClient } from '@/lib/api-client';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Note: In production, fetch actual subscription data
  const subscription = { tier: 'free', status: 'active' };
  const usage = { aiGenerations: 2 };

  const tier = subscription?.tier || 'free';
  const limits = getTierLimits(tier);
  const currentUsage = usage?.aiGenerations || 0;

  const handleManageSubscription = async () => {
    if (tier === 'free') {
      // Navigate to pricing/upgrade
      Alert.alert('Upgrade', 'Navigate to pricing page to upgrade your plan');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.createPortalSession();
      if (result.url) {
        // Open Stripe portal URL
        Alert.alert('Success', 'Opening subscription management...');
        // TODO: Use expo-web-browser to open URL
      }
    } catch (error) {
      console.error('Failed to open portal:', error);
      Alert.alert('Error', 'Failed to open subscription management');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || '?'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.firstName || 'User'}
        </Text>
        <Text style={styles.email}>{user?.emailAddresses[0]?.emailAddress}</Text>
      </View>

      {/* Subscription Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.card}>
          <View style={styles.subscriptionHeader}>
            <View>
              <Text style={styles.planName}>{getTierDisplayName(tier)}</Text>
              <Text style={styles.planStatus}>Status: {subscription?.status || 'Active'}</Text>
            </View>
            {tier === 'free' && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={handleManageSubscription}
              >
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.usageStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>AI Generations</Text>
              <Text style={styles.statValue}>
                {currentUsage} / {limits.aiGenerations === Infinity ? '∞' : limits.aiGenerations}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Weekly Posts</Text>
              <Text style={styles.statValue}>
                {limits.weeklyPostsLimit === Infinity ? '∞' : limits.weeklyPostsLimit}
              </Text>
            </View>
          </View>

          {tier !== 'free' && (
            <TouchableOpacity
              style={styles.manageButton}
              onPress={handleManageSubscription}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.manageButtonText}>Manage Subscription</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Notifications</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Connected Accounts</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>About</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Out Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Post Planner v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planStatus: {
    fontSize: 14,
    color: '#666',
  },
  upgradeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  usageStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  manageButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#999',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  signOutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  signOutButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});
