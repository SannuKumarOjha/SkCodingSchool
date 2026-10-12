import React from "react";

const Sidebar = (props) => {
  return (
    <>
      <div className="pt-6">
        <ul>
          <h2 className="text-[28px] text-[#f76A2D]">{props.Heading}</h2>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
