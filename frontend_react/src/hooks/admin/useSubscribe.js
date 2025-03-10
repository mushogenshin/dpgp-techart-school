import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, FieldValue } from "firebase/firestore";
import { db } from "../../firebase_config";
import { useAuthContext } from "../auth/useAuthContext";

/**
 * Hook to manage newsletter subscription status for logged in user
 */
const useSubscribe = (source) => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(null);

  useEffect(() => {
    const checkSubscription = async () => {
      setError(null);
      setIsPending(true);

      try {
        if (user) {
          const optRef = doc(db, "subscriptions", user.email);
          const opt = await getDoc(optRef);

          if (opt.exists()) {
            const data = opt.data();
            // logged in user is subscribed by default unless opted out
            setIsUnsubscribed(data.opted_out);
          } else {
            setIsUnsubscribed(false);
          }
        } else {
          setIsUnsubscribed(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsPending(false);
      }
    };

    checkSubscription();
  }, [user, setIsUnsubscribed]);

  const subscribe = async () => {
    setError(null);
    setIsPending(true);

    try {
      if (user) {
        const optRef = doc(db, "subscriptions", user.email);
        await updateDoc(optRef, {
          opted_out: false,
          log: FieldValue.arrayUnion({
            action: "subscribe",
            at: new Date(),
            source: source,
          }),
        });
        setIsUnsubscribed(false);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  const unsubscribe = async () => {
    setError(null);
    setIsPending(true);

    try {
      if (user) {
        const optRef = doc(db, "subscriptions", user.email);
        await updateDoc(optRef, {
          opted_out: true,
          log: FieldValue.arrayUnion({
            action: "unsubscribe",
            at: new Date(),
            source: source,
          }),
        });
        setIsUnsubscribed(true);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsPending(false);
    }
  };

  return { isUnsubscribed, error, isPending, subscribe, unsubscribe };
};

export default useSubscribe;
