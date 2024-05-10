import { useState } from "react";
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase_config";

export const useGrantAccess = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [successList, setSuccessList] = useState([]);

  const grantAccess = async (emails, modules, target) => {
    setSuccessList([]);
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
            let newEnrollments;
            if (target) {
              newEnrollments = new Set([...enrollments, ...modules]);
            } else {
              newEnrollments = new Set(
                [...enrollments].filter((mod) => !modules.includes(mod))
              );
            }
            const newEnrollmentsArray = Array.from(newEnrollments);
            return updateDoc(userDoc.ref, {
              enrollments: newEnrollmentsArray,
            }).then(() => {
              setSuccessList((prevList) => [...prevList, emails[index]]);
            });
          } else {
            failedEmails.push(emails[index]);
            return Promise.resolve();
          }
        })
      );

      if (failedEmails.length > 0) {
        const errorMessage = `😶‍🌫️ ${
          failedEmails.length
        } học viên này chưa đăng nhập hoặc chưa migrate: ${failedEmails.join(
          ", "
        )}`;
        setError(errorMessage);
      } else {
        setError(null);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return { grantAccess, error, isPending, successList };
};
