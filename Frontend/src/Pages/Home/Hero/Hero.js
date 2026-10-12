import { motion } from "motion/react";

const Hero = () => {
  return (
    <section className="hero heroColor dark:bg-gray-900 pt-28">
      <div className="bgColor absolute top-28 left-12 w-44 h-44 rounded-full bg-[#f72d99] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <motion.a
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
          }}
          href="/pagenotfound"
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 heroColor rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          role="alert"
        >
          <span className="text-xs blueBtnColor rounded-full text-white px-4 py-1.5 mr-3">
            New
          </span>
          <span className="text-sm font-medium">See what's new!</span>
          <svg
            className="ml-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.a>
        <motion.h1
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
          }}
          className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
        >
          Discover Your Journey with Us
        </motion.h1>
        <motion.p
          initial={{ y: -150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
          }}
          className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
        >
          Get access to 500+ tutorials from top instructors around the world in
          one place.
        </motion.p>
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
          }}
          className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
        >
          <a
            href="https://buymeacoffee.com/sannukumar7"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg blueBtnColor hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Buy me a Coffee
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="/ytvideo"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            <svg
              className="mr-2 -ml-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
            </svg>
            Watch video
          </a>
        </motion.div>
        <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
          <span className="font-semibold text-gray-400 uppercase">
            FEATURED IN
          </span>
          <div className="flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between">
            <a
              href="/ytvideo"
              className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400"
            >
              <img src="https://static.vecteezy.com/system/resources/thumbnails/022/721/714/small/youtube-logo-for-popular-online-media-content-creation-website-and-application-free-png.png" alt="youtube" width={120} />
            </a>
            <a
              href="https://www.linkedin.com/in/sannukumarojha/"
              className="mr-5 mb-5 lg:mb-0 hover:text-red-800 dark:hover:text-gray-400"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LinkedIn_logo.svg" alt="linkedin" width={140} />
            </a>
            <a
              href="/"
              className="mr-5 mb-5 lg:mb-0 hover:text-blue-800 dark:hover:text-gray-400"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/8f/MNC_logo.png" alt="mnc" width={160} />
            </a>
          </div>
        </div>
      </div>
      <div className="bgColor absolute bottom-4 right-8 w-44 h-44 rounded-full bg-[#f76A2D] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-30"></div>
    </section>
  );
};

export default Hero;
