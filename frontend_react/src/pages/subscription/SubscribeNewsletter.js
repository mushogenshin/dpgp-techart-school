import styles from "./Subscription.module.css";

export default function SubscribeNewsletter() {
  return (
    <div className={styles.form}>
      <h2>📧 Newsletter</h2>
      <button className="btn" onClick={(e) => e.preventDefault()} disabled>
        Subscribe
      </button>
    </div>
  );
}
