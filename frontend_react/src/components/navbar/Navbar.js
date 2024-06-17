import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull, faUnlock, faBook } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { ignoreLockedModules, setIgnoreLockedModules } = useCoursesContext();
  const { user, elevatedRole } = useAuthContext();

  const handleIgnoreLockedModulesChange = (event) => {
    setIgnoreLockedModules(event.target.checked);
  };

  const [isActive, setActive] = useState(false);
  const toggleClass = () => {
    setActive(!isActive);
  };

  return (
    <nav className={styles.navbar}>
      {/* Nav bar icon for mobile */}
      <div id="mob_header" className="tab">
        <span onClick={toggleClass} className="mob_nav_open_btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            width="40"
            viewBox="0 0 512 512"
          >
            <path d="M432 176H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 272H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16zM432 368H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16z" />
          </svg>
        </span>
      </div>
      {/* Nav bar icon for mobile */}
      <div className={isActive ? "nav_wrapper open" : "nav_wrapper"}>
        <div id="mob_nav_close" className="tab">
          <span onClick={toggleClass} className="mob_nav_close_btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width="40"
              viewBox="0 0 512 512"
            >
              <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z" />
            </svg>
          </span>
        </div>

        <ul>
          {/* Left aligned */}
          <li className={styles.title}>
            {/* Home page */}
            <Link onClick={toggleClass} to="/">
              DPGP TechArt
            </Link>{" "}
            {/* About */}
            <Link onClick={toggleClass} to="/about">
              About
            </Link>
            {/* Instructors */}
            <Link onClick={toggleClass} to="/instructors">
              Instructors
            </Link>
            {/* <Link onClick={toggleClass} to="/long-ap">
              <span className="material-symbols-outlined">wb_incandescent</span>
            </Link> */}
            {/* <Link onClick={toggleClass} to="/wiki">
              <FontAwesomeIcon icon={faBook} /> Wiki
            </Link> */}
          </li>
          {elevatedRole && (
            <span>
              {/* Admin panels */}
              <Link onClick={toggleClass} to="/admin">
                Admin
              </Link>

              {/* Ignore Locked Modules checkbox */}
              <label title="Bất chấp các Modules bị khóa">
                <input
                  type="checkbox"
                  checked={ignoreLockedModules}
                  onChange={handleIgnoreLockedModulesChange}
                />
                <FontAwesomeIcon
                  icon={faUnlock}
                  className={styles["admin-link"]}
                />
              </label>
            </span>
          )}

          {/* Right aligned */}
          <Link onClick={toggleClass} to="/courses">
            Courses
          </Link>
          {user ? (
            <>
              <li>
                <Link onClick={toggleClass} to="/dashboard" title="Dashboard">
                  <FontAwesomeIcon icon={faSkull} />
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link onClick={toggleClass} to="/login" title="Login">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "1em" }}
                  >
                    skull
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
