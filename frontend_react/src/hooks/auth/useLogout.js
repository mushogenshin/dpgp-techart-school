import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { signOut, getAuth } from "firebase/auth";

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      // sign the user out
      const auth = getAuth();
      await signOut(auth);

      // dispatch logout action
      dispatch({ type: "LOGOUT" });

      // update the state
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { logout, error, isPending };
};
