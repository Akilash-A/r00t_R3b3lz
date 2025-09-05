import { NextRequest, NextResponse } from 'next/server';
import { getTeamMembersFromDB } from '@/lib/data';

export async function GET() {
  try {
    const members = await getTeamMembersFromDB();
    // Ensure we're sending clean, serializable data
    const serializedMembers = members.map(member => ({
      id: member.id,
      name: member.name,
      social: {
        instagram: member.social?.instagram || '',
        twitter: member.social?.twitter || '',
        github: member.social?.github || '',
        linkedin: member.social?.linkedin || '',
        email: member.social?.email || '',
        website: member.social?.website || ''
      },
      role: member.role,
      avatarUrl: member.avatarUrl
    }));
    
    return NextResponse.json({ success: true, data: serializedMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
