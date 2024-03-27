import { useState, useEffect } from "react";
import { db } from "../../firebase_config";
import { doc, setDoc } from "firebase/firestore";
import { useCollection } from "../../hooks/firestore/useCollection";

import styles from "./Admin.module.css";

export default function UnlockUnit() {
  const [collapsed, setCollapsed] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // context for the form
  const { documents: allModules } = useCollection("modules");
  const [moduleIds, setModuleIds] = useState(null);
  const [query, setQuery] = useState("");
  const [filteredModuleIds, setFilteredModuleIds] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  useEffect(() => {
    // this will help us keep the filtered list of module IDs populated
    // at the start, and for subsequent form submissions
    const filtered = query
      ? moduleIds.filter((id) => id.toLowerCase().includes(query))
      : moduleIds;
    setFilteredModuleIds(filtered);
  }, [moduleIds, query]);

  useEffect(() => {
    setModuleIds((allModules && allModules.map((mod) => mod.id)) || []);
  }, [allModules]);

  const unlockUnit = async (unlocked) => {
    setError(null);
    setSuccess(false);
    setIsPending(true);

    // Get the selected module document
    const selectedModule = allModules.find(
      (mod) => mod.id === selectedModuleId
    );

    // TODO

    setIsPending(false);
  };

  const label = `${collapsed ? "👁️" : "👁️👁️👁️"} Unlock Unit`;

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
            {/* List of available modules, with filtering */}
            <label htmlFor="contentId">Module ID:</label>
            <div>
              🔍{" "}
              <input
                type="text"
                value={query}
                placeholder="Filter module IDs"
                onChange={(event) => {
                  setQuery(event.target.value.toLowerCase());
                }}
              />
            </div>

            {selectedModuleId && (
              <span className={styles.preview}>
                Đang chọn 👉: "{selectedModuleId}"
              </span>
            )}

            {/* filtered results */}
            <div className={styles["list-container"]}>
              <ul className={styles.comboList}>
                {filteredModuleIds.map((id) => (
                  <li
                    key={id}
                    onClick={() => setSelectedModuleId(id)}
                    className={selectedModuleId === id ? styles.selected : ""}
                  >
                    {id}
                  </li>
                ))}
              </ul>
            </div>

            {/* TODO */}
          </form>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>Success!</div>}
        </div>
      )}
    </div>
  );
}
