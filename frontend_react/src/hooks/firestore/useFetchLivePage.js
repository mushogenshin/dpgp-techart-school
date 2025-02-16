import { useState, useEffect } from "react";
import { db } from "../../firebase_config";
import { doc, onSnapshot } from "firebase/firestore";

export const useFetchLivePage = (path, pageId) => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    setPageData(null);
    setError(null);
    setIsPending(true);

    const moduleRef = doc(db, path, pageId);
    const unsub = onSnapshot(
      moduleRef,
      (doc) => {
        if (doc.exists()) {
          const mod = { ...doc.data(), id: doc.id };
          setPageData(mod);
          setError(null);
          setIsPending(false);
        } else {
          setError("Page not found");
          setIsPending(false);
        }
      },
      (error) => {
        setPageData(null);
        setError(error.message);
        setIsPending(false);
      }
    );
    return () => unsub();
  }, [pageId]);

  return { pageData, error, isPending };
};
