// HeaderHome.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./HeaderHome.css";

function HeaderHome() {

  return (
    <header className="header-home">
      <div className="header-home-left">
        <a
          href="/shop"
          className="header-home-link"
        >
          Store
        </a>
      </div>
      <div style={{ display: "flex", flex: 2 }} />
      <div className="header-home-right">
        <Link
          to="/lyrics"
          className="header-home-link"
        >
          Lyrics
        </Link>
        <a href="images" className="header-home-link" target="_blank">
          Images
        </a>
      </div>
    </header>
  );
}

export default HeaderHome;
