import React, { useState, useEffect } from "react";
import { CircularProgress, Alert, Box } from "@mui/material";
import { client } from "../../lib/sanity";
import {
  SearchResults,
  SearchResult,
  formatCite,
  formatElapsed,
  datedSnippet,
} from "../../components/SearchResults/SearchResults.jsx";

export default function MusicPage() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState("0.12");

  useEffect(() => {
    const fetchReleases = async () => {
      const started = performance.now();
      try {
        setLoading(true);
        setError(null);

        const query = `*[_type == "musicRelease"] | order(order asc) {
          _id,
          title,
          description,
          url,
          date
        }`;

        const data = await client.fetch(query);
        setReleases(data);
        setElapsed(formatElapsed(performance.now() - started));
      } catch (err) {
        console.error("Error fetching music releases:", err);
        setError(
          err.message || "Failed to load music releases. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
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

  if (!releases.length) {
    return (
      <Box p={2}>
        <Alert severity="info">
          No music releases found. Add releases in the Sanity Studio.
        </Alert>
      </Box>
    );
  }

  return (
    <SearchResults count={releases.length} elapsed={elapsed}>
      {releases.map((release) => (
        <SearchResult
          key={release._id}
          href={release.url}
          title={release.title}
          cite={formatCite(release.url)}
          snippet={datedSnippet(release.date, release.description)}
        />
      ))}
    </SearchResults>
  );
}
