# Video Platform

A professional full-stack video upload and streaming platform built with React and Node.js. This application allows users to upload large video files, automatically generates thumbnails, converts videos to multiple resolutions, and provides a custom video player with advanced playback controls.

---

## Features

### Backend Features

- **Large File Upload Support** - Handle video files up to 5GB with progress tracking
- **Automatic Thumbnail Generation** - Extract thumbnail from uploaded videos
- **Multi-Resolution Conversion** - Automatically convert videos to multiple resolutions:
  - 360p (640x360)
  - 480p (854x480)
  - 720p (1280x720)
  - 1080p (1920x1080)
  - 1440p (2560x1440)
  - 4K (3840x2160)
- **Real-time Processing Status** - Monitor upload and conversion progress
- **RESTful API** - Well-structured API endpoints
- **Video Metadata Extraction** - Get duration, size, and format information

### Frontend Features

- **Modern UI/UX** - Beautiful gradient design with smooth animations
- **Video Upload Form** - User-friendly form with title, description, and file upload
- **Upload Progress Tracking** - Real-time progress indicators for upload and processing
- **Video Grid Display** - Responsive grid layout showing all uploaded videos
- **Thumbnail Preview** - Display auto-generated thumbnails
- **Custom Video Player** with:
  - Play/Pause controls (Space bar or click)
  - Playback speed control (0.25x to 2x)
  - Resolution switching (360p to 4K)
  - Volume control with mute option
  - Progress bar with seek functionality
  - Fullscreen mode (F key)
  - Keyboard shortcuts
  - Responsive design for mobile devices
- **Status Indicators** - Show processing, completed, or failed states
- **Auto-refresh** - Automatically updates video list during processing

---

## Screenshots

### Application Interface

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.17.18 PM.png" alt="Upload Interface" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.17.40 PM.png" alt="Upload Form" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.17.48 PM.png" alt="File Selection" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.17.55 PM.png" alt="Video Upload Progress" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.18.07 PM.png" alt="Processing Status" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.18.14 PM.png" alt="Video Grid" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.18.17 PM.png" alt="Video Thumbnails" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.18.22 PM.png" alt="Video Details" width="800"/>

### Video Player

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.19.46 PM.png" alt="Custom Video Player" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.19.49 PM.png" alt="Player Controls" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.19.54 PM.png" alt="Resolution Selection" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.20.01 PM.png" alt="Playback Speed Control" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.20.12 PM.png" alt="Volume Controls" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.20.28 PM.png" alt="Video Progress Bar" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.20.44 PM.png" alt="Fullscreen Mode" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.21.05 PM.png" alt="Player in Action" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.21.31 PM.png" alt="Multi-Resolution Display" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.22.45 PM.png" alt="Video Library" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.22.59 PM.png" alt="Processing Complete" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.23.03 PM.png" alt="Video Management" width="800"/>

<img src="frontend/src/images/Screenshot-2025-12-19-at-7.23.11 PM.png" alt="Application Overview" width="800"/>

---

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Multer** - File upload middleware
- **FFmpeg** - Video processing and conversion
- **fluent-ffmpeg** - Node.js wrapper for FFmpeg

### Frontend
- **React 18** - UI library
- **React Hooks** - State management
- **Axios** - HTTP client
- **React Icons** - Icon library
- **CSS3** - Styling with animations

---

## Prerequisites

Before running this application, make sure you have the following installed:

### 1. Node.js (v14 or higher)
```bash
node --version
```

### 2. npm (comes with Node.js)
```bash
npm --version
```

### 3. FFmpeg (required for video processing)

**Mac (using Homebrew):**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
- Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- Add FFmpeg to your system PATH

**Verify installation:**
```bash
ffmpeg -version
```

---

## Installation & Setup

### Step 1: Clone or Navigate to the Repository

```bash
cd "/Applications/Video Platform Assignment"
```

### Step 2: Install Dependencies

Install both backend and frontend dependencies:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Configure Environment (Optional)

The application uses port 9876 by default. To change it, create/edit `.env` file:

```
PORT=9876
NODE_ENV=development
```

### Step 4: FFmpeg Configuration (if needed)

If FFmpeg is not in your system PATH, set the FFmpeg path in `backend/utils/videoProcessor.js`:

```javascript
// Uncomment and set your FFmpeg path
ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');  // Mac with Homebrew
ffmpeg.setFfprobePath('/opt/homebrew/bin/ffprobe');
```

---

## Running the Application

### Option 1: Run Backend and Frontend Separately (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd "/Applications/Video Platform Assignment"
PORT=9876 npm run dev
```

You should see:
```
Server is running on port 9876
Upload directories created successfully
```

**Terminal 2 - Start Frontend:**
```bash
cd "/Applications/Video Platform Assignment/frontend"
npm start
```

Frontend will start on `http://localhost:3000`

### Option 2: Run Both Together

```bash
npm run dev:all
```

This starts both backend and frontend in a single terminal.

### Accessing the Application

Open your browser and navigate to:
```
http://localhost:3000
```

The backend API runs on:
```
http://localhost:9876
```

---

## Usage Guide

### Uploading a Video

1. Open `http://localhost:3000` in your browser
2. Fill in the upload form:
   - **Title** (required) - Enter video title
   - **Description** (optional) - Add video description
   - **Video File** - Click "Choose Video File" and select a video
3. Click **"Upload Video"** button
4. Monitor the upload progress (0% to 100%)
5. Wait for video processing to complete

### Video Processing Stages

After upload, the video goes through:
1. **Thumbnail Generation** - Extracts thumbnail from middle of video
2. **Resolution Conversion** - Converts to multiple resolutions (360p to 4K)
3. **Completion** - Video appears in the grid with "Ready to play" status

### Playing a Video

1. Once processing is complete, click on the video thumbnail
2. Custom video player opens with the video
3. Use player controls:
   - **Space bar** - Play/Pause
   - **F key** - Toggle fullscreen
   - **M key** - Mute/Unmute
   - **Arrow Left/Right** - Seek backward/forward 5 seconds
   - **Speed dropdown** - Change playback speed
   - **Resolution dropdown** - Switch video quality
   - **Volume slider** - Adjust volume
   - **Progress bar** - Click to seek

---

## Project Structure

```
Video Platform Assignment/
├── README.md
├── package.json                 (Backend dependencies)
├── .gitignore
├── .env
│
├── backend/
│   ├── server.js               (Express server entry point)
│   ├── config/
│   │   └── multer.js           (File upload configuration)
│   ├── routes/
│   │   ├── upload.js           (Upload endpoints)
│   │   └── video.js            (Video management endpoints)
│   ├── utils/
│   │   └── videoProcessor.js   (FFmpeg video processing)
│   └── uploads/
│       ├── temp/               (Temporary uploads)
│       ├── videos/             (Processed videos by ID)
│       ├── thumbnails/         (Generated thumbnails)
│       └── processed/          (Additional processed files)
│
└── frontend/
    ├── package.json            (Frontend dependencies)
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js            (React entry point)
        ├── App.js              (Main app component)
        └── components/
            ├── UploadForm.js   (Video upload form)
            ├── VideoGrid.js    (Video grid display)
            └── VideoPlayer.js  (Custom video player)
```

---

## API Documentation

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
  "data": [...]
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
    "status": "completed",
    "thumbnails": [...],
    "resolutions": {...}
  }
}
```

#### DELETE /api/videos/:id
Delete a video.

**Response:**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

## Configuration Options

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

### Thumbnail Count

Currently set to generate 1 thumbnail from the middle of the video.

Modify in `backend/utils/videoProcessor.js` if you want more:
```javascript
const thumbnails = await generateThumbnails(videoPath, thumbDir, 1);  // Change to desired count
```

### Available Resolutions

Modify in `backend/utils/videoProcessor.js`:
```javascript
const availableResolutions = ['360p', '480p', '720p', '1080p', '1440p', '4k'];
```

---

## Troubleshooting

### Issue: FFmpeg not found

**Error:** `Cannot find ffmpeg`

**Solution:**
1. Verify FFmpeg installation: `ffmpeg -version`
2. If not installed, install FFmpeg (see Prerequisites)
3. If installed but not in PATH, set the path in `videoProcessor.js`

### Issue: Port already in use

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

### Issue: Videos not processing

**Symptoms:** Videos stuck in "Processing..." status

**Solution:**
1. Check backend console for FFmpeg errors
2. Verify FFmpeg is properly installed: `ffmpeg -version`
3. Check file permissions in `backend/uploads/` directories
4. Ensure sufficient disk space for video conversion

### Issue: Upload progress not showing

**Solution:**
1. Check browser console for errors (F12)
2. Verify backend is running on correct port
3. Clear browser cache and reload

### Issue: Thumbnails not displaying

**Solution:**
1. Check if thumbnails were generated in `backend/uploads/thumbnails/`
2. Verify static file serving is working
3. Check browser console for 404 errors

---

## Assumptions & Design Decisions

### 1. In-Memory Storage
Used JavaScript Map for video metadata storage instead of a database. This simplifies setup and meets assignment requirements. For production, MongoDB or PostgreSQL would be recommended.

### 2. Single User
No authentication/authorization implemented as the assignment focuses on video processing and playback features. Multi-user support would be added for production.

### 3. File Storage
Local filesystem used for video and thumbnail storage. This is suitable for development and demo purposes. For production, cloud storage (AWS S3, Google Cloud Storage) would be necessary for scalability.

### 4. Processing Queue
Videos are processed immediately after upload in the same Node.js process. For production, a queue system (Bull, RabbitMQ) would handle concurrent uploads and prevent server overload.

### 5. Resolution Selection
The system intelligently generates only resolutions up to the source video quality (e.g., if source is 1080p, it won't generate 4K). This saves processing time and storage space.

### 6. Thumbnail Generation
Single thumbnail extracted from the middle of video for clean UI and efficient processing. Multiple thumbnails can be generated by changing one line of code if needed.

---

## Challenges Faced & Solutions

### Challenge 1: Large File Upload Handling
**Problem:** Uploading multi-GB video files could timeout or crash the server.

**Solution:** Implemented Multer with streaming upload, set 5GB limit, and added progress tracking using Axios onUploadProgress callback.

### Challenge 2: FFmpeg Integration
**Problem:** FFmpeg binary needs to be installed separately and path configuration varies by OS.

**Solution:** Created comprehensive documentation for all platforms (Mac, Linux, Windows), added error handling, and provided path configuration options in code comments.

### Challenge 3: Video Processing Time
**Problem:** Converting videos to multiple resolutions takes significant time, blocking the user.

**Solution:** Implemented asynchronous processing that responds immediately to the user after upload, then processes in the background. Added real-time status polling so users can monitor progress.

### Challenge 4: Resolution Switching in Player
**Problem:** Switching resolution mid-playback would restart video from beginning.

**Solution:** Saved current playback time before changing source, then restored position after new resolution loads, providing seamless switching experience.

### Challenge 5: Port Conflicts
**Problem:** Default port 5000 was occupied by macOS ControlCenter.

**Solution:** Made port configurable via environment variables and documented port change process. Backend auto-detects conflicts and suggests alternatives.

---

## Extra Features Implemented

- Real-time upload progress with percentage
- Real-time processing status with resolution-specific progress
- Automatic thumbnail generation from video
- Intelligent resolution selection based on source video (6 resolutions)
- Custom video player with advanced controls
- Keyboard shortcuts for video player (Space, F, M, Arrows)
- Auto-hiding controls for better viewing experience
- Fullscreen support
- Responsive design for mobile devices
- Beautiful gradient UI with smooth animations
- Video buffering indicator
- Playback speed control (0.25x to 2x - 8 options)
- Volume control with mute option
- Status badges for video processing states
- Empty state with friendly message
- Error handling throughout application

---

## Future Enhancements

- User authentication and authorization
- Video editing capabilities (trim, crop, filters)
- Subtitle/caption support
- Video sharing and embedding
- Analytics and view tracking
- Comment system
- Playlist creation
- Video search and filtering
- Cloud storage integration (AWS S3, Google Cloud Storage)
- CDN integration for faster streaming
- Database integration (MongoDB, PostgreSQL)
- WebSocket for real-time updates
- Admin dashboard
- Video compression optimization
- HLS/DASH adaptive streaming

---

## Performance Optimization

### For Production

1. **Database** - Replace in-memory storage with MongoDB/PostgreSQL
2. **Queue System** - Use Bull or RabbitMQ for video processing queue
3. **CDN** - Serve processed videos from a CDN
4. **Caching** - Implement Redis for metadata caching
5. **Load Balancing** - Use PM2 or Nginx for load balancing

### Recommended System Requirements

- **CPU:** Multi-core processor (video conversion is CPU-intensive)
- **RAM:** Minimum 4GB (8GB+ recommended for 4K videos)
- **Storage:** SSD recommended for better I/O performance
- **Network:** Fast internet for uploading large files

---

## AI-Assisted Development

This project was built with help from **Claude 4 Sonnet AI** through **Cursor IDE**. Honestly, it made a huge difference in development speed and code quality. Here's what we accomplished together:

### What AI Actually Helped Build

**1. Component Architecture**
Created 3 main React components with clean separation:
- `UploadForm.js` - Handles file uploads with progress tracking
- `VideoGrid.js` - Displays videos in responsive grid, receives videos as props so it's reusable
- `VideoPlayer.js` (395 lines) - Custom player with 10+ features, completely self-contained

Each component has its own CSS file and doesn't depend on others unnecessarily.

**2. Video Processing Pipeline**
The trickiest part was FFmpeg integration. AI helped with:
- Figuring out the right FFmpeg commands for H.264 encoding with `-movflags +faststart`
- Setting up 6 resolution outputs (360p to 4K) with proper bitrates
- Writing the async processing logic so videos convert in background
- Smart resolution detection - only generates resolutions up to source quality (e.g., won't make 4K from a 720p source)

Example from `videoProcessor.js`:
```javascript
const resolutionsToGenerate = availableResolutions.filter(res => {
  return resolutionHeights[res] <= originalHeight;
});
```

**3. Custom Video Player Features**
Built a full-featured player with:
- Play/pause (spacebar or click)
- Speed control (0.25x to 2x - 8 options)
- Resolution switching that remembers your current timestamp
- Keyboard shortcuts (Space, F for fullscreen, M for mute, arrows to seek)
- Auto-hiding controls after 3 seconds
- Buffering indicator

This was way more complex than using a library, but gave us full control.

**4. API Design**
Created 5 REST endpoints:
- `POST /api/upload` - Upload with multipart/form-data
- `GET /api/videos` - List all videos
- `GET /api/videos/:id` - Single video details
- `GET /api/upload/progress/:videoId` - Check processing status
- `DELETE /api/videos/:id` - Remove video

**5. Real-time Features**
- Upload progress tracking using Axios `onUploadProgress`
- Processing status polling every 5 seconds in the frontend
- Progress callbacks during FFmpeg conversion

**6. Problem Solving**
Some issues AI helped debug:
- FFmpeg path problems on different OS (Mac Homebrew vs system paths)
- Port 5000 conflict with macOS ControlCenter (changed to 9876)
- Resolution switching was restarting video - fixed by saving/restoring currentTime
- CORS errors between frontend (3000) and backend (9876)

### Technical Decisions Made

**Used in-memory storage (Map) instead of database** - For this assignment it's simpler, but noted in docs that production needs MongoDB/PostgreSQL

**Local file storage** - Videos and thumbnails saved in `uploads/` directory. Cloud storage (S3) would be needed for production.

**Immediate processing** - Videos process right after upload. Production would need a queue system like Bull or RabbitMQ.

**Single thumbnail per video** - Extracts 1 thumbnail from middle of video. Could easily change to 6 by modifying one line:
```javascript
const thumbnails = await generateThumbnails(videoPath, thumbDir, 1);  // Change to 6
```

### Code Quality

AI helped ensure:
- Proper error handling with try-catch blocks
- ESLint-friendly code (ES6+ syntax)
- Modular structure (routes, utils, config separated)
- Async/await instead of callback hell
- Proper use of React hooks (useState, useRef, useEffect)

### Documentation

The README you're reading is 642 lines covering:
- Installation for Mac/Linux/Windows
- FFmpeg setup instructions
- API documentation with examples
- Troubleshooting common issues
- Project structure explanation

### What This Demonstrates

Working with AI wasn't about having it write everything blindly. It was more like pair programming:
- I'd describe what I needed
- AI would generate code
- I'd test it, find issues
- AI would help debug

The video player alone probably saved me 2-3 days of work. FFmpeg command configuration would've taken hours of trial and error.

Total development was much faster than doing it solo, and the code quality is solid. Everything actually works - upload a video, it converts to multiple resolutions, generates thumbnails, and plays back smoothly.

---



