
import { Link } from "react-router-dom";

const SidebarLink = (props) => {
  return (
    <div className="links">
      <Link to={props.link} className="mt-[1px] text-[17px] ml-1 px-4 py-2 inline-block w-[340px] cursor-pointer hover:bg-green-500 transition-all ease-in-out duration-150">
        {props.name}
      </Link>
    </div>
  );
};

export default SidebarLink;
