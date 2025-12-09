/**
 * ContentCard Component
 * Display content items with consistent styling
 */

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { ContentItem } from '@/lib/content-types';

interface ContentCardProps {
  item: ContentItem;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
}

const PLATFORM_EMOJIS: Record<string, string> = {
  instagram: '📷',
  facebook: '👍',
  twitter: '🐦',
  linkedin: '💼',
  all: '🌐',
};

export default function ContentCard({ item, onEdit, onDelete, onPress }: ContentCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Header with platform */}
      <View style={styles.header}>
        <View style={styles.platformBadge}>
          <Text style={styles.platformEmoji}>
            {PLATFORM_EMOJIS[item.platform || 'all'] || '📱'}
          </Text>
          <Text style={styles.platformText}>{item.platform || 'All'}</Text>
        </View>
        {item.date && (
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        )}
      </View>

      {/* Title */}
      {item.title && <Text style={styles.title}>{item.title}</Text>}

      {/* Content */}
      <Text style={styles.content} numberOfLines={4}>
        {item.content}
      </Text>

      {/* Image Preview */}
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      )}

      {/* Tags/Hashtags */}
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreText}>+{item.tags.length - 3} more</Text>
          )}
        </View>
      )}

      {/* Actions */}
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  platformEmoji: {
    fontSize: 15,
    marginRight: 5,
  },
  platformText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 13,
    color: '#999999',
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#1A1A1A',
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  tagChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 13,
    color: '#999999',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
});
