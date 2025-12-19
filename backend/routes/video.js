const express = require('express');
const router = express.Router();
const { videoDatabase } = require('./upload');

/**
 * Get all videos
 * GET /api/videos
 */
router.get('/', (req, res) => {
  try {
    const videos = Array.from(videoDatabase.values()).map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      uploadDate: video.uploadDate,
      status: video.status,
      thumbnails: video.thumbnails,
      resolutions: video.resolutions,
      metadata: video.metadata
    }));

    res.json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch videos'
    });
  }
});

/**
 * Get single video by ID
 * GET /api/videos/:id
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const video = videoDatabase.get(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video'
    });
  }
});

/**
 * Delete video
 * DELETE /api/videos/:id
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const video = videoDatabase.get(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Delete video from database
    videoDatabase.delete(id);

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete video'
    });
  }
});

module.exports = router;

