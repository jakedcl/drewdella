import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GoogleLogo from "../GoogleLogo/GoogleLogo";
import SearchBar from "../SearchBar/SearchBar";
import { client } from "../../lib/sanity";
import { searchSuggestions } from "../../constants/searchSuggestions";
import "./Header.css"; // Your CSS file for styling

const Header = ({ currentPath = "" }) => {
  const [shopUrl, setShopUrl] = useState("https://www.drewdellamerch.com"); // Default fallback

  useEffect(() => {
    const fetchShopLink = async () => {
      try {
        // Fetch the shop link from Sanity
        const query = `*[_type == "shopLink"][0] {
          title,
          url
        }`;

        const data = await client.fetch(query);

        if (data && data.url) {
          setShopUrl(data.url);
        }
      } catch (error) {
        console.error("Error fetching shop link:", error);
        // Keep the default URL on error
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
        <img
          className="header-navbar-doodle"
          src="/thx4itall-navbar.png"
          alt="Thx4itall"
          width={200}
          height={80}
        />
      </div>
      <div className="header-search-wrap">
        <SearchBar
          currentPath={currentPath}
          suggestions={searchSuggestions}
        />
      </div>
      <div className="header-spacer" aria-hidden />
      <div className="header-links">
        <Link
          to="/lyrics"
          className="header-link"
        >
          Lyrics
        </Link>
        <a
          href="/shop"
          className="header-link"
          style={{ mx: "2rem" }}
        >
          Store
        </a>
      </div>
    </header>
  );
};

export default Header;
