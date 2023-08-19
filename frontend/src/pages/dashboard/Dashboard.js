import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useLogout } from "../../hooks/useLogout";
import { useMigrate } from "../../hooks/useMigrate";
import { useAuthContext } from "../../hooks/useAuthContext";
import { CoursesContext } from "../../context/CoursesContext";

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
      <MigrateStatus history={history} conformed={conformed} />
      <History history={history} />

      <div className={styles.block}>
        Cảm ơn đã tham gia cùng Dẫu Phải Giải Phẫu 🚀
      </div>
    </div>
  );
}

function LoginStatus({ user }) {
  const { logout, isPending: isLogoutPending } = useLogout();

  return (
    <div className={styles.block}>
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
    <div className={styles.block}>
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
            <p>
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
            </button>
          </div>
        )
      )}
    </div>
  );
}

function History({ history }) {
  const { courses } = useContext(CoursesContext);
  const [coursesWithModule, setCoursesWithModule] = useState([]);

  useEffect(() => {
    if (history) {
      const courseIds = new Set();
      const historyEnrollments = history.enrollments || [];
      const coursesWithModule = historyEnrollments.flatMap((modId) =>
        courses.filter((course) => {
          if (course.modules.includes(modId) && !courseIds.has(course.id)) {
            courseIds.add(course.id);
            return true;
          }
          return false;
        })
      );
      setCoursesWithModule(coursesWithModule);
    } else {
      setCoursesWithModule([]);
    }
  }, [history, courses]);

  return (
    <div className={styles.block}>
      <h2>🥅 Các khoá học cũ đã ghi danh:</h2>
      <p>(trước khi DPGP chuyển sang hệ thống mới tháng 8/2023)</p>

      {history && coursesWithModule.length > 0 ? (
        <ol className={styles.conformed}>
          {coursesWithModule.map((cls) => (
            <li key={cls.id}>
              <Link to={`/courses/${cls.id}`}>
                {cls.name} <span className={styles.courses_id}>{cls.id}</span>
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
