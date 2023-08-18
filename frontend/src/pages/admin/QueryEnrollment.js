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
    console.log("Enrollments", enrollments);
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
          <label htmlFor="moduleId">Module:</label>
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
        </form>
      )}
    </div>
  );
}
