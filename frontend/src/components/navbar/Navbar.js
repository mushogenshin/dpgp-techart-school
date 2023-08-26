import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCoursesContext } from "../../hooks/useCoursesContext";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, elevatedRole } = useAuthContext();
  const { usersCount } = useCoursesContext();

  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={styles.title}>
          <Link to="/">DPGP TechArt</Link>{" "}
          {elevatedRole && (
            <span className={styles.circle}>
              <span className={styles["users-count"]} title="Users Count">
                {usersCount}
              </span>
            </span>
          )}
        </li>
        {elevatedRole && (
          <Link to="/admin" title="Admin" className={styles.circle}>
            👽
          </Link>
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
