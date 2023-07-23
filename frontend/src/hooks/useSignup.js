import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    // firstly, clear errors for every signup
    setError(null);
    setIsPending(true);
    const auth = getAuth();

    try {
      // signup the user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error("Could not complete the signup");
      }

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      setIsPending(false);
      setError(null);
    } catch (err) {
      console.log(err);
      // handle errors
      setError(err.message);
      setIsPending(false);
    }
  };

  return { signup, error, isPending };
};
