import { db } from "../../firebase_config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import styles from "./Module.module.css";

export default function LearningModule({ mod, purchased }) {
  const [isPending, setIsPending] = useState(false);
  const [units, setUnits] = useState([]);
  const [unitType, setUnitType] = useState("");

  useEffect(() => {
    if (!purchased) {
      return;
    }

    const contentIDs = mod.units.flatMap((unit) => unit.contents);

    if (contentIDs.length === 0) {
      return;
    }

    console.log("Fetching content IDs", contentIDs);

    const unsubscribe = onSnapshot(
      query(collection(db, "contents"), where("__name__", "in", contentIDs)),
      (snapshot) => {
        const results = mod.units.map((unit) => {
          const contents = snapshot.docs
            .filter((doc) => unit.contents.includes(doc.id))
            .map((doc) => ({ ...doc.data(), id: doc.id }));
          return { contents };
        });

        setUnits(results);
      },
      (error) => {
        console.log(error);
      }
    );

    setUnitType(mod.unit_type || "unknown unit type");
    setIsPending(false);

    return () => unsubscribe();
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
        <Carousel mod_id={mod.id} units={units} unitType={unitType} />
      ) : (
        <h3>😳 Module này trống trơn, không tìm thấy nội dung nào.</h3>
      )}
    </div>
  );
}

function Carousel({ mod_id, units, unitType }) {
  const [active, setActive] = useState(
    parseInt(localStorage.getItem(`activeUnitIndex_${mod_id}`)) || 0
  );

  useEffect(() => {
    localStorage.setItem(`activeUnitIndex_${mod_id}`, active);
  }, [active, mod_id]);

  return (
    <div className={styles.carousel}>
      <ul>
        {units.map((unit, index) => (
          <li
            key={index}
            onClick={() => setActive(index)}
            className={active === index ? styles.active : {}}
          >
            {/* {unit} */}
            HUHU
          </li>
        ))}
      </ul>
      {units.length > 1 && (
        <small className={styles.hint}>
          {unitType.toUpperCase()} #{active + 1}:
        </small>
      )}
      {/* <LearningModule mod={weeks[active]} /> */}
    </div>
  );
}
