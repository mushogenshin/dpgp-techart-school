import { useState } from "react";
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
  const [selectedModuleId, setSelectedModuleId] = useState(null);

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
          {/* TODO */}

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>Success!</div>}
        </div>
      )}
    </div>
  );
}
