import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase_config";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

import styles from "./Sidebar.module.css";

/**
 *
 * @param {Array<Object>} contents
 * Each content has this shape: { id: string, name: string, lessons: Array<Object> }
 */
export default function Sidebar({ contents }) {
  const navigate = useNavigate();
  const { courseId, modId, unitId, lessonId: lessonParam } = useParams();

  const routeActiveLesson = (target) => {
    navigate(`/course/${courseId}/${modId}/${unitId}/${target}`);
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebarVis = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // using CSS in `responsive.css` to toggle the sidebar
  return (
    <div id="itu_sidebar_wrap">
      <div
        id="itu_sidebar_main"
        className={sidebarVisible ? styles.sidebar + " open" : styles.sidebar}
      >
        <div className={styles.sidebarHandle}></div>
        {contents.map((content, index) => (
          <ContentOutline
            key={index}
            content={content}
            activeLessonId={lessonParam}
            setActiveLessonId={routeActiveLesson}
          />
        ))}
      </div>
      <div id="itu_sidebar_footer" className="mob">
        <span onClick={toggleSidebarVis}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="#fc5aff" // or "currentColor"
            class="bi bi-grid-3x3-gap"
            viewBox="0 0 16 16"
          >
            <path d="M4 2v2H2V2h2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zM9 2v2H7V2h2zm5 0v2h-2V2h2zM4 7v2H2V7h2zm5 0v2H7V7h2zm5 0h-2v2h2V7zM4 12v2H2v-2h2zm5 0v2H7v-2h2zm5 0v2h-2v-2h2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2z" />
          </svg>
        </span>
        <span
          onClick={toggleSidebarVis}
          style={{ marginLeft: "10px", color: "#fc5aff" }}
        >
          CONTENTS
        </span>
      </div>
    </div>
  );
}

function ContentOutline({ content, activeLessonId, setActiveLessonId }) {
  const { elevatedRole } = useAuthContext();

  const toggleAllowsPeek = async (lessonId) => {
    const targetLesson = content.lessons.find(
      (lesson) => lesson.id === lessonId
    );
    const newAllowsPeek = !targetLesson.allows_peek;

    try {
      const contentRef = doc(db, "contents", content.id);
      const contentDoc = await getDoc(contentRef);

      if (contentDoc.exists()) {
        const data = contentDoc.data();

        const updatedLessons = data.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, allows_peek: newAllowsPeek }
            : lesson
        );

        await updateDoc(contentRef, {
          lessons: updatedLessons,
        });
        console.log("Lesson successfully updated!");
      }
    } catch (error) {
      console.error("Error updating lesson: ", error);
    }
  };

  return (
    <div id="itu_sidebar_2">
      <h3>{content?.name || "Unknown Section"}</h3>
      {content?.lessons && content.lessons.length > 0 ? (
        <ul>
          {content.lessons.map((lesson, index) => {
            return (
              <li
                key={index}
                onClick={() => setActiveLessonId(lesson.id)}
                className={activeLessonId === lesson.id ? styles.active : {}}
              >
                {/* show checkbox of `allows_peek` value of the lesson */}
                <span>
                  {elevatedRole && (
                    <>
                      <input
                        type="checkbox"
                        checked={lesson.allows_peek || false}
                        className={styles["allows-peek"]}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent li onClick from firing
                          toggleAllowsPeek(lesson.id);
                        }}
                      />
                      {lesson.allows_peek || false ? (
                        <span className={styles["allows-peek-hint"]}>
                          (public){" "}
                        </span>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                  {lesson.name || "Untitled"}
                </span>
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
