/**
 * Create Screen
 * AI content generation
 */

import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { apiClient } from '@/lib/api-client';
import type { Platform, ToneType } from '@shared/lib/content-types';
import { getTierLimits } from '@shared/lib/subscription-types';

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'all', label: 'All Platforms' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const TONES: { value: ToneType; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'humorous', label: 'Humorous' },
];

export default function CreateScreen() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState<Platform>('all');
  const [tone, setTone] = useState<ToneType>('professional');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);

  // Note: In production, fetch actual subscription data
  const subscription = { tier: 'free', status: 'active' };
  const usage = { aiGenerations: 2 };

  const tier = subscription?.tier || 'free';
  const limits = getTierLimits(tier);
  const currentUsage = usage?.aiGenerations || 0;
  const canGenerate = currentUsage < limits.aiGenerations || limits.aiGenerations === Infinity;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    if (!canGenerate) {
      Alert.alert(
        'Usage Limit Reached',
        'You have reached your AI generation limit. Please upgrade your plan to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      const result = await apiClient.generateContent({
        prompt,
        platform,
        tone,
      });

      setGeneratedContent(result.content);

      // Auto-generate hashtags
      if (result.content) {
        const hashtagResult = await apiClient.generateHashtags({
          content: result.content,
          platform,
        });
        setGeneratedHashtags(hashtagResult.hashtags);
      }

      Alert.alert('Success', 'Content generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert('Error', 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent) return;

    // TODO: Implement save functionality
    Alert.alert('Coming Soon', 'Save functionality will be implemented soon!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Usage Warning */}
      {!canGenerate && (
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            ⚠️ You've reached your generation limit
          </Text>
          <Text style={styles.warningSubtext}>
            Upgrade your plan to continue creating content
          </Text>
        </View>
      )}

      {/* Generation Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generate New Content</Text>

        {/* Prompt Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>What do you want to create?</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what you want to post about..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

        {/* Platform Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Platform</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {PLATFORMS.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[styles.chip, platform === p.value && styles.chipActive]}
                onPress={() => setPlatform(p.value)}
              >
                <Text style={[styles.chipText, platform === p.value && styles.chipTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tone Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tone</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {TONES.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[styles.chip, tone === t.value && styles.chipActive]}
                onPress={() => setTone(t.value)}
              >
                <Text style={[styles.chipText, tone === t.value && styles.chipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, (!canGenerate || loading) && styles.buttonDisabled]}
          onPress={handleGenerate}
          disabled={!canGenerate || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generateButtonText}>Generate Content</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Generated Content */}
      {generatedContent && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generated Content</Text>
          <View style={styles.card}>
            <Text style={styles.contentText}>{generatedContent}</Text>
          </View>

          {/* Hashtags */}
          {generatedHashtags.length > 0 && (
            <View style={styles.hashtagsContainer}>
              <Text style={styles.hashtagsLabel}>Suggested Hashtags:</Text>
              <View style={styles.hashtagsWrap}>
                {generatedHashtags.map((tag, index) => (
                  <View key={index} style={styles.hashtagChip}>
                    <Text style={styles.hashtagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setGeneratedContent(null)}>
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Usage Info */}
      <View style={styles.usageInfo}>
        <Text style={styles.usageInfoText}>
          Generations used: {currentUsage} / {limits.aiGenerations === Infinity ? '∞' : limits.aiGenerations}
        </Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  warningCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9500',
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  warningSubtext: {
    fontSize: 14,
    color: '#856404',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipContainer: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  hashtagsContainer: {
    marginBottom: 16,
  },
  hashtagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  hashtagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagChip: {
    backgroundColor: '#e8f4f8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hashtagText: {
    fontSize: 14,
    color: '#0066cc',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  usageInfo: {
    padding: 20,
    paddingTop: 0,
  },
  usageInfoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
