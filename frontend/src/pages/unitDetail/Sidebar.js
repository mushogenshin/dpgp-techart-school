import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useEffect } from "react";

export default function Sidebar({ contents }) {
  const navigate = useNavigate();
  const { courseId, modId, unitId, lessonId: lessonParam } = useParams();

  // the target content ID is parsed from the content ID param in the URL
  const [targetLessonId, setTargetLessonId] = useState(lessonParam);

  useEffect(() => {
    // update the target content ID if the content ID param in the URL changes
    setTargetLessonId(lessonParam);
  }, [lessonParam, navigate]);

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
          activeLessonId={targetLessonId}
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
