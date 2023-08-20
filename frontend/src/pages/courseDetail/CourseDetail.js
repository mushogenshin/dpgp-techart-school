import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { CoursesContext } from "../../context/CoursesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import CourseMetadata from "./CourseMetadata";
import ModuleDetail from "../moduleDetail/ModuleDetail";

import styles from "./CourseDetail.module.css";

export default function CourseDetail() {
  const navigate = useNavigate();
  const { courseId, modId: modParam, unitId } = useParams();

  // the target module ID is parsed from the module ID param in the URL
  const [targetModId, setTargetModId] = useState(modParam);

  const [currCourse, setCurrCourse] = useState(null);
  const [modules, setModules] = useState(null);

  const { courses: allCourses } = useContext(CoursesContext);

  useEffect(() => {
    // we should wait for allCourses to be fetched before checking if courseId is valid
    if (allCourses) {
      const courseLookup = allCourses.find((cls) => cls.id === courseId);
      setCurrCourse(courseLookup);

      if (!courseLookup) {
        navigate("/404");
        return;
      } else {
        setModules(courseLookup.modules || []);
      }
    }

    // updates the target module ID if the module ID param in the URL changes
    setTargetModId(modParam);
  }, [allCourses, courseId, modParam, navigate]);

  return (
    <div
      className={styles["course-detail"]}
      style={
        // spare some space for the sidebar when viewing a Unit
        unitId
          ? {
              marginLeft: "var(--sidebar-width)",
            }
          : {}
      }
    >
      <CourseMetadata course={currCourse} />
      <hr></hr>
      {/* carousel-style clickable elements to select a Module */}
      <ChooseModule
        courseId={courseId}
        moduleIds={modules}
        activeMod={targetModId}
      />

      {targetModId && (
        <GuardedModule courseId={courseId} moduleId={targetModId} />
      )}
    </div>
  );
}

function ChooseModule({ courseId, moduleIds, activeMod }) {
  const navigate = useNavigate();
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
            {moduleIds.map((mod, index) => (
              <li
                key={index}
                onClick={() => routeActiveModule(mod, index)}
                className={activeMod === mod ? styles.active : {}}
              >
                {mod}
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

function GuardedModule({ courseId, moduleId }) {
  const { user } = useAuthContext();

  return user ? (
    <ModuleDetail courseId={courseId} moduleId={moduleId} />
  ) : (
    <h3 className={styles.prompt}>
      🗝️ <Link to="/login">Đăng nhập</Link> để xem: các tài liệu miễn phí + toàn
      bộ modules đã mua
    </h3>
  );
}
