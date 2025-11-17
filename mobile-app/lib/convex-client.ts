/**
 * Convex Client for Mobile
 * Same database as web app
 */

import { ConvexReactClient } from 'convex/react';
import Constants from 'expo-constants';

const convexUrl = Constants.expoConfig?.extra?.convexUrl || process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.warn('EXPO_PUBLIC_CONVEX_URL not set - Convex features will not work');
}

export const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;
