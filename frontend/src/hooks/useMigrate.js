import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { db } from "../firebase_config";
import { doc, runTransaction } from "firebase/firestore";

export const useMigrate = () => {
  const { user, history } = useAuthContext();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const migrate = async () => {
    // firstly, clear errors for every migration
    setError(null);
    setIsPending(true);

    const userRef = doc(db, "users", user.uid);

    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);

      // If user does not exist, create the user
      if (!userDoc.exists()) {
        const userData = {
          email: user.email,
          enrollments: history ? history : [],
        };
        transaction.set(userRef, userData);
      }
    })
      .then(() => {
        setIsPending(false);
        setSucceeded(true);
      })
      .catch((err) => {
        setError(err.message);
        setIsPending(false);
      });
  };
  return { migrate, error, isPending, succeeded };
};
