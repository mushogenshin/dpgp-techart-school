import { db } from "../../firebase_config";
import { query, collection, onSnapshot, limit } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useCollection = (collectionName, docsLimit) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDocuments(null);
    setError(null);

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
        setDocuments(results);
        setError(null);
      },
      (error) => {
        setDocuments(null);
        setError(error.message);
      }
    );

    // unsubscribe when component unmounts
    return () => unsub();
  }, [collectionName, docsLimit]);

  return { documents, error };
};
