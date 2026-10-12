import React from "react";

const MainContent = (props) => {
  return (
    <div className="pt-2">
      <h1 className="text-4xl text-center text-[#f76a2d] uppercase py-6">
        {props.sem}
      </h1>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Subject Name
              </th>
              <th scope="col" className="px-6 py-3">
                Notes
              </th>
              <th scope="col" className="px-6 py-3">
                Shivani
              </th>
              <th scope="col" className="px-6 py-3">
                YouTube
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {props.sname1}
              </th>
              <td className="px-6 py-4">
                <a
                  href={props.notes1}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.shivani1}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.youtube1}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Watch Now
                </a>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {props.sname2}
              </th>
              <td className="px-6 py-4">
                <a
                  href={props.notes2}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.shivani2}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.youtube2}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Watch Now
                </a>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {props.sname3}
              </th>
              <td className="px-6 py-4">
                <a
                  href={props.notes3}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.shivani3}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.youtube3}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Watch Now
                </a>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {props.sname4}
              </th>
              <td className="px-6 py-4">
                <a
                  href={props.notes4}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.shivani4}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.youtube4}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Watch Now
                </a>
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {props.sname5}
              </th>
              <td className="px-6 py-4">
                <a
                  href={props.notes5}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.shivani5}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <a
                  href={props.youtube5}
                  download
                  className="underline hover:text-[#f76a2d]"
                >
                  Watch Now
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainContent;
