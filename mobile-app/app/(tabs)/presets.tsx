/**
 * Weekly Presets Screen
 * Create and manage weekly content presets for batch generation
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
  Switch,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addDays, startOfWeek } from 'date-fns';
import {
  getPresets,
  savePreset,
  updatePreset,
  deletePreset,
  saveScheduledContent,
} from '@/lib/storage';
import { generateWeeklyContent } from '@/lib/ai-service';
import { Preset, ContentType, CONTENT_CATEGORIES } from '@/lib/types';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
];

export default function PresetsScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
  const [applyingPreset, setApplyingPreset] = useState<Preset | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<{ day: string; visible: boolean }>({
    day: '',
    visible: false,
  });
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: {} as Record<
      string,
      { enabled: boolean; topic: string; time: string; platforms: string[]; contentType?: ContentType }
    >,
    platforms: {
      instagram: false,
      linkedin: false,
      facebook: false,
      twitter: false,
    },
  });

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const allPresets = await getPresets();
      setPresets(allPresets);
    } catch (error) {
      console.error('Failed to load presets:', error);
      Alert.alert('Error', 'Failed to load presets');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPresets();
    setRefreshing(false);
  }, []);

  const initializeFormData = (preset?: Preset) => {
    if (preset) {
      setFormData({
        name: preset.name,
        description: preset.description,
        schedule: preset.schedule || {},
        platforms: preset.platforms || {
          instagram: false,
          linkedin: false,
          facebook: false,
          twitter: false,
        },
      });
    } else {
      // Initialize with default schedule
      const defaultSchedule: Record<
        string,
        { enabled: boolean; topic: string; time: string; platforms: string[]; contentType?: ContentType }
      > = {};
      DAYS_OF_WEEK.forEach((day) => {
        defaultSchedule[day] = {
          enabled: false,
          topic: '',
          time: '09:00',
          platforms: [],
          contentType: 'lifestyle',
        };
      });

      setFormData({
        name: '',
        description: '',
        schedule: defaultSchedule,
        platforms: {
          instagram: false,
          linkedin: false,
          facebook: false,
          twitter: false,
        },
      });
    }
  };

  const openCreateModal = (preset?: Preset) => {
    if (preset) {
      setEditingPreset(preset);
      initializeFormData(preset);
    } else {
      setEditingPreset(null);
      initializeFormData();
    }
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setEditingPreset(null);
    initializeFormData();
  };

  const toggleDayEnabled = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          enabled: !prev.schedule[day]?.enabled,
        },
      },
    }));
  };

  const updateDaySchedule = (day: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value,
        },
      },
    }));
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform as keyof typeof prev.platforms],
      },
    }));
  };

  const toggleDayPlatform = (day: string, platform: string) => {
    const daySchedule = formData.schedule[day];
    const platforms = daySchedule?.platforms || [];
    const newPlatforms = platforms.includes(platform)
      ? platforms.filter((p) => p !== platform)
      : [...platforms, platform];

    updateDaySchedule(day, 'platforms', newPlatforms);
  };

  const openTimePicker = (day: string) => {
    const dayConfig = formData.schedule[day];
    if (dayConfig?.time) {
      const [hours, minutes] = dayConfig.time.split(':');
      const timeDate = new Date();
      timeDate.setHours(parseInt(hours), parseInt(minutes));
      setSelectedTime(timeDate);
    }
    setShowTimePicker({ day, visible: true });
  };

  const handleTimeChange = (event: any, date?: Date) => {
    setShowTimePicker({ day: showTimePicker.day, visible: Platform.OS === 'ios' });
    if (date && event.type !== 'dismissed') {
      setSelectedTime(date);
      updateDaySchedule(showTimePicker.day, 'time', format(date, 'HH:mm'));
    }
  };

  const handleSavePreset = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a preset name');
      return;
    }

    const enabledDays = Object.entries(formData.schedule).filter(([_, config]) => config.enabled);
    if (enabledDays.length === 0) {
      Alert.alert('Error', 'Please enable at least one day');
      return;
    }

    for (const [day, config] of enabledDays) {
      if (!config.topic.trim()) {
        Alert.alert('Error', `Please enter a topic for ${day}`);
        return;
      }
      if (config.platforms.length === 0) {
        Alert.alert('Error', `Please select at least one platform for ${day}`);
        return;
      }
    }

    try {
      if (editingPreset) {
        await updatePreset(editingPreset.id, {
          name: formData.name,
          description: formData.description,
          schedule: formData.schedule,
          platforms: formData.platforms,
        });
        Alert.alert('Success', 'Preset updated successfully');
      } else {
        const newPreset: Preset = {
          id: Date.now(),
          name: formData.name,
          description: formData.description,
          schedule: formData.schedule,
          platforms: formData.platforms,
          createdAt: new Date().toISOString(),
        };
        await savePreset(newPreset);
        Alert.alert('Success', 'Preset created successfully');
      }

      closeCreateModal();
      await loadPresets();
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save preset');
    }
  };

  const handleApplyPreset = async (preset: Preset) => {
    setApplyingPreset(preset);
    setShowApplyModal(true);
  };

  const confirmApplyPreset = async () => {
    if (!applyingPreset) return;

    setGenerating(true);
    try {
      const enabledDays = Object.entries(applyingPreset.schedule).filter(
        ([_, config]) => config.enabled
      );

      if (enabledDays.length === 0) {
        Alert.alert('Error', 'This preset has no enabled days');
        return;
      }

      // Get the start of next week
      const today = new Date();
      const nextMonday = addDays(startOfWeek(today, { weekStartsOn: 1 }), 7);

      let generatedCount = 0;

      for (const [day, config] of enabledDays) {
        try {
          // Generate content for this day
          const dayIndex = DAYS_OF_WEEK.indexOf(day);
          const scheduledDate = addDays(nextMonday, dayIndex);
          const dateStr = format(scheduledDate, 'yyyy-MM-dd');

          // Generate content using AI
          const contentType = (config as any).contentType || 'lifestyle';
          const results = await generateWeeklyContent(
            config.topic,
            config.platforms,
            contentType
          );

          if (results.length > 0) {
            const content = results[0].content;

            // Save as scheduled content
            await saveScheduledContent({
              id: `${Date.now()}-${dayIndex}`,
              title: `${day}: ${config.topic}`,
              content: content,
              date: dateStr,
              time: config.time,
              platform: config.platforms,
              status: 'scheduled',
              createdAt: new Date().toISOString(),
            });

            generatedCount++;
          }
        } catch (error) {
          console.error(`Failed to generate for ${day}:`, error);
        }
      }

      Alert.alert(
        'Success',
        `Successfully generated and scheduled ${generatedCount} posts for next week!`,
        [{ text: 'OK', onPress: () => setShowApplyModal(false) }]
      );
    } catch (error) {
      console.error('Apply error:', error);
      Alert.alert('Error', 'Failed to apply preset');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePreset = (presetId: number) => {
    Alert.alert('Delete Preset', 'Are you sure you want to delete this preset?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePreset(presetId);
            await loadPresets();
            Alert.alert('Success', 'Preset deleted successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete preset');
          }
        },
      },
    ]);
  };

  const getEnabledDaysCount = (preset: Preset) => {
    return Object.values(preset.schedule || {}).filter((config) => config.enabled).length;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weekly Presets</Text>
          <Text style={styles.headerSubtitle}>
            Create reusable weekly content schedules and generate a full week at once
          </Text>
        </View>

        {/* Presets List */}
        {loading && presets.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C4A484" />
          </View>
        ) : presets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No presets yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first weekly preset to generate content automatically
            </Text>
          </View>
        ) : (
          <View style={styles.presetsList}>
            {presets.map((preset) => (
              <View key={preset.id} style={styles.presetCard}>
                <View style={styles.presetHeader}>
                  <View style={styles.presetHeaderLeft}>
                    <Text style={styles.presetName}>{preset.name}</Text>
                    {preset.description && (
                      <Text style={styles.presetDescription}>{preset.description}</Text>
                    )}
                    <Text style={styles.presetMeta}>
                      {getEnabledDaysCount(preset)} days enabled
                    </Text>
                  </View>
                </View>

                <View style={styles.presetActions}>
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => handleApplyPreset(preset)}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openCreateModal(preset)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePreset(preset.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => openCreateModal()}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Create/Edit Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCreateModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPreset ? 'Edit Preset' : 'Create Weekly Preset'}
              </Text>
              <TouchableOpacity onPress={closeCreateModal}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Preset Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Weekly Marketing Posts"
                  value={formData.name}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                />
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe this preset..."
                  multiline
                  numberOfLines={3}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, description: text }))
                  }
                />
              </View>

              {/* Days Configuration */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Configure Days</Text>
                {DAYS_OF_WEEK.map((day) => {
                  const dayConfig = formData.schedule[day] || {
                    enabled: false,
                    topic: '',
                    time: '09:00',
                    platforms: [],
                  };

                  return (
                    <View key={day} style={styles.dayConfig}>
                      <View style={styles.dayHeader}>
                        <Text style={styles.dayName}>{day}</Text>
                        <Switch
                          value={dayConfig.enabled}
                          onValueChange={() => toggleDayEnabled(day)}
                          trackColor={{ false: '#e0e0e0', true: '#C4A484' }}
                          thumbColor={dayConfig.enabled ? '#fff' : '#f4f3f4'}
                        />
                      </View>

                      {dayConfig.enabled && (
                        <View style={styles.dayConfigContent}>
                          <TextInput
                            style={styles.input}
                            placeholder="Content topic..."
                            value={dayConfig.topic}
                            onChangeText={(text) => updateDaySchedule(day, 'topic', text)}
                          />

                          {/* Content Type */}
                          <View style={styles.inputGroup}>
                            <Text style={styles.platformLabel}>Content Type:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                              {Object.entries(CONTENT_CATEGORIES).map(([key, value]) => (
                                <TouchableOpacity
                                  key={key}
                                  style={[
                                    styles.contentTypeChip,
                                    dayConfig.contentType === key &&
                                      styles.contentTypeChipActive,
                                  ]}
                                  onPress={() =>
                                    updateDaySchedule(day, 'contentType', key as ContentType)
                                  }
                                >
                                  <Text style={styles.contentTypeChipIcon}>{value.icon}</Text>
                                  <Text
                                    style={[
                                      styles.contentTypeChipText,
                                      dayConfig.contentType === key &&
                                        styles.contentTypeChipTextActive,
                                    ]}
                                  >
                                    {value.name}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>

                          {/* Time Picker */}
                          <View style={styles.inputGroup}>
                            <Text style={styles.platformLabel}>Time:</Text>
                            <TouchableOpacity
                              style={styles.pickerButton}
                              onPress={() => openTimePicker(day)}
                            >
                              <Text style={styles.pickerButtonText}>{dayConfig.time}</Text>
                              <Text style={styles.pickerButtonIcon}>🕐</Text>
                            </TouchableOpacity>
                            {showTimePicker.visible && showTimePicker.day === day && (
                              <DateTimePicker
                                value={selectedTime}
                                mode="time"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                is24Hour={true}
                                onChange={handleTimeChange}
                              />
                            )}
                          </View>

                          <Text style={styles.platformLabel}>Platforms:</Text>
                          <View style={styles.platformsGrid}>
                            {PLATFORMS.map((platform) => {
                              const isSelected = dayConfig.platforms.includes(platform.value);
                              return (
                                <TouchableOpacity
                                  key={platform.value}
                                  style={[
                                    styles.platformChip,
                                    isSelected && styles.platformChipActive,
                                  ]}
                                  onPress={() => toggleDayPlatform(day, platform.value)}
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
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSavePreset}>
                <Text style={styles.saveButtonText}>
                  {editingPreset ? 'Update Preset' : 'Create Preset'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Apply Confirmation Modal */}
      <Modal
        visible={showApplyModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowApplyModal(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>Apply Preset?</Text>
            <Text style={styles.confirmModalText}>
              This will generate content for all enabled days and schedule them for next week. This
              may use multiple AI generations.
            </Text>
            <View style={styles.confirmModalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowApplyModal(false)}
                disabled={generating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmApplyPreset}
                disabled={generating}
              >
                {generating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FAF9F7',
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD5',
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
  presetsList: {
    padding: 20,
  },
  presetCard: {
    backgroundColor: '#FAF9F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  presetHeader: {
    marginBottom: 12,
  },
  presetHeaderLeft: {
    flex: 1,
  },
  presetName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  presetMeta: {
    fontSize: 12,
    color: '#999',
  },
  presetActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2DDD5',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#C4A484',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#F6F3EE',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  editButtonText: {
    color: '#3A3A3A',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FAF9F7',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dayConfig: {
    backgroundColor: '#F6F3EE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  dayConfigContent: {
    gap: 12,
  },
  platformLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F7',
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
  pickerButton: {
    backgroundColor: '#FAF9F7',
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
  contentTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2DDD5',
    gap: 6,
  },
  contentTypeChipActive: {
    backgroundColor: '#C4A484',
    borderColor: '#C4A484',
  },
  contentTypeChipIcon: {
    fontSize: 16,
  },
  contentTypeChipText: {
    fontSize: 14,
    color: '#666',
  },
  contentTypeChipTextActive: {
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
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContent: {
    backgroundColor: '#FAF9F7',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 12,
  },
  confirmModalText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  confirmModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F6F3EE',
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  cancelButtonText: {
    color: '#3A3A3A',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#C4A484',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

