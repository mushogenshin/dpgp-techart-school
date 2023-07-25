import React from "react";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className={styles.dashboard}>
      <p>Account Email: {user.email}</p>
      <div>
        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
      <br />
      <div>Thank You for being a member!</div>
    </div>
  );
}
