import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

import styles from "./Module.module.css";

export default function LearningModule({ mod, isPurchased }) {
  const { user } = useAuthContext();

  return (
    // NOTE: we may want to check if mod is undefined before trying to access its properties
    <div className={styles.mod}>
      <h2>{mod.description}</h2>

      <p className={styles.desc}>Hình thức: {mod.format}</p>
      <p className={styles.desc}>
        Bắt đầu: {mod.starts_at.toLocaleDateString()}
      </p>
      <p className={styles.desc}>
        Kết thúc: {mod.ends_at.toLocaleDateString()}
      </p>

      <hr></hr>
      {user ? (
        <div>
          {isPurchased ? (
            <div>
              OK bạn đã mua module này rồi, hãy xem video bài giảng ở đây
            </div>
          ) : (
            <h3>
              📺 Để xem video bài giảng, liên lạc DPGP để mua module này (👉{" "}
              {mod.id})
            </h3>
          )}
        </div>
      ) : (
        <h3 className={styles.prompt}>
          🗝️ <Link to="/login">Đăng nhập</Link> để xem: các tài liệu miễn phí +
          toàn bộ modules đã mua
        </h3>
      )}
    </div>
  );
}
