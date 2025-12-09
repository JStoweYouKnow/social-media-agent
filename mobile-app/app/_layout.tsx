/**
 * Root Layout
 * Sets up providers and navigation
 */

// IMPORTANT: Import gesture handler FIRST - required for React Navigation
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect, useState } from 'react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { apiClient } from '@/lib/api-client';

// Dynamically import convex only if needed (prevents module loading when disabled)
let convex: any = null;
try {
  const convexModule = require('@/lib/convex-client');
  convex = convexModule.convex || null;
} catch (error) {
  // Convex not available or disabled - that's fine
  convex = null;
}

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

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || Constants.expoConfig?.extra?.clerkPublishableKey;

// Improved error handling - don't crash, show helpful message
if (!clerkPublishableKey) {
  console.error('❌ Missing Clerk Publishable Key');
  console.error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as an EAS secret:');
  console.error('  eas secret:create --scope project --name EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY --value pk_live_...');
  // Still throw, but with more context
  throw new Error('Missing Clerk Publishable Key. Configure EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in EAS secrets for production builds.');
}

/**
 * Professional Loading Screen
 * Minimal, clean design with smooth animations
 */
function LoadingScreen() {
  const fadeAnim = useState(() => new Animated.Value(0))[0];
  const scaleAnim = useState(() => new Animated.Value(0.9))[0];
  const dotAnim = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the dot (separate from main fade)
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    const timer = setTimeout(() => pulse.start(), 600);
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, dotAnim]);

  return (
    <View style={loadingStyles.container}>
      <Animated.View
        style={[
          loadingStyles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={loadingStyles.logoContainer}>
          <Text style={loadingStyles.logoText}>Post Planner</Text>
          <Animated.View style={[loadingStyles.dot, { opacity: dotAnim }]} />
        </View>
        <Text style={loadingStyles.tagline}>AI-Powered Content Creation</Text>
      </Animated.View>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4A484',
    marginLeft: 4,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 14,
    color: '#666666',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});

function RootLayoutNav() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

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

    // Small delay to ensure router is ready
    const timer = setTimeout(() => {
      try {
        // Navigate based on authentication state
        if (isSignedIn && !inAuthGroup) {
          router.replace('/(tabs)');
        } else if (!isSignedIn && !inAuthGroup) {
          router.replace('/(auth)/sign-in');
        }
        setIsReady(true);
      } catch (error) {
        console.error('Navigation error:', error);
        // Fall back to showing content anyway
        setIsReady(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isSignedIn, segments, isLoaded]);

  // Hide splash screen once loaded and ready
  useEffect(() => {
    if (isLoaded && isReady) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        SplashScreen.hideAsync().catch(err => {
          console.warn('Failed to hide splash:', err);
        });
      }, 300);
    }
  }, [isLoaded, isReady]);

  // Timeout fallback - if not loaded after 10 seconds, show error
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.error('Auth loading timeout');
        setIsReady(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  if (!isLoaded || !isReady) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  // CRITICAL: Only use Convex if it's properly configured AND not null
  // This prevents any Convex initialization when disabled
  const shouldUseConvex = convex !== null && convex !== undefined;
  
  if (!shouldUseConvex) {
    // If Convex not configured, just use Clerk (no Convex provider)
    // This is the normal path when Convex is optional/disabled
    return (
      <GestureHandlerRootView style={styles.container}>
        <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
          <RootLayoutNav />
        </ClerkProvider>
      </GestureHandlerRootView>
    );
  }

  // Only reach here if Convex is actually configured and initialized
  // Use dynamic import to prevent Convex from loading if not needed
  let ConvexProviderWithClerk: any = null;
  try {
    const convexModule = require('convex/react-clerk');
    ConvexProviderWithClerk = convexModule.ConvexProviderWithClerk;
  } catch (error) {
    // Convex module not available - fall back to Clerk only
    console.warn('Convex provider not available, using Clerk only');
    return (
      <GestureHandlerRootView style={styles.container}>
        <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
          <RootLayoutNav />
        </ClerkProvider>
      </GestureHandlerRootView>
    );
  }
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <RootLayoutNav />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
