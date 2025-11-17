/**
 * Schedule Screen
 * View and manage scheduled content
 */

import { useUser } from '@clerk/clerk-expo';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { apiClient } from '@/lib/api-client';

interface ScheduledPost {
  id: string;
  date: string;
  content: string;
  platform: string;
  tags: string[];
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [schedule, setSchedule] = useState<ScheduledPost[]>([]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const loadSchedule = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      // const result = await apiClient.getWeeklySchedule({
      //   startDate: format(weekStart, 'yyyy-MM-dd')
      // });

      // Mock scheduled posts
      setSchedule([
        {
          id: '1',
          date: format(new Date(), 'yyyy-MM-dd'),
          content: 'Check out our latest blog post about social media trends!',
          platform: 'instagram',
          tags: ['#socialmedia', '#trends', '#marketing'],
        },
        {
          id: '2',
          date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
          content: 'New product launch coming soon! Stay tuned for updates.',
          platform: 'twitter',
          tags: ['#launch', '#newproduct'],
        },
      ]);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      Alert.alert('Error', 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [weekStart]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSchedule();
    setRefreshing(false);
  };

  const handlePreviousWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const getPostsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedule.filter((post) => post.date === dateStr);
  };

  const selectedDatePosts = getPostsForDate(selectedDate);

  const handleDeletePost = (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this scheduled post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete functionality
            setSchedule((prev) => prev.filter((p) => p.id !== postId));
            Alert.alert('Success', 'Post deleted successfully');
          },
        },
      ]
    );
  };

  const getPlatformEmoji = (platform: string) => {
    const emojis: Record<string, string> = {
      instagram: '📷',
      facebook: '👍',
      twitter: '🐦',
      linkedin: '💼',
      all: '🌐',
    };
    return emojis[platform] || '📱';
  };

  return (
    <View style={styles.container}>
      {/* Week Navigation */}
      <View style={styles.weekNav}>
        <TouchableOpacity onPress={handlePreviousWeek} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.weekLabel}>
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </Text>
        <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Week View */}
      <View style={styles.calendarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.daysRow}>
            {weekDays.map((day, index) => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const postsCount = getPostsForDate(day).length;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCard,
                    isSelected && styles.dayCardSelected,
                    isToday && styles.dayCardToday,
                  ]}
                  onPress={() => handleDateSelect(day)}
                >
                  <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                    {DAYS_OF_WEEK[index]}
                  </Text>
                  <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                    {format(day, 'd')}
                  </Text>
                  {postsCount > 0 && (
                    <View style={styles.postBadge}>
                      <Text style={styles.postBadgeText}>{postsCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Posts for Selected Date */}
      <ScrollView
        style={styles.postsContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.postsHeader}>
          <Text style={styles.postsHeaderTitle}>
            {format(selectedDate, 'EEEE, MMMM d')}
          </Text>
          {selectedDatePosts.length > 0 && (
            <Text style={styles.postsCount}>{selectedDatePosts.length} posts</Text>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : selectedDatePosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No posts scheduled</Text>
            <Text style={styles.emptySubtext}>
              Create content and schedule it for this day
            </Text>
          </View>
        ) : (
          selectedDatePosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Text style={styles.platformEmoji}>{getPlatformEmoji(post.platform)}</Text>
                <Text style={styles.platformName}>{post.platform}</Text>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
              {post.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {post.tags.map((tag, idx) => (
                    <Text key={idx} style={styles.tag}>
                      {tag}
                    </Text>
                  ))}
                </View>
              )}
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePost(post.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: '#000',
  },
  weekLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  daysRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  dayCard: {
    width: 60,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  dayCardSelected: {
    backgroundColor: '#000',
  },
  dayCardToday: {
    borderWidth: 2,
    borderColor: '#000',
  },
  dayName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dayNameSelected: {
    color: '#fff',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dayNumberSelected: {
    color: '#fff',
  },
  postBadge: {
    marginTop: 4,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  postBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  postsContainer: {
    flex: 1,
  },
  postsHeader: {
    padding: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postsHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postsCount: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  platformName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'capitalize',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    fontSize: 14,
    color: '#0066cc',
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff3b30',
  },
});
