/**
 * Convex Client for Mobile
 * Same database as web app
 * Only initializes if a valid Convex URL is provided
 * 
 * IMPORTANT: Convex is OPTIONAL. If not configured, this exports null
 * and the app will work with Clerk authentication only.
 */

import Constants from 'expo-constants';

// Get Convex URL from environment
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || Constants.expoConfig?.extra?.convexUrl;

// Check if URL is valid (not a placeholder or empty)
const isValidConvexUrl = convexUrl && 
  typeof convexUrl === 'string' && 
  convexUrl.trim() !== '' &&
  convexUrl.startsWith('https://') && 
  convexUrl.includes('.convex.cloud') &&
  !convexUrl.includes('your-deployment') &&
  convexUrl !== 'https://your-deployment.convex.cloud';

// Force disable Convex if URL is not valid
// This prevents any Convex initialization attempts
let convex: any = null;

// Only create Convex client if we have a valid, real URL
if (isValidConvexUrl && convexUrl) {
  try {
    // Dynamic import to prevent Convex from loading if not needed
    const { ConvexReactClient } = require('convex/react');
    convex = new ConvexReactClient(convexUrl);
    console.log('✅ Convex client initialized');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Convex client:', error);
    convex = null;
  }
} else {
  // Explicitly disable Convex when not configured
  // Set to null to ensure no accidental initialization
  convex = null;
  
  // Log in dev mode only (helps with debugging)
  if (__DEV__) {
    console.log('ℹ️ Convex is disabled (no valid URL configured)');
  }
}

// Export null to ensure Convex is completely disabled when not configured
export { convex };
