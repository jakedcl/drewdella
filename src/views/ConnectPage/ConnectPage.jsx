"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { client } from "../../lib/sanity";
import {
  SearchResults,
  SearchResult,
  formatCite,
  formatElapsed,
  socialSnippet,
} from "../../components/SearchResults/SearchResults.jsx";
import SerpMessage from "../../components/SerpMessage/SerpMessage.jsx";

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
        setError("Couldn’t load socials right now. Try again in a bit.");
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
      <SerpMessage
        title="Socials are taking a break."
        detail={error}
        links={[
          { to: "/", label: "All results" },
          { to: "/home", label: "Home" },
        ]}
      />
    );
  }

  if (!socialLinks.length) {
    return (
      <SearchResults count={0} elapsed={elapsed}>
        <SerpMessage
          title="No socials listed yet."
          detail="Links will show up here when they’re ready."
          links={[
            { to: "/", label: "All results" },
            { to: "/blog", label: "Blog" },
          ]}
        />
      </SearchResults>
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
