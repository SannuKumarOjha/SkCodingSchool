

const HelpInInterview = () => {
  return (
    <div className="pt-28 h-screen w-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      {/* <a
        href="/pagenotfound"
        className="px-3 py-2 ml-8 bg-[#f76a2d] rounded-2xl text-[#fff] fixed top-28 right-7 text-lg font-semibold hover:bg-[#873222] hover:text-[#fff] transition-all duration-100 z-100"
      >RGPV Previous Year Paper</a>
      <a
        href="/rgpv-notes"
        className="px-3 py-2 ml-8 bg-[#f7e02d] rounded-2xl text-[#000] fixed bottom-80 right-9 text-lg font-semibold hover:bg-[#873222]  hover:text-[#fff] transition-all duration-100 z-100"
      >RGPV Notes | Shivani</a> */}
      <div className="bgColor absolute top-16 left-8 w-44 h-44 rounded-full bg-[#f72d30] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <div className="bgColor fixed top-1/2 left-1/2 w-44 h-44 rounded-full bg-[#f72d2d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <div className="bgColor fixed top-20 right-8 w-44 h-44 rounded-full bg-[#f7d52d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <h1 className="text-center mt-1 p-5 text-3xl text-bold mb-12">
        Help in Interview | Exam
      </h1>
      <div className="helpinrgpvexam pb-9 pt-2">
        <a href="/rgpv-notes" className="px-3 py-2 ml-8 bg-[#f76a2d] rounded-2xl text-[#fff] absolute top-28 right-7 text-lg font-semibold hover:bg-[#873222] transition-all duration-100 z-100">RGPV Notes | Shivani</a>
        <a href="/rgpv-notes" className="px-3 py-2 ml-8 bg-[#f76a2d] rounded-2xl text-[#fff] absolute top-48 right-7 text-lg font-semibold hover:bg-[#873222] transition-all duration-100 z-100">RGPV Previous Year Paper</a>
      </div>
      <div className="content pb-[52px] px-3">
        <h3 className="text-center">
          *Company-wise details for Interview | Placement coming soon!
        </h3>
        <p className="text-center">
          Note - This Sheet is only meant for{" "}
          <b className="text-[#f88757]">SKCodingSchool</b> students.
        </p>
      </div>
    </div>
  );
};

export default HelpInInterview;
