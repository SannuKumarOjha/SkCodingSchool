import React from "react";
import CssSidebar from "./CssSidebar";
import Content from "../Content";

const Css = () => {
  return (
    <>
      <div className="w-full h-screen">
        <div className="pointer-events-none absolute top-16 left-8 w-44 h-44 rounded-full bg-[#f72d30] overflow-hidden blur-[55px] opacity-10 dark:opacity-20 -z-10"></div>
        <div className="pointer-events-none fixed top-1/2 left-1/2 w-44 h-44 rounded-full bg-[#f72d_lst] overflow-hidden blur-[55px] opacity-10 dark:opacity-20 -z-10"></div>
        <div className="pointer-events-none fixed top-20 right-8 w-44 h-44 rounded-full bg-[#f7d52d] overflow-hidden blur-[55px] opacity-10 dark:opacity-20 -z-10"></div>

        <div className="main-Content flex pt-20 h-full">
          <CssSidebar />
          <Content />
        </div>
      </div>
    </>
  );
};

export default Css;
