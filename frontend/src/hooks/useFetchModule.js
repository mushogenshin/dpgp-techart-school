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
          const result = { ...doc.data(), id: doc.id };
          result.starts_at = result.starts_at.toDate();
          result.ends_at = result.ends_at.toDate();
          setMod(result);
          setError(null);
          setIsPending(false);
        } else {
          setError("Module not found");
          setIsPending(false);
        }
      },
      (error) => {
        setMod(null);
        setError(error.message);
        setIsPending(false);
      }
    );
    return () => unsub();
  }, [moduleId]);

  return { mod, error, isPending };
};
