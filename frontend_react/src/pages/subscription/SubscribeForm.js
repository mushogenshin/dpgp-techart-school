import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

import styles from "./Subscription.module.css";

/** Firebase gives us two flavors of the endpoint, region path or a unique app
 */
const getEndpoint = (route) => {
  //   const CLOUD_FN_ENDPOINT =
  //     "https://asia-southeast1-dpgp-techart.cloudfunctions.net";
  const CLOUD_FN_ENDPOINT =
    "https://requestsubscription-sddsnmo5oq-as.a.run.app";

  return CLOUD_FN_ENDPOINT.includes("cloudfunctions.net")
    ? `${CLOUD_FN_ENDPOINT}/${route}`
    : CLOUD_FN_ENDPOINT;
};

/**
 * Form for subscribing to email updates for non-logged in users
 */
export default function SubscribeForm() {
  const { user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setIsEmailValid(
      emailValue.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null
    );
  };

  // send a POST request to the backend (Cloud Functions) to send a confirmation email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    setSubmitSuccess(false);

    try {
      await fetch(getEndpoint("requestSubscription"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setSubmitSuccess(true);
      handleEmailChange({ target: { value: "" } }); // Clear the input field
    } catch (error) {
      console.error(`Error sending confirmation email: ${error}`);
      setError(`Failed to send confirmation email: ${error.message}`);
    } finally {
      setIsPending(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div>
      <div className={styles.header}>
        <h4>Đăng ký nhận newsletter với nhiều thông tin bổ ích từ DPGP!</h4>
      </div>
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
      {submitSuccess && (
        <p className={styles.form}>
          Để an toàn, xác nhận vừa gửi qua email, vui lòng xem hộp thư và
          confirm để hoàn tất 😌
        </p>
      )}
      {error === null && submitSuccess === false && (
        <div className={styles.footer}>
          <small>DPGP tôn trọng sự riêng tư của bạn</small>
        </div>
      )}
    </div>
  );
}
