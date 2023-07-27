import { useContext } from "react";
import { CoursesContext } from "../../context/CoursesContext";
import styles from "./Courses.module.css";

export default function Courses() {
  const { courses, error } = useContext(CoursesContext);

  return (
    <div className={styles.courses}>
      <h2>ALL COURSES</h2>
      {error && <p>{error}</p>}
      {courses.map((cls) => (
        <li key={cls.id}>
          {cls.name} ({cls.id})
        </li>
      ))}
    </div>
  );
}
