import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useEffect } from "react";

export default function Sidebar({ contents }) {
  const navigate = useNavigate();
  const { courseId, modId, unitId, contentId: contentParam } = useParams();

  // the target content ID is parsed from the content ID param in the URL
  const [targetContentId, setTargetContentId] = useState(contentParam);

  useEffect(() => {
    // update the target content ID if the content ID param in the URL changes
    setTargetContentId(contentParam);
  }, [contentParam, navigate]);

  const routeActiveContent = (target) => {
    navigate(`/course/${courseId}/${modId}/${unitId}/${target}`);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHandle}></div>
      {contents.map((content, index) => (
        <Outline
          key={index}
          content={content}
          active={targetContentId}
          setActive={routeActiveContent}
        />
      ))}
    </div>
  );
}

function Outline({ content, active, setActive }) {
  return (
    <div>
      <h3>{content.name}</h3>
      <ul>
        {content.lessons.map((lesson, index) => {
          return (
            <li key={index} onClick={() => setActive(lesson.id)}>
              {lesson.id}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
