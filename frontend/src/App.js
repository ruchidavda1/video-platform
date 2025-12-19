import React, { useState, useEffect } from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import VideoGrid from './components/VideoGrid';
import VideoPlayer from './components/VideoPlayer';
import axios from 'axios';

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/videos');
      if (response.data.success) {
        setVideos(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    
    // Poll for updates every 5 seconds to check processing status
    const interval = setInterval(() => {
      fetchVideos();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleVideoUpload = () => {
    // Refresh video list after upload
    fetchVideos();
  };

  const handleVideoClick = (video) => {
    if (video.status === 'completed') {
      setSelectedVideo(video);
      setIsPlayerOpen(true);
    }
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1 className="logo">🎬 Video Platform</h1>
          <p className="tagline">Professional Video Platform</p>
        </div>
      </header>

      <main className="container">
        <section className="upload-section">
          <UploadForm onUploadComplete={handleVideoUpload} />
        </section>

        <section className="videos-section">
          <h2 className="section-title">
            {loading ? 'Loading Videos...' : `Your Videos (${videos.length})`}
          </h2>
          <VideoGrid videos={videos} onVideoClick={handleVideoClick} />
        </section>
      </main>

      {isPlayerOpen && selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={handleClosePlayer}
        />
      )}

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 Video Platform. Built with React & Node.js</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

