import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { useMapModulesToCourses } from "../../hooks/firestore/useMapModulesToCourses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import styles from "./Courses.module.css";

export default function AllCourses() {
  const { user } = useAuthContext();
  const { courses, coursesError } = useCoursesContext();

  // // Group courses by category
  // const coursesByCategory = courses.reduce((acc, course) => {
  //   (course.categories || []).forEach((category) => {
  //     if (!acc[category]) {
  //       acc[category] = [];
  //     }
  //     acc[category].push(course);
  //   });
  //   return acc;
  // }, {});

  return (
    <div className={styles.courses}>
      <Purchased user={user} />
      <Freebie user={user} courses={courses} />
      <AllExisting courses={courses} coursesError={coursesError} />
      {/* {Object.entries(coursesByCategory).map(([category, courses]) => (
        <div key={category}>
          <h2>{category}</h2>
          <AllExisting courses={courses} coursesError={coursesError} />
        </div>
      ))} */}
    </div>
  );
}

function Purchased({ user }) {
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
          <ul>
            {courses.map((cls) => (
              <li key={cls.id}>
                <Link to={`/course/${cls.id}`}>
                  {cls.name}{" "}
                  <span className={styles["course-id"]}>{cls.id}</span>
                </Link>
              </li>
            ))}
          </ul>
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

function Freebie({ user, courses }) {
  const freebies =
    courses && courses.filter((cls) => cls.maybe_freebie || false);

  if (!freebies || freebies.length === 0) return null;

  return (
    <div className={styles.freebies}>
      <p>Miễn phí</p>
      {user ? (
        freebies && (
          <ol>
            {freebies.map((cls) => (
              <li key={cls.id}>
                <Link to={`/course/${cls.id}`}>
                  {cls.name}{" "}
                  <span className={styles["course-id"]}>{cls.id}</span>
                </Link>
              </li>
            ))}
          </ol>
        )
      ) : (
        <p className={styles.hint}>
          🗝️ <Link to="/login">Đăng nhập để xem các tài liệu miễn phí</Link>
        </p>
      )}
    </div>
  );
}

function AllExisting({ courses, coursesError }) {
  return (
    <div>
      <p>Các khoá đã dạy</p>
      {coursesError && <h2>{coursesError}</h2>}
      <ul>
        {courses &&
          courses.map((cls) => (
            <li key={cls.id}>
              <Link to={`/course/${cls.id}`}>
                {cls.name} <span className={styles["course-id"]}>{cls.id}</span>{" "}
                {cls.shows_student_works && (
                  <FontAwesomeIcon
                    icon={faImages}
                    className={styles["student-works"]}
                  />
                )}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
