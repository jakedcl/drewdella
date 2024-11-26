import React from "react";
import { Link } from "react-router-dom";
import logo from "/dellagoogle.png";
import "./GoogleLogo.css";

function GoogleLogo({ style }) {
  return (
    <div className="logo-container" style={style}>
      <Link to="/">
        <img src={logo} alt="Google Logo" className="logo" />
      </Link>
    </div>
  );
}

export default GoogleLogo;
