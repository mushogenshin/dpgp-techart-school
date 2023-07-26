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

    try {
      // signup the user
      const auth = getAuth();
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!result) {
        throw new Error("Could not complete the signup");
      }

      // dispatch login action
      dispatch({ type: "LOGIN", payload: result.user });

      // update the state
      setIsPending(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  };

  return { signup, error, isPending };
};
