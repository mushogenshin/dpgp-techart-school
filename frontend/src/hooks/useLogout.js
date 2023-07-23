import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { signOut, getAuth } from "firebase/auth";

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    // firstly, clear errors for every logout
    setError(null);
    setIsPending(true);
    const auth = getAuth();

    // sign the user out
    try {
      await signOut(auth);

      // dispatch logout action
      dispatch({ type: "LOGOUT" });

      // update the state
      setIsPending(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  };

  return { logout, error, isPending };
};
