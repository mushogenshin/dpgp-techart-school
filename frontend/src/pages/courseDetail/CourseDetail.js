// import { db } from "../../firebase_config";
// import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { CoursesContext } from "../../context/CoursesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import ModuleDetail from "../moduleDetail/ModuleDetail";
import CourseMetadata from "./CourseMetadata";
// import LearningModule from "../moduleDetail/LearningModule";
// import ModuleMetadata from "../../components/module/ModuleMetadata";

import styles from "./CourseDetail.module.css";

export default function CourseDetail() {
  const navigate = useNavigate();
  const { courseId, moduleId, unitId, contentId } = useParams();

  const [currCourse, setCurrCourse] = useState(null);
  const [modules, setModules] = useState(null);
  // the target module is parsed from the moduleId in the URL
  const [targetMod, setTargetMod] = useState(moduleId);

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

    // updates the target module if the moduleId in the URL changes
    setTargetMod(moduleId);
  }, [allCourses, courseId, navigate]);

  return (
    <div className={styles["course-detail"]}>
      <CourseMetadata course={currCourse} />
      <hr></hr>
      {/* carousel-style clickable elements */}
      <ChooseModule
        courseId={courseId}
        moduleIds={modules}
        active={targetMod}
      />

      {targetMod && (
        <div>
          <ModuleDetail moduleId={targetMod} />
        </div>
      )}
    </div>
  );
}

function ChooseModule({ courseId, moduleIds, active }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(null);

  const routeActiveModule = (buttonId, i) => {
    setIndex(i);
    navigate(`/course/${courseId}/${buttonId}`);
  };

  return (
    <div className={styles.carousel}>
      {moduleIds && (
        <div>
          <ul>
            {moduleIds.map((mod, index) => (
              <li
                key={mod}
                onClick={() => routeActiveModule(mod, index)}
                className={active === mod ? styles.active : {}}
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

// function Carousel({ courseId, modules }) {
//   const { user, purchased } = useAuthContext();
//   const [active, setActive] = useState(
//     parseInt(localStorage.getItem(`activeModuleIndex_${courseId}`)) || 0
//   );

//   const isPurchased = purchased && purchased.includes(modules[active].id);

//   useEffect(() => {
//     localStorage.setItem(`activeModuleIndex_${courseId}`, active);
//   }, [active, courseId]);

//   return (
//     <div className={styles.carousel}>
//       <ul>
//         {modules.map((mod, index) => (
//           <li
//             key={index}
//             onClick={() => setActive(index)}
//             className={active === index ? styles.active : {}}
//           >
//             {mod.id}
//           </li>
//         ))}
//       </ul>
//       {modules.length > 1 && (
//         <small className={styles.hint}>Module #{active + 1}:</small>
//       )}
//       {/* showing the metadata regardless of signin or purchase state */}
//       <ModuleMetadata mod={modules[active]} />
//       <hr></hr>

//       {user ? (
//         <LearningModule mod={modules[active]} purchased={isPurchased} />
//       ) : (
//         <h3 className={styles.prompt}>
//           🗝️ <Link to="/login">Đăng nhập</Link> để xem: các tài liệu miễn phí +
//           toàn bộ modules đã mua
//         </h3>
//       )}
//     </div>
//   );
// }
