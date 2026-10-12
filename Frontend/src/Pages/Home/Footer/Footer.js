import React from "react";
import logo from "../../../Photos/logo.png"

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <a href="/" className="flex items-center space-x-3 group transition-opacity hover:opacity-90">
            <img
              src={logo}
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              alt="SkCodingSchool Logo"
            />
            <span className="self-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Sk Coding School
            </span>
          </a>
          <nav>
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              <li>
                <a href="/courses" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  Our courses
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/about" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  About me
                </a>
              </li>
              <li>
                <a href="/contact" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 border-t border-gray-100 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024{" "}
            <a href="/" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              SkCodingSchool™
            </a>
            . All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
