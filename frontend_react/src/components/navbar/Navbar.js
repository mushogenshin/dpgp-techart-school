import { Link } from "react-router-dom";
import { isEmulator } from "../../firebase_config";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkull, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { ignoreLockedModules, setIgnoreLockedModules } = useCoursesContext();
  const { user, elevatedRole } = useAuthContext();

  const handleIgnoreLockedModulesChange = (event) => {
    setIgnoreLockedModules(event.target.checked);
  };

  const [navCollapsed, setNavCollapsed] = useState(true);
  const toggleNavCollapseState = () => {
    setNavCollapsed(!navCollapsed);
  };

  return (
    <nav className={styles.navbar}>
      {/* Nav bar icon for mobile */}
      <div id="mob_header" className="tab">
        <span onClick={toggleNavCollapseState} className="mob_nav_open_btn">
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
      <div className={navCollapsed ? "nav_wrapper" : "nav_wrapper open"}>
        <div id="mob_nav_close" className="tab">
          <span onClick={toggleNavCollapseState} className="mob_nav_close_btn">
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
          {isEmulator && <div className={styles.emulator}>Emulator Mode</div>}
          {/* Left aligned */}
          <li className={styles.title}>
            {/* Home page */}
            <Link onClick={toggleNavCollapseState} to="/">
              DPGP TechArt
            </Link>{" "}
            {/* About */}
            <Link onClick={toggleNavCollapseState} to="/about">
              About
            </Link>
            {/* Instructors */}
            <Link onClick={toggleNavCollapseState} to="/instructors">
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
              <Link onClick={toggleNavCollapseState} to="/admin">
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
          <Link
            onClick={toggleNavCollapseState}
            style={{ fontSize: "1em" }}
            to="/courses"
          >
            Courses
          </Link>
          <Link
            onClick={toggleNavCollapseState}
            style={{ fontSize: "1em" }}
            to="/buy"
          >
            Self-taught
          </Link>
          {user ? (
            <>
              <li>
                <Link
                  onClick={toggleNavCollapseState}
                  to="/dashboard"
                  title="Dashboard"
                >
                  <FontAwesomeIcon icon={faSkull} />
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  onClick={toggleNavCollapseState}
                  to="/login"
                  title="Login"
                >
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
