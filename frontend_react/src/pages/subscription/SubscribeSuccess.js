import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Subscription.module.css";

const SubscribeSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");

  useEffect(() => {
    if (!email) {
      navigate("/courses");
    }
  }, [email, navigate]);

  const obscureEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    const obscuredName =
      name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
    return `${obscuredName}@${domain}`;
  };

  return (
    <div>
      <h2 className={styles.form}>🎉 Subscribed Successfully</h2>
      <p className={styles.form}>Từ nay bạn sẽ nhận newsletter từ DPGP 🙆‍♀️</p>
      <p className={styles.form}>Email: {obscureEmail(email)}</p>
    </div>
  );
};

export default SubscribeSuccess;
