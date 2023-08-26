import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCoursesContext } from "../../hooks/useCoursesContext";
// import { useFetchModule } from "../../hooks/useFetchModule";
import CourseMetadata from "./CourseMetadata";
import ModuleDetail from "../moduleDetail/ModuleDetail";

import styles from "./CourseDetail.module.css";

export default function CourseDetail() {
  const navigate = useNavigate();
  const { courses: allCourses } = useCoursesContext();
  const { courseId, modId: modParam } = useParams();

  const [showSidebar, setShowSidebar] = useState(false);
  const courseLookup = allCourses
    ? allCourses.find((cls) => cls.id === courseId)
    : null;
  const moduleIds = useMemo(
    () => (courseLookup ? courseLookup.modules : []),
    [courseLookup]
  );

  useEffect(() => {
    // we should wait for allCourses to be fetched before doing any redirection
    if (allCourses) {
      if (!courseLookup) {
        navigate("/404");
        return;
      }

      if (!modParam && moduleIds.length > 0) {
        // if no module ID param is specified, redirect to the first module
        navigate(`/course/${courseId}/${moduleIds[0]}`);
      }
    }
  }, [allCourses, courseId, courseLookup, moduleIds, modParam, navigate]);

  return (
    <div
      className={styles["course-detail"]}
      style={
        // spare some space for the sidebar when viewing a Unit
        showSidebar
          ? {
              marginLeft: "var(--sidebar-width)",
            }
          : {}
      }
    >
      <CourseMetadata courseData={courseLookup} />
      <hr></hr>
      {/* carousel-style clickable elements to select a Module */}
      <ChooseModule moduleIds={moduleIds} activeModId={modParam} />

      {modParam && <GuardedModule setShowSidebar={setShowSidebar} />}
    </div>
  );
}

function ChooseModule({ moduleIds, activeModId }) {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [index, setIndex] = useState(null);

  const routeActiveModule = (target, i) => {
    setIndex(i);
    navigate(`/course/${courseId}/${target}`);
  };

  return (
    <div className={styles.carousel}>
      {moduleIds && (
        <div>
          <ul>
            {moduleIds.map((modId, index) => (
              <li
                key={index}
                onClick={() => routeActiveModule(modId, index)}
                className={activeModId === modId ? styles.active : {}}
              >
                {modId}
              </li>
            ))}
          </ul>
          {moduleIds.length > 1 && index !== null && (
            <small className={styles.hint}>Module #{index + 1}:</small>
          )}
        </div>
      )}
    </div>
  );
}

function GuardedModule({ setShowSidebar }) {
  const { user } = useAuthContext();

  return user ? (
    <ModuleDetail setShowSidebar={setShowSidebar} />
  ) : (
    <h3 className={styles.prompt}>
      🗝️ <Link to="/login">Đăng nhập</Link> để xem: các tài liệu miễn phí + toàn
      bộ modules đã mua
    </h3>
  );
}
