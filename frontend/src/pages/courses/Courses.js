import { useContext } from "react";
import { Link } from "react-router-dom";
import { CoursesContext } from "../../context/CoursesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useMapModulesToCourses } from "../../hooks/useMapModulesToCourses";
import styles from "./Courses.module.css";

export default function Courses() {
  const { user } = useAuthContext();

  return (
    <div className={styles.courses}>
      {user && <Purchased />}
      <All />
    </div>
  );
}

function Purchased() {
  const {
    purchased,
    pre_2023_07_history: history,
    post_2023_07_conformed: conformed,
  } = useAuthContext();

  const courses = useMapModulesToCourses(purchased || []);
  const action = history ? "ráp hồ sơ cũ" : "chuyển hệ thống mới";

  return (
    <div>
      <p>Các khoá đã mua</p>
      {courses.length > 0 ? (
        <ol>
          {courses.map((cls) => (
            <li key={cls.id}>
              <Link to={`/course/${cls.id}`}>
                {cls.name} <span className={styles.courses_id}>{cls.id}</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className={styles.hint}>
          <p>Chưa có khoá nào cả</p>
          {!conformed ? (
            <p>
              👀 Bạn chưa thực hiện "Migrate" để{" "}
              <Link to="/dashboard">{action}</Link>
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function All() {
  const { courses, coursesError } = useContext(CoursesContext);
  return (
    <div>
      <p>Các khoá đã dạy</p>
      {coursesError && <h2>{coursesError}</h2>}
      <ul>
        {courses &&
          courses.map((cls) => (
            <li key={cls.id}>
              <Link to={`/course/${cls.id}`}>
                {cls.name} <span className={styles.courses_id}>{cls.id}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
