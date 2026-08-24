"use client";

import React from "react";
import Link from "next/link";
import "./GoogleLogo.css";

function GoogleLogo({ style }) {
  return (
    <div className="logo-container" style={style}>
      <Link href="/home" aria-label="Drew Della home">
        <img src="/dellagoogle.png" alt="Google Logo" className="logo" />
      </Link>
    </div>
  );
}

export default GoogleLogo;
