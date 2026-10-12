import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Pages/Navbar/Navbar";
import Footer from "./Pages/Home/Footer/Footer";

const Layout = ({ theme, setTheme }) => {
  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
