import { useState, useEffect } from "react";
import { db } from "../../firebase_config";
import { doc, updateDoc } from "firebase/firestore";
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
  const [selectedModule, setSelectedModule] = useState(null);

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

  const unlockUnit = async (unit) => {
    setError(null);
    setSuccess(false);
    setIsPending(true);

    // console.log("Unlocking unit with ID:", unit.id);

    try {
      // Update the database with the new value of unit.unlocked
      const newUnlockedValue = !unit.unlocked;
      const moduleRef = doc(db, "modules", selectedModuleId);
      const updatedUnits = selectedModule.units.map((u) =>
        u.id === unit.id ? { ...u, unlocked: newUnlockedValue } : u
      );
      await updateDoc(moduleRef, { units: updatedUnits });

      // Update the selectedModule state
      setSelectedModule((prevModule) => ({
        ...prevModule,
        units: updatedUnits,
      }));

      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPending(false);
    }
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
                    onClick={() => {
                      setSelectedModuleId(id);
                      const modData = allModules.find((mod) => mod.id === id);
                      setSelectedModule(modData);
                    }}
                    className={selectedModuleId === id ? styles.selected : ""}
                  >
                    {id}
                  </li>
                ))}
              </ul>
            </div>

            <label htmlFor="units">Units:</label>
            <UnitsList
              units={(selectedModule && selectedModule.units) || []}
              unlockUnit={unlockUnit}
            />
          </form>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>Success!</div>}
        </div>
      )}
    </div>
  );
}

function UnitsList({ units, unlockUnit }) {
  return (
    <ul>
      {units.map((unit, index) => (
        <label key={index}>
          {unit.name} {unit.unlocked ? "-- 👀 --" : "-- 🔒 --"}
          <input
            type="checkbox"
            checked={unit.unlocked}
            onChange={() => unlockUnit(unit)}
          />
        </label>
      ))}
    </ul>
  );
}
