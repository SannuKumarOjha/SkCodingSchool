import React from "react";
import CourseCard from "./Course/CourseCard";
import thumbnail from "../Photos/thumbnail.webp";
import mvc from "../Photos/mvc.webp";

const Courses = () => {
  document.title = `Courses - SkCodingSchool`;
  return (
    <>
      <div className="pt-20 h-full w-full bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
        <div className="bgColor absolute top-16 left-8 w-44 h-44 rounded-full bg-[#f72d30] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="bgColor fixed top-1/2 left-1/2 w-44 h-44 rounded-full bg-[#f72d2d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="bgColor fixed top-20 right-8 w-44 h-44 rounded-full bg-[#f7d52d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="our-course">
          <h1 className="text-center mt-6 p-5 text-3xl text-bold">
            Our Courses
          </h1>
          <div className="course-card w-full h-full p-7 flex justify-center items-center">
            <div className="card-box w-full h-full flex items-center justify-around gap-4 flex-wrap">
              <CourseCard
                image={thumbnail}
                title="Spring Data JPA Setup in Spring Boot!"
                desc="Spring Data JPA Setup in Spring Boot! write short description
Spring Data JPA Setup in Spring Boot
Spring Data JPA makes it easy to implement JPA-based repositories in a Spring Boot application. In this tutorial, you'll learn how to set up Spring Data JPA from scratch, including the necessary dependencies, configuration, and entity creation."
                link="https://www.youtube.com/watch?v=cOxaye8Vg_g&list=PLy6zyakL6t9ojtTFZxWTCmoFuIx8WU_Hs"
              />
              <CourseCard
                image={mvc}
                title="Mastering Spring Boot MVC"
                desc="Mastering Spring Boot MVC write short description
Mastering Spring Boot MVC
Unlock the full potential of your Spring Boot applications by mastering Spring Boot MVC. This comprehensive guide will take you through the essential components of Spring Boot's Model-View-Controller architecture, providing a robust foundation for developing dynamic web applications."
                link="https://www.youtube.com/watch?v=cOxaye8Vg_g&list=PLy6zyakL6t9ojtTFZxWTCmoFuIx8WU_Hs"
              />
              <CourseCard
                image={thumbnail}
                title="Spring Data JPA Setup in Spring Boot!"
                desc="Spring Data JPA Setup in Spring Boot! write short description
Spring Data JPA Setup in Spring Boot
Spring Data JPA makes it easy to implement JPA-based repositories in a Spring Boot application. In this tutorial, you'll learn how to set up Spring Data JPA from scratch, including the necessary dependencies, configuration, and entity creation."
                link="https://www.youtube.com/watch?v=cOxaye8Vg_g&list=PLy6zyakL6t9ojtTFZxWTCmoFuIx8WU_Hs"
              />
              <CourseCard
                image={thumbnail}
                title="Tutorial 4"
                desc="Description is here"
                link="https://sannuojha95portfolio.netlify.app/"
              />
              <CourseCard
                image={thumbnail}
                title="Tutorial 5"
                desc="Description is here"
                link="https://sannuojha95portfolio.netlify.app/"
              />
              <CourseCard
                image={thumbnail}
                title="Tutorial 6"
                desc="Description is here"
                link="https://sannuojha95portfolio.netlify.app/"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
