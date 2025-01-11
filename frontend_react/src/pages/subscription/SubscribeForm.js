import { useState } from "react";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

import styles from "./Subscription.module.css";

/**
 * Form for subscribing to email updates for non-logged in users
 */
export default function SubscribeForm() {
  const { user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const isPending = false; // TODO

  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setIsEmailValid(
      emailValue.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Email submitted:", email);
  };

  if (user) {
    return null;
  }

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit} className={styles.inlineForm}>
        <label htmlFor="email" className={styles.inlineLabel}>
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
          placeholder="Nhập email"
          className={styles.inlineInput}
        />
        <button
          type="submit"
          className={`btn ${styles.inlineButton}`}
          disabled={isPending || !isEmailValid}
        >
          {isPending ? "Đang request..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
