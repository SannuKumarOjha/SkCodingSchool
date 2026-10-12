import React from "react";

const RgpvSite = () => {
  return (
    <div className="pt-28">
      <div className="p-1 relative">
        <div className="bgColor fixed top-16 left-8 w-44 h-44 rounded-full bg-[#f72d30] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="bgColor absolute top-1/2 left-1/2 w-44 h-44 rounded-full bg-[#f72d2d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="bgColor fixed top-20 right-8 w-44 h-44 rounded-full bg-[#f7d52d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      </div>
      <h1 className="text-4xl text-center text-blue-600">
        Welcome to RGPV Notes + Shivani
      </h1>

      <h3 className="text-4xl pb-4 text-center pt-16">Select your Branch !</h3>
      <div className="branch w-full h-[30vh] flex items-center justify-center flex-wrap">
        <a
          href="/rgpv-notes/rgpv-notes&shivani/cse"
          className="rounded-lg text-2xl text-white bg-[#f76a2d] px-4 pt-1"
        >
          CSE
        </a>
        <a
          href="/rgpv-notes/rgpv-notes&shivani/ai&ml"
          className="rounded-lg text-2xl ml-4 text-white bg-[#f76a2d] px-4 pt-1"
        >
          AI/ML
        </a>
        <a
          href="/rgpv-notes/rgpv-notes&shivani/me"
          className="rounded-lg text-2xl ml-4 text-white bg-[#f76a2d] px-4 pt-1"
        >
          ME
        </a>
        <a
          href="/rgpv-notes/rgpv-notes&shivani/ce"
          className="rounded-lg text-2xl ml-4 text-white bg-[#f76a2d] px-4 pt-1"
        >
          CE
        </a>
        <a
          href="/rgpv-notes/rgpv-notes&shivani/ex"
          className="rounded-lg text-2xl ml-4 text-white bg-[#f76a2d] px-4 pt-1"
        >
          EX
        </a>
      </div>
    </div>
  );
};

export default RgpvSite;
