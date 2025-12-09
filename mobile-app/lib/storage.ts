/**
 * Storage Service
 * Handles local data persistence using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Post,
  ScheduledContent,
  Preset,
  CustomCategory,
  ContentType,
} from './types';

const STORAGE_KEYS = {
  POSTS: 'posts',
  SCHEDULED: 'scheduled',
  PRESETS: 'presets',
  CUSTOM_CATEGORIES: 'custom_categories',
  USER_PREFERENCES: 'user_preferences',
};

// Generic storage functions

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
}

async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return defaultValue;
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    throw error;
  }
}

// Content Library Storage

export async function getAllPosts(): Promise<Record<ContentType | string, Post[]>> {
  return await getItem(STORAGE_KEYS.POSTS, {});
}

export async function getPostsByCategory(category: ContentType | string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts[category] || [];
}

export async function savePost(category: ContentType | string, post: Post): Promise<void> {
  const allPosts = await getAllPosts();
  if (!allPosts[category]) {
    allPosts[category] = [];
  }
  allPosts[category].push(post);
  await setItem(STORAGE_KEYS.POSTS, allPosts);
}

export async function updatePost(
  category: ContentType | string,
  postId: string,
  updates: Partial<Post>
): Promise<void> {
  const allPosts = await getAllPosts();
  if (allPosts[category]) {
    const index = allPosts[category].findIndex((p) => p.id === postId);
    if (index !== -1) {
      allPosts[category][index] = { ...allPosts[category][index], ...updates };
      await setItem(STORAGE_KEYS.POSTS, allPosts);
    }
  }
}

export async function deletePost(category: ContentType | string, postId: string): Promise<void> {
  const allPosts = await getAllPosts();
  if (allPosts[category]) {
    allPosts[category] = allPosts[category].filter((p) => p.id !== postId);
    await setItem(STORAGE_KEYS.POSTS, allPosts);
  }
}

export async function savePosts(
  category: ContentType | string,
  posts: Post[]
): Promise<void> {
  const allPosts = await getAllPosts();
  allPosts[category] = posts;
  await setItem(STORAGE_KEYS.POSTS, allPosts);
}

// Scheduled Content Storage

export async function getScheduledContent(): Promise<ScheduledContent[]> {
  return await getItem(STORAGE_KEYS.SCHEDULED, []);
}

export async function saveScheduledContent(content: ScheduledContent): Promise<void> {
  const scheduled = await getScheduledContent();
  scheduled.push(content);
  await setItem(STORAGE_KEYS.SCHEDULED, scheduled);
}

export async function updateScheduledContent(
  contentId: string,
  updates: Partial<ScheduledContent>
): Promise<void> {
  const scheduled = await getScheduledContent();
  const index = scheduled.findIndex((c) => c.id === contentId);
  if (index !== -1) {
    scheduled[index] = { ...scheduled[index], ...updates };
    await setItem(STORAGE_KEYS.SCHEDULED, scheduled);
  }
}

export async function deleteScheduledContent(contentId: string): Promise<void> {
  const scheduled = await getScheduledContent();
  const filtered = scheduled.filter((c) => c.id !== contentId);
  await setItem(STORAGE_KEYS.SCHEDULED, filtered);
}

// Presets Storage

export async function getPresets(): Promise<Preset[]> {
  return await getItem(STORAGE_KEYS.PRESETS, []);
}

export async function savePreset(preset: Preset): Promise<void> {
  const presets = await getPresets();
  presets.push(preset);
  await setItem(STORAGE_KEYS.PRESETS, presets);
}

export async function updatePreset(presetId: number, updates: Partial<Preset>): Promise<void> {
  const presets = await getPresets();
  const index = presets.findIndex((p) => p.id === presetId);
  if (index !== -1) {
    presets[index] = { ...presets[index], ...updates };
    await setItem(STORAGE_KEYS.PRESETS, presets);
  }
}

export async function deletePreset(presetId: number): Promise<void> {
  const presets = await getPresets();
  const filtered = presets.filter((p) => p.id !== presetId);
  await setItem(STORAGE_KEYS.PRESETS, filtered);
}

// Custom Categories Storage

export async function getCustomCategories(): Promise<CustomCategory[]> {
  return await getItem(STORAGE_KEYS.CUSTOM_CATEGORIES, []);
}

export async function saveCustomCategory(category: CustomCategory): Promise<void> {
  const categories = await getCustomCategories();
  categories.push(category);
  await setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, categories);
}

export async function deleteCustomCategory(categoryId: string): Promise<void> {
  const categories = await getCustomCategories();
  const filtered = categories.filter((c) => c.id !== categoryId);
  await setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, filtered);

  // Also delete associated posts
  const allPosts = await getAllPosts();
  delete allPosts[categoryId];
  await setItem(STORAGE_KEYS.POSTS, allPosts);
}

// User Preferences

export interface UserPreferences {
  defaultPlatforms?: string[];
  defaultTone?: string;
  notificationsEnabled?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export async function getUserPreferences(): Promise<UserPreferences> {
  return await getItem(STORAGE_KEYS.USER_PREFERENCES, {});
}

export async function saveUserPreferences(preferences: UserPreferences): Promise<void> {
  await setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
}

// Utility functions

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}

export async function exportData(): Promise<string> {
  const data = {
    posts: await getAllPosts(),
    scheduled: await getScheduledContent(),
    presets: await getPresets(),
    customCategories: await getCustomCategories(),
    preferences: await getUserPreferences(),
  };
  return JSON.stringify(data, null, 2);
}

export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    if (data.posts) await setItem(STORAGE_KEYS.POSTS, data.posts);
    if (data.scheduled) await setItem(STORAGE_KEYS.SCHEDULED, data.scheduled);
    if (data.presets) await setItem(STORAGE_KEYS.PRESETS, data.presets);
    if (data.customCategories)
      await setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, data.customCategories);
    if (data.preferences) await setItem(STORAGE_KEYS.USER_PREFERENCES, data.preferences);
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Invalid import data');
  }
}
