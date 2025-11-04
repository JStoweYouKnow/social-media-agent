import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Middleware to check if the user is authenticated
 * Returns userId if authenticated, or an error response if not
 */
export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    return {
      userId: null,
      error: NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      ),
    };
  }

  return { userId, error: null };
}
