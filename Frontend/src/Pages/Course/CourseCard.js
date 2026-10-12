import React from "react";
import { motion } from "framer-motion";

const CourseCard = (props) => {
  return (
    <motion.div
      initial={{ y:150 , opacity: 0 }}
      whileInView={{ y:0, opacity: 1 }}
      transition={{
        duration:0.7 ,
      }}
      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <a href={props.link}>
        <img
          className="rounded-t-lg w-full h-full"
          src={props.image}
          alt="thumbnail"
        />
      </a>
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {props.title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {props.desc}
        </p>
        <a
          href={props.link}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          See Tutorial
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
    </motion.div>
  );
};

export default CourseCard;
