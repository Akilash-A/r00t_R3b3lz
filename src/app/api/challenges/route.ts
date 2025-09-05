import { NextRequest, NextResponse } from 'next/server';
import { getChallengesFromDB } from '@/lib/data';

export async function GET() {
  try {
    const challenges = await getChallengesFromDB();
    return NextResponse.json({ success: true, data: challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}
