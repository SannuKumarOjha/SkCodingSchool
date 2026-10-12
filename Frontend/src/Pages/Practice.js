import React from "react";
import Card from "./Practice/Card";
import htmlLogo from "../Photos/html.png";
import css from "../Photos/css.png";
import javascript from "../Photos/javascript.png";
import react from "../Photos/React.webp";
import java from "../Photos/java.png";
import dsa from "../Photos/dsa.png";

const Practice = () => {
  document.title = `Practice - SkCodingSchool`;
  return (
    <div className="pt-28 bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <div className="bgColor absolute top-16 left-8 w-44 h-44 rounded-full bg-[#f72d30] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <div className="bgColor fixed top-1/2 left-1/2 w-44 h-44 rounded-full bg-[#f72d2d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <div className="bgColor fixed top-20 right-8 w-44 h-44 rounded-full bg-[#f7d52d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <h1 className="text-center mt-1 p-5 text-3xl text-bold mb-12">
        Practice Now
      </h1>
      <div className="cards px-4 flex flex-wrap gap-6 items-center justify-center">
        <Card
          img={htmlLogo}
          title="HTML Basic to Advance"
          desc="Embark on a comprehensive journey to master HTML, the backbone of the web. Whether you're starting from scratch or looking to sharpen your skills, our guide covers everything you need to know."
          link="/practice/html/html-home"
        />
        <Card
          img={css}
          title="CSS Basic to Advance"
          desc="Unlock the full potential of web design with our comprehensive guide to CSS. Whether you're just starting out or aiming to refine your skills, this journey covers all the essentials and beyond."
          link="/practice/css-full-course"
        />
        <Card
          img={javascript}
          title="JavaScript Master Class"
          desc="Dive into the world of JavaScript and unlock the secrets of dynamic web development. This comprehensive guide will take you from the fundamentals to advanced concepts, empowering you to build interactive and responsive websites."
          link="/javascript"
        />
        <Card
          img={react}
          title="React 0 to Advance Level"
          desc="Embark on a complete journey to become a proficient React developer. Our comprehensive guide takes you from the basics of React to advanced concepts, empowering you to build powerful and scalable web applications."
          link="/react"
        />
        <Card
          img={java}
          title="Java With DSA Master"
          desc="Unlock the full potential of Java programming by mastering Data Structures and Algorithms (DSA). This comprehensive guide will take you from the basics to advanced levels, equipping you with the skills needed to tackle complex coding challenges and ace technical interviews."
          link="/java"
        />
        <Card
          img={dsa}
          title="DSA Basic to Advance Level"
          desc="Embark on a journey to master Data Structures and Algorithms (DSA), essential skills for every aspiring coder. This comprehensive guide takes you from foundational concepts to advanced techniques, equipping you with the knowledge to solve complex problems efficiently."
          link="/dsa-full-tutorials"
        />
      </div>
    </div>
  );
};

export default Practice;
