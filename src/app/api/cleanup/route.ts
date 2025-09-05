import { NextRequest, NextResponse } from 'next/server';
import { cleanupOrphanedChallenges } from '@/lib/actions';

export async function POST() {
  try {
    const result = await cleanupOrphanedChallenges();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in cleanup API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cleanup orphaned challenges' },
      { status: 500 }
    );
  }
}
