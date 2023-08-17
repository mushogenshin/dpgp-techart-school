import { db } from "../../firebase_config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Unit from "../unit/Unit";

import styles from "./Module.module.css";

export default function LearningModule({ mod, purchased }) {
  const [isPending, setIsPending] = useState(false);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    setIsPending(true);
    setUnits([]);

    let contentIDs = [];
    let unsubscribe;

    if (purchased && mod.units) {
      contentIDs = mod.units.flatMap((unit) => unit.contents);

      if (contentIDs.length > 0) {
        console.log(`Fetching content IDs for mod ${mod.id}`);

        unsubscribe = onSnapshot(
          query(
            collection(db, "contents"),
            where("__name__", "in", contentIDs)
          ),
          (snapshot) => {
            const results = mod.units.map((unit) => {
              const contents = snapshot.docs
                .filter((doc) => unit.contents.includes(doc.id))
                .map((doc) => ({ ...doc.data(), id: doc.id }));
              return { ...unit, contents };
            });

            setIsPending(false);
            setUnits(results);
          },
          (error) => {
            console.log(error.message);
            setIsPending(false);
          }
        );
      } else {
        setIsPending(false); // empty units, nothing to fetch
      }
    } else {
      setIsPending(false); // not purchased or empty module, nothing to do
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [purchased, mod]);

  if (!purchased) {
    return (
      <h3>
        📺 Để xem video bài giảng, liên lạc DPGP để mua module này (👉 {mod.id})
      </h3>
    );
  }

  return isPending ? (
    <p>Đang tải nội dung bài giảng ⏱️ ...</p>
  ) : (
    <div className={styles.mod}>
      {units.length > 0 ? (
        <Carousel moduleId={mod.id} units={units} />
      ) : (
        <h3>😳 Module này trống trơn, không tìm thấy nội dung nào.</h3>
      )}
    </div>
  );
}

function Carousel({ moduleId, units }) {
  const [active, setActive] = useState(
    parseInt(localStorage.getItem(`activeUnitIndex_${moduleId}`)) || 0
  );

  useEffect(() => {
    localStorage.setItem(`activeUnitIndex_${moduleId}`, active);
  }, [active, moduleId]);

  const handleUnitChange = (index) => {
    setActive(index);
  };

  return (
    <div className={styles.carousel}>
      <ul>
        {units.map((unit, index) => (
          <li
            key={index}
            onClick={() => handleUnitChange(index)}
            className={active === index ? styles.active : {}}
          >
            {unit.name || `Unit ${index + 1}`}
          </li>
        ))}
      </ul>

      <Unit contents={units[active].contents} />
    </div>
  );
}
