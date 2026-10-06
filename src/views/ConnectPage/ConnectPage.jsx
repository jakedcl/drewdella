"use client";

import React from "react";
import {
  SearchResults,
  SearchResult,
  formatCite,
  socialSnippet,
} from "../../components/SearchResults/SearchResults.jsx";
import SerpMessage from "../../components/SerpMessage/SerpMessage.jsx";

export default function ConnectPage({ initialLinks = [], initialElapsed = "0.12" }) {
  const socialLinks = initialLinks || [];

  if (!socialLinks.length) {
    return (
      <SearchResults count={0} elapsed={initialElapsed}>
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
    <SearchResults count={socialLinks.length} elapsed={initialElapsed}>
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
