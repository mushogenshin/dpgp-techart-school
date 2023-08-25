import { db } from "../firebase_config";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useCollectionLength = (collectionName) => {
  const [length, setLength] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = collection(db, collectionName);
    const unsub = onSnapshot(
      ref,
      (querySnapshot) => {
        setLength(querySnapshot.size);
        setError(null);
      },
      (error) => {
        setLength(null);
        setError(error.message);
      }
    );

    // unsubscribe when component unmounts
    return () => unsub();
  }, [collectionName]);

  return { length, error };
};
