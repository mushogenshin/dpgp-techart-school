import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useLogout } from "../../hooks/auth/useLogout";
import { useMigrate } from "../../hooks/admin/useMigrate";
import { useMapModulesToCourses } from "../../hooks/firestore/useMapModulesToCourses";

import SubscribeToggle from "../subscription/SubscribeToggle";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const {
    user,
    pre_2023_07_history: history,
    post_2023_07_conformed: conformed,
  } = useAuthContext();

  return (
    <div className={styles.dashboard}>
      <LoginStatus user={user} />
      {/* TODO */}
      {/* <SubscribeToggle source="web-dashboard-page" /> */}
      <MigrateStatus history={history} conformed={conformed} />
      <History history={history} />

      <div className={styles["metadata-section"]}>
        Cảm ơn đã tham gia cùng Dẫu Phải Giải Phẫu 🚀
      </div>
    </div>
  );
}

function LoginStatus({ user }) {
  const { logout, isPending: isLogoutPending } = useLogout();

  return (
    <div className={styles["metadata-section"]}>
      <h2>🙌 Đã đang đăng nhập</h2>
      <p>Account Email: {user.email}</p>
      <button onClick={logout} className="btn" disabled={isLogoutPending}>
        {isLogoutPending ? "Signing Out..." : "Sign Out"}
      </button>
    </div>
  );
}

function MigrateStatus({ history, conformed }) {
  const { migrate, isPending: isMigratePending } = useMigrate();
  return (
    <div className={styles["metadata-section"]}>
      {history ? (
        <div>
          {/* Cựu Học viên */}
          <h2>🌋 Ráp hồ sơ cũ</h2>
          {conformed && (
            <div>Dữ liệu ghi danh cũ đều đã được di dời xong 👌</div>
          )}
        </div>
      ) : (
        <div>
          {/* Tân Học viên */}
          <h2>🎢 Chuyển hệ thống mới</h2>
          {conformed && <div>Đã chuyển hệ thống mới thành công 👌</div>}
        </div>
      )}

      {!conformed ? (
        <div>
          <p>
            DPGP đang chuyển sang hệ thống website mới từ tháng 8/2023. Do đó,
            để muốn xem được đầy đủ các khoá đã ghi danh, bạn sẽ cần nối kết với
            các dữ liệu cũ bằng cách nhấn nút "Migrate" bên dưới. Chỉ cần làm
            một lần duy nhất.
          </p>

          <button onClick={migrate} className="btn" disabled={isMigratePending}>
            {isMigratePending ? "Migrating..." : "Migrate"}
          </button>
        </div>
      ) : (
        // user has already migrated, but we only allow them to rerun if they
        // have a history
        history && (
          <div>
            {/* <p>
              Tuy nhiên nếu thấy có thiếu sót, vui lòng liên lạc admin và{" "}
              <b>sau khi admin sửa chữa hồ sơ</b>, bạn có thể chạy lại khâu{" "}
              <em>Migrate</em> bằng nút "Rerun" bên dưới:
            </p>
            <button
              onClick={migrate}
              className="btn"
              disabled={isMigratePending}
            >
              {isMigratePending ? "Migrating..." : "Rerun"}
            </button> */}
          </div>
        )
      )}
    </div>
  );
}

function History({ history }) {
  const historyEnrollments = history ? history.enrollments || [] : [];
  const historyCourses = useMapModulesToCourses(historyEnrollments);

  return (
    <div className={styles["metadata-section"]}>
      <h2>🥅 Các khoá học cũ đã ghi danh:</h2>
      <p>(trước khi DPGP chuyển sang hệ thống mới tháng 8/2023)</p>

      {history && historyCourses.length > 0 ? (
        <ol className={styles.conformed}>
          {historyCourses.map((cls) => (
            <li key={cls.id}>
              <Link to={`/courses/${cls.id}`}>
                {cls.name} <span className={styles["course-id"]}>{cls.id}</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles["migration-non-existent"]}>Không có khoá nào cả</p>
      )}
    </div>
  );
}
