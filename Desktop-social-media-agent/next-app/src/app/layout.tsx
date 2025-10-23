import type { Metadata } from "next";
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import "./globals.css";

export const metadata: Metadata = {
  title: "Post Planner - AI-powered social media content planning",
  description: "AI-powered social media content planning application for Project Comfort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
