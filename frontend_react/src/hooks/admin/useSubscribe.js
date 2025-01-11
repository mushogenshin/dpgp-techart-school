import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase_config";
import { useAuthContext } from "../auth/useAuthContext";

const useSubscribe = () => {
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
  }, [user]);

  return { isUnsubscribed, error, isPending };
};

export default useSubscribe;
