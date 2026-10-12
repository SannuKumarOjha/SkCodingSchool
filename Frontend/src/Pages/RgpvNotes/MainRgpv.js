import React from "react";

const Notes = () => {
  document.title = `RGPV Notes-SkCodingSchool`;
  return (
    <div className="pt-28 h-full w-full bg-[#d7ede8] dark:bg-[#0f172a]">
      <a
        href="/pagenotfound"
        className="px-3 py-2 ml-8 bg-[#f76a2d] rounded-2xl text-[#fff] absolute top-28 right-7 text-lg font-semibold hover:bg-[#eb7d4e]/90 transition-all duration-100 z-50"
      >RGPV Previous Year Paper</a>
      <div className="p-1 relative">
        <div className="bgColor fixed top-16 left-8 w-44 h-44 rounded-full bg-[#f72d30] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="bgColor fixed top-1/2 left-1/2 w-44 h-44 rounded-full bg-[#f72d2d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="bgColor fixed top-20 right-8 w-44 h-44 rounded-full bg-[#f7d52d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      </div>
      <div className="pt-7">
        <h1 className="text-4xl text-center text-blue-600">
          Welcome to RGPV Notes + Shivani
        </h1>
        <p className="pt-10 text-center text-cyan-200">
          This is a collection of notes for RGPV students, created by <span className="text-[#f76a2d]">SkCodingSchool...</span> <br />
          Feel free to explore and use these resources for your studies.
        </p>
      </div>
      <div className="pb-6 pt-20 w-full h-full text-center">
        <a href="/rgpv-notes/rgpv-notes&shivani" className="px-3 py-2 rounded-2xl text-[#000] text-lg font-semibold hover:bg-[#eb7d4e]/90 transition-all duration-100 dark:text-[#fff]">
          <b className="underline text-[#f76a2d]">Click here</b> for RGPV Notes || Shivani{" "}
        </a>
      </div>
    </div>
  );
};

export default Notes;
