import { NextRequest, NextResponse } from 'next/server';
import { getTeamMembersFromDB } from '@/lib/data';

export async function GET() {
  try {
    const members = await getTeamMembersFromDB();
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
