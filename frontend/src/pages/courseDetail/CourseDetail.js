import { db } from "../../firebase_config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";

import { CoursesContext } from "../../context/CoursesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import LearningModule from "../module/Module";
import ModuleMetadata from "../module/ModuleMetadata";

import styles from "./CourseDetail.module.css";

export default function CourseDetail() {
  const { cls_id } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    setIsPending(true);
    const classRef = doc(db, "classes", cls_id);

    getDoc(classRef).then(async (classSnapshot) => {
      const moduleIds = classSnapshot.data().modules;
      const results = [];

      if (!moduleIds) {
        setIsPending(false);
        setModules(results);
        return;
      }

      // query all module documents simultaneously by their IDs
      await Promise.all(
        moduleIds.map(async (mod_id) => {
          const moduleRef = doc(db, "modules", mod_id);
          const moduleSnapshot = await getDoc(moduleRef);

          const mod = { ...moduleSnapshot.data(), id: moduleSnapshot.id };
          mod.starts_at = mod.starts_at.toDate();
          mod.ends_at = mod.ends_at.toDate();

          // listen for real-time updates to the module document
          onSnapshot(moduleRef, (doc) => {
            if (doc.exists()) {
              const updatedMod = { ...doc.data(), id: doc.id };
              updatedMod.starts_at = updatedMod.starts_at.toDate();
              updatedMod.ends_at = updatedMod.ends_at.toDate();

              const index = results.findIndex((result) => result.id === doc.id);
              if (index !== -1) {
                results[index] = updatedMod;
                setModules([...results]);
              }
            } else {
              console.log("No such module document!");
            }
          });

          results.push(mod);
        })
      );

      setIsPending(false);
      setModules(results);
    });
  }, [cls_id]);

  return (
    <div className={styles["course-detail"]}>
      <CourseMetadata cls_id={cls_id} />
      <hr></hr>

      {isPending ? (
        <h2>Đợi xíu nha 😙...</h2>
      ) : (
        <div>
          {modules.length > 0 ? (
            <Carousel cls_id={cls_id} modules={modules} />
          ) : (
            <h2>😳 Khóa học này trống trơn, không tìm thấy modules nào.</h2>
          )}
        </div>
      )}
    </div>
  );
}

function Carousel({ cls_id, modules }) {
  const { user, purchased } = useAuthContext();
  const [active, setActive] = useState(
    parseInt(localStorage.getItem(`activeModuleIndex_${cls_id}`)) || 0
  );

  const isPurchased = purchased && purchased.includes(modules[active].id);

  useEffect(() => {
    localStorage.setItem(`activeModuleIndex_${cls_id}`, active);
  }, [active, cls_id]);

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

function CourseMetadata({ cls_id }) {
  const { courses } = useContext(CoursesContext);
  const cls = courses.find((cls) => cls.id === cls_id);

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
