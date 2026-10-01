"use client";

import React from "react";
import Link from "next/link";
import { DEFAULT_SHOP_PATH } from "../../lib/shopLink";
import "./HeaderHome.css";

function HeaderHome({ shop = { href: DEFAULT_SHOP_PATH, external: false } }) {
  return (
    <header className="header-home">
      <div className="header-home-left">
        {shop.external ? (
          <a
            href={shop.href}
            className="header-home-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Store
          </a>
        ) : (
          <Link href={shop.href} className="header-home-link">
            Store
          </Link>
        )}
      </div>
      <div style={{ display: "flex", flex: 2 }} />
      <div className="header-home-right">
        <Link href="/lyrics" className="header-home-link">
          Lyrics
        </Link>
        <Link href="/images" className="header-home-link" prefetch={false}>
          Images
        </Link>
      </div>
    </header>
  );
}

export default HeaderHome;
