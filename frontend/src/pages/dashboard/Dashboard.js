import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, enrollments } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className={styles.dashboard}>
      <div className={styles.block}>
        <h2>🙌 Đã đang đăng nhập</h2>
        <p>Account Email: {user.email}</p>
        <button className="btn" onClick={logout}>
          Sign Out
        </button>
      </div>

      <div className={styles.block}>
        <h2>🌋 Ráp hồ sơ cũ</h2>
        <p>
          Từ tháng 8/2023, DPGP đang chuyển sang hệ thống website mới, và sẽ cần
          bạn nối kết với các dữ liệu cũ bằng cách nhấn nút "Migrate" bên dưới.
        </p>
        <button className="btn" onClick={() => {}}>
          Migrate
        </button>
      </div>

      <div className={styles.block}>
        <h2>🥅 Các khoá học cũ đã ghi danh:</h2>
        <p>(trước khi DPGP chuyển sang hệ thống mới tháng 7/2023)</p>

        {enrollments ? (
          <ol className={styles.migrated}>
            {enrollments.map((mod) => (
              <li key={mod}>{mod}</li>
            ))}
          </ol>
        ) : (
          <p className={styles["migration-non-existent"]}>
            Không có khoá nào cả
          </p>
        )}
      </div>

      {/* <footer>Cảm ơn đã tham gia cùng Dẫu Phải Giải Phẫu 🚀</footer> */}
    </div>
  );
}
