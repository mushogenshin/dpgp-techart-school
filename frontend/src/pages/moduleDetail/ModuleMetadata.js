import styles from "./Module.module.css";

export default function ModuleMetadata({ moduleData }) {
  return (
    <div className={styles.mod}>
      <h2>{moduleData.description}</h2>
      <p className={styles.desc}>Hình thức: {moduleData.format}</p>
      <p className={styles.desc}>
        Bắt đầu: {moduleData.starts_at.toLocaleDateString()}
      </p>
      <p className={styles.desc}>
        Kết thúc: {moduleData.ends_at.toLocaleDateString()}
      </p>
    </div>
  );
}
