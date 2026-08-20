import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client } from "../../lib/sanity";
import { resolveShopDestination, DEFAULT_SHOP_PATH } from "../../lib/shopLink";
import "./HeaderHome.css";

function HeaderHome() {
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
          <Link to={shop.href} className="header-home-link">
            Store
          </Link>
        )}
      </div>
      <div style={{ display: "flex", flex: 2 }} />
      <div className="header-home-right">
        <Link to="/lyrics" className="header-home-link">
          Lyrics
        </Link>
        <Link to="/images" className="header-home-link">
          Images
        </Link>
      </div>
    </header>
  );
}

export default HeaderHome;
