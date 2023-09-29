import { useState } from "react";
import { db } from "../../firebase_config";
import { doc, setDoc } from "firebase/firestore";
import { useCollection } from "../../hooks/firestore/useCollection";

import styles from "./Admin.module.css";

export default function DuplicateContent() {
  const [collapsed, setCollapsed] = useState(true);
  const [newContentId, setNewContentId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // context for the form
  const { documents: allModules } = useCollection("contents");
  const [selectedContentId, setSelectedContentId] = useState(null);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9_]/g, "");
  };

  const duplicateContent = async () => {
    setError(null);
    setSuccess(false);
    setIsPending(true);

    // Get the selected content document
    const selectedContent = allModules.find(
      (content) => content.id === selectedContentId
    );

    // Create a new content document with the same data as the selected content
    // but without the ID
    delete selectedContent.id;
    const newContentData = { ...selectedContent };
    const newContentRef = doc(db, "contents", newContentId);
    await setDoc(newContentRef, newContentData)
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

    if (!selectedContentId) {
      setError("Chọn một content để duplicate");
      setSuccess(false);
      return;
    }

    if (newContentId === "") {
      setError("Nhập một ID cho content mới");
      setSuccess(false);
      return;
    }

    duplicateContent();
  };

  const label = `${collapsed ? "👉" : "👇"} Duplicate Content`;

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
            <label htmlFor="contentId">Content gốc:</label>
            <select
              id="contentId"
              value={selectedContentId}
              onChange={(event) => setSelectedContentId(event.target.value)}
            >
              <option value="">-- Chọn content --</option>
              {allModules &&
                allModules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.id}
                  </option>
                ))}
            </select>

            <label htmlFor="newContentId">New Content ID:</label>
            <input
              type="text"
              id="newContentId"
              placeholder="ABC_123"
              value={newContentId}
              onChange={(event) =>
                setNewContentId(sanitizeInput(event.target.value))
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
