import React, { useState, useRef, useEffect } from 'react';
import './VideoPlayer.css';
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiX
} from 'react-icons/fi';

const VideoPlayer = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedResolution, setSelectedResolution] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);

  const controlsTimeoutRef = useRef(null);

  // Available playback speeds
  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Get available resolutions
  const availableResolutions = video.resolutions 
    ? Object.keys(video.resolutions).sort((a, b) => {
        const order = { '360p': 1, '480p': 2, '720p': 3, '1080p': 4, '1440p': 5, '4k': 6 };
        return order[a] - order[b];
      })
    : [];

  // Initialize with best available resolution
  useEffect(() => {
    if (availableResolutions.length > 0 && !selectedResolution) {
      // Start with 720p if available, otherwise the highest
      const defaultRes = availableResolutions.includes('720p') 
        ? '720p' 
        : availableResolutions[availableResolutions.length - 1];
      setSelectedResolution(defaultRes);
    }
  }, [availableResolutions, selectedResolution]);

  // Format time to MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Update buffered amount
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / videoRef.current.duration) * 100;
        setBuffered(bufferedPercent);
      }
    }
  };

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Seek video
  const handleProgressBarClick = (e) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setVolume(volume || 0.5);
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Change playback speed
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Change resolution
  const handleResolutionChange = (resolution) => {
    if (videoRef.current && resolution !== selectedResolution) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;
      
      setSelectedResolution(resolution);
      
      // Wait for new source to load
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          if (wasPlaying) {
            videoRef.current.play();
          }
        }
      }, 100);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, duration]);

  const currentVideoSrc = selectedResolution && video.resolutions[selectedResolution]
    ? `/uploads/${video.resolutions[selectedResolution]}`
    : '';

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div
        className={`video-player-container ${isFullscreen ? 'fullscreen' : ''}`}
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={resetControlsTimeout}
      >
        {/* Close button */}
        <button className="close-player-btn" onClick={onClose} title="Close (Esc)">
          <FiX size={24} />
        </button>

        {/* Video element */}
        <video
          ref={videoRef}
          src={currentVideoSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlayPause}
          className="video-element"
        />

        {/* Video info */}
        <div className={`video-info-overlay ${showControls ? 'visible' : ''}`}>
          <h2 className="video-title">{video.title}</h2>
          {video.description && (
            <p className="video-description">{video.description}</p>
          )}
        </div>

        {/* Controls */}
        <div className={`video-controls ${showControls ? 'visible' : ''}`}>
          {/* Progress bar */}
          <div
            className="progress-bar-container"
            ref={progressBarRef}
            onClick={handleProgressBarClick}
          >
            <div className="progress-bar-buffered" style={{ width: `${buffered}%` }} />
            <div
              className="progress-bar-played"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
            <div
              className="progress-bar-thumb"
              style={{ left: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>

          {/* Control buttons */}
          <div className="controls-row">
            <div className="controls-left">
              {/* Play/Pause */}
              <button
                className="control-btn"
                onClick={togglePlayPause}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <FiPause size={22} /> : <FiPlay size={22} />}
              </button>

              {/* Time */}
              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Volume */}
              <div className="volume-control">
                <button
                  className="control-btn"
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                >
                  {isMuted || volume === 0 ? (
                    <FiVolumeX size={20} />
                  ) : (
                    <FiVolume2 size={20} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>

            <div className="controls-right">
              {/* Speed control */}
              <div className="speed-control">
                <select
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="speed-select"
                  title="Playback speed"
                >
                  {speeds.map((speed) => (
                    <option key={speed} value={speed}>
                      {speed}x
                    </option>
                  ))}
                </select>
              </div>

              {/* Resolution selector */}
              {availableResolutions.length > 0 && (
                <div className="resolution-control">
                  <select
                    value={selectedResolution}
                    onChange={(e) => handleResolutionChange(e.target.value)}
                    className="resolution-select"
                    title="Video quality"
                  >
                    {availableResolutions.map((res) => (
                      <option key={res} value={res}>
                        {res.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Fullscreen */}
              <button
                className="control-btn"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
              >
                {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {!currentVideoSrc && (
          <div className="loading-indicator">
            <div className="spinner" />
            <p>Loading video...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;

