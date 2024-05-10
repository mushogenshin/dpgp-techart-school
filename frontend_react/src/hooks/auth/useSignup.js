import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
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
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { signup, error, isPending };
};
