/**
 * Tab Navigation Layout
 * Main navigation for the app
 */

import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

// Simple icon component for tabs
const TabBarIcon = ({ name, color }: { name: string; color: string }) => {
  // In a real app, use @expo/vector-icons or similar
  const icons: Record<string, string> = {
    home: '🏠',
    create: '✏️',
    schedule: '📅',
    profile: '👤',
  };

  return <span style={{ fontSize: 24 }}>{icons[name] || '•'}</span>;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitle: 'Post Planner',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <TabBarIcon name="create" color={color} />,
          headerTitle: 'Create Content',
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <TabBarIcon name="schedule" color={color} />,
          headerTitle: 'Schedule',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="profile" color={color} />,
          headerTitle: 'Profile',
        }}
      />
    </Tabs>
  );
}
