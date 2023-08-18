import { useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase_config";

export const useQueryEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const queryEnrollment = (moduleId) => {
    setIsPending(true);
    const usersRef = query(
      collection(db, "users"),
      where("enrollments", "array-contains", moduleId)
    );
    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const newEnrollments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEnrollments(newEnrollments);
        setIsPending(false);
      },
      (error) => {
        setError(error.message);
        setIsPending(false);
      }
    );

    return unsubscribe;
  };

  return { queryEnrollment, error, isPending, enrollments };
};
