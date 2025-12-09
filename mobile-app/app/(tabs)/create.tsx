/**
 * Create Screen
 * AI content generation with sentiment analysis and engagement scoring
 */

import { useUser } from '@clerk/clerk-expo';
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
  Switch,
} from 'react-native';
import { generateContent, generateHashtags, generateImageRecommendations } from '@/lib/ai-service';
import { analyzeSentiment, calculateEngagementScore } from '@/lib/sentiment-analysis';
import { savePost } from '@/lib/storage';
import { CONTENT_CATEGORIES, ContentType, AIGenerationResult } from '@/lib/types';
import { getTierLimits } from '@/lib/subscription-types';
import { apiClient } from '@/lib/api-client';

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

export default function CreateScreen() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [tone, setTone] = useState<'professional' | 'casual' | 'funny' | 'inspiring' | 'educational'>('professional');
  const [category, setCategory] = useState<ContentType>('lifestyle');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeImageRecommendations, setIncludeImageRecommendations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    content: string;
    hashtags?: string[];
    imageRecommendations?: string;
    sentiment?: { score: number; label: 'positive' | 'negative' | 'neutral' };
    engagement?: { score: number; recommendations: string[] };
  } | null>(null);

  // Note: In production, fetch actual subscription data
  const subscription = { tier: 'free', status: 'active' };
  const usage = { aiGenerations: 2 };

  const tier = (subscription?.tier || 'free') as 'free' | 'starter' | 'pro' | 'agency';
  const limits = getTierLimits(tier);
  const currentUsage = usage?.aiGenerations || 0;
  const canGenerate = currentUsage < limits.aiGenerations || limits.aiGenerations === Infinity;

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    if (selectedPlatforms.length === 0) {
      Alert.alert('Error', 'Please select at least one platform');
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
    
    // Map tone to API client's ToneType
    const toneMap: Record<string, 'casual' | 'professional' | 'friendly' | 'inspirational' | 'humorous'> = {
      professional: 'professional',
      casual: 'casual',
      funny: 'humorous',
      inspiring: 'inspirational',
      educational: 'professional',
    };
    
    // Map category to API client's ContentType
    const categoryMap: Record<string, 'recipes' | 'workouts' | 'quotes' | 'tips' | 'events' | 'general'> = {
      recipes: 'recipes',
      workouts: 'workouts',
      lifestyle: 'general',
      business: 'tips',
      educational: 'tips',
      motivational: 'quotes',
      travel: 'events',
      tech: 'tips',
      finance: 'tips',
      beauty: 'tips',
      parenting: 'tips',
      mindfulness: 'quotes',
      realEstate: 'tips',
    };
    
    try {
      // Try using API client first (calls Next.js backend)
      let generated: AIGenerationResult;
      
      try {
        // API endpoint expects: prompt, day?, tone?, model?, includeTrending?, includeTimeContext?, urlContext?
        // It doesn't use platform or contentType, but we can include them in the prompt
        const enhancedPrompt = categoryMap[category] 
          ? `Create a ${categoryMap[category]} post for ${selectedPlatforms.join(', ')}: ${prompt}`
          : prompt;
        
        const apiResponse = await apiClient.generateContent({
          prompt: enhancedPrompt,
          tone: toneMap[tone] || 'professional',
          // Note: API doesn't use platform or contentType, but we include them in prompt
        });
        // API returns 'caption' not 'content'
        generated = { content: apiResponse.caption || apiResponse.content || '' };
      } catch (apiError: any) {
        // Fallback to local AI service if API fails
        console.warn('API client failed, using local AI service:', apiError?.message || apiError);
        try {
          generated = await generateContent({
            prompt,
            tone,
            platforms: selectedPlatforms,
            contentType: category,
            includeHashtags,
            includeImageRecommendations,
          });
        } catch (localError: any) {
          // If both fail, throw a helpful error
          throw new Error(
            `Failed to generate content. ${apiError?.message || 'API unavailable'}. ${localError?.message || 'Local AI service also failed.'}`
          );
        }
      }

      // Analyze sentiment
      const sentiment = analyzeSentiment(generated.content);

      // Calculate engagement score
      const engagement = calculateEngagementScore(generated.content);

      // Generate hashtags if requested
      let hashtags: string[] = [];
      if (includeHashtags) {
        try {
          // Try API client first
          try {
            const apiHashtags = await apiClient.generateHashtags({
              content: generated.content,
              count: 10,
            });
            hashtags = apiHashtags.hashtags;
          } catch (apiError) {
            // Fallback to local service
            hashtags = await generateHashtags(generated.content, 10);
          }
        } catch (error) {
          console.error('Hashtag generation failed:', error);
        }
      }

      // Generate image recommendations if requested
      let imageRecommendations: string = '';
      if (includeImageRecommendations) {
        try {
          // Try API client first
          try {
            const apiImgRec = await apiClient.getImageRecommendations({
              title: prompt.substring(0, 50) || 'Generated Post',
              content: generated.content,
              contentType: categoryMap[category] || 'general',
              platform: selectedPlatforms[0] as any,
            });
            imageRecommendations = apiImgRec.recommendations.map(r => `${r.type}: ${r.elements} (${r.style}, ${r.colors})`).join('\n');
          } catch (apiError) {
            // Fallback to local service
            const imgRec = await generateImageRecommendations(generated.content);
            imageRecommendations = imgRec.content;
          }
        } catch (error) {
          console.error('Image recommendations failed:', error);
        }
      }

      setResult({
        content: generated.content,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
        imageRecommendations: imageRecommendations || undefined,
        sentiment,
        engagement,
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      Alert.alert('Error', error.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result?.content) return;

    try {
      await savePost(category, {
        id: Date.now().toString(),
        title: prompt.substring(0, 50) || 'Generated Post',
        content: result.content,
        tags: result.hashtags?.join(' ') || '',
        createdAt: new Date().toISOString(),
        used: false,
        sentiment: result.sentiment,
        engagementScore: result.engagement?.score,
      });

      Alert.alert('Success', 'Content saved to library!', [
        {
          text: 'OK',
          onPress: () => {
            setResult(null);
            setPrompt('');
          },
        },
      ]);
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save content. Please try again.');
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return '#4CAF50';
      case 'negative':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Usage Warning */}
      {!canGenerate && (
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>⚠️ You've reached your generation limit</Text>
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

        {/* Content Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {Object.entries(CONTENT_CATEGORIES).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[styles.chip, category === key && styles.chipActive]}
                onPress={() => setCategory(key as ContentType)}
              >
                <Text style={styles.chipIcon}>{value.icon}</Text>
                <Text style={[styles.chipText, category === key && styles.chipTextActive]}>
                  {value.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Platform Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Platforms (select multiple)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {PLATFORMS.map((p) => {
              const isSelected = selectedPlatforms.includes(p.value);
              return (
                <TouchableOpacity
                  key={p.value}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => togglePlatform(p.value)}
                >
                  <Text style={styles.chipIcon}>{p.icon}</Text>
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
                onPress={() => setTone(t.value as any)}
              >
                <Text style={[styles.chipText, tone === t.value && styles.chipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Include Hashtags</Text>
            <Switch
              value={includeHashtags}
              onValueChange={setIncludeHashtags}
              trackColor={{ false: '#E5E5E5', true: '#1A1A1A' }}
              thumbColor={includeHashtags ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Include Image Recommendations</Text>
            <Switch
              value={includeImageRecommendations}
              onValueChange={setIncludeImageRecommendations}
              trackColor={{ false: '#E5E5E5', true: '#1A1A1A' }}
              thumbColor={includeImageRecommendations ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>
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
      {result && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generated Content</Text>
          <View style={styles.card}>
            <Text style={styles.contentText}>{result.content}</Text>
          </View>

          {/* Sentiment Analysis */}
          {result.sentiment && (
            <View style={styles.metricsCard}>
              <Text style={styles.metricsTitle}>Sentiment Analysis</Text>
              <View style={styles.metricRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Sentiment</Text>
                  <View
                    style={[
                      styles.sentimentBadge,
                      { backgroundColor: getSentimentColor(result.sentiment.label) },
                    ]}
                  >
                    <Text style={styles.sentimentText}>
                      {result.sentiment.label.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Score</Text>
                  <Text style={styles.metricValue}>{result.sentiment.score}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Engagement Score */}
          {result.engagement && (
            <View style={styles.metricsCard}>
              <Text style={styles.metricsTitle}>Engagement Score</Text>
              <View style={styles.engagementContainer}>
                <View style={styles.scoreCircle}>
                  <Text
                    style={[
                      styles.scoreText,
                      { color: getEngagementColor(result.engagement.score) },
                    ]}
                  >
                    {result.engagement.score}
                  </Text>
                  <Text style={styles.scoreLabel}>/ 100</Text>
                </View>
                {result.engagement.recommendations.length > 0 && (
                  <View style={styles.recommendationsContainer}>
                    <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                    {result.engagement.recommendations.map((rec, index) => (
                      <Text key={index} style={styles.recommendationItem}>
                        • {rec}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Hashtags */}
          {result.hashtags && result.hashtags.length > 0 && (
            <View style={styles.hashtagsContainer}>
              <Text style={styles.hashtagsLabel}>Suggested Hashtags:</Text>
              <View style={styles.hashtagsWrap}>
                {result.hashtags.map((tag, index) => (
                  <View key={index} style={styles.hashtagChip}>
                    <Text style={styles.hashtagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Image Recommendations */}
          {result.imageRecommendations && (
            <View style={styles.imageRecContainer}>
              <Text style={styles.imageRecLabel}>Image Recommendations:</Text>
              <Text style={styles.imageRecText}>{result.imageRecommendations}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setResult(null);
                setPrompt('');
              }}
            >
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>Save to Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Usage Info */}
      <View style={styles.usageInfo}>
        <Text style={styles.usageInfoText}>
          Generations used: {currentUsage} /{' '}
          {limits.aiGenerations === Infinity ? '∞' : limits.aiGenerations}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  warningCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
    marginBottom: 6,
  },
  warningSubtext: {
    fontSize: 14,
    color: '#B8860B',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    color: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chipContainer: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chipActive: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  chipIcon: {
    fontSize: 18,
  },
  chipText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  generateButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#1A1A1A',
  },
  metricsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  metricsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 14,
    color: '#1A1A1A',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A3A3A',
  },
  sentimentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  sentimentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  engagementContainer: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FAF9F7',
    borderWidth: 3,
    borderColor: '#C4A484',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  recommendationsContainer: {
    width: '100%',
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#3A3A3A',
  },
  recommendationItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
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
  imageRecContainer: {
    backgroundColor: '#FAF9F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  imageRecLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#3A3A3A',
  },
  imageRecText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#C4A484',
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
    backgroundColor: '#FAF9F7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  secondaryButtonText: {
    color: '#3A3A3A',
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
