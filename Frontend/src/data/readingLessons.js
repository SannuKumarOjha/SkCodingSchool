import { htmlTopics } from "./htmlTopics";

export const readingLessons = [
  ...htmlTopics.map((topic) => ({
    id: topic.path.split("/").pop(),
    name: topic.name,
    path: topic.path,
    category: "HTML",
  })),
  {
    id: "css-full-course",
    name: "CSS Full Course",
    path: "/practice/css-full-course",
    category: "CSS",
  },
];

export const getReadingLesson = (pathname) =>
  readingLessons.find((lesson) => lesson.path === pathname);
