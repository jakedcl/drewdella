import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import NavTabs from "../NavTabs/NavTabs.jsx";
import Header from "../Header/Header.jsx";
import HangoutsChat from "../HangoutsChat/HangoutsChat.jsx";
import "./Layout.css";

const Layout = () => {
  const { pathname } = useLocation();
  const isMaps = pathname === "/maps";

  return (
    <div className={`site-layout${isMaps ? " site-layout--maps" : ""}`}>
      <Header />
      <NavTabs />
      <Box
        className={isMaps ? "site-main site-main--maps" : "site-main"}
        sx={isMaps ? undefined : { margin: "1rem" }}
      >
        <Outlet />
      </Box>
      <HangoutsChat />
    </div>
  );
};

export default Layout;
