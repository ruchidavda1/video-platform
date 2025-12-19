const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const upload = require('../config/multer');
const { processVideo } = require('../utils/videoProcessor');

// In-memory storage for video metadata (use a database in production)
const videoDatabase = new Map();

// Store for tracking processing progress
const processingProgress = new Map();

/**
 * Upload video endpoint
 * POST /api/upload
 */
router.post('/', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded'
      });
    }

    const { title, description } = req.body;

    if (!title) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const videoId = uuidv4();
    const videoPath = req.file.path;

    // Store initial video metadata
    const videoData = {
      id: videoId,
      title: title,
      description: description || '',
      originalName: req.file.originalname,
      uploadDate: new Date().toISOString(),
      status: 'processing',
      thumbnails: [],
      resolutions: {},
      metadata: null
    };

    videoDatabase.set(videoId, videoData);

    // Send immediate response
    res.json({
      success: true,
      message: 'Video uploaded successfully, processing started',
      videoId: videoId,
      data: videoData
    });

    // Process video asynchronously
    const baseDir = path.join(__dirname, '../uploads');
    
    processVideo(videoPath, videoId, baseDir, (progress) => {
      // Store progress
      processingProgress.set(videoId, progress);
    })
      .then((results) => {
        // Update video data with processing results
        const updatedData = {
          ...videoData,
          status: 'completed',
          thumbnails: results.thumbnails,
          resolutions: results.resolutions,
          metadata: {
            duration: results.metadata.format.duration,
            size: results.metadata.format.size,
            format: results.metadata.format.format_name
          }
        };
        
        videoDatabase.set(videoId, updatedData);
        processingProgress.delete(videoId);
        
        console.log(`Video processing completed: ${videoId}`);
      })
      .catch((error) => {
        console.error(`Video processing failed: ${videoId}`, error);
        
        const errorData = {
          ...videoData,
          status: 'failed',
          error: error.message
        };
        
        videoDatabase.set(videoId, errorData);
        processingProgress.delete(videoId);
      });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload video'
    });
  }
});

/**
 * Get upload progress
 * GET /api/upload/progress/:videoId
 */
router.get('/progress/:videoId', (req, res) => {
  const { videoId } = req.params;
  const progress = processingProgress.get(videoId);
  const videoData = videoDatabase.get(videoId);

  if (!videoData) {
    return res.status(404).json({
      success: false,
      message: 'Video not found'
    });
  }

  res.json({
    success: true,
    status: videoData.status,
    progress: progress || null
  });
});

module.exports = router;
module.exports.videoDatabase = videoDatabase;

