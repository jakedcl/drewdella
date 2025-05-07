// HeaderHome.jsx
import React, { useState, useEffect } from "react";
import { client } from "../../lib/sanity";
import "./HeaderHome.css";

function HeaderHome() {
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

  return (
    <header className="header-home">
      <div className="header-home-left">
        <a
          href="https://www.drewdella.com"
          className="header-home-link"
          target="_blank"
        >
          About
        </a>
        <a
          href={shopUrl}
          className="header-home-link"
          target="_blank"
        >
          Store
        </a>
      </div>
      <div style={{ display: "flex", flex: 2 }} />
      <div className="header-home-right">
        <a
          href="mailto:drewdella@gmail.com?subject=Reaching out from the Website&body=Hi Andrew,"
          className="header-home-link"
        >
          Gmail
        </a>
        <a href="images" className="header-home-link" target="_blank">
          Images
        </a>
      </div>
    </header>
  );
}

export default HeaderHome;
