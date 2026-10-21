"use client";

import React from "react";
import {
  SearchResults,
  SearchResult,
  formatCite,
  socialSnippet,
} from "../../components/SearchResults/SearchResults.jsx";
import SerpMessage from "../../components/SerpMessage/SerpMessage.jsx";
function emailHref(email) {
  const params = new URLSearchParams({ subject: "Hey Drew" });
  return `mailto:${email}?${params.toString()}`;
}

function EmailResult({ email }) {
  if (!email) return null;
  return (
    <SearchResult
      href={emailHref(email)}
      title="Email Drew"
      cite={email}
      snippet="Send Drew a note."
    />
  );
}

export default function ConnectPage({
  initialLinks = [],
  initialElapsed = "0.12",
  email = "",
}) {
  const socialLinks = initialLinks || [];
  const address = String(email || "").trim();
  const count = socialLinks.length + (address ? 1 : 0);

  if (!socialLinks.length) {
    return (
      <SearchResults count={count} elapsed={initialElapsed}>
        <SerpMessage
          title="No socials listed yet."
          detail="Links will show up here when they’re ready."
          links={[
            { to: "/", label: "All results" },
            { to: "/blog", label: "Blog" },
          ]}
        />
        <EmailResult email={address} />
      </SearchResults>
    );
  }

  return (
    <SearchResults count={count} elapsed={initialElapsed}>
      {socialLinks.map((link) => (
        <SearchResult
          key={link._id}
          href={link.url}
          title={link.title}
          cite={formatCite(link.url)}
          snippet={socialSnippet(link)}
        />
      ))}
      <EmailResult email={address} />
    </SearchResults>
  );
}
