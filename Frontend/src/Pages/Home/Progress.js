"use client";
import React from "react";

import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";

const Progress = () => {
  return (
    <div className="py-10 px-10 relative bg-white dark:bg-gray-800">
      <div className="bgColor absolute top-16 left-8 w-44 h-44 rounded-full bg-[#f72d30] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <div className="bgColor absolute top-1/2 left-1/2 w-44 h-44 rounded-full bg-[#f72d2d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <div className="bgColor absolute top-20 right-8 w-44 h-44 rounded-full bg-[#f7d52d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
      <Timeline>
        <Timeline.Item>
          <Timeline.Point />
          <Timeline.Content>
            <Timeline.Time>February 2024</Timeline.Time>
            <Timeline.Title className="mb-4">
              Week 1-2: Planning and Research
            </Timeline.Title>
            <Timeline.Body>
              <b>Define Purpose and Goals:</b> Clearly outline the objectives of
              your website.
            </Timeline.Body>
            <Timeline.Body>
              <b>Research:</b> Study your target audience and competitors.
            </Timeline.Body>
            <Timeline.Body>
              <b>Content Planning:</b> Plan out the main pages and the content
              you’ll need.
            </Timeline.Body>
            <Timeline.Body>
              <b>Feature List:</b> Decide on the essential features and
              functionalities.
            </Timeline.Body>
            <Button color="gray">
              Learn More
              <HiArrowNarrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point />
          <Timeline.Content>
            <Timeline.Time>March 2024</Timeline.Time>
            <Timeline.Title className="mb-4">Week 3-4: Design</Timeline.Title>
            <Timeline.Body>
              <b>Wireframes and Mockups:</b> Create basic wireframes and
              high-fidelity mockups.
            </Timeline.Body>
            <Timeline.Body>
              <b>Branding:</b> Choose colors, fonts, and other design elements
              that match your brand.
            </Timeline.Body>
            <Timeline.Body>
              <b>User Experience (UX):</b> Ensure the design is user-friendly
              and intuitive.
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point />
          <Timeline.Content>
            <Timeline.Time>April 2024</Timeline.Time>
            <Timeline.Title className="mb-4">
              Week 5-6: Development
            </Timeline.Title>
            <Timeline.Body>
              <b>Setup Development Environment:</b> Choose the right tools and
              technologies (HTML, CSS, JavaScript, CMS).
            </Timeline.Body>
            <Timeline.Body>
              <b>Front-End Development:</b> Develop the user interface and
              interactive elements.
            </Timeline.Body>
            <Timeline.Body>
              <b>Back-End Development:</b> Set up the server, database, and any
              back-end logic.
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline>
    </div>
  );
};

export default Progress;
