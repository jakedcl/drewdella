"use client";

import React from "react";
import Link from "next/link";
import GoogleLogo from "../GoogleLogo/GoogleLogo";
import SearchBar from "../SearchBar/SearchBar";
import { searchSuggestions } from "../../constants/searchSuggestions";
import "./Header.css";

const Header = ({ currentPath = "" }) => {

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
        <Link href="/connect" className="header-link" prefetch={false}>
          Contact
        </Link>
      </div>
    </header>
  );
};

export default Header;
