import { useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase_config";

export const useQueryEnrolledUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const queryEnrolledUsers = (moduleId) => {
    // firstly, clear errors for every signup
    setError(null);
    setIsPending(true);
    setUsers([]);

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
        setUsers(newEnrollments);
        setError(null);
        setIsPending(false);
      },
      (error) => {
        setError(error.message);
        setIsPending(false);
      }
    );

    return unsubscribe;
  };

  return { queryEnrolledUsers, error, isPending, users };
};
