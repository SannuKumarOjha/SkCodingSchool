import { useLocation, useNavigate } from "react-router-dom";
import { htmlTopics } from "../../../data/htmlTopics";

const Btns = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = htmlTopics.findIndex(
    (topic) => topic.path === location.pathname
  );

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === htmlTopics.length - 1;

  const handlePrevious = () => {
    if (!isFirst) {
      navigate(htmlTopics[currentIndex - 1].path);
    } else {
      navigate("/practice/html/html-home");
    }
  };

  const handleNext = () => {
    if (!isLast) {
      navigate(htmlTopics[currentIndex + 1].path);
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-0 justify-center sm:justify-between items-center mt-8 px-4 sm:px-10 md:px-16">

      {/* Previous / Home */}
      <button
        onClick={handlePrevious}
        className="w-full sm:w-auto py-2.5 px-6 text-sm font-medium text-gray-900 bg-white rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-blue-700 transition-all duration-200 cursor-pointer"
      >
        {isFirst ? "<< Home" : "<< Previous"}
      </button>

      {/* Next Button */}
      {!isLast && (
        <button
          onClick={handleNext}
          className="w-full sm:w-auto py-2.5 px-6 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200 cursor-pointer"
        >
          Next {">>"}
        </button>
      )}
    </div>
  );
};

export default Btns;