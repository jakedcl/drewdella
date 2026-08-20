import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { client } from "../../lib/sanity";
import {
  SearchResults,
  SearchResult,
  formatCite,
  formatElapsed,
  datedSnippet,
} from "../../components/SearchResults/SearchResults.jsx";
import SerpMessage from "../../components/SerpMessage/SerpMessage.jsx";

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
        setError("Couldn’t load music right now. Try again in a bit.");
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
      <SerpMessage
        title="Music is taking a break."
        detail={error}
        links={[
          { to: "/", label: "All results" },
          { to: "/home", label: "Home" },
        ]}
      />
    );
  }

  if (!releases.length) {
    return (
      <SearchResults count={0} elapsed={elapsed}>
        <SerpMessage
          title="No releases to show yet."
          detail="New music is on the way — check back soon."
          links={[
            { to: "/lyrics", label: "Lyrics" },
            { to: "/videos", label: "Videos" },
          ]}
        />
      </SearchResults>
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
