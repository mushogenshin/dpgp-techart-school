import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    // firstly, clear errors for every login
    setError(null);
    setIsPending(true);
    const auth = getAuth();

    // log the user in
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      // update the state
      setIsPending(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  };

  return { login, error, isPending };
};
