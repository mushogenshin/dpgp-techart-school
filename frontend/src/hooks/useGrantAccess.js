import { useState } from "react";
import { db } from "../firebase_config";
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const useGrantAccess = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const grantAccess = async (email, modules) => {
    // firstly, clear errors for every signup
    setError(null);
    setIsPending(true);

    try {
      // get the user document
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const userDocs = await getDocs(userQuery);

      if (userDocs.empty) {
        const errorMessage = `😶‍🌫️ Student with email "${email}" might not have migrated`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      // get the first document in the query result
      const userDoc = userDocs.docs[0];

      // get the current enrollments array from the user document
      const enrollments = userDoc.data().enrollments || [];

      // create a new set with the current enrollments and the new modules
      const newEnrollments = new Set([...enrollments, ...modules]);

      // convert the set back to an array
      const newEnrollmentsArray = Array.from(newEnrollments);

      // update the user document with the new enrollments array
      await updateDoc(userDoc.ref, { enrollments: newEnrollmentsArray });

      setError(null);
    } catch (err) {
      setError(err.message);
    }

    setIsPending(false);
  };

  return { grantAccess, error, isPending };
};
