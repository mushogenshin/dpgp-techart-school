import { useContext } from "react";
import { CoursesContext } from "../../context/CoursesContext";
import { Link } from "react-router-dom";
import styles from "./Courses.module.css";

export default function Courses() {
  const { courses, error } = useContext(CoursesContext);

  return (
    <div className={styles.courses}>
      <h2>Các khoá đã dạy</h2>
      {error && <p>{error}</p>}
      {courses.map((cls) => (
        <li key={cls.id}>
          <Link to={`/courses/${cls.id}`}>
            {cls.name} <span className={styles.courses_id}>{cls.id}</span>
          </Link>
        </li>
      ))}
    </div>
  );
}
