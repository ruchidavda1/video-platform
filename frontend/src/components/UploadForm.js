import React, { useState } from 'react';
import axios from 'axios';
import './UploadForm.css';
import { FiUploadCloud, FiX } from 'react-icons/fi';

const UploadForm = ({ onUploadComplete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videoId, setVideoId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i)) {
        setError('Please select a valid video file (MP4, AVI, MOV, MKV, WEBM)');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        video: file
      }));
      setError('');
    }
  };

  const clearFile = () => {
    setFormData(prev => ({
      ...prev,
      video: null
    }));
    // Reset file input
    const fileInput = document.getElementById('video-input');
    if (fileInput) fileInput.value = '';
  };

  const pollProcessingStatus = async (videoId) => {
    try {
      const response = await axios.get(`/api/upload/progress/${videoId}`);
      const { status, progress } = response.data;

      if (progress) {
        if (progress.stage === 'thumbnails') {
          setProcessingStatus('Generating thumbnails...');
        } else if (progress.stage === 'conversion') {
          setProcessingStatus(
            `Converting to ${progress.resolution} (${progress.current}/${progress.total})... ${Math.round(progress.percent || 0)}%`
          );
        }
      }

      if (status === 'completed') {
        setSuccess('Video uploaded and processed successfully! 🎉');
        setProcessingStatus(null);
        setUploading(false);
        setVideoId(null);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          video: null
        });
        
        // Clear file input
        const fileInput = document.getElementById('video-input');
        if (fileInput) fileInput.value = '';

        if (onUploadComplete) {
          onUploadComplete();
        }

        setTimeout(() => setSuccess(''), 5000);
        return true;
      } else if (status === 'failed') {
        setError('Video processing failed. Please try again.');
        setProcessingStatus(null);
        setUploading(false);
        setVideoId(null);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error polling status:', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!formData.video) {
      setError('Please select a video file');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('video', formData.video);

      const response = await axios.post('/api/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        const uploadedVideoId = response.data.videoId;
        setVideoId(uploadedVideoId);
        setProcessingStatus('Processing video...');

        // Start polling for processing status
        const pollInterval = setInterval(async () => {
          const isComplete = await pollProcessingStatus(uploadedVideoId);
          if (isComplete) {
            clearInterval(pollInterval);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload video. Please try again.');
      setUploading(false);
      setUploadProgress(0);
      setProcessingStatus(null);
    }
  };

  return (
    <div className="upload-form-container">
      <div className="upload-form-card">
        <h2 className="form-title">📤 Upload Video</h2>
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter video title"
              disabled={uploading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter video description (optional)"
              rows="3"
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-input">Video File *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="video-input"
                accept="video/*"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="file-select-btn"
                onClick={() => document.getElementById('video-input').click()}
                disabled={uploading}
              >
                <FiUploadCloud size={20} />
                Choose Video File
              </button>
              {formData.video && (
                <div className="selected-file">
                  <span className="file-name">{formData.video.name}</span>
                  <span className="file-size">
                    ({(formData.video.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                  {!uploading && (
                    <button
                      type="button"
                      className="clear-file-btn"
                      onClick={clearFile}
                      title="Remove file"
                    >
                      <FiX size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {uploading && (
            <div className="upload-status">
              {uploadProgress < 100 ? (
                <>
                  <p className="status-text">Uploading... {uploadProgress}%</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </>
              ) : processingStatus ? (
                <>
                  <p className="status-text">{processingStatus}</p>
                  <div className="progress-bar">
                    <div className="progress-fill processing" />
                  </div>
                </>
              ) : null}
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;

