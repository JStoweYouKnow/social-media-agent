/**
 * Root Layout
 * Sets up providers and navigation
 */

import { useEffect } from 'react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { convex } from '@/lib/convex-client';
import { apiClient } from '@/lib/api-client';

// Keep splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

// Clerk token cache for Expo
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      return;
    }
  },
};

const clerkPublishableKey = Constants.expoConfig?.extra?.clerkPublishableKey;

if (!clerkPublishableKey) {
  throw new Error('Missing Clerk Publishable Key. Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env');
}

function RootLayoutNav() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Set up API client auth
  useEffect(() => {
    if (isLoaded) {
      apiClient.setAuthTokenProvider(getToken);
    }
  }, [isLoaded, getToken]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && !inAuthGroup) {
      // User is signed in but not in auth group, redirect to home
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      // User is not signed in, redirect to sign in
      router.replace('/(auth)/sign-in');
    }
  }, [isSignedIn, segments, isLoaded]);

  // Hide splash screen once loaded
  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  if (!convex) {
    // If Convex not configured, just use Clerk
    return (
      <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
        <RootLayoutNav />
      </ClerkProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <RootLayoutNav />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
