import { useState } from "react";

import styles from "./Admin.module.css";

export default function QueryEnrollment() {
  const [collapsed, setCollapsed] = useState(true);
  const label = `${collapsed ? "👉" : "👇"} Tra tham dự`;

  return (
    <div>
      <button
        className={styles.collapsibleHeader}
        onClick={() => setCollapsed(!collapsed)}
      >
        <h2>{label}</h2>
      </button>

      {!collapsed && <h1>QueryEnrollment</h1>}
    </div>
  );
}
