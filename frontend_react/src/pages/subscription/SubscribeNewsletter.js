import styles from "./Subscription.module.css";
import useSubscribe from "../../hooks/admin/useSubscribe";

export default function SubscribeNewsletter() {
  const { isUnsubscribed, error, isPending } = useSubscribe();

  return (
    <div className={styles.form}>
      <h2>📧 Newsletter</h2>
      {isUnsubscribed ? (
        <button
          className="btn"
          onClick={(e) => e.preventDefault()}
          disabled={isPending}
        >
          Subscribe
        </button>
      ) : (
        <p>You are already subscribed.</p>
      )}
      {error && <p>{error.toString()}</p>}
    </div>
  );
}
