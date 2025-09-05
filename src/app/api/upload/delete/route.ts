import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ success: false, error: 'No filename provided' }, { status: 400 });
    }

    // Construct the file path
    const filepath = join(process.cwd(), 'public', 'uploads', filename);

    // Check if file exists and delete it
    if (existsSync(filepath)) {
      await unlink(filepath);
      return NextResponse.json({ 
        success: true, 
        message: 'File deleted successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'File not found' 
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
