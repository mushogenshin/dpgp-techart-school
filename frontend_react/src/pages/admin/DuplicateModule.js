import { useState } from "react";
import { db } from "../../firebase_config";
import { doc, setDoc } from "firebase/firestore";
import { useCollection } from "../../hooks/firestore/useCollection";

import styles from "./Admin.module.css";

export default function DuplicateModule() {
  const [collapsed, setCollapsed] = useState(true);
  const [newModuleId, setNewModuleId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // context for the form
  const { documents: allModules } = useCollection("modules");
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9_]/g, "");
  };

  const duplicateModule = async () => {
    setError(null);
    setSuccess(false);
    setIsPending(true);

    // Get the selected module document
    const selectedModule = allModules.find(
      (mod) => mod.id === selectedModuleId
    );

    // Create a new module document with the same data as the selected module
    // but without the ID
    delete selectedModule.id;
    const newModuleData = { ...selectedModule };
    const newModuleRef = doc(db, "modules", newModuleId);
    await setDoc(newModuleRef, newModuleData)
      .then((docRef) => {
        setError(null);
        setSuccess(true);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess(false);
      })
      .finally(() => {
        setIsPending(false);
      });

    setIsPending(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedModuleId) {
      setError("Chọn một module để duplicate");
      setSuccess(false);
      return;
    }

    if (newModuleId === "") {
      setError("Nhập một ID cho module mới");
      setSuccess(false);
      return;
    }

    duplicateModule();
  };

  const label = `${collapsed ? "🎯" : "🎯🎯🎯"} Duplicate Module`;

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
            <label htmlFor="moduleId">Module gốc:</label>
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

            <label htmlFor="newModuleId">New Module ID:</label>
            <input
              type="text"
              id="newModuleId"
              placeholder="ABC_123"
              value={newModuleId}
              onChange={(event) =>
                setNewModuleId(sanitizeInput(event.target.value))
              }
            />

            <button
              type="submit"
              className="btn"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Duplicating..." : "Duplicate"}
            </button>
          </form>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>Success!</div>}
        </div>
      )}
    </div>
  );
}
