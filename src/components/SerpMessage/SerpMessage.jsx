"use client";

import React from "react";
import Link from "next/link";
import "./SerpMessage.css";

/** Fan-facing empty / error / not-found chrome for SERP pages. */
export default function SerpMessage({
  title,
  detail,
  links = [],
}) {
  return (
    <div className="serp-message">
      <p className="serp-message-title">{title}</p>
      {detail ? <p className="serp-message-detail">{detail}</p> : null}
      {links.length > 0 ? (
        <p className="serp-message-links">
          {links.map((item, i) => (
            <React.Fragment key={item.to || item.href || item.label}>
              {i > 0 ? " · " : null}
              {item.to ? (
                <Link href={item.to}>{item.label}</Link>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </React.Fragment>
          ))}
        </p>
      ) : null}
    </div>
  );
}
