import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { useUsersContext } from "../../hooks/auth/useUsersContext";

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
            <label>
              <input
                type="checkbox"
                checked={ignoreLockedModules}
                onChange={handleIgnoreLockedModulesChange}
              />
              Ignore 🔓
            </label>
            {/* Admin panels */}
            <Link to="/admin" title="Admin" className={styles.circle}>
              👽
            </Link>
          </span>
        )}
        <Link to="/about">About</Link>
        <Link to="/courses">Courses</Link>
        {user ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
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
