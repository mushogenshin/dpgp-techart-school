import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { sendVerificationEmail } from "../../hooks/firestore/mail_verification";

import styles from "./Subscription.module.css";

/**
 * Form for subscribing to email updates for non-logged in users
 */
export default function SubscribeForm() {
  const { user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [sendConfirmationSuccess, setConfirmationSuccess] = useState(false);

  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setIsEmailValid(
      emailValue.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    setConfirmationSuccess(false);

    try {
      await sendVerificationEmail(email);
      console.log(`Verification email sent to: ${email}`);
      setConfirmationSuccess(true);
    } catch (error) {
      setError(error.message);
      console.error(`Error sending verification email: ${error}`);
    } finally {
      setIsPending(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div>
      <div className={styles.form}>
        <form onSubmit={handleSubmit} className={styles.inlineForm}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Nhập email"
          />
          <button
            type="submit"
            className={`btn`}
            disabled={isPending || !isEmailValid}
          >
            {isPending ? "Sending..." : "Subscribe"}
          </button>
        </form>
      </div>
      {error && <p className={styles.form}>{error}</p>}
      {sendConfirmationSuccess && (
        <p className={styles.form}>
          Để cho an toàn, email để confirm đã được gửi. Vui lòng xem hộp thư và
          xác nhận nhé!
        </p>
      )}
    </div>
  );
}
