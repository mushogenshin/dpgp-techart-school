import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { useMapModulesToCourses } from "../../hooks/firestore/useMapModulesToCourses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages,
  faPaintRoller,
  faPersonDigging,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Courses.module.css";

export default function AllCourses() {
  const { user } = useAuthContext();
  const { courses, coursesError, isPending } = useCoursesContext();

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
      {isPending && <p>Đợi xíu nha 😙...</p>}

      <Purchased user={user} />
      <Freebie user={user} courses={courses} />
      <AllMigrated courses={courses} coursesError={coursesError} />
      <MigrationIncomplete courses={courses} coursesError={coursesError} />
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
      <>
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
      </>
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

function AllMigrated({ courses, coursesError }) {
  const filteredCourses =
    courses && courses.filter((cls) => !cls.migration_incomplete);

  return (
    <>
      <p>Các khoá đã dạy</p>
      {coursesError && <h2>{coursesError}</h2>}
      <ul>
        {filteredCourses &&
          filteredCourses.map((cls) => (
            <li key={cls.id}>
              <Link to={`/course/${cls.id}`}>
                {/* the Class name */}
                <span>{cls.name} </span>
                {/* the Class ID */}
                <span className={styles["course-id"]}>{cls.id}</span>{" "}
                {cls.shows_student_works && (
                  <FontAwesomeIcon
                    icon={faImages}
                    className={styles["fa-icon"]}
                  />
                )}
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
}

function MigrationIncomplete({ courses, coursesError }) {
  const filteredCourses =
    courses && courses.filter((cls) => cls.migration_incomplete || false);

  return (
    <>
      <p>Các khoá cũ</p>
      {coursesError && <h2>{coursesError}</h2>}
      <ul>
        {filteredCourses &&
          filteredCourses.map((cls) => (
            <li key={cls.id}>
              <Link to={`/course/${cls.id}`}>
                <>
                  <FontAwesomeIcon
                    icon={faPaintRoller}
                    className={styles["migrating-symbol"]}
                  />{" "}
                </>
                {/* the Class name */}
                <span className={styles.migrating}>{cls.name} </span>
                {/* the Class ID */}
                <span
                  className={styles["course-id"]}
                  style={{ background: "#6b8b26" }}
                >
                  {cls.id}
                </span>{" "}
                {/* migrating hint */}
                <>
                  <FontAwesomeIcon
                    icon={faPersonDigging}
                    className={styles["migrating-symbol"]}
                  />
                  <span className={styles["migrating-hint"]}> (migrating)</span>
                </>
                {cls.shows_student_works && (
                  <FontAwesomeIcon
                    icon={faImages}
                    className={styles["fa-icon"]}
                  />
                )}
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
}
