import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { useUsersContext } from "../../hooks/auth/useUsersContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSkull,
  faUnlock,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { ignoreLockedModules, setIgnoreLockedModules } = useCoursesContext();
  const { user, elevatedRole } = useAuthContext();

  const handleIgnoreLockedModulesChange = (event) => {
    setIgnoreLockedModules(event.target.checked);
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={styles.title}>
          <Link to="/">DPGP TechArt</Link> <UserCount />
        </li>

        {elevatedRole && (
          <span>
            {/* Ignore Locked Modules checkbox */}
            <label title="Bất chấp các Modules bị khóa">
              <input
                type="checkbox"
                checked={ignoreLockedModules}
                onChange={handleIgnoreLockedModulesChange}
              />
              <FontAwesomeIcon icon={faUnlock} />
            </label>
            {/* Admin panels */}
            <Link to="/admin" title="Admin">
              <FontAwesomeIcon icon={faScrewdriverWrench} />
            </Link>
            <span style={{ fontSize: "1.7em" }}>|</span>
          </span>
        )}
        <Link to="/courses">Courses</Link>
        <Link to="/long-ap">
          <span class="material-symbols-outlined">wb_incandescent</span>
        </Link>
        {user ? (
          <>
            <li>
              <Link to="/dashboard" title="Dashboard">
                <FontAwesomeIcon icon={faSkull} />
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" title="Login">
                <span class="material-symbols-outlined">skull</span>
              </Link>
            </li>
          </>
        )}
        <Link to="/about">About</Link>
      </ul>
    </nav>
  );
}

function UserCount() {
  const { usersCount } = useUsersContext();
  return (
    usersCount && (
      <span>
        <span style={{ fontSize: "1.7em" }}>| 📈 </span>
        <span className={styles.circle}>
          <span className={styles["users-count"]} title="Users Count">
            {usersCount}
          </span>
        </span>
      </span>
    )
  );
}
