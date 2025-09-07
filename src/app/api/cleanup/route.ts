import { NextRequest, NextResponse } from 'next/server';
import { cleanupOrphanedChallenges } from '@/lib/actions';

export async function POST(request: NextRequest) {
  try {
    // Cleanup orphaned challenges
    const orphanResult = await cleanupOrphanedChallenges();
    
    // Cleanup temporary files
    const tempCleanupResponse = await fetch(`${request.nextUrl.origin}/api/upload/temp/cleanup`, {
      method: 'POST'
    });
    const tempResult = await tempCleanupResponse.json();
    
    return NextResponse.json({
      success: orphanResult.success && tempResult.success,
      message: `Orphaned challenges: ${orphanResult.message}. Temp files: ${tempResult.message}`,
      orphanResult,
      tempResult
    });
  } catch (error) {
    console.error('Error in cleanup API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cleanup' },
      { status: 500 }
    );
  }
}
