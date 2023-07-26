import React from "react";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className={styles.dashboard}>
      <h3>Signed In</h3>
      <p>Account Email: {user.email}</p>
      <div>
        <button className="btn" onClick={logout}>
          Sign Out
        </button>
      </div>
      <br />
      <div>Cảm ơn đã tham gia cùng Dẫu Phải Giải Phẫu : )</div>
    </div>
  );
}
