import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, elevatedRole } = useAuthContext();

  return (
    <nav className={styles.navbar}>
      <ul>
        <li className={styles.title}>
          <Link to="/">DPGP TechArt</Link>
        </li>
        {elevatedRole && <Link to="/admin">Admin</Link>}
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
