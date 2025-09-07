import { NextRequest, NextResponse } from 'next/server';
import { rename, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { tempFilename, finalFilename, deleteOldFile } = await request.json();

    if (!tempFilename) {
      return NextResponse.json({ success: false, error: 'No temp filename provided' }, { status: 400 });
    }

    const tempPath = join(process.cwd(), 'public', 'uploads', 'temp', tempFilename);
    const finalPath = join(process.cwd(), 'public', 'uploads', finalFilename || tempFilename.replace('temp_', ''));

    // Check if temp file exists
    if (!existsSync(tempPath)) {
      return NextResponse.json({ success: false, error: 'Temporary file not found' }, { status: 404 });
    }

    // Delete old file if specified
    if (deleteOldFile && deleteOldFile !== finalFilename) {
      const oldFilePath = join(process.cwd(), 'public', 'uploads', deleteOldFile);
      if (existsSync(oldFilePath)) {
        await unlink(oldFilePath);
      }
    }

    // Move temp file to final location
    await rename(tempPath, finalPath);

    const finalUrl = `/uploads/${finalFilename || tempFilename.replace('temp_', '')}`;
    
    return NextResponse.json({ 
      success: true, 
      url: finalUrl,
      filename: finalFilename || tempFilename.replace('temp_', '')
    });

  } catch (error) {
    console.error('Error finalizing upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to finalize upload' },
      { status: 500 }
    );
  }
}
