import { useAuthContext } from "../../hooks/auth/useAuthContext";

import styles from "./Subscription.module.css";

/**
 * Form for subscribing to email updates for non-logged in users
 */
export default function SubscribeForm() {
  const { user } = useAuthContext();
  if (user) {
    return null;
  }

  return <div className={styles.form}>TODO: Subscribe Form</div>;
}
