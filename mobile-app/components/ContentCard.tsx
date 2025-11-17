/**
 * ContentCard Component
 * Display content items with consistent styling
 */

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { ContentItem } from '@shared/lib/content-types';

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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  platformEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#0066cc',
  },
  moreText: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#ff3b30',
  },
});
