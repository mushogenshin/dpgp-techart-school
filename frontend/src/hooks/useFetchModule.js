import { useState, useEffect } from "react";
import { db } from "../firebase_config";
import { doc, onSnapshot } from "firebase/firestore";

export const useFetchModule = (moduleId) => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [mod, setMod] = useState(null);

  useEffect(() => {
    // firstly, clear errors for every fetch
    setError(null);
    setIsPending(true);

    const moduleRef = doc(db, "modules", moduleId);
    const unsub = onSnapshot(
      moduleRef,
      (doc) => {
        if (doc.exists()) {
          const mod = { ...doc.data(), id: doc.id };
          mod.starts_at = mod.starts_at.toDate();
          mod.ends_at = mod.ends_at.toDate();
          setMod(mod);
          setError(null);
          setIsPending(false);
        } else {
          setError("Module not found");
          setIsPending(false);
        }
      },
      (error) => {
        setError(error.message);
        setIsPending(false);
      }
    );
    return () => unsub();
  }, [moduleId]);

  return { mod, error, isPending };
};
