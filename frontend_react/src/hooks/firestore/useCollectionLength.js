import { db } from "../../firebase_config";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useCollectionLength = (collectionName, bypass) => {
  const [length, setLength] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLength(null);
    setError(null);
    let unsub;

    // only listen to collection if bypass is false
    if (!bypass) {
      const ref = collection(db, collectionName);
      unsub = onSnapshot(
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
    }

    return () => unsub && unsub();
  }, [collectionName, bypass]);

  return { length, error };
};
