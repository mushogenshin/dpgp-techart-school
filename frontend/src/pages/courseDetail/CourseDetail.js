import { db } from "../../firebase_config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CoursesContext } from "../../context/CoursesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import LearningModule from "../module/Module";

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

      if (moduleIds) {
        // query all module documents simultaneously by their IDs
        await Promise.all(
          moduleIds.map(async (mod_id) => {
            const moduleRef = doc(db, "modules", mod_id);
            const moduleSnapshot = await getDoc(moduleRef);

            const mod = { ...moduleSnapshot.data(), id: moduleSnapshot.id };
            mod.starts_at = mod.starts_at.toDate();
            mod.ends_at = mod.ends_at.toDate();

            results.push(mod);
          })
        );
      }

      setIsPending(false);
      setModules(results);
    });
  }, [cls_id]);

  return (
    <div className={styles["course-detail"]}>
      <CourseMetadata cls_id={cls_id} />
      <hr></hr>
      {isPending ? (
        <h2>Đợi xíu nha...</h2>
      ) : (
        <div>
          {modules.length > 0 ? (
            <Carousel modules={modules} />
          ) : (
            <h2>Khóa học này trống trơn, không tìm thấy modules nào.</h2>
          )}
        </div>
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
                <span className={styles.title}>{title}:</span>
                <span className={styles.person}>{people}</span>
              </p>
            )}
          </div>
        )}
      </div>
    )
  );
}

function Carousel({ modules }) {
  const { purchased } = useAuthContext();
  const [index, setIndex] = useState(0);

  const isPurchased = purchased && purchased.includes(modules[index].id);

  return (
    <div className={styles.carousel}>
      <ul>
        {modules.map((mod, i) => (
          <li
            key={i}
            onClick={() => setIndex(i)}
            className={index === i ? styles.active : {}}
          >
            {mod.id}
          </li>
        ))}
      </ul>
      {modules.length > 1 && (
        <small className={styles.hint}>Module #{index + 1}:</small>
      )}

      <LearningModule mod={modules[index]} isPurchased={isPurchased} />
    </div>
  );
}
