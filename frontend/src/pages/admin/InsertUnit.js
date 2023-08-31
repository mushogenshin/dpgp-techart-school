import { useState } from "react";
import { db } from "../../firebase_config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCollection } from "../../hooks/firestore/useCollection";

import styles from "./Admin.module.css";

export default function InsertUnit() {
  const [collapsed, setCollapsed] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { documents: allModules } = useCollection("modules");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [unitId, setUnitId] = useState("");
  const [unitName, setUnitName] = useState("");
  const [appendUnit, setAppendUnit] = useState(true);
  const [unitIndex, setUnitIndex] = useState(0);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const insertUnitAtIndex = async (insertion) => {
    const docRef = doc(db, "modules", selectedModuleId);

    // Get the current unit array
    const docSnap = await getDoc(docRef);
    const units = docSnap.data().units || [];

    // function to insert the new element at the specified index
    const inserted = () => {
      const pre = units.slice(0, unitIndex);
      const post = units.slice(unitIndex);
      return [...pre, insertion, ...post];
    };

    const updated = appendUnit ? [...units, insertion] : inserted();

    // Update with the modified array
    await updateDoc(docRef, {
      units: updated,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // return if any of the required fields are empty
    if (!selectedModuleId || unitId === "" || unitName === "") {
      setError("Cần điền đủ thông tin");
      setSuccess(false);
      return;
    }

    setError(null);
    setSuccess(false);

    // prepare the new Unit object
    const newUnit = {
      id: unitId,
      name: unitName,
      contents: [],
      unlocked: false,
    };

    insertUnitAtIndex(newUnit)
      .then(() => {
        setError(null);
        setSuccess(true);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess(false);
      });
  };
  const label = `${collapsed ? "👉" : "👇"} Chèn Unit rỗng`;

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
          <form onSubmit={handleSubmit}>
            <label htmlFor="moduleId">Parent Module ID:</label>
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

            <label htmlFor="unitId">New Unit ID:</label>
            <input
              type="text"
              id="unitId"
              placeholder="vd: week1 (ảnh hưởng URL)"
              value={unitId}
              onChange={(event) => setUnitId(sanitizeInput(event.target.value))}
            />

            <label htmlFor="unitName">New Unit name:</label>
            <input
              type="text"
              id="unitName"
              placeholder="vd: Week 3 (sẽ là tên của Unit button)"
              value={unitName}
              onChange={(event) => setUnitName(event.target.value)}
            />

            <div>
              <input
                type="checkbox"
                id="appendUnit"
                checked={appendUnit}
                className={styles.checkbox}
                onChange={(event) => setAppendUnit(event.target.checked)}
              />
              <label htmlFor="appendUnit" className={styles.checkboxLabel}>
                Append
              </label>
            </div>

            <label htmlFor="unitIndex">New Unit index:</label>
            <input
              type="number"
              id="unitIndex"
              value={unitIndex}
              disabled={appendUnit}
              onChange={(event) => setUnitIndex(event.target.value)}
            />

            <div>
              <button type="submit" className="btn" onClick={handleSubmit}>
                Chèn unit
              </button>
            </div>
          </form>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>Success!</div>}
        </div>
      )}
    </div>
  );
}
