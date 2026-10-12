import React, { useEffect, useState } from "react";
import "./Loader.css";

const Loader = ({ onFinish }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => {
        if (prev === 100) {
          clearInterval(id);
          setTimeout(() => {
            localStorage.setItem("visited", "true");
            onFinish(); // parent ko batayenge loader complete
          }, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(id);
  }, [onFinish]);

  return (
    <div className="card flex items-center justify-center w-full h-screen flex-col">
      <div className="loaderCount">
        <p className="text-2xl">
          {count} <span>%</span>
        </p>
      </div>

      <div className="loader">
        <p className="ml-12">Loading</p>
        <div className="words">
          <span className="word">Home</span>
          <span className="word">Courses</span>
          <span className="word">Practice</span>
          <span className="word">DSA Sheet</span>
          <span className="word">Login & SignUp</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;