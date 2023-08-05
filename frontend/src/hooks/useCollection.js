import { db } from "../firebase_config";
import { query, collection, onSnapshot, limit } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useCollection = (collectionName, docsLimit) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        console.log(error);
        setError(error.message);
      }
    );

    // unsubscribe when component unmounts
    return () => unsub();
  }, [collectionName]);

  return { documents, error };
};
