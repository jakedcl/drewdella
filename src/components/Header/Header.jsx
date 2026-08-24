"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import GoogleLogo from "../GoogleLogo/GoogleLogo";
import SearchBar from "../SearchBar/SearchBar";
import { client } from "../../lib/sanity";
import { searchSuggestions } from "../../constants/searchSuggestions";
import { resolveShopDestination, DEFAULT_SHOP_PATH } from "../../lib/shopLink";
import "./Header.css";

const Header = ({ currentPath = "" }) => {
  const [shop, setShop] = useState({
    href: DEFAULT_SHOP_PATH,
    external: false,
  });

  useEffect(() => {
    const fetchShopLink = async () => {
      try {
        const data = await client.fetch(`*[_type == "shopLink"][0]{ url }`);
        setShop(resolveShopDestination(data?.url));
      } catch (error) {
        console.error("Error fetching shop link:", error);
      }
    };

    fetchShopLink();
  }, []);

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
        <Link href="/maps" className="header-link">
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
