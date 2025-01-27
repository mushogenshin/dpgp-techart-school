import { db } from "../../firebase_config";
import { query, collection, onSnapshot, limit } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useCollection = (collectionName, docsLimit) => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    setDocuments(null);
    setError(null);
    setIsPending(true);

    let ref = docsLimit
      ? query(collection(db, collectionName), limit(docsLimit))
      : collection(db, collectionName);
    const unsub = onSnapshot(
      ref,
      (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setError(null);
        setDocuments(results);
        setIsPending(false);
      },
      (error) => {
        setError(error.message);
        setDocuments(null);
        setIsPending(false);
      }
    );

    // unsubscribe when component unmounts
    return () => unsub();
  }, [collectionName, docsLimit]);

  return { documents, error, isPending };
};
