import { useParams, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar({ contents }) {
  const navigate = useNavigate();
  const { courseId, modId, unitId, lessonId: lessonParam } = useParams();

  const routeActiveLesson = (target) => {
    navigate(`/course/${courseId}/${modId}/${unitId}/${target}`);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHandle}></div>
      {contents.map((content, index) => (
        <Outline
          key={index}
          content={content}
          activeLessonId={lessonParam}
          setActiveLessonId={routeActiveLesson}
        />
      ))}
    </div>
  );
}

function Outline({ content, activeLessonId, setActiveLessonId }) {
  return (
    <div>
      <h3>{content.name}</h3>
      <ul>
        {content.lessons.map((lesson, index) => {
          return (
            <li key={index} onClick={() => setActiveLessonId(lesson.id)}>
              {lesson.id}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
