"use client";

import React from "react";
import Link from "next/link";
import GoogleLogo from "../GoogleLogo/GoogleLogo";
import SearchBar from "../SearchBar/SearchBar";
import { searchSuggestions } from "../../constants/searchSuggestions";
import { DEFAULT_SHOP_PATH } from "../../lib/shopLink";
import "./Header.css";

const Header = ({
  currentPath = "",
  shop = { href: DEFAULT_SHOP_PATH, external: false },
}) => {

  const googleLogoStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    position: "relative",
    padding: 0,
  };

  return (
    <header className="header">
      <div className="header-logo-group">
        <GoogleLogo style={googleLogoStyles} />
      </div>
      <div className="header-search-wrap">
        <SearchBar currentPath={currentPath} suggestions={searchSuggestions} />
      </div>
      <div className="header-spacer" aria-hidden />
      <div className="header-links">
        <Link href="/maps" className="header-link" prefetch={false}>
          Maps
        </Link>
        {shop.external ? (
          <a
            href={shop.href}
            className="header-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Store
          </a>
        ) : (
          <Link href={shop.href} className="header-link">
            Store
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
