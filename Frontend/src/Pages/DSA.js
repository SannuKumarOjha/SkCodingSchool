

const DSA = () => {
  document.title = `DSA Sheet - SkCodingSchool`;
  return (
    <div className="pt-28 h-screen w-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <div className="bgColor absolute top-16 left-8 w-44 h-44 rounded-full bg-[#f72d30] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <div className="bgColor fixed top-1/2 left-1/2 w-44 h-44 rounded-full bg-[#f72d2d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <div className="bgColor fixed top-20 right-8 w-44 h-44 rounded-full bg-[#f7d52d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <h1 className="text-center mt-1 p-5 text-3xl text-bold mb-12">
        DSA Practice Sheet
      </h1>
      <div className="content pb-[52px] px-3">
        <h3 className="text-center">*Company-wise details for Questions coming soon!</h3>
        <p className="text-center">Note - This Sheet is only meant for <b className="text-[#f88757]">SKCodingSchool</b> students.</p>
      </div>
    </div>
  );
};

export default DSA;
