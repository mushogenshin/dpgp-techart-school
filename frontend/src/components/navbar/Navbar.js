import { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { CoursesContext } from "../../context/CoursesContext";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, elevatedRole } = useAuthContext();
  const { usersCount } = useContext(CoursesContext);

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
