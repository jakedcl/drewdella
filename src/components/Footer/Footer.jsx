"use client";

import React from "react";
import Link from "next/link";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer_left">
        <Link href="/music" className="footer_link">
          Music
        </Link>
        <Link href="/connect" className="footer_link">
          Socials
        </Link>
      </div>
      <div className="footer_right">
        <Link href="/blog" className="footer_link">
          Blog
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
