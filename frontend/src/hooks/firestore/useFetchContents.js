import { useState, useEffect } from "react";
import { db } from "../../firebase_config";
import { onSnapshot, query, collection, where } from "firebase/firestore";

export function useFetchContents(contentIds, bypass) {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [contents, setContents] = useState(null);

  console.log("Content IDs:", contentIds);

  useEffect(() => {
    setContents(null);
    setError(null);
    setIsPending(true);
    let unsubscribe;

    if (bypass) {
      return;
    }

    if (contentIds.length > 0) {
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

          // sort the results array based on the order of the contentIds array
          const sortedResults = contentIds.map((id) =>
            results.find((result) => result.id === id)
          );

          setError(null);
          setContents(sortedResults);
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
      setContents([]);
      setIsPending(false);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [contentIds, bypass]);

  return { contents, error, isPending };
}
