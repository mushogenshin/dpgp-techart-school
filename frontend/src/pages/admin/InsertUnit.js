import { useState } from "react";
import { db } from "../../firebase_config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import styles from "./Admin.module.css";

export default function InsertUnit() {
  const [collapsed, setCollapsed] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [moduleId, setModuleId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [unitName, setUnitName] = useState("");
  const [appendUnit, setAppendUnit] = useState(false);
  const [unitIndex, setUnitIndex] = useState(0);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const prepareUnitObject = () => {
    // sanitize input
    const sanitizedModuleId = sanitizeInput(moduleId);
    const sanitizedUnitId = sanitizeInput(unitId);
    const sanitizedUnitName = sanitizeInput(unitName);

    // return if any of the required fields are empty
    if (
      sanitizedModuleId === "" ||
      sanitizedUnitId === "" ||
      sanitizedUnitName === ""
    ) {
      setError("Cần điền đủ thông tin");
      setSuccess(false);
      return;
    }

    // prepare the new unit object
    const newUnit = {
      id: sanitizedUnitId,
      name: sanitizedUnitName,
    };

    // get the current module object
    const docRef = doc(db, "modules", sanitizedModuleId);
    getDoc(docRef)
      .then((docSnap) => {
        const moduleData = docSnap.data();
        const units = moduleData.units || [];

        // determine the index to insert the new unit
        let index = parseInt(unitIndex, 10);
        if (isNaN(index) || index < 0 || index > units.length) {
          index = units.length;
        }
        if (appendUnit) {
          index = units.length;
        }

        // insert the new unit at the specified index
        units.splice(index, 0, newUnit);

        // update the module object with the new unit
        return updateDoc(docRef, {
          units: units,
        });
      })
      .then(() => {
        setSuccess("Đã thêm unit mới");
        setError(null);
        setModuleId("");
        setUnitIndex("");
        setAppendUnit(false);
        setUnitId("");
        setUnitName("");
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
          <form onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="moduleId">Module ID:</label>
            <input
              type="text"
              id="moduleId"
              value={moduleId}
              onChange={(event) => setModuleId(event.target.value)}
            />

            <label htmlFor="unitId">Unit ID:</label>
            <input
              type="text"
              id="unitId"
              value={unitId}
              onChange={(event) => setUnitId(event.target.value)}
            />

            <label htmlFor="unitName">Tên Unit:</label>
            <input
              type="text"
              id="unitName"
              value={unitName}
              onChange={(event) => setUnitName(event.target.value)}
            />

            <label htmlFor="unitIndex">Thứ tự của Unit:</label>
            <input
              type="number"
              id="unitIndex"
              value={unitIndex}
              disabled={appendUnit}
              onChange={(event) => setUnitIndex(event.target.value)}
            />

            <label htmlFor="appendUnit">
              <input
                type="checkbox"
                id="appendUnit"
                checked={appendUnit}
                className={styles.checkbox}
                onChange={(event) => setAppendUnit(event.target.checked)}
              />
              Cuối dãy
            </label>

            <div>
              <button onClick={prepareUnitObject}>Thêm unit</button>
            </div>
          </form>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
        </div>
      )}
    </div>
  );
}
