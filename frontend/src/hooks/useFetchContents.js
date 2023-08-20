import { useState, useEffect } from "react";
import { db } from "../firebase_config";
import { onSnapshot, query, collection, where } from "firebase/firestore";

export function useFetchContents(contentIds, unlocked) {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [contents, setContents] = useState(null);

  useEffect(() => {
    let unsubscribe;
    setError(null);
    setIsPending(true);

    if (contentIds.length > 0 && unlocked) {
      // fetch contents from content IDs
      const contentRef = query(
        collection(db, "contents"),
        where("__name__", "in", contentIds)
      );
      unsubscribe = onSnapshot(
        contentRef,
        (snapshot) => {
          const results = snapshot.docs.map((doc) => {
            const contentData = doc.data();
            return {
              ...contentData,
              id: doc.id,
            };
          });
          setError(null);
          setContents(results);
          setIsPending(false);
        },
        (error) => {
          setError(error.message);
          setContents(null);
          setIsPending(false);
        }
      );
    } else {
      setError(null);
      setContents(null);
      setIsPending(false);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [contentIds, unlocked]);

  return { contents, error, isPending };
}
