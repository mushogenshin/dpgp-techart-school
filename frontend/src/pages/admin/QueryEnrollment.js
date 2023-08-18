import { useState } from "react";
import { useQueryEnrollment } from "../../hooks/useQueryEnrollment";

import styles from "./Admin.module.css";

export default function QueryEnrollment() {
  const [collapsed, setCollapsed] = useState(true);
  const [moduleId, setModuleId] = useState("");
  const { queryEnrollment, error, isPending, enrollments } =
    useQueryEnrollment();

  const handleModuleIdInput = (event) => {
    const sanitizedModuleId = event.target.value
      .replace(/[^\w\s-]/gi, "") // sanitize for special characters
      .replace(/[^\x00-\x7F]/g, "") // remove non-ASCII characters
      .trim();
    setModuleId(sanitizedModuleId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    queryEnrollment(moduleId);
  };

  const label = `${collapsed ? "👉" : "👇"} Tra tham dự`;

  return (
    <div>
      <button
        className={styles.collapsibleHeader}
        onClick={() => setCollapsed(!collapsed)}
      >
        <h2>{label}</h2>
      </button>

      {!collapsed && (
        <form className={collapsed ? "" : styles.section}>
          <label htmlFor="moduleId">Theo module:</label>
          <input
            type="text"
            id="moduleId"
            name="moduleId"
            value={moduleId}
            onChange={handleModuleIdInput}
          />

          <button
            type="submit"
            className="btn"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Querying..." : "Tra"}
          </button>

          {error && <div className={styles.error}>{error}</div>}

          {enrollments.length > 0 && (
            <div className={styles.success}>
              <hr></hr>
              <h3>Danh sách tham dự:</h3>
              <ul>
                {enrollments.map((user) => (
                  <li key={user.id}>{user.email}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
