import React from 'react';
import './VideoGrid.css';
import { FiClock, FiCheckCircle, FiLoader } from 'react-icons/fi';

const VideoGrid = ({ videos, onVideoClick }) => {
  if (videos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📹</div>
        <h3>No videos yet</h3>
        <p>Upload your first video to get started!</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="status-icon completed" />;
      case 'processing':
        return <FiLoader className="status-icon processing" />;
      case 'failed':
        return <FiClock className="status-icon failed" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Ready to play';
      case 'processing':
        return 'Processing...';
      case 'failed':
        return 'Processing failed';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <div
          key={video.id}
          className={`video-card ${video.status === 'completed' ? 'clickable' : ''}`}
          onClick={() => onVideoClick(video)}
        >
          <div className="video-thumbnail">
            {video.thumbnails && video.thumbnails.length > 0 ? (
              <img
                src={`/uploads/${video.thumbnails[0]}`}
                alt={video.title}
                loading="lazy"
              />
            ) : (
              <div className="thumbnail-placeholder">
                <span>🎬</span>
              </div>
            )}
            
            <div className="video-status-badge">
              {getStatusIcon(video.status)}
              <span>{getStatusText(video.status)}</span>
            </div>

            {video.status === 'completed' && (
              <div className="play-overlay">
                <div className="play-button">▶</div>
              </div>
            )}
          </div>

          <div className="video-info">
            <h3 className="video-title" title={video.title}>
              {video.title}
            </h3>
            
            {video.description && (
              <p className="video-description" title={video.description}>
                {video.description}
              </p>
            )}

            <div className="video-meta">
              <span className="video-date">
                📅 {formatDate(video.uploadDate)}
              </span>
              
              {video.resolutions && Object.keys(video.resolutions).length > 0 && (
                <span className="video-resolutions">
                  🎥 {Object.keys(video.resolutions).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
