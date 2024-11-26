import { useEffect, useState } from 'react';
import axios from 'axios';
import './VideosPage.css';


export default function VideosPage() {
  const [videos, setVideos] = useState([]);

  // Replace this with your YouTube channel ID or search term
  const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID; // Example channel ID
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  // Fetch videos from the YouTube API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`
        );
        setVideos(response.data.items);
      } catch (error) {
        console.error('Error fetching videos: ', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="video-results-container">
      {videos.map((video, index) => (
        <div key={index} className="video-result-item">
          <iframe
            className="video-iframe"
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            title={video.snippet.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="video-content">
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="video-title"
            >
              {video.snippet.title}
            </a>
            <p className="video-description">{video.snippet.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
