/**
 * Content Library Screen
 * Manage all content categories and posts
 */

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { CONTENT_CATEGORIES, ContentType, Post } from '@/lib/types';
import {
  getAllPosts,
  getPostsByCategory,
  savePost,
  deletePost,
  updatePost,
} from '@/lib/storage';

export default function LibraryScreen() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<ContentType>('recipes');
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    const categoryPosts = await getPostsByCategory(selectedCategory);
    setPosts(categoryPosts);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, [selectedCategory]);

  const handleAddPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert('Error', 'Please fill in title and content');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags,
      createdAt: new Date().toISOString(),
      used: false,
    };

    await savePost(selectedCategory, post);
    setNewPost({ title: '', content: '', tags: '' });
    setShowAddModal(false);
    await loadPosts();
  };

  const handleDeletePost = async (postId: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePost(selectedCategory, postId);
          await loadPosts();
        },
      },
    ]);
  };

  const handleToggleUsed = async (postId: string, currentUsed: boolean) => {
    await updatePost(selectedCategory, postId, { used: !currentUsed });
    await loadPosts();
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Object.entries(CONTENT_CATEGORIES);

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <View style={styles.categoryList}>
          {categories.map(([key, { name, icon }]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryTab,
                selectedCategory === key && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(key as ContentType)}
            >
              <Text style={styles.categoryIcon}>{icon}</Text>
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === key && styles.categoryNameActive,
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Posts List */}
      <ScrollView
        style={styles.postsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? 'No posts match your search'
                : `Add your first ${CONTENT_CATEGORIES[selectedCategory].name.toLowerCase()} post`}
            </Text>
          </View>
        ) : (
          filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <TouchableOpacity
                  onPress={() => handleToggleUsed(post.id, post.used || false)}
                >
                  <Text style={styles.usedBadge}>
                    {post.used ? '✓ Used' : '○ Unused'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.postContent} numberOfLines={3}>
                {post.content}
              </Text>
              {post.tags && (
                <Text style={styles.postTags} numberOfLines={1}>
                  {post.tags}
                </Text>
              )}
              <View style={styles.postActions}>
                <Text style={styles.postDate}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
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

      {/* Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Post Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Post</Text>
            <TouchableOpacity onPress={handleAddPost}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter post title"
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
            />

            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter post content"
              value={newPost.content}
              onChangeText={(text) => setNewPost({ ...newPost, content: text })}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Tags/Hashtags</Text>
            <TextInput
              style={styles.input}
              placeholder="#hashtags #tags"
              value={newPost.tags}
              onChangeText={(text) => setNewPost({ ...newPost, tags: text })}
            />
          </ScrollView>
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
  categoryScroll: {
    maxHeight: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD5',
    backgroundColor: '#fff',
  },
  categoryList: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F6F3EE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: '#C4A484',
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryNameActive: {
    color: '#fff',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD5',
  },
  searchInput: {
    backgroundColor: '#F6F3EE',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  postsList: {
    flex: 1,
    padding: 16,
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3A3A',
    flex: 1,
  },
  usedBadge: {
    fontSize: 12,
    color: '#C4A484',
    fontWeight: '500',
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  postTags: {
    fontSize: 12,
    color: '#C4A484',
    marginBottom: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F6F3EE',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE',
  },
  deleteButtonText: {
    color: '#D33',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F6F3EE',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2DDD5',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C4A484',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2DDD5',
  },
  textArea: {
    minHeight: 120,
  },
});
