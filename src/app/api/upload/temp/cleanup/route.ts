import { NextRequest, NextResponse } from 'next/server';
import { unlink, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (filename) {
      // Delete specific temp file
      const tempPath = join(process.cwd(), 'public', 'uploads', 'temp', filename);
      if (existsSync(tempPath)) {
        await unlink(tempPath);
        return NextResponse.json({ 
          success: true, 
          message: 'Temporary file deleted successfully' 
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Temporary file not found' 
        }, { status: 404 });
      }
    }

    return NextResponse.json({ success: false, error: 'No filename provided' }, { status: 400 });

  } catch (error) {
    console.error('Error deleting temp file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete temporary file' },
      { status: 500 }
    );
  }
}

// Clean up old temp files (older than 1 hour)
export async function POST(request: NextRequest) {
  try {
    const tempDir = join(process.cwd(), 'public', 'uploads', 'temp');
    
    if (!existsSync(tempDir)) {
      return NextResponse.json({ success: true, message: 'No temp directory to clean' });
    }

    const files = await readdir(tempDir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    let deletedCount = 0;

    for (const file of files) {
      if (file.startsWith('temp_')) {
        const timestamp = parseInt(file.split('_')[1]);
        if (now - timestamp > oneHour) {
          const filePath = join(tempDir, file);
          if (existsSync(filePath)) {
            await unlink(filePath);
            deletedCount++;
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${deletedCount} old temporary files` 
    });

  } catch (error) {
    console.error('Error cleaning up temp files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clean up temporary files' },
      { status: 500 }
    );
  }
}
