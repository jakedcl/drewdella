"use client";

import React from "react";
import HeaderHome from "../../components/HeaderHome/HeaderHome.jsx";
import GoogleLogo from "../../components/GoogleLogo/GoogleLogo.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { searchSuggestions } from "../../constants/searchSuggestions";
import "./HomePage.css";

function HomePage({ luckyPaths = [], shop }) {
  const googleLogoStyles = {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "90vh",
    paddingLeft: "3rem",
    paddingRight: "3rem",
    height: "70%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <HeaderHome shop={shop} />
      <h1 className="sr-only">Drew Della</h1>
      <div style={{ flex: 2 }} />
      <div className="home-div">
        <div className="home-hero">
          <GoogleLogo style={googleLogoStyles} animateOnLoad />
          <SearchBar
            suggestions={searchSuggestions}
            showActions
            luckyPaths={luckyPaths}
          />
        </div>
      </div>
      <div style={{ flex: 3 }} />
      <Footer />
    </div>
  );
}

export default HomePage;
