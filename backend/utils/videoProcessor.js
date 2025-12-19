const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Set FFmpeg path (adjust if needed based on your system)
// For Mac with Homebrew: /opt/homebrew/bin/ffmpeg or /usr/local/bin/ffmpeg
// For Linux: /usr/bin/ffmpeg
// Uncomment and set the path if FFmpeg is not in your PATH
// ffmpeg.setFfmpegPath('/opt/homebrew/bin/ffmpeg');
// ffmpeg.setFfprobePath('/opt/homebrew/bin/ffprobe');

/**
 * Generate thumbnails from video
 * @param {string} videoPath - Path to the video file
 * @param {string} outputDir - Directory to save thumbnails
 * @param {number} count - Number of thumbnails to generate
 * @returns {Promise<string[]>} - Array of thumbnail paths
 */
const generateThumbnails = (videoPath, outputDir, count = 6) => {
  return new Promise((resolve, reject) => {
    const thumbnails = [];
    const filename = path.basename(videoPath, path.extname(videoPath));

    ffmpeg(videoPath)
      .on('end', () => {
        // Get all generated thumbnails
        for (let i = 1; i <= count; i++) {
          const thumbPath = path.join(outputDir, `${filename}_thumb_${i}.png`);
          if (fs.existsSync(thumbPath)) {
            thumbnails.push(thumbPath);
          }
        }
        resolve(thumbnails);
      })
      .on('error', (err) => {
        console.error('Error generating thumbnails:', err);
        reject(err);
      })
      .screenshots({
        count: count,
        folder: outputDir,
        filename: `${filename}_thumb_%i.png`,
        size: '320x240'
      });
  });
};

/**
 * Get video metadata
 * @param {string} videoPath - Path to the video file
 * @returns {Promise<object>} - Video metadata
 */
const getVideoMetadata = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
};

/**
 * Convert video to specific resolution
 * @param {string} inputPath - Input video path
 * @param {string} outputPath - Output video path
 * @param {string} resolution - Resolution (e.g., '720p', '1080p', '4k')
 * @param {function} onProgress - Progress callback
 * @returns {Promise<string>} - Output path
 */
const convertVideoResolution = (inputPath, outputPath, resolution, onProgress) => {
  return new Promise((resolve, reject) => {
    // Resolution configurations
    const resolutions = {
      '360p': { width: 640, height: 360, bitrate: '500k' },
      '480p': { width: 854, height: 480, bitrate: '1000k' },
      '720p': { width: 1280, height: 720, bitrate: '2500k' },
      '1080p': { width: 1920, height: 1080, bitrate: '5000k' },
      '1440p': { width: 2560, height: 1440, bitrate: '8000k' },
      '4k': { width: 3840, height: 2160, bitrate: '15000k' }
    };

    const config = resolutions[resolution];
    if (!config) {
      reject(new Error(`Unsupported resolution: ${resolution}`));
      return;
    }

    let command = ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .videoBitrate(config.bitrate)
      .size(`${config.width}x${config.height}`)
      .outputOptions([
        '-preset fast',
        '-movflags +faststart', // Enable streaming
        '-profile:v high',
        '-level 4.2'
      ])
      .on('start', (commandLine) => {
        console.log('FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        if (onProgress) {
          onProgress(progress);
        }
        console.log(`Processing ${resolution}: ${Math.round(progress.percent)}%`);
      })
      .on('end', () => {
        console.log(`✓ Conversion to ${resolution} completed`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error(`Error converting to ${resolution}:`, err);
        reject(err);
      });

    command.run();
  });
};

/**
 * Process video - generate thumbnails and convert to multiple resolutions
 * @param {string} videoPath - Path to the original video
 * @param {string} videoId - Unique video ID
 * @param {string} baseDir - Base directory for processed files
 * @param {function} onProgress - Progress callback
 * @returns {Promise<object>} - Processing results
 */
const processVideo = async (videoPath, videoId, baseDir, onProgress) => {
  try {
    const results = {
      videoId,
      thumbnails: [],
      resolutions: {},
      metadata: null
    };

    // Create directories
    const videoDir = path.join(baseDir, 'videos', videoId);
    const thumbDir = path.join(baseDir, 'thumbnails', videoId);
    
    [videoDir, thumbDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Get video metadata
    console.log('📊 Getting video metadata...');
    results.metadata = await getVideoMetadata(videoPath);
    
    const videoStream = results.metadata.streams.find(s => s.codec_type === 'video');
    const originalWidth = videoStream?.width || 0;
    const originalHeight = videoStream?.height || 0;
    
    console.log(`Original resolution: ${originalWidth}x${originalHeight}`);

    console.log('🖼️  Generating thumbnail...');
    if (onProgress) onProgress({ stage: 'thumbnails', percent: 0 });
    
    const thumbnails = await generateThumbnails(videoPath, thumbDir, 1);
    results.thumbnails = thumbnails.map(t => path.relative(baseDir, t));
    
    if (onProgress) onProgress({ stage: 'thumbnails', percent: 100 });

    // Determine which resolutions to generate based on original video
    const availableResolutions = ['360p', '480p', '720p', '1080p', '1440p', '4k'];
    const resolutionHeights = {
      '360p': 360,
      '480p': 480,
      '720p': 720,
      '1080p': 1080,
      '1440p': 1440,
      '4k': 2160
    };

    const resolutionsToGenerate = availableResolutions.filter(res => {
      return resolutionHeights[res] <= originalHeight;
    });

    // If original is smaller than 720p, still include it
    if (resolutionsToGenerate.length === 0) {
      resolutionsToGenerate.push('360p');
    }

    console.log(`📹 Converting to resolutions: ${resolutionsToGenerate.join(', ')}`);

    // Convert to multiple resolutions
    for (let i = 0; i < resolutionsToGenerate.length; i++) {
      const resolution = resolutionsToGenerate[i];
      const outputPath = path.join(videoDir, `${resolution}.mp4`);
      
      console.log(`Converting to ${resolution}...`);
      if (onProgress) {
        onProgress({ 
          stage: 'conversion', 
          resolution, 
          current: i + 1, 
          total: resolutionsToGenerate.length,
          percent: 0 
        });
      }

      await convertVideoResolution(
        videoPath,
        outputPath,
        resolution,
        (progress) => {
          if (onProgress) {
            onProgress({
              stage: 'conversion',
              resolution,
              current: i + 1,
              total: resolutionsToGenerate.length,
              percent: progress.percent || 0
            });
          }
        }
      );

      results.resolutions[resolution] = path.relative(baseDir, outputPath);
    }

    // Delete temporary file
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
      console.log('🗑️  Temporary file deleted');
    }

    return results;
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  }
};

module.exports = {
  generateThumbnails,
  getVideoMetadata,
  convertVideoResolution,
  processVideo
};

