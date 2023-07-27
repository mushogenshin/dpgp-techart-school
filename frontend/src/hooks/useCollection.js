import { db } from "../firebase_config";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useCollection = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q = collection(db, collectionName);
    const unsub = onSnapshot(
      q,
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
