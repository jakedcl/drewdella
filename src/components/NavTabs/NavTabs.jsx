import React, { useState, useEffect } from "react";
import { Tabs, Tab, CircularProgress } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { client } from "../../lib/sanity";

function NavTabs() {
  const location = useLocation();
  const [shopUrl, setShopUrl] = useState("https://www.drewdellamerch.com"); // Default fallback
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchShopLink();
  }, []);

  const pages = [
    { label: "All", path: "/all" },
    { label: "Images", path: "/images" },
    { label: "Videos", path: "/videos" },
    { label: "Socials", path: "/connect" },
    { label: "Shopping", path: shopUrl },
    { label: "Maps", path: "/maps" },
  ];

  // Determine the current index based on path
  const currentTab = pages.findIndex((page) => page.path === location.pathname);

  return (
    <div
      style={{
        paddingLeft: ".5rem",
        paddingRight: "1rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        borderBottom: "1px solid #f1f3f4",
      }}
    >
      <Tabs
        value={currentTab === -1 ? 0 : currentTab} // Fallback to 'All' if path not found
        scrollButtons="auto"
        variant="scrollable"
        sx={{}}
        centered
      >
        {pages.map((page, index) => (
          <Tab
            key={page.label}
            component={Link}
            to={page.path}
            label={page.label}
            sx={{
              textTransform: "none",
              minHeight: 48,
              fontSize: "1rem",
            }}
          />
        ))}
      </Tabs>
    </div>
  );
}

export default NavTabs;
