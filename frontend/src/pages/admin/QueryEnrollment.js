import { useState } from "react";
import { useCollection } from "../../hooks/firestore/useCollection";
import { useQueryEnrolledStudents } from "../../hooks/admin/useQueryEnrollment";

import styles from "./Admin.module.css";

export default function QueryEnrollment() {
  const [collapsed, setCollapsed] = useState(true);
  const [censored, setCensored] = useState(true);

  const { documents: allModules } = useCollection("modules");

  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const { queryEnrolledUsers, error, isPending, students } =
    useQueryEnrolledStudents();

  const handleSubmit = (event) => {
    event.preventDefault();
    selectedModuleId && queryEnrolledUsers(selectedModuleId);
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
            <select
              id="moduleId"
              value={selectedModuleId}
              onChange={(event) => setSelectedModuleId(event.target.value)}
            >
              <option value="">-- Chọn module --</option>
              {allModules &&
                allModules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.id}
                  </option>
                ))}
            </select>

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

              <label>
                <input
                  type="checkbox"
                  checked={censored}
                  className={styles.checkbox}
                  onChange={() => setCensored(!censored)}
                />
                Censor Emails
              </label>

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
