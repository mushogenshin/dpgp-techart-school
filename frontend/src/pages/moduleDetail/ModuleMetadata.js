import styles from "./Module.module.css";

export default function ModuleMetadata({ moduleData }) {
  return (
    <div className={styles.mod}>
      {moduleData.description && <h2>{moduleData.description}</h2>}
      {moduleData.format && (
        <p className={styles.desc}>Hình thức: {moduleData.format}</p>
      )}
      {moduleData.starts_at && (
        <p className={styles.desc}>
          Bắt đầu:{" "}
          {moduleData.starts_at.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      )}
      {moduleData.ends_at && (
        <p className={styles.desc}>
          Kết thúc:{" "}
          {moduleData.ends_at.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
