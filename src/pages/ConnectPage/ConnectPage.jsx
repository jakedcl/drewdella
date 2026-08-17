import React, { useState, useEffect } from "react";
import { CircularProgress, Alert, Box } from "@mui/material";
import { client } from "../../lib/sanity";
import {
  SearchResults,
  SearchResult,
  formatCite,
  formatElapsed,
  socialSnippet,
} from "../../components/SearchResults/SearchResults.jsx";

export default function ConnectPage() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState("0.12");

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const started = performance.now();
      try {
        setLoading(true);
        setError(null);

        const query = `*[_type == "socialLink"] | order(order asc) {
          _id,
          title,
          url,
          description
        }`;

        const data = await client.fetch(query);
        setSocialLinks(data);
        setElapsed(formatElapsed(performance.now() - started));
      } catch (err) {
        console.error("Error fetching social links:", err);
        setError(
          err.message || "Failed to load social links. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!socialLinks.length) {
    return (
      <Box p={2}>
        <Alert severity="info">
          No social links found. Add links in the Sanity Studio.
        </Alert>
      </Box>
    );
  }

  return (
    <SearchResults count={socialLinks.length} elapsed={elapsed}>
      {socialLinks.map((link) => (
        <SearchResult
          key={link._id}
          href={link.url}
          title={link.title}
          cite={formatCite(link.url)}
          snippet={socialSnippet(link)}
        />
      ))}
    </SearchResults>
  );
}
