import React, { useState, useRef, useEffect } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./context/userContext";
import darkIcon from "../../Photos/dark.png";
import lightIcon from "../../Photos/light.png";
import "./Navbar.css";

const Navbar = ({ theme, setTheme }) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const toggle_mode = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar fixed top-0 z-50 text-black dark:text-white">
      <div className="logo">
        <Link to="/">SkCodingSchool</Link>
      </div>

      <div className="nav-btns">
        <div className={`res-items${menuOpen ? " showNav" : ""}`}>
          <Link to="/" className="link-tag" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/courses" className="link-tag" onClick={closeMenu}>
            Courses
          </Link>

          <Link to="/practice" className="link-tag" onClick={closeMenu}>
            Practice
          </Link>

          <Link to="/DSA-sheet" className="link-tag" onClick={closeMenu}>
            DSA Sheet
          </Link>

          <Link to="/rgpv-placement" className="link-tag" onClick={closeMenu}>
            RGPV | Placement
          </Link>
        </div>

        {/* User Section */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user.username}`}
                alt="profile"
                className="w-9 h-9 rounded-full border object-cover"
              />
            </div>

            {open && (
              <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-900 border rounded-xl shadow-xl overflow-hidden text-sm">
                <Link
                  to="/profile"
                  onClick={() => {
                    setOpen(false);
                    closeMenu();
                  }}
                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  View Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="link-tag login-link" onClick={closeMenu}>
            Login
          </Link>
        )}

        <div className="dark-light">
          <button
            type="button"
            onClick={toggle_mode}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <img
              src={theme === "light" ? darkIcon : lightIcon}
              alt=""
              className="dark-light-img"
            />
          </button>
        </div>

        {/* Topmate Button */}
        <a
          href="https://topmate.io/sannukumarojha"
          target="_blank"
          rel="noreferrer"
          className="topmate"
        >
          Book 1:1
        </a>
        <button
          type="button"
          className="menu"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <IoCloseSharp /> : <CiMenuFries />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;