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

  const grantAccess = async (emails, modules) => {
    // firstly, clear errors for every signup
    setError(null);
    setIsPending(true);

    try {
      // get the user documents for each email address
      const userDocs = await Promise.all(
        emails.map((email) => {
          const userQuery = query(
            collection(db, "users"),
            where("email", "==", email)
          );
          return getDocs(userQuery);
        })
      );

      // update the enrollments for each user document
      const failedEmails = [];
      await Promise.all(
        userDocs.map((docs, index) => {
          const userDoc = docs.docs[0];
          if (userDoc) {
            const enrollments = userDoc.data().enrollments || [];
            const newEnrollments = new Set([...enrollments, ...modules]);
            const newEnrollmentsArray = Array.from(newEnrollments);
            return updateDoc(userDoc.ref, {
              enrollments: newEnrollmentsArray,
            });
          } else {
            failedEmails.push(emails[index]);
            return Promise.resolve();
          }
        })
      );

      if (failedEmails.length > 0) {
        const errorMessage = `😶‍🌫️ Những học viên này chưa đăng nhập hoặc chưa migrate: ${failedEmails.join(
          ", "
        )}`;
        setError(errorMessage);
      } else {
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    }

    setIsPending(false);
  };

  return { error, isPending, grantAccess };
};
