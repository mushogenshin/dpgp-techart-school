import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { db } from "../firebase_config";
import { doc, runTransaction } from "firebase/firestore";

export const useMigrate = () => {
  const { user, pre_2023_07_history: history } = useAuthContext();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const migrate = async () => {
    setError(null);
    setIsPending(true);

    const userRef = doc(db, "users", user.uid);

    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);

      // If user does not exist, create the user
      if (!userDoc.exists()) {
        const userData = history
          ? {
              email: user.email,
              ...Object.fromEntries(
                Object.entries(history).filter(
                  ([_, value]) => value !== null && value !== ""
                )
              ),
            }
          : {
              email: user.email,
            };
        transaction.set(userRef, userData);
      } else {
        const userData = userDoc.data();
        const enrollments = userData.enrollments || [];
        const mergedEnrollments = history.enrollments
          ? [...enrollments, ...history.enrollments]
          : enrollments;
        const mergedEnrollmentSet = [...new Set(mergedEnrollments)];
        const userUpdate = history
          ? {
              enrollments: mergedEnrollmentSet,
              ...Object.fromEntries(
                Object.entries(history).filter(
                  ([key, value]) =>
                    value !== null && value !== "" && key !== "email"
                )
              ),
            }
          : {
              enrollments: mergedEnrollmentSet,
            };
        transaction.update(userRef, userUpdate);
      }
    })
      .then(() => {
        setError(null);
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
