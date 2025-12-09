/**
 * Schedule Screen
 * View and manage scheduled content with calendar integration
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
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO, isSameDay, startOfDay } from 'date-fns';
import {
  getScheduledContent,
  saveScheduledContent,
  updateScheduledContent,
  deleteScheduledContent,
} from '@/lib/storage';
import { ScheduledContent } from '@/lib/types';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
];

export default function ScheduleScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [scheduled, setScheduled] = useState<ScheduledContent[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduledContent | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    platforms: [] as string[],
  });

  useEffect(() => {
    loadScheduledContent();
  }, []);

  const loadScheduledContent = async () => {
    setLoading(true);
    try {
      const content = await getScheduledContent();
      setScheduled(content);

      // Mark dates on calendar
      const marked: Record<string, any> = {};
      content.forEach((item) => {
        const dateKey = item.date;
        if (marked[dateKey]) {
          marked[dateKey].dots = [
            ...(marked[dateKey].dots || []),
            { color: '#C4A484', selectedColor: '#C4A484' },
          ];
        } else {
          marked[dateKey] = {
            marked: true,
            dotColor: '#C4A484',
            selected: isSameDay(parseISO(item.date), parseISO(selectedDate)),
          };
        }
      });

      // Mark selected date
      if (marked[selectedDate]) {
        marked[selectedDate].selected = true;
        marked[selectedDate].selectedColor = '#C4A484';
      } else {
        marked[selectedDate] = {
          selected: true,
          selectedColor: '#C4A484',
        };
      }

      setMarkedDates(marked);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      Alert.alert('Error', 'Failed to load scheduled content');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadScheduledContent();
    setRefreshing(false);
  }, []);

  const handleDateSelect = (day: any) => {
    const dateStr = day.dateString;
    setSelectedDate(dateStr);
    setFormData((prev) => ({ ...prev, date: dateStr }));
  };

  const getPostsForDate = (date: string) => {
    return scheduled.filter((post) => post.date === date);
  };

  const selectedDatePosts = getPostsForDate(selectedDate);

  const togglePlatform = (platform: string) => {
    setFormData((prev) => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
  };

  const openScheduleModal = (item?: ScheduledContent) => {
    const now = new Date();
    if (item) {
      setEditingItem(item);
      const itemDate = parseISO(item.date);
      const [hours, minutes] = item.time.split(':');
      itemDate.setHours(parseInt(hours), parseInt(minutes));
      setSelectedDateTime(itemDate);
      setFormData({
        title: item.title,
        content: item.content,
        date: item.date,
        time: item.time,
        platforms: item.platform,
      });
    } else {
      setEditingItem(null);
      now.setHours(9, 0, 0, 0);
      setSelectedDateTime(now);
      setFormData({
        title: '',
        content: '',
        date: selectedDate,
        time: '09:00',
        platforms: [],
      });
    }
    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      date: selectedDate,
      time: '09:00',
      platforms: [],
    });
  };

  const handleSaveSchedule = async () => {
    if (!formData.content.trim()) {
      Alert.alert('Error', 'Please enter content');
      return;
    }

    if (formData.platforms.length === 0) {
      Alert.alert('Error', 'Please select at least one platform');
      return;
    }

    try {
      if (editingItem) {
        // Update existing
        await updateScheduledContent(editingItem.id, {
          title: formData.title || formData.content.substring(0, 50),
          content: formData.content,
          date: formData.date,
          time: formData.time,
          platform: formData.platforms,
        });
        Alert.alert('Success', 'Schedule updated successfully');
      } else {
        // Create new
        const newScheduled: ScheduledContent = {
          id: Date.now().toString(),
          title: formData.title || formData.content.substring(0, 50),
          content: formData.content,
          date: formData.date,
          time: formData.time,
          platform: formData.platforms,
          status: 'scheduled',
          createdAt: new Date().toISOString(),
        };
        await saveScheduledContent(newScheduled);
        Alert.alert('Success', 'Content scheduled successfully');
      }

      closeScheduleModal();
      await loadScheduledContent();
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save schedule');
    }
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this scheduled post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteScheduledContent(postId);
            await loadScheduledContent();
            Alert.alert('Success', 'Post deleted successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete post');
          }
        },
      },
    ]);
  };

  const getPlatformEmoji = (platform: string) => {
    const emojis: Record<string, string> = {
      instagram: '📷',
      facebook: '👥',
      twitter: '🐦',
      linkedin: '💼',
    };
    return emojis[platform] || '📱';
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={handleDateSelect}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#FAF9F7',
            calendarBackground: '#FAF9F7',
            textSectionTitleColor: '#3A3A3A',
            selectedDayBackgroundColor: '#C4A484',
            selectedDayTextColor: '#fff',
            todayTextColor: '#C4A484',
            dayTextColor: '#3A3A3A',
            textDisabledColor: '#E2DDD5',
            dotColor: '#C4A484',
            selectedDotColor: '#fff',
            arrowColor: '#C4A484',
            monthTextColor: '#3A3A3A',
            indicatorColor: '#C4A484',
            textDayFontWeight: '500',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          style={styles.calendar}
        />
      </View>

      {/* Selected Date Header */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateHeaderTitle}>
          {format(parseISO(selectedDate), 'EEEE, MMMM d')}
        </Text>
        {selectedDatePosts.length > 0 && (
          <Text style={styles.postsCount}>{selectedDatePosts.length} posts</Text>
        )}
      </View>

      {/* Posts List */}
      <ScrollView
        style={styles.postsContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading && scheduled.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C4A484" />
          </View>
        ) : selectedDatePosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No posts scheduled</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to schedule content for this day
            </Text>
          </View>
        ) : (
          selectedDatePosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postHeaderLeft}>
                  <Text style={styles.postTime}>{formatTime(post.time)}</Text>
                  <View style={styles.platformsContainer}>
                    {post.platform.map((platform) => (
                      <Text key={platform} style={styles.platformEmoji}>
                        {getPlatformEmoji(platform)}
                      </Text>
                    ))}
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{post.status}</Text>
                </View>
              </View>
              {post.title && <Text style={styles.postTitle}>{post.title}</Text>}
              <Text style={styles.postContent}>{post.content}</Text>
              {post.tags && (
                <View style={styles.tagsContainer}>
                  <Text style={styles.tagsText}>{post.tags}</Text>
                </View>
              )}
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openScheduleModal(post)}
                >
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

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => openScheduleModal()}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Schedule Modal */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeScheduleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Schedule' : 'Schedule Content'}
              </Text>
              <TouchableOpacity onPress={closeScheduleModal}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter title..."
                  value={formData.title}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
                />
              </View>

              {/* Content */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Content *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter post content..."
                  multiline
                  numberOfLines={6}
                  value={formData.content}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, content: text }))}
                />
              </View>

              {/* Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date *</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.pickerButtonText}>{formData.date}</Text>
                  <Text style={styles.pickerButtonIcon}>📅</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDateTime}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (date) {
                        setSelectedDateTime(date);
                        setFormData((prev) => ({
                          ...prev,
                          date: format(date, 'yyyy-MM-dd'),
                        }));
                      }
                    }}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              {/* Time */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Time *</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.pickerButtonText}>{formData.time}</Text>
                  <Text style={styles.pickerButtonIcon}>🕐</Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={selectedDateTime}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={true}
                    onChange={(event, date) => {
                      setShowTimePicker(Platform.OS === 'ios');
                      if (date) {
                        setSelectedDateTime(date);
                        setFormData((prev) => ({
                          ...prev,
                          time: format(date, 'HH:mm'),
                        }));
                      }
                    }}
                  />
                )}
              </View>

              {/* Platforms */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Platforms *</Text>
                <View style={styles.platformsGrid}>
                  {PLATFORMS.map((platform) => {
                    const isSelected = formData.platforms.includes(platform.value);
                    return (
                      <TouchableOpacity
                        key={platform.value}
                        style={[styles.platformChip, isSelected && styles.platformChipActive]}
                        onPress={() => togglePlatform(platform.value)}
                      >
                        <Text style={styles.platformChipIcon}>{platform.icon}</Text>
                        <Text
                          style={[
                            styles.platformChipText,
                            isSelected && styles.platformChipTextActive,
                          ]}
                        >
                          {platform.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveSchedule}>
                <Text style={styles.saveButtonText}>
                  {editingItem ? 'Update Schedule' : 'Schedule Content'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F3EE',
  },
  calendarContainer: {
    backgroundColor: '#FAF9F7',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD5',
  },
  calendar: {
    borderRadius: 10,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAF9F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD5',
  },
  dateHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  postsCount: {
    fontSize: 14,
    color: '#666',
  },
  postsContainer: {
    flex: 1,
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
    backgroundColor: '#FAF9F7',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C4A484',
  },
  platformsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  platformEmoji: {
    fontSize: 16,
  },
  statusBadge: {
    backgroundColor: '#E2DDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
    marginBottom: 12,
  },
  tagsContainer: {
    marginBottom: 12,
  },
  tagsText: {
    fontSize: 14,
    color: '#0066cc',
  },
  postActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2DDD5',
  },
  editButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F6F3EE',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  deleteButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FAF9F7',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F44336',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#C4A484',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FAF9F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#3A3A3A',
  },
  input: {
    backgroundColor: '#F6F3EE',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2DDD5',
    color: '#3A3A3A',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  pickerButton: {
    backgroundColor: '#F6F3EE',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2DDD5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#3A3A3A',
  },
  pickerButtonIcon: {
    fontSize: 20,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F3EE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2DDD5',
    gap: 6,
  },
  platformChipActive: {
    backgroundColor: '#C4A484',
    borderColor: '#C4A484',
  },
  platformChipIcon: {
    fontSize: 16,
  },
  platformChipText: {
    fontSize: 14,
    color: '#666',
  },
  platformChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#C4A484',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
