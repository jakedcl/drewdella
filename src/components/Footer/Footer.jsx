import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer_left">
        <Link to="/blog" className="footer_link">
          About
        </Link>
        <a href="/link2" className="footer_link">
          Privacy
        </a>
      </div>
      <div className="footer_right">
        <a href="/link3" className="footer_link">
          Settings
        </a>
      </div>
    </footer>
  );
}

export default Footer;
