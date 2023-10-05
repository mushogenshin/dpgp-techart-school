import { useParams, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState } from "react";

export default function Sidebar({ contents }) {
  const navigate = useNavigate();
  const { courseId, modId, unitId, lessonId: lessonParam } = useParams();

  const routeActiveLesson = (target) => {
    navigate(`/course/${courseId}/${modId}/${unitId}/${target}`);
  };

  const [isActive, setActive] = useState(false);
  const toggleClass = () => {
    setActive(!isActive);
  };

  /* <div id="itu_sidebar_main" className={styles.sidebar}> */

  return (
    <div id="itu_sidebar_wrap">
      <div
        id="itu_sidebar_main"
        className={isActive ? styles.sidebar + " open" : styles.sidebar}
      >
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
      <div id="itu_sidebar_footer" className="mob">
        <span onClick={toggleClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-grid-3x3-gap"
            viewBox="0 0 16 16"
          >
            <path d="M4 2v2H2V2h2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zM9 2v2H7V2h2zm5 0v2h-2V2h2zM4 7v2H2V7h2zm5 0v2H7V7h2zm5 0h-2v2h2V7zM4 12v2H2v-2h2zm5 0v2H7v-2h2zm5 0v2h-2v-2h2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2z" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function Outline({ content, activeLessonId, setActiveLessonId }) {
  return (
    <div id="itu_sidebar_2">
      <h3>{content.name || "Section"}</h3>
      {content.lessons && content.lessons.length > 0 ? (
        <ul>
          {content.lessons.map((lesson, index) => {
            return (
              <li
                key={index}
                onClick={() => setActiveLessonId(lesson.id)}
                className={activeLessonId === lesson.id ? styles.active : {}}
              >
                {lesson.name || "Untitled"}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>{`- { No lessons found } -`}</p>
      )}
    </div>
  );
}
