import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer_left">
        <Link to="/all" className="footer_link">
          Music
        </Link>
        <Link to="/connect" className="footer_link">
          Socials
        </Link>
      </div>
      <div className="footer_right">
        <Link to="/blog" className="footer_link">
          Blog
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
