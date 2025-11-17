import type { Metadata } from "next";
import { Inter, Playfair_Display, Caveat } from 'next/font/google';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { WebVitals } from '@/components/WebVitals';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SentryInit } from '@/components/SentryInit';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://post-planner.vercel.app'),
  title: {
    default: "Post Planner - AI-Powered Social Media Management",
    template: "%s | Post Planner"
  },
  description: "AI-powered social media content planning and scheduling for Instagram, Facebook, LinkedIn & Twitter. Generate content, schedule posts, and manage your social media presence with ease.",
  keywords: [
    "social media planner",
    "content calendar",
    "AI content generation",
    "social media scheduling",
    "Instagram planner",
    "Facebook scheduler",
    "LinkedIn content",
    "Twitter scheduler",
    "content management",
    "social media automation"
  ],
  authors: [{ name: "Post Planner Team" }],
  creator: "Post Planner",
  publisher: "Post Planner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://post-planner.vercel.app',
    title: "Post Planner - AI-Powered Social Media Management",
    description: "AI-powered social media content planning and scheduling for Instagram, Facebook, LinkedIn & Twitter.",
    siteName: "Post Planner",
  },
  twitter: {
    card: "summary_large_image",
    title: "Post Planner - AI-Powered Social Media Management",
    description: "AI-powered social media content planning and scheduling for Instagram, Facebook, LinkedIn & Twitter.",
    creator: "@postplanner",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${caveat.variable}`}>
      <body className="antialiased font-sans">
        <SentryInit />
        <ErrorBoundary>
          <WebVitals />
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
