import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { useNavigateFirstUnit } from "../../hooks/firestore/useNavigateFirstUnit";
import CourseMetadata from "./CourseMetadata";
import Album from "../../components/album/Album";
import ModuleDetail from "../moduleDetail/ModuleDetail";

import styles from "./CourseDetail.module.css";

export default function CourseDetail() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
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
  const showStudentWorks =
    (courseLookup && courseLookup.shows_student_works) || false;

  useNavigateFirstUnit();

  useEffect(() => {
    // we should wait for allCourses to be fetched before doing any redirection
    if (allCourses) {
      if (!courseLookup) {
        navigate("/404");
        return;
      }

      if (!modParam && moduleIds.length > 0) {
        // if no module ID param is specified, redirect to the first module
        // console.log("Redirecting to first module:", moduleIds[0]);
        navigate(`/course/${courseId}/${moduleIds[0]}`, { replace: true });
      }
    }
  }, [allCourses, courseId, courseLookup, moduleIds, modParam, navigate]);

  return (
    <div
      id="course_details_main"
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

      {/* optional featured student works */}
      {showStudentWorks && (
        <Album
          albumName="Bài nộp học viên"
          folderName={`student-works/${courseId}`}
          // comma-separated list of labels for each image
          imgLabels={courseLookup.student_works_labels || []}
        />
      )}
      <hr></hr>

      {/* carousel-style clickable elements to select a Module */}
      <ChooseModule moduleIds={moduleIds} activeModId={modParam} />

      {/* show the Module detail, i.e. Unit contents */}
      {modParam &&
        (user ? (
          <ModuleDetail setShowSidebar={setShowSidebar} />
        ) : (
          <h3 className={styles.prompt}>
            🗝️ <Link to="/login">Đăng nhập</Link> để xem: các tài liệu miễn phí
            + toàn bộ modules đã mua + nhiều nội dung học thử khác
          </h3>
        ))}
    </div>
  );
}

function ChooseModule({ moduleIds, activeModId }) {
  const navigate = useNavigate();
  const { courseId } = useParams();
  // const [index, setIndex] = useState(null);

  const routeActiveModule = (target, i) => {
    // setIndex(i);
    navigate(`/course/${courseId}/${target}`);
  };

  return (
    <div id="course_carousel_module" className={styles.carousel}>
      {moduleIds && (
        <div>
          <ul>
            {moduleIds.map((modId, i) => (
              <li
                key={i}
                onClick={() => routeActiveModule(modId, i)}
                className={activeModId === modId ? styles.active : {}}
              >
                {modId}
              </li>
            ))}
          </ul>
          {/* {moduleIds.length > 1 && index !== null && (
            <small className={styles.hint}>Module #{index + 1}:</small>
          )} */}
        </div>
      )}
    </div>
  );
}
