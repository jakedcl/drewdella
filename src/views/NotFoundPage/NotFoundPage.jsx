"use client";

import React from "react";
import Link from "next/link";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <p className="not-found-stats">About 0 results (0.42 seconds)</p>

      <div className="not-found-body">
        <p className="not-found-lead">
          <b>404.</b> That’s an error.
        </p>
        <p className="not-found-copy">
          The requested URL was not found on this server.
          <br />
          That’s all we know.
        </p>

        <p className="not-found-suggest">
          Try searching from{" "}
          <Link href="/home">the homepage</Link>
          {" · "}
          <Link href="/">All results</Link>
          {" · "}
          <Link href="/music">Music</Link>
        </p>
      </div>
    </div>
  );
}
