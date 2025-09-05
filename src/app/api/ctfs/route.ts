import { NextRequest, NextResponse } from 'next/server';
import { getCtfsFromDB } from '@/lib/data';

export async function GET() {
  try {
    const ctfs = await getCtfsFromDB();
    return NextResponse.json({ success: true, data: ctfs });
  } catch (error) {
    console.error('Error fetching CTFs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch CTFs' },
      { status: 500 }
    );
  }
}
