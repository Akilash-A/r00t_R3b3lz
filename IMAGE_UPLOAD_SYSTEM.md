# Image Upload System

This project now implements a two-stage image upload system for better user experience and resource management.

## How it works

### 1. Temporary Upload
- When a user selects an image file, it's uploaded to `/public/uploads/temp/` directory
- Files are prefixed with `temp_` and timestamp
- The form field is updated with the temporary URL
- No permanent storage until user clicks "Save"

### 2. Finalization
- When user submits the form successfully, temporary files are moved to permanent location (`/public/uploads/`)
- Old images are automatically deleted when updating existing records
- Temporary files are cleaned up on successful save

### 3. Cleanup
- Temporary files older than 1 hour are automatically cleaned up
- Failed form submissions trigger immediate cleanup of temp files
- Manual cleanup available via `/api/cleanup` endpoint

## API Endpoints

- `POST /api/upload/temp` - Upload file to temporary location
- `POST /api/upload/finalize` - Move temp file to permanent location and delete old file
- `DELETE /api/upload/temp/cleanup` - Clean up specific or old temp files
- `POST /api/cleanup` - Comprehensive cleanup (orphaned challenges + temp files)

## Benefits

1. **No wasted storage**: Images are only saved permanently when forms are successfully submitted
2. **Automatic cleanup**: Old images are deleted when new ones replace them
3. **Better UX**: Users see immediate feedback when uploading, but files aren't committed until save
4. **Resource efficiency**: Temporary files are cleaned up automatically

## Forms affected

- CTF Form (banner images)
- Member Form (avatar images)  
- Writeup Form (challenge images)

All forms now show "Image is ready. Click 'Save' to finalize." message after upload.
