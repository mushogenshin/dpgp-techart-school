import { useState } from "react";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

const url =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://school.dauphaigiaiphau.wtf";

const actionCodeSettings = {
  url: `${url}/finishLogin`,
  handleCodeInApp: true,
  iOS: {
    bundleId: "com.dauphaigiaiphau.ios",
  },
  android: {
    packageName: "com.dauphaigiaiphau.android",
    installApp: true,
    minimumVersion: "12",
  },
  dynamicLinkDomain: "dpgp.page.link",
};

export const useEmailLinkLogin = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const sendSignInLink = async (email) => {
    // firstly, clear errors for every send attempt
    setError(null);
    setLinkSent(false);
    setIsPending(true);

    const auth = getAuth();
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        setIsPending(false);
        setLinkSent(true);
        window.localStorage.setItem("emailForSignIn", email);
      })
      .catch((err) => {
        setError(err.message);
        setIsPending(false);
      });
  };

  return { sendSignInLink, error, isPending, linkSent };
};
