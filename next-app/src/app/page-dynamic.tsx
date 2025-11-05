// Dynamic imports for better bundle splitting
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-planner-terracotta" />
  </div>
);

const LoadingCard = () => (
  <div className="bg-white rounded-lg shadow-planner-soft p-6 animate-pulse">
    <div className="h-4 bg-planner-cream rounded w-3/4 mb-4" />
    <div className="h-4 bg-planner-cream rounded w-1/2" />
  </div>
);

// Dynamically import heavy components
export const DynamicContentManager = dynamic(
  () => import('@/components/ContentManager').then((mod) => mod.default),
  {
    loading: () => <LoadingCard />,
    ssr: false, // Disable SSR for client-only components
  }
);

export const DynamicCalendar = dynamic(
  () => import('@/components/CalendarComponent').then((mod) => mod.default),
  {
    loading: () => <LoadingCard />,
    ssr: false,
  }
);

export const DynamicPlannerTabs = dynamic(
  () => import('@/components/PlannerTabs').then((mod) => mod.default),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const DynamicDayPlannerView = dynamic(
  () => import('@/components/DayPlannerView').then((mod) => mod.default),
  {
    loading: () => <LoadingCard />,
    ssr: false,
  }
);

export const DynamicWeeklyPresetsManager = dynamic(
  () => import('@/components/WeeklyPresetsManager').then((mod) => mod.default),
  {
    loading: () => <LoadingCard />,
    ssr: false,
  }
);

// Framer Motion (heavy animation library)
export const DynamicMotion = {
  div: dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
    ssr: true,
  }),
  span: dynamic(() => import('framer-motion').then((mod) => mod.motion.span), {
    ssr: true,
  }),
};

// Icons - lazy load heavy icon sets
export const DynamicLucideIcons = {
  Sparkles: dynamic(() => import('lucide-react').then((mod) => ({ default: mod.Sparkles }))),
  Calendar: dynamic(() => import('lucide-react').then((mod) => ({ default: mod.Calendar }))),
  Settings: dynamic(() => import('lucide-react').then((mod) => ({ default: mod.Settings }))),
  CreditCard: dynamic(() => import('lucide-react').then((mod) => ({ default: mod.CreditCard }))),
  TrendingUp: dynamic(() => import('lucide-react').then((mod) => ({ default: mod.TrendingUp }))),
};
