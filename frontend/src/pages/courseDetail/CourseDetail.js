import { db } from "../../firebase_config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CoursesContext } from "../../context/CoursesContext";
import LearningModule from "../module/Module";
import styles from "./CourseDetail.module.css";

export default function CourseDetail() {
  const { id } = useParams();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const classRef = doc(db, "classes", id);

    getDoc(classRef).then(async (classSnapshot) => {
      const moduleIds = classSnapshot.data().modules;
      const results = [];

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

      setModules(results);
    });
  }, [id]);
  return (
    modules.length > 0 && (
      <div className={styles["course-detail"]}>
        <CourseMetadata id={id} />
        <Carousel modules={modules} />
      </div>
    )
  );
}

function CourseMetadata({ id }) {
  const { courses } = useContext(CoursesContext);
  const cls = courses.find((cls) => cls.id === id);

  return (
    <div>
      {cls.location && (
        <p className={styles.location}>Địa điểm: {cls.location}</p>
      )}

      <People title="Giảng viên" people={cls.instructors} />
      <People title="Trợ giảng" people={cls.assistants} />
    </div>
  );
}

function People({ title, people }) {
  return (
    <div className={styles.people}>
      {people.length > 1 ? (
        <ul>
          <h3>{title}: </h3>
          {people.map((instructor) => (
            <li id={instructor}>{instructor}</li>
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
  );
}

function Carousel({ modules }) {
  const [index, setIndex] = useState(0);

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
      <LearningModule mod={modules[index]} />
    </div>
  );
}
