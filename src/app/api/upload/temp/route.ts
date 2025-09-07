import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File size too large (max 5MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with temp prefix
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `temp_${timestamp}.${extension}`;
    
    // Ensure temp upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'temp');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Write the file to temp directory
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the temporary URL and filename for later processing
    const url = `/uploads/temp/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url,
      filename,
      tempPath: filepath
    });

  } catch (error) {
    console.error('Error uploading temp file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
