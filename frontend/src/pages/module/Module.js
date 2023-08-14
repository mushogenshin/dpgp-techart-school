import styles from "./Module.module.css";

export default function LearningModule({ mod, isPurchased }) {
  return (
    // // check if mod is undefined before trying to access its properties
    // mod && (
    // )
    <div className={styles.mod}>
      <h2>{mod.description}</h2>

      <p className={styles.desc}>Hình thức: {mod.format}</p>
      <p className={styles.desc}>
        Bắt đầu: {mod.starts_at.toLocaleDateString()}
      </p>
      <p className={styles.desc}>
        Kết thúc: {mod.ends_at.toLocaleDateString()}
      </p>

      {isPurchased ? <h1>PURCHASED</h1> : <h1>NOT PURCHASED</h1>}
    </div>
  );
}
