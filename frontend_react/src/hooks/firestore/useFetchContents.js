import { useState, useEffect } from "react";
import { db } from "../../firebase_config";
import { onSnapshot, query, collection, where } from "firebase/firestore";

/**
 * Fetches contents from Firestore based on an array of content IDs.
 * @param {Array<string>} contentIds: an array of content IDs to fetch
 * @param {boolean} bypass: if true, bypass fetching contents
 * @param {boolean} onlyTeasers: if true, modify the fetched contents to show only teasers
 * @returns {Object} an object containing the fetched contents, error, and pending status
 */
export function useFetchContents(contentIds, bypass, onlyTeasers = false) {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [contents, setContents] = useState(null);

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
          // NOTE: `onSnapshot` is async, therefore there is a chance that the
          // contentData objects may be returned in a different order
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
