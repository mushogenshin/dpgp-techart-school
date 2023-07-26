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
          Sign Out
        </button>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>Cảm ơn đã tham gia cùng Dẫu Phải Giải Phẫu : )</div>
    </div>
  );
}
