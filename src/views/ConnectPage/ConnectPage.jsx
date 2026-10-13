"use client";

import React from "react";
import {
  SearchResults,
  SearchResult,
  formatCite,
  socialSnippet,
} from "../../components/SearchResults/SearchResults.jsx";
import SerpMessage from "../../components/SerpMessage/SerpMessage.jsx";
import { CONTACT_EMAIL, contactMailto } from "../../lib/contact";

function EmailResult() {
  return (
    <SearchResult
      href={contactMailto()}
      title="Email Drew"
      cite={CONTACT_EMAIL}
      snippet="Send Drew a note."
    />
  );
}

export default function ConnectPage({ initialLinks = [], initialElapsed = "0.12" }) {
  const socialLinks = initialLinks || [];

  if (!socialLinks.length) {
    return (
      <SearchResults count={1} elapsed={initialElapsed}>
        <SerpMessage
          title="No socials listed yet."
          detail="Links will show up here when they’re ready."
          links={[
            { to: "/", label: "All results" },
            { to: "/blog", label: "Blog" },
          ]}
        />
        <EmailResult />
      </SearchResults>
    );
  }

  return (
    <SearchResults count={socialLinks.length + 1} elapsed={initialElapsed}>
      {socialLinks.map((link) => (
        <SearchResult
          key={link._id}
          href={link.url}
          title={link.title}
          cite={formatCite(link.url)}
          snippet={socialSnippet(link)}
        />
      ))}
      <EmailResult />
    </SearchResults>
  );
}
