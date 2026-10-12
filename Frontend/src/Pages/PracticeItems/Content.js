
import htmlB from "../../Photos/html_boilerplate.png";
import Btns from "./HTML/Btns";

const Content = () => {
  return (
    <div className="main-content w-full h-screen overflow-y-auto overflow-x-hidden Content bg-gray-200 text-black dark:bg-gray-950 dark:text-white pb-16">
      <h1 className="text-4xl text-center mt-4">HTML Tutorials</h1>
      <Btns />
      <div className="short-desc w-full h-60 bg-[#ff73001d] mt-8 pt-6">
        <p className="text-center">
          HTML is the standard markup language for Web pages. <br /> <br /> With
          HTML you can create your own Website. <br /> <br />
          HTML is easy to learn - You will enjoy it!
        </p>
        <button
          type="button"
          className="ml-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-6"
        >
          Study our Free HTML Tutorial{">>"}
        </button>
      </div>

      <div className="bottom-desc pt-12">
        <hr />
        <h2 className="text-4xl ml-8 mt-10">
          Easy Learning with HTML "Try it Yourself"
        </h2>
        <p className="text-14px mt-10 ml-10">
          With our "Try it Yourself" editor, you can edit the HTML code and view
          the result:
        </p>
        <div className="box w-[75%] h-[450px] bg-[#3a2b2bc5] rounded-lg mt-10 mx-auto p-2">
          <h2 className="text-3xl text-[#f76A2D]">Example</h2>
          <div className="codeBox w-[600px] bg-slate-800 h-[280px] mt-6 mx-auto">
            <img
              src={htmlB}
              alt="HTML_BoilerPlate"
              className="bg-cover object-cover w-full"
            />
          </div>
          <button
            type="button"
            className="ml-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-6"
          >
            Try it Yourself{" >> "}
          </button>
        </div>
      </div>

      <h3 className="mt-6 ml-20 mb-4 font-bold">
        Click on the <span className="text-[#f76A2Dy]">"Try it Yourself"</span>{" "}
        button to see how it works.
      </h3>
      <hr />
      <div className="content"></div>

      <Btns />
    </div>
  );
};

export default Content;
