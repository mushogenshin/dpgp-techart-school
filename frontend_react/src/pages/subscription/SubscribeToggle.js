import styles from "./Subscription.module.css";
import useSubscribe from "../../hooks/admin/useSubscribe";

/**
 * SubscribeToggle component for authenticated users to subscribe/unsubscribe.
 */
export default function SubscribeToggle() {
  const { isUnsubscribed, error, isPending, subscribe, unsubscribe } =
    useSubscribe();

  const handleSubscribe = async (e) => {
    await subscribe();
  };

  const handleUnsubscribe = async (e) => {
    await unsubscribe();
  };

  return (
    <div className={styles.toggles}>
      <h2>📧 Newsletter</h2>
      {isUnsubscribed ? (
        <div>
          <p>Đang không nhận newsletter. Muốn subscribe trở lại?</p>
          <button
            className="btn"
            onClick={handleSubscribe}
            disabled={isPending}
          >
            Subscribe
          </button>
        </div>
      ) : (
        <div>
          <p>Đã subscribed để nhận thư 👌</p>
          <button
            className="btn"
            onClick={handleUnsubscribe}
            disabled={isPending}
          >
            Unsubscribe
          </button>
        </div>
      )}
      {error && <p>{error.toString()}</p>}
    </div>
  );
}
