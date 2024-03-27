import { useState } from "react";
import { db } from "../../firebase_config";
import { doc, setDoc } from "firebase/firestore";
import { useCollection } from "../../hooks/firestore/useCollection";

import styles from "./Admin.module.css";

export default function DuplicateClass() {
  const [collapsed, setCollapsed] = useState(true);
  const [newClassId, setNewClassId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // context for the form
  const { documents: allClasses } = useCollection("classes");
  const [selectedClassId, setSelectedClassId] = useState(null);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9_]/g, "");
  };

  const duplicateClass = async () => {
    setError(null);
    setSuccess(false);
    setIsPending(true);

    // Get the selected class document
    const selectedClass = allClasses.find((cls) => cls.id === selectedClassId);

    // Create a new class document with the same data as the selected class
    // but without the ID
    delete selectedClass.id;
    const newClassData = { ...selectedClass };
    const newClassRef = doc(db, "classes", newClassId);
    await setDoc(newClassRef, newClassData)
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

    if (!selectedClassId) {
      setError("Chọn một class để duplicate");
      setSuccess(false);
      return;
    }

    if (newClassId === "") {
      setError("Nhập một ID cho class mới");
      setSuccess(false);
      return;
    }

    duplicateClass();
  };

  const label = `${collapsed ? "🤼‍♀️" : "🤼‍♀️🤼‍♀️🤼‍♀️"} Duplicate Class`;

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
            <label htmlFor="classId">Class gốc:</label>
            <select
              id="classId"
              value={selectedClassId}
              onChange={(event) => setSelectedClassId(event.target.value)}
            >
              <option value="">-- Chọn class --</option>
              {allClasses &&
                allClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.id}
                  </option>
                ))}
            </select>

            <label htmlFor="newClassId">New Class ID:</label>
            <input
              type="text"
              id="newClassId"
              placeholder="ABC_123"
              value={newClassId}
              onChange={(event) =>
                setNewClassId(sanitizeInput(event.target.value))
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
