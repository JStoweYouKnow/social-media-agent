/**
 * Auth Layout
 * Stack navigation for sign-in/sign-up
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    />
  );
}
