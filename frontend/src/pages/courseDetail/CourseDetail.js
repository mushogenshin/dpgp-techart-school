import { db } from "../../firebase_config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        <Carousel modules={modules} />
      </div>
    )
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
      <small>
        Module {index + 1} of {modules.length}:
      </small>
      <LearningModule mod={modules[index]} />
    </div>
  );
}
