import { useLogout } from "../../hooks/useLogout";
import { useMigrate } from "../../hooks/useMigrate";
import { useAuthContext } from "../../hooks/useAuthContext";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, history, migrated } = useAuthContext();
  const { logout, isPending: isLogoutPending } = useLogout();
  const { migrate, isPending: isMigratePending } = useMigrate();

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
        {history ? (
          <div>
            {/* Cựu Học viên */}
            <h2>🌋 Ráp hồ sơ cũ</h2>
            {migrated && <div>Dữ liệu ghi danh cũ đều đã được di dời xong</div>}
          </div>
        ) : (
          <div>
            {/* Tân Học viên */}
            <h2>🎢 Chuyển hệ thống mới</h2>
            {migrated && <div>Đã chuyển hệ thống mới thành công!</div>}
          </div>
        )}

        {!migrated && (
          <div>
            <p>
              DPGP đang chuyển sang hệ thống website mới từ tháng 8/2023. Do đó,
              để muốn xem được đầy đủ các khoá đã ghi danh, bạn sẽ cần nối kết
              với các dữ liệu cũ bằng cách nhấn nút "Migrate" bên dưới. Chỉ cần
              làm một lần duy nhất.
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
          </div>
        )}
      </div>

      <div className={styles.block}>
        <h2>🥅 Các khoá học cũ đã ghi danh:</h2>
        <p>(trước khi DPGP chuyển sang hệ thống mới tháng 8/2023)</p>

        {history ? (
          <ol className={styles.migrated}>
            {history.map((mod) => (
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
