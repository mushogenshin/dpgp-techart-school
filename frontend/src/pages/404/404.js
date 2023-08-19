import styles from "./404.module.css";

export default function NotFound() {
  return (
    <div className={styles.center}>
      <span className={styles.text}>404 Not Found :(</span>
    </div>
  );
}
