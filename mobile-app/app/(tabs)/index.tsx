/**
 * Home Screen
 * Dashboard and overview
 */

import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link } from 'expo-router';
import { getTierLimits, getTierDisplayName } from '@shared/lib/subscription-types';
import { apiClient } from '@/lib/api-client';

export default function HomeScreen() {
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  // Note: In a real app with Convex, use:
  // const subscription = useQuery(api.subscriptions.getUserSubscription, { userId: user?.id || '' });
  // const usage = useQuery(api.subscriptions.getUserUsage, { userId: user?.id || '' });

  const loadData = async () => {
    // Mock data for now - replace with actual Convex queries
    setSubscription({ tier: 'free', status: 'active' });
    setUsage({ aiGenerations: 2 });
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const tier = subscription?.tier || 'free';
  const limits = getTierLimits(tier);
  const currentUsage = usage?.aiGenerations || 0;
  const usagePercentage = limits.aiGenerations === Infinity
    ? 0
    : Math.min((currentUsage / limits.aiGenerations) * 100, 100);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Section */}
      <View style={styles.section}>
        <Text style={styles.greeting}>
          Welcome back, {user?.firstName || 'there'}! 👋
        </Text>
        <Text style={styles.subtitle}>
          Let's create amazing content today
        </Text>
      </View>

      {/* Subscription Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Your Plan</Text>
          {tier === 'free' && (
            <Link href="/pricing" asChild>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
        <Text style={styles.planName}>{getTierDisplayName(tier)}</Text>
        <Text style={styles.planStatus}>Status: {subscription?.status || 'Active'}</Text>
      </View>

      {/* Usage Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Generations This Month</Text>
        <View style={styles.usageRow}>
          <Text style={styles.usageText}>
            {currentUsage} / {limits.aiGenerations === Infinity ? '∞' : limits.aiGenerations}
          </Text>
          <Text style={styles.usagePercentage}>{usagePercentage.toFixed(0)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${usagePercentage}%` }]} />
        </View>
        {usagePercentage >= 80 && limits.aiGenerations !== Infinity && (
          <Text style={styles.warningText}>
            ⚠️ You're running low on AI generations
          </Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <Link href="/(tabs)/create" asChild>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>✏️</Text>
              <Text style={styles.actionTitle}>Create Post</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/schedule" asChild>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionTitle}>View Schedule</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.card}>
          <Text style={styles.emptyText}>No recent activity</Text>
          <Text style={styles.emptySubtext}>Your generated content will appear here</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  upgradeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planStatus: {
    fontSize: 14,
    color: '#666',
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  usageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  usagePercentage: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  warningText: {
    marginTop: 8,
    color: '#ff9500',
    fontSize: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 14,
  },
});
