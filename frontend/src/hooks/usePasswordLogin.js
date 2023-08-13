import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const usePasswordLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    // firstly, clear errors for every login
    setError(null);
    setIsPending(true);

    try {
      // log the user in using email and password
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);

      // dispatch login action
      dispatch({ type: "LOGIN", payload: result.user });

      // update the state
      setError(null);
      setIsPending(false);
    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  };

  return { login, error, isPending };
};
