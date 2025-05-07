import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert, Box } from '@mui/material';
import { client } from '../../lib/sanity';
import './ConnectPage.css';

export default function ConnectPage() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        setError(null);

        // GROQ query to get social links ordered by the order field
        const query = `*[_type == "socialLink"] | order(order asc) {
          _id,
          title,
          url,
          description
        }`;

        const data = await client.fetch(query);
        setSocialLinks(data);
      } catch (err) {
        console.error("Error fetching social links:", err);
        setError(err.message || 'Failed to load social links. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
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

  // Display message if no social links found
  if (!socialLinks.length) {
    return (
      <Box p={2}>
        <Alert severity="info">No social links found. Add links in the Sanity Studio.</Alert>
      </Box>
    );
  }

  // Render the social links
  return (
    <div className="all-results-container">
      {socialLinks.map((link) => (
        <div key={link._id} className="result-item">
          <div className="result-content">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="result-title">
              {link.title}
            </a>
            <p className="result-description">{link.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
