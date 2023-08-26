import { useState } from "react";
import { useQueryEnrolledStudents } from "../../hooks/useQueryEnrollment";

import styles from "./Admin.module.css";

export default function QueryEnrollment() {
  const [collapsed, setCollapsed] = useState(true);
  const [censored, setCensored] = useState(true);
  const [moduleId, setModuleId] = useState("");
  const { queryEnrolledUsers, error, isPending, students } =
    useQueryEnrolledStudents();

  const handleModuleIdInput = (event) => {
    const sanitizedModuleId = event.target.value
      .replace(/[^\w\s-]/gi, "") // sanitize for special characters
      .replace(/[^\x00-\x7F]/g, "") // remove non-ASCII characters
      .trim();
    setModuleId(sanitizedModuleId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (moduleId === "") {
      return;
    }
    queryEnrolledUsers(moduleId);
  };

  const censorEmail = (email) => {
    const username = email.slice(0, 8);
    const domain = email.slice(-3);
    const censoredUsername = username + "**...";
    return `${censoredUsername}${domain}`;
  };
  const label = `${collapsed ? "👉" : "👇"} Tra tham dự`;

  return (
    <div>
      <button
        className={styles.collapsibleHeader}
        onClick={() => setCollapsed(!collapsed)}
      >
        {label}
      </button>

      {!collapsed && (
        <div className={collapsed ? "" : styles.section}>
          <form>
            <label htmlFor="moduleId">Theo module:</label>
            <input
              type="text"
              id="moduleId"
              name="moduleId"
              value={moduleId}
              onChange={handleModuleIdInput}
            />

            <label>
              <input
                type="checkbox"
                checked={censored}
                className={styles.checkbox}
                onChange={() => setCensored(!censored)}
              />
              Censor Emails
            </label>

            <button
              type="submit"
              className="btn"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Querying..." : "Tra"}
            </button>
          </form>

          {error && <div className={styles.error}>{error}</div>}

          {students.length > 0 && (
            <div className={styles.success}>
              <hr></hr>
              <h3>{`Danh sách tham dự (tổng cộng ${students.length}):`}</h3>
              <ul>
                {students.map((student) => (
                  <li key={student.id}>
                    {censored ? censorEmail(student.email) : student.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
