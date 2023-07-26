import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function FinishLogin() {
  const [verifyError, setVerifyError] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          setVerifyError(null);
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          dispatch({ type: "LOGIN", payload: result.user });

          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null

          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          setVerifyError(error.message);
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
        });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return <div>{verifyError && <p>{verifyError}</p>}</div>;
}
