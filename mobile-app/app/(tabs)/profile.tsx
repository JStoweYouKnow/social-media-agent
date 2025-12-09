/**
 * Profile Screen
 * Enhanced with user settings, preferences, and data export
 */

import { useUser, useAuth } from '@clerk/clerk-expo';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Switch,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import { getTierDisplayName, getTierLimits } from '@/lib/subscription-types';
import { apiClient } from '@/lib/api-client';
import {
  getUserPreferences,
  saveUserPreferences,
  exportData,
  UserPreferences,
} from '@/lib/storage';
import { getAllPosts, getScheduledContent } from '@/lib/storage';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
];

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'funny', label: 'Funny' },
  { value: 'inspiring', label: 'Inspiring' },
  { value: 'educational', label: 'Educational' },
];

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultPlatforms: ['instagram'],
    defaultTone: 'professional',
    notificationsEnabled: true,
  });

  // Note: In production, fetch actual subscription data
  const subscription = { tier: 'free', status: 'active' };
  const [usage, setUsage] = useState<any>({ aiGenerations: 0 });

  useEffect(() => {
    loadPreferences();
    loadUsage();
    // Load user data for edit profile
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const prefs = await getUserPreferences();
      setPreferences({
        defaultPlatforms: prefs.defaultPlatforms || ['instagram'],
        defaultTone: prefs.defaultTone || 'professional',
        notificationsEnabled: prefs.notificationsEnabled !== false,
      });
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const loadUsage = async () => {
    try {
      const allPosts = await getAllPosts();
      const totalPosts = Object.values(allPosts).reduce((sum, posts) => sum + posts.length, 0);
      setUsage({ aiGenerations: Math.min(totalPosts, 10) });
    } catch (error) {
      console.error('Failed to load usage:', error);
    }
  };

  const savePreferences = async () => {
    try {
      await saveUserPreferences(preferences);
      setShowSettingsModal(false);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportData();
      const fileName = `post-planner-export-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
      
      // Use legacy API for compatibility
      // Type assertion needed because TypeScript types may not be fully updated
      const cacheDir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory;
      if (!cacheDir) {
        throw new Error('Unable to access file system directory');
      }
      
      const fileUri = `${cacheDir}${fileName}`;
      
      // Write data to file - use the writeAsStringAsync method from legacy API
      // The legacy import should provide this method
      await FileSystem.writeAsStringAsync(fileUri, data);

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Post Planner Data',
        });
        Alert.alert('Success', 'Data exported and shared successfully!');
      } else {
        Alert.alert(
          'Export Ready',
          `Data exported to: ${fileUri}\n\nSharing is not available on this device.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Error', error.message || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleManageSubscription = async () => {
    if (subscription.tier === 'free') {
      router.push('/pricing');
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.createPortalSession();
      
      if (result.url) {
        // Open Stripe customer portal in browser
        await WebBrowser.openBrowserAsync(result.url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        });
      } else {
        Alert.alert('Error', 'Failed to create portal session');
      }
    } catch (error: any) {
      console.error('Failed to open portal:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to open subscription management. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    if (!user) return;
    
    setEditingProfile(true);
    try {
      await user.update({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      setShowEditProfileModal(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setEditingProfile(false);
    }
  };

  const handleOpenPrivacyPolicy = async () => {
    const privacyUrl = 'https://postplanner.projcomfort.com/privacy-policy';
    try {
      await WebBrowser.openBrowserAsync(privacyUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to open privacy policy');
    }
  };

  const handleOpenTermsOfService = async () => {
    const termsUrl = 'https://postplanner.projcomfort.com/terms-of-service';
    try {
      await WebBrowser.openBrowserAsync(termsUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to open terms of service');
    }
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'Need help? Contact us:\n\nEmail: support@postplanner.app\n\nWe typically respond within 24 hours.',
      [
        {
          text: 'Open Email',
          onPress: async () => {
            const emailUrl = 'mailto:support@postplanner.app?subject=Post Planner Support Request';
            try {
              await WebBrowser.openBrowserAsync(emailUrl);
            } catch (error) {
              Alert.alert('Error', 'Unable to open email client');
            }
          },
        },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
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
    ]);
  };

  const togglePlatform = (platform: string) => {
    setPreferences((prev) => {
      const platforms = prev.defaultPlatforms || [];
      const newPlatforms = platforms.includes(platform)
        ? platforms.filter((p) => p !== platform)
        : [...platforms, platform];
      return { ...prev, defaultPlatforms: newPlatforms };
    });
  };

  const tier = (subscription?.tier || 'free') as 'free' | 'starter' | 'pro' | 'agency';
  const limits = getTierLimits(tier);
  const currentUsage = usage?.aiGenerations || 0;

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
                {user?.firstName?.charAt(0) ||
                  user?.emailAddresses[0]?.emailAddress.charAt(0) ||
                  '?'}
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
              <TouchableOpacity style={styles.upgradeButton} onPress={handleManageSubscription}>
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
              <Text style={styles.statLabel}>Scheduled Posts</Text>
              <Text style={styles.statValue}>
                {limits.scheduledPosts === Infinity ? '∞' : limits.scheduledPosts}
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
                <ActivityIndicator color="#C4A484" />
              ) : (
                <Text style={styles.manageButtonText}>Manage Subscription</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowSettingsModal(true)}
          >
            <Text style={styles.menuItemText}>Default Settings</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Notifications</Text>
            <Switch
              value={preferences.notificationsEnabled}
              onValueChange={async (value) => {
                const newPrefs = { ...preferences, notificationsEnabled: value };
                setPreferences(newPrefs);
                await saveUserPreferences(newPrefs);
                Alert.alert('Success', `Notifications ${value ? 'enabled' : 'disabled'}`);
              }}
              trackColor={{ false: '#e0e0e0', true: '#C4A484' }}
              thumbColor={preferences.notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem} onPress={handleExport} disabled={exporting}>
            <Text style={styles.menuItemText}>Export Data</Text>
            {exporting ? (
              <ActivityIndicator size="small" color="#C4A484" />
            ) : (
              <Text style={styles.menuItemArrow}>→</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowEditProfileModal(true)}
          >
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleOpenPrivacyPolicy}
          >
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleOpenTermsOfService}
          >
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleHelpSupport}
          >
            <Text style={styles.menuItemText}>Help & Support</Text>
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

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfileModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.textInput, styles.textInputDisabled]}
                  value={user?.emailAddresses[0]?.emailAddress || ''}
                  editable={false}
                  placeholderTextColor="#999"
                />
                <Text style={styles.helperText}>Email cannot be changed here</Text>
              </View>

              <TouchableOpacity
                style={[styles.saveButton, editingProfile && styles.saveButtonDisabled]}
                onPress={handleEditProfile}
                disabled={editingProfile}
              >
                {editingProfile ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Default Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Default Platforms */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Default Platforms</Text>
                <View style={styles.platformsGrid}>
                  {PLATFORMS.map((platform) => {
                    const isSelected = (preferences.defaultPlatforms || []).includes(
                      platform.value
                    );
                    return (
                      <TouchableOpacity
                        key={platform.value}
                        style={[
                          styles.platformChip,
                          isSelected && styles.platformChipActive,
                        ]}
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

              {/* Default Tone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Default Tone</Text>
                <View style={styles.tonesGrid}>
                  {TONES.map((tone) => (
                    <TouchableOpacity
                      key={tone.value}
                      style={[
                        styles.toneChip,
                        preferences.defaultTone === tone.value && styles.toneChipActive,
                      ]}
                      onPress={() =>
                        setPreferences((prev) => ({ ...prev, defaultTone: tone.value }))
                      }
                    >
                      <Text
                        style={[
                          styles.toneChipText,
                          preferences.defaultTone === tone.value && styles.toneChipTextActive,
                        ]}
                      >
                        {tone.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 16,
    color: '#666666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FAF9F7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2DDD5',
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
    color: '#3A3A3A',
  },
  planStatus: {
    fontSize: 14,
    color: '#666',
  },
  upgradeButton: {
    backgroundColor: '#C4A484',
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
    backgroundColor: '#F6F3EE',
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
    color: '#3A3A3A',
  },
  manageButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#3A3A3A',
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#999',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E2DDD5',
  },
  signOutButton: {
    backgroundColor: '#FAF9F7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  signOutButtonText: {
    color: '#F44336',
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
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toneChip: {
    backgroundColor: '#F6F3EE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  toneChipActive: {
    backgroundColor: '#C4A484',
    borderColor: '#C4A484',
  },
  toneChipText: {
    fontSize: 14,
    color: '#666',
  },
  toneChipTextActive: {
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  textInput: {
    backgroundColor: '#F6F3EE',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#3A3A3A',
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  textInputDisabled: {
    backgroundColor: '#F0F0F0',
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
