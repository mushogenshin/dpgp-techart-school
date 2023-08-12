import { useLogout } from "../../hooks/useLogout";
import { useMigrate } from "../../hooks/useMigrate";
import { useAuthContext } from "../../hooks/useAuthContext";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, enrollments } = useAuthContext();
  const { logout, isPending: isLogoutPending } = useLogout();
  const { migrate, isPending: isMigratePending, succeeded } = useMigrate();

  return (
    <div className={styles.dashboard}>
      <div className={styles.block}>
        <h2>🙌 Đã đang đăng nhập</h2>
        <p>Account Email: {user.email}</p>
        {isLogoutPending ? (
          <button className="btn" disabled>
            Signing Out...
          </button>
        ) : (
          <button className="btn" onClick={logout}>
            Sign Out
          </button>
        )}
      </div>

      <div className={styles.block}>
        <h2>🌋 Ráp hồ sơ cũ</h2>
        <p>
          DPGP đang chuyển sang hệ thống website mới từ tháng 8/2023. Do đó, nếu
          muốn xem được đầy đủ các khoá đã ghi danh, bạn sẽ cần nối kết với các
          dữ liệu cũ bằng cách nhấn nút "Migrate" bên dưới. Chỉ cần làm một lần
          duy nhất.
        </p>
        {isMigratePending ? (
          <button className="btn" disabled>
            Migrating...
          </button>
        ) : (
          <button className="btn" onClick={migrate}>
            Migrate
          </button>
        )}
        {succeeded && (
          <div>
            <small>Đã ráp thành công hồ sơ cũ!</small>
          </div>
        )}
      </div>

      <div className={styles.block}>
        <h2>🥅 Các khoá học cũ đã ghi danh:</h2>
        <p>(trước khi DPGP chuyển sang hệ thống mới tháng 8/2023)</p>

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

      <div className={styles.block}>
        Cảm ơn đã tham gia cùng Dẫu Phải Giải Phẫu 🚀
      </div>
    </div>
  );
}
