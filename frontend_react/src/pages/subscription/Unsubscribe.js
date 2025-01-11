import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Unsubscribe.module.css";

const UnsubscribeSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");

  useEffect(() => {
    if (!email) {
      navigate("/courses");
    }
  }, [email]);

  const obscureEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    const obscuredName =
      name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
    return `${obscuredName}@${domain}`;
  };

  return (
    <div>
      <h2 className={styles.info}>Unsubscribe Successful</h2>
      <p className={styles.info}>Từ nay bạn sẽ không nhận email từ DPGP nữa.</p>
      <p className={styles.info}>Email: {obscureEmail(email)}</p>
    </div>
  );
};

export default UnsubscribeSuccess;
