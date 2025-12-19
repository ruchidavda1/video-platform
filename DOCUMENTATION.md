# Video Platform - Complete Documentation

Detailed technical documentation for the Video Platform application.

---

## Table of Contents

1. [Installation Guide](#installation-guide)
2. [API Reference](#api-reference)
3. [Configuration](#configuration)
4. [Troubleshooting](#troubleshooting)
5. [Architecture](#architecture)
6. [Assumptions](#assumptions)
7. [Challenges & Solutions](#challenges--solutions)

---

## Installation Guide

### FFmpeg Installation

FFmpeg is required for video processing and conversion.

#### Mac (using Homebrew)
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows
1. Download from [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to your system PATH

#### Verify Installation
```bash
ffmpeg -version
```

### FFmpeg Path Configuration

If FFmpeg is not in your system PATH, set it in `backend/utils/videoProcessor.js`:

```javascript
// Uncomment and set your FFmpeg path
ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');  // Mac with Homebrew
ffmpeg.setFfprobePath('/opt/homebrew/bin/ffprobe');
```

---

## API Reference

### Upload Endpoints

#### POST /api/upload
Upload a new video file.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `title` (string, required) - Video title
  - `description` (string, optional) - Video description
  - `video` (file, required) - Video file

**Response:**
```json
{
  "success": true,
  "message": "Video uploaded successfully, processing started",
  "videoId": "uuid",
  "data": {
    "id": "uuid",
    "title": "My Video",
    "status": "processing"
  }
}
```

#### GET /api/upload/progress/:videoId
Get processing progress for a video.

**Response:**
```json
{
  "success": true,
  "status": "processing",
  "progress": {
    "stage": "conversion",
    "resolution": "720p",
    "percent": 45.5
  }
}
```

### Video Endpoints

#### GET /api/videos
Get all uploaded videos.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "uuid",
      "title": "Video Title",
      "status": "completed",
      "thumbnails": ["path/to/thumb.png"],
      "resolutions": {
        "360p": "path/to/360p.mp4",
        "720p": "path/to/720p.mp4",
        "1080p": "path/to/1080p.mp4"
      }
    }
  ]
}
```

#### GET /api/videos/:id
Get single video by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "My Video",
    "description": "Video description",
    "status": "completed",
    "thumbnails": ["path/to/thumb.png"],
    "resolutions": {
      "360p": "path/to/360p.mp4",
      "720p": "path/to/720p.mp4"
    },
    "uploadedAt": "2025-12-19T12:00:00.000Z"
  }
}
```

#### DELETE /api/videos/:id
Delete a video and all its associated files.

**Response:**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

## Configuration

### Video Upload Limits

Modify in `backend/config/multer.js`:
```javascript
limits: {
  fileSize: 5 * 1024 * 1024 * 1024  // 5GB (change as needed)
}
```

### Supported Video Formats

Modify in `backend/config/multer.js`:
```javascript
const allowedTypes = /mp4|avi|mov|mkv|webm|flv|wmv/;
```

### Thumbnail Configuration

Currently generates 1 thumbnail from the middle of the video.

Modify in `backend/utils/videoProcessor.js`:
```javascript
const thumbnails = await generateThumbnails(videoPath, thumbDir, 6);  // Generate 6 thumbnails
```

### Available Resolutions

Modify in `backend/utils/videoProcessor.js`:
```javascript
const availableResolutions = ['360p', '480p', '720p', '1080p', '1440p', '4k'];
```

The system automatically generates only resolutions up to the source video quality.

### Port Configuration

Create/edit `.env` file in root directory:
```
PORT=9876
NODE_ENV=development
```

---

## Troubleshooting

### FFmpeg Issues

#### Issue: FFmpeg not found
**Error:** `Cannot find ffmpeg`

**Solution:**
1. Verify FFmpeg installation: `ffmpeg -version`
2. If not installed, install FFmpeg (see [Installation Guide](#ffmpeg-installation))
3. If installed but not in PATH, set the path in `videoProcessor.js`

### Port Issues

#### Issue: Port already in use
**Error:** `Port 9876 is already in use`

**Solution 1 - Change port:**
Edit `.env` file:
```
PORT=9877
```

**Solution 2 - Kill process:**
```bash
# Mac/Linux
lsof -ti:9876 | xargs kill -9

# Windows
netstat -ano | findstr :9876
taskkill /PID <PID> /F
```

### Video Processing Issues

#### Issue: Videos not processing
**Symptoms:** Videos stuck in "Processing..." status

**Solution:**
1. Check backend console for FFmpeg errors
2. Verify FFmpeg is properly installed: `ffmpeg -version`
3. Check file permissions in `backend/uploads/` directories
4. Ensure sufficient disk space for video conversion
5. Check system resources (CPU, RAM) - video conversion is intensive

#### Issue: Processing fails for large videos
**Symptoms:** Processing fails or server crashes with large 4K videos

**Solution:**
1. Ensure sufficient RAM (8GB+ recommended for 4K)
2. Increase Node.js memory limit: `NODE_OPTIONS=--max_old_space_size=4096 npm run dev`
3. Consider reducing the number of concurrent conversions

### Upload Issues

#### Issue: Upload progress not showing
**Solution:**
1. Check browser console for errors (F12)
2. Verify backend is running on correct port
3. Clear browser cache and reload
4. Check CORS configuration in backend

#### Issue: Upload fails for large files
**Solution:**
1. Check Multer file size limits in `backend/config/multer.js`
2. Increase server timeout if needed
3. Check available disk space

### Display Issues

#### Issue: Thumbnails not displaying
**Solution:**
1. Check if thumbnails were generated in `backend/uploads/thumbnails/`
2. Verify static file serving is working
3. Check browser console for 404 errors
4. Verify file permissions

#### Issue: Videos won't play
**Solution:**
1. Check if video files exist in `backend/uploads/videos/`
2. Verify video format is supported by browser
3. Check browser console for errors
4. Try a different browser

---

## Architecture

### Design Decisions

#### 1. In-Memory Storage
**Decision:** Used JavaScript Map for video metadata storage instead of a database.

**Rationale:** Simplifies setup and meets assignment requirements. Data persists only during server runtime.

**Production Alternative:** MongoDB or PostgreSQL for persistent storage.

#### 2. Single User System
**Decision:** No authentication/authorization implemented.

**Rationale:** Assignment focuses on video processing and playback features.

**Production Alternative:** JWT-based authentication with user roles.

#### 3. Local File Storage
**Decision:** Local filesystem for video and thumbnail storage.

**Rationale:** Suitable for development and demo purposes.

**Production Alternative:** Cloud storage (AWS S3, Google Cloud Storage, Azure Blob).

#### 4. Immediate Processing
**Decision:** Videos processed immediately after upload in the same Node.js process.

**Rationale:** Simpler implementation for single-user demo.

**Production Alternative:** Queue system (Bull, RabbitMQ, AWS SQS) for handling concurrent uploads.

#### 5. Smart Resolution Selection
**Decision:** Only generate resolutions up to source video quality.

**Rationale:** Saves processing time and storage space. No point generating 4K from 720p source.

**Implementation:**
```javascript
const resolutionsToGenerate = availableResolutions.filter(res => {
  return resolutionHeights[res] <= originalHeight;
});
```

#### 6. Single Thumbnail
**Decision:** Generate 1 thumbnail from middle of video.

**Rationale:** Clean UI and efficient processing.

**Easy to Change:** Modify one line to generate multiple thumbnails.

### Project Structure Details

```
Video Platform Assignment/
├── README.md                    # Quick start guide
├── DOCUMENTATION.md             # This file
├── package.json                 # Backend dependencies
├── .gitignore                   # Git ignore rules
├── .env                         # Environment variables
│
├── backend/
│   ├── server.js                # Express server entry point
│   │                            # - CORS configuration
│   │                            # - Route mounting
│   │                            # - Static file serving
│   │
│   ├── config/
│   │   └── multer.js            # File upload configuration
│   │                            # - File size limits
│   │                            # - File type validation
│   │                            # - Storage configuration
│   │
│   ├── routes/
│   │   ├── upload.js            # Upload endpoints
│   │   │                        # - POST /api/upload
│   │   │                        # - GET /api/upload/progress/:videoId
│   │   │
│   │   └── video.js             # Video management endpoints
│   │                            # - GET /api/videos
│   │                            # - GET /api/videos/:id
│   │                            # - DELETE /api/videos/:id
│   │
│   ├── utils/
│   │   └── videoProcessor.js    # FFmpeg video processing
│   │                            # - Thumbnail generation
│   │                            # - Multi-resolution conversion
│   │                            # - Progress tracking
│   │
│   └── uploads/
│       ├── temp/                # Temporary uploads (original files)
│       ├── videos/              # Processed videos by ID
│       │   └── [videoId]/       # - 360p.mp4, 720p.mp4, etc.
│       ├── thumbnails/          # Generated thumbnails
│       │   └── [videoId]/       # - thumb_1.png, thumb_2.png, etc.
│       └── processed/           # Additional processed files
│
└── frontend/
    ├── package.json             # Frontend dependencies
    ├── public/
    │   └── index.html           # HTML template
    │
    └── src/
        ├── index.js             # React entry point
        ├── index.css            # Global styles
        │
        ├── App.js               # Main app component
        ├── App.css              # App styles
        │
        └── components/
            ├── UploadForm.js    # Video upload form
            ├── UploadForm.css   # - Form styling
            │                    # - Progress bar
            │
            ├── VideoGrid.js     # Video grid display
            ├── VideoGrid.css    # - Grid layout
            │                    # - Card styling
            │                    # - Status badges
            │
            ├── VideoPlayer.js   # Custom video player (395 lines)
            └── VideoPlayer.css  # - Player controls
                                 # - Responsive design
                                 # - Control animations
```

### Component Architecture

#### UploadForm Component
- Manages file upload state
- Tracks upload progress
- Handles form validation
- Communicates with upload API

#### VideoGrid Component
- Displays videos in responsive grid
- Shows processing status
- Handles video refresh
- Provides delete functionality

#### VideoPlayer Component
- Custom video player implementation
- Resolution switching
- Playback speed control
- Keyboard shortcuts
- Fullscreen support
- Volume control
- Progress tracking

---

## Assumptions

#### 1. Development/Demo Environment
This is a proof-of-concept for assignment demonstration, not production-ready. Video metadata is stored in-memory (lost on server restart), local file storage is used, and no database is required. Suitable for single-user demo purposes only.

#### 2. FFmpeg Installed and Configured
FFmpeg must be pre-installed on the system and accessible via PATH. Video processing entirely depends on this external dependency with no fallback option.

#### 3. Single-User System with Trusted Users
No authentication, authorization, or user management. All videos are publicly accessible. Assumes trusted users with basic file validation only and no security measures against malicious uploads or attacks.

#### 4. Sufficient System Resources
Server has adequate CPU (8+ cores for 4K), RAM (16GB+ for large videos), and storage (10GB+ minimum) for video conversion. Videos processed sequentially without concurrent processing or resource throttling.

#### 5. Modern Browser and Stable Network
Users have updated browsers supporting HTML5 video, ES6+ JavaScript, and stable internet for large file uploads (no resume capability for interrupted uploads).

---

## Challenges & Solutions

### Challenge 1: Large File Upload Handling
**Problem:** Uploading multi-GB video files could timeout or crash the server.

**Solution:** 
- Implemented Multer with streaming upload
- Set 5GB file size limit
- Added real-time progress tracking using Axios `onUploadProgress` callback
- Chunked upload processing

### Challenge 2: FFmpeg Integration
**Problem:** FFmpeg binary needs to be installed separately and path configuration varies by OS.

**Solution:**
- Created comprehensive documentation for all platforms (Mac, Linux, Windows)
- Added error handling for missing FFmpeg
- Provided path configuration options in code comments
- Included verification steps in docs

### Challenge 3: Video Processing Time
**Problem:** Converting videos to multiple resolutions takes significant time, blocking the user.

**Solution:**
- Implemented asynchronous processing
- Responds immediately to user after upload
- Processes in background
- Added real-time status polling (every 5 seconds)
- Shows progress percentage per resolution

### Challenge 4: Resolution Switching in Player
**Problem:** Switching resolution mid-playback would restart video from beginning.

**Solution:**
- Save current playback time before changing source
- Load new resolution source
- Restore playback position after new video loads
- Provides seamless switching experience

**Implementation:**
```javascript
const handleResolutionChange = (newResolution) => {
  const currentTime = videoRef.current.currentTime;
  setCurrentResolution(newResolution);
  videoRef.current.currentTime = currentTime;
};
```

## Performance Considerations

### Current Implementation

- **File Storage:** Local filesystem (not suitable for distributed systems)
- **Metadata:** In-memory Map (lost on server restart)
- **Processing:** Synchronous per video (one at a time)
- **Streaming:** Direct file serving (not optimized for high traffic)

### Production Recommendations

1. **Database** - Replace in-memory storage with MongoDB or PostgreSQL
2. **Queue System** - Use Bull or RabbitMQ for video processing queue
3. **CDN** - Serve videos from CloudFront, Cloudflare, or similar
4. **Caching** - Implement Redis for metadata and thumbnail caching
5. **Load Balancing** - Use PM2, Nginx, or container orchestration
6. **Cloud Storage** - Move to S3, Google Cloud Storage, or Azure Blob
7. **Adaptive Streaming** - Implement HLS or DASH for better streaming
8. **Monitoring** - Add logging, error tracking (Sentry), and metrics

### System Requirements

**Development:**
- CPU: Dual-core processor
- RAM: 4GB minimum
- Storage: 10GB available space
- Network: Standard broadband

**Production (handling 4K videos):**
- CPU: Multi-core processor (8+ cores recommended)
- RAM: 16GB+ (video conversion is memory-intensive)
- Storage: SSD with 100GB+ (depends on video volume)
- Network: High-bandwidth connection (1Gbps+)

---

## Extra Features Implemented

Beyond basic requirements:

**UI/UX:**
- Responsive design for mobile
- Status badges for processing states
- Empty state messaging
- Gradient UI with animations
- Comprehensive error handling

---

## Future Enhancements

### Short-term (could be added quickly)
- Multiple thumbnail generation
- Video duration display
- File size display
- Sort/filter videos
- Search functionality

### Medium-term (require significant work)
- User authentication & authorization
- Video editing (trim, crop, rotate)
- Subtitle/caption support
- Video sharing & embedding
- Comment system
- Playlist creation
- View count tracking

### Long-term (major features)
- Live streaming support
- Video analytics dashboard
- Mobile apps (React Native)
- Social features (likes, follows)
- Monetization features
- Content moderation tools
- Multi-language support
- HLS/DASH adaptive streaming



