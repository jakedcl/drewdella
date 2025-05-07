import React, { useState, useEffect } from "react";
import GoogleLogo from "../GoogleLogo/GoogleLogo";
import SearchBar from "../SearchBar/SearchBar";
import { client } from "../../lib/sanity";
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
    flex: 1,
    position: "relative",
    padding: 0,
  };

  return (
    <header className="header">
      <GoogleLogo style={googleLogoStyles} />
      <div style={{ flex: 2.4 }}>
        <SearchBar
          currentPath={currentPath}
          feelingLucky={false} // prop makes feeling google search and lucky buttons appear under this instance of searchBar
          suggestions={[
            { name: "drew della discography", path: "/all" },
            { name: "della photos", path: "/images" },
            { name: "@thedrewdella", path: "/connect" },
            { name: "@thedrewdella", path: "/connect" },
            { name: "live shows nyc+", path: "/maps" },
            { name: "drew della merch", path: shopUrl },
          ]}
        />
      </div>
      <div style={{ flex: 1.7 }}></div>
      <div style={{ flex: 0.3, alignItems: "end" }}>
        <a
          href="mailto:drewdella@gmail.com?subject=Reaching out from the Website&body=Hi Andrew,"
          className="header-link"
        >
          Gmail
        </a>
        <a
          href={shopUrl}
          className="header-link"
          style={{ mx: "2rem" }}
          target="_blank"
        >
          Store
        </a>
      </div>
    </header>
  );
};

export default Header;
