/**
 * Home Screen
 * Enhanced Dashboard with real stats and recent activity
 */

import { useUser } from '@clerk/clerk-expo';
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { format, startOfWeek, addDays, isWithinInterval } from 'date-fns';
import { getTierLimits, getTierDisplayName } from '@/lib/subscription-types';
import { getAllPosts, getScheduledContent } from '@/lib/storage';
import { Post, ScheduledContent } from '@/lib/types';

interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  avgEngagement: number;
  categoriesUsed: number;
  thisWeekScheduled: number;
  usedPosts: number;
}

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    scheduledPosts: 0,
    avgEngagement: 0,
    categoriesUsed: 0,
    thisWeekScheduled: 0,
    usedPosts: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [subscription, setSubscription] = useState<any>({ tier: 'free', status: 'active' });
  const [usage, setUsage] = useState<any>({ aiGenerations: 0 });

  const calculateStats = async () => {
    try {
      const allPosts = await getAllPosts();
      const scheduled = await getScheduledContent();

      // Calculate total posts
      const totalPosts = Object.values(allPosts).reduce((sum, posts) => sum + posts.length, 0);

      // Calculate categories used
      const categoriesUsed = Object.keys(allPosts).length;

      // Calculate used posts
      const usedPosts = Object.values(allPosts)
        .flat()
        .filter((p) => p.used).length;

      // Calculate average engagement
      const postsWithEngagement = Object.values(allPosts)
        .flat()
        .filter((p) => p.engagementScore !== undefined);
      const avgEngagement =
        postsWithEngagement.length > 0
          ? Math.round(
              postsWithEngagement.reduce((sum, p) => sum + (p.engagementScore || 0), 0) /
                postsWithEngagement.length
            )
          : 0;

      // Calculate this week's scheduled posts
      const now = new Date();
      const weekStart = startOfWeek(now);
      const weekEnd = addDays(weekStart, 7);
      const thisWeekScheduled = scheduled.filter((s) => {
        const postDate = new Date(s.date);
        return isWithinInterval(postDate, { start: weekStart, end: weekEnd });
      }).length;

      // Get recent posts (last 5, sorted by creation date)
      const allPostsFlat = Object.values(allPosts)
        .flat()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalPosts,
        scheduledPosts: scheduled.length,
        avgEngagement,
        categoriesUsed,
        thisWeekScheduled,
        usedPosts,
      });

      setRecentPosts(allPostsFlat);

      // Mock usage - in production, fetch from backend
      setUsage({ aiGenerations: Math.min(totalPosts, 10) });
    } catch (error) {
      console.error('Failed to calculate stats:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await calculateStats();
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await calculateStats();
    setRefreshing(false);
  }, []);

  const tier = subscription?.tier || 'free';
  const limits = getTierLimits(tier);
  const currentUsage = usage?.aiGenerations || 0;
  const usagePercentage =
    limits.aiGenerations === Infinity
      ? 0
      : Math.min((currentUsage / limits.aiGenerations) * 100, 100);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C4A484" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Section */}
      <View style={styles.section}>
        <Text style={styles.greeting}>Welcome back, {user?.firstName || 'there'}! 👋</Text>
        <Text style={styles.subtitle}>Let's create amazing content today</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalPosts}</Text>
            <Text style={styles.statLabel}>Total Posts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.scheduledPosts}</Text>
            <Text style={styles.statLabel}>Scheduled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.categoriesUsed}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.thisWeekScheduled}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>
      </View>

      {/* Engagement Score */}
      {stats.avgEngagement > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Average Engagement Score</Text>
          <View style={styles.engagementContainer}>
            <Text style={styles.engagementScore}>{stats.avgEngagement}</Text>
            <Text style={styles.engagementLabel}>/ 100</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${stats.avgEngagement}%`,
                  backgroundColor:
                    stats.avgEngagement >= 80
                      ? '#4CAF50'
                      : stats.avgEngagement >= 60
                        ? '#FF9800'
                        : '#F44336',
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Subscription Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Your Plan</Text>
          {tier === 'free' && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/pricing')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
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
          <View
            style={[
              styles.progressFill,
              {
                width: `${usagePercentage}%`,
                backgroundColor: usagePercentage >= 80 ? '#FF9800' : '#C4A484',
              },
            ]}
          />
        </View>
        {usagePercentage >= 80 && limits.aiGenerations !== Infinity && (
          <Text style={styles.warningText}>⚠️ You're running low on AI generations</Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/create')}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionTitle}>Create Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/schedule')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionTitle}>View Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/library')}
          >
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionTitle}>Library</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentPosts.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.emptyText}>No recent activity</Text>
            <Text style={styles.emptySubtext}>Your generated content will appear here</Text>
          </View>
        ) : (
          recentPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.activityCard}
              onPress={() => router.push('/(tabs)/library')}
            >
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle} numberOfLines={1}>
                  {post.title}
                </Text>
                {post.used && (
                  <View style={styles.usedBadge}>
                    <Text style={styles.usedBadgeText}>Used</Text>
                  </View>
                )}
              </View>
              <Text style={styles.activityContent} numberOfLines={2}>
                {post.content}
              </Text>
              <View style={styles.activityFooter}>
                <Text style={styles.activityDate}>{formatDate(post.createdAt)}</Text>
                {post.engagementScore !== undefined && (
                  <Text style={styles.activityScore}>
                    Engagement: {post.engagementScore}/100
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  section: {
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  upgradeButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  planName: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  planStatus: {
    fontSize: 15,
    color: '#666666',
  },
  engagementContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
    marginBottom: 8,
  },
  engagementScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#C4A484',
  },
  engagementLabel: {
    fontSize: 18,
    color: '#666',
    marginLeft: 4,
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
    color: '#3A3A3A',
  },
  usagePercentage: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2DDD5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C4A484',
  },
  warningText: {
    marginTop: 8,
    color: '#FF9800',
    fontSize: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    letterSpacing: -0.3,
  },
  usedBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 8,
  },
  usedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  activityContent: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 12,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 13,
    color: '#999999',
  },
  activityScore: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 17,
    marginBottom: 6,
    fontWeight: '500',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#CCCCCC',
    fontSize: 15,
  },
});
