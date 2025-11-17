import { NextRequest, NextResponse } from 'next/server';

/**
 * Monitoring tunnel route for Sentry
 * This route allows Sentry to send events through Next.js to bypass ad blockers
 * Configured in next.config.ts as tunnelRoute: "/monitoring"
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}

export async function POST(request: NextRequest) {
  // This route is handled by Sentry's tunnel middleware
  // It forwards requests to Sentry's API
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}

