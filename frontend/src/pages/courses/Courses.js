import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useCoursesContext } from "../../hooks/useCoursesContext";
import { useMapModulesToCourses } from "../../hooks/useMapModulesToCourses";
import styles from "./Courses.module.css";

export default function Courses() {
  return (
    <div className={styles.courses}>
      <Purchased />
      <Freebie />
      <All />
    </div>
  );
}

function Purchased() {
  const { user } = useAuthContext();
  const {
    purchased,
    pre_2023_07_history: history,
    post_2023_07_conformed: conformed,
  } = useAuthContext();

  const courses = useMapModulesToCourses(purchased || []);
  const action = history ? "ráp hồ sơ cũ" : "chuyển hệ thống mới";

  return (
    user && (
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
    )
  );
}

function Freebie() {
  const { user } = useAuthContext();
  const { courses } = useCoursesContext();
  return (
    <div>
      <p>Các khoá miễn phí</p>
      {user ? (
        <ul>
          {/* {courses &&
          courses.map((cls) => (
            <li key={cls.id}>
              <Link to={`/course/${cls.id}`}>
                {cls.name} <span className={styles.courses_id}>{cls.id}</span>
              </Link>
            </li>
          ))} */}
        </ul>
      ) : (
        <div>Please sign in to see freebies </div>
      )}
    </div>
  );
}

function All() {
  const { courses, coursesError } = useCoursesContext();
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
