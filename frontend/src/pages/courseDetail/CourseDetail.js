import { db } from "../../firebase_config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { CoursesContext } from "../../context/CoursesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import LearningModule from "../../components/module/LearningModule";
import ModuleMetadata from "../../components/module/ModuleMetadata";

import styles from "./CourseDetail.module.css";

export default function CourseDetail() {
  const navigate = useNavigate();
  const { courses } = useContext(CoursesContext);
  const { courseId, moduleId, unitId, contentId } = useParams();

  console.log(courseId, moduleId, unitId, contentId);

  const [isPending, setIsPending] = useState(false);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    // if (!courses.find((cls) => cls.id === courseId)) {
    //   navigate("/404");
    //   return;
    // }

    setIsPending(true);
    const classRef = doc(db, "classes", courseId);

    getDoc(classRef).then(async (classSnapshot) => {
      const moduleIds = classSnapshot.data().modules;
      const results = [];

      if (moduleIds) {
        const unsubscribes = [];

        // query all module documents simultaneously by their IDs
        await Promise.all(
          moduleIds.map(async (moduleId) => {
            const moduleRef = doc(db, "modules", moduleId);
            const moduleSnapshot = await getDoc(moduleRef);

            const mod = { ...moduleSnapshot.data(), id: moduleSnapshot.id };
            mod.starts_at = mod.starts_at.toDate();
            mod.ends_at = mod.ends_at.toDate();

            // listen for real-time updates to the module document
            const unsub = onSnapshot(moduleRef, (doc) => {
              if (doc.exists()) {
                const updatedMod = { ...doc.data(), id: doc.id };
                updatedMod.starts_at = updatedMod.starts_at.toDate();
                updatedMod.ends_at = updatedMod.ends_at.toDate();

                const index = results.findIndex(
                  (result) => result.id === doc.id
                );
                if (index !== -1) {
                  results[index] = updatedMod;
                  setModules([...results]);
                }
              } else {
                console.log("No such module document!");
              }
            });

            unsubscribes.push(unsub);
            results.push(mod);
          })
        );

        setIsPending(false);
        setModules(results);

        // return a cleanup function that unsubscribes from all listeners
        return () => {
          unsubscribes.forEach((unsubscribe) => unsubscribe());
        };
      }
    });
  }, [courseId, navigate]);

  return (
    <div className={styles["course-detail"]}>
      <CourseMetadata courseId={courseId} />
      <hr></hr>

      {isPending ? (
        <h2>Đợi xíu nha 😙...</h2>
      ) : (
        <div>
          {modules.length > 0 ? (
            <Carousel courseId={courseId} modules={modules} />
          ) : (
            <h2>😳 Khóa học này trống trơn, không tìm thấy modules nào.</h2>
          )}
        </div>
      )}
    </div>
  );
}

function Carousel({ courseId, modules }) {
  const { user, purchased } = useAuthContext();
  const [active, setActive] = useState(
    parseInt(localStorage.getItem(`activeModuleIndex_${courseId}`)) || 0
  );

  const isPurchased = purchased && purchased.includes(modules[active].id);

  useEffect(() => {
    localStorage.setItem(`activeModuleIndex_${courseId}`, active);
  }, [active, courseId]);

  return (
    <div className={styles.carousel}>
      <ul>
        {modules.map((mod, index) => (
          <li
            key={index}
            onClick={() => setActive(index)}
            className={active === index ? styles.active : {}}
          >
            {mod.id}
          </li>
        ))}
      </ul>
      {modules.length > 1 && (
        <small className={styles.hint}>Module #{active + 1}:</small>
      )}
      {/* showing the metadata regardless of signin or purchase state */}
      <ModuleMetadata mod={modules[active]} />
      <hr></hr>

      {user ? (
        <LearningModule mod={modules[active]} purchased={isPurchased} />
      ) : (
        <h3 className={styles.prompt}>
          🗝️ <Link to="/login">Đăng nhập</Link> để xem: các tài liệu miễn phí +
          toàn bộ modules đã mua
        </h3>
      )}
    </div>
  );
}

function CourseMetadata({ courseId }) {
  const { courses } = useContext(CoursesContext);
  const cls = courses.find((cls) => cls.id === courseId);

  return (
    // if user accesses this page directly, cls may not be fetched completely yet,
    // so we need to check if cls is undefined before trying to access its properties
    cls && (
      <div>
        {cls.location && (
          <p className={styles.location}>Địa điểm: {cls.location}</p>
        )}

        <People title="Giảng viên" people={cls.instructors} />
        <People title="Trợ giảng" people={cls.assistants} />
      </div>
    )
  );
}

function People({ title, people }) {
  return (
    people && (
      <div className={styles.people}>
        {people.length > 1 ? (
          <ul>
            <h3>{title}: </h3>
            {people.map((instructor) => (
              <li key={instructor}>{instructor}</li>
            ))}
          </ul>
        ) : (
          <div>
            {people.length > 0 && (
              <p>
                <span className={styles.title}>{title}: </span>
                <span className={styles.person}>{people}</span>
              </p>
            )}
          </div>
        )}
      </div>
    )
  );
}
