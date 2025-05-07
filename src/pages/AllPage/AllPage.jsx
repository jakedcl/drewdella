import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert, Box } from '@mui/material';
import { client } from '../../lib/sanity';
import './AllPage.css';

export default function AllPage() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        setError(null);

        // GROQ query to get music releases ordered by the order field
        const query = `*[_type == "musicRelease"] | order(order asc) {
          _id,
          title,
          description,
          url
        }`;

        const data = await client.fetch(query);
        setReleases(data);
      } catch (err) {
        console.error("Error fetching music releases:", err);
        setError(err.message || 'Failed to load music releases. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Display error message if fetch failed
  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Display message if no releases found
  if (!releases.length) {
    return (
      <Box p={2}>
        <Alert severity="info">No music releases found. Add releases in the Sanity Studio.</Alert>
      </Box>
    );
  }

  // Render the music releases
  return (
    <div className="all-results-container">
      {releases.map((release) => (
        <div key={release._id} className="result-item">
          <div className="result-content">
            <a href={release.url} target="_blank" rel="noopener noreferrer" className="result-title">
              {release.title}
            </a>
            <p className="result-description">{release.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
