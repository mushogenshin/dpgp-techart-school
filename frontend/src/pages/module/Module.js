import { db } from "../../firebase_config";
import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import styles from "./Module.module.css";

export default function LearningModule({ mod, purchased }) {
  const [isPending, setIsPending] = useState(false);
  const [units, setUnits] = useState([]);
  const [unitType, setUnitType] = useState("");

  useEffect(() => {
    const fetchUnits = async () => {
      if (purchased && mod.units) {
        console.log("Fetching", mod.units);

        setIsPending(true);
        const contentsRef = collection(db, "contents");

        try {
          const results = [];
          for (const unit of mod.units) {
            const snapshots = await Promise.all(
              unit.contents.map(
                async (contentId) => await getDoc(doc(contentsRef, contentId))
              )
            );
            const unitData = {
              contents: snapshots.map((snapshot) => {
                return { ...snapshot.data(), id: snapshot.id };
              }),
            };
            results.push(unitData);
          }
          setUnits(results);
          setUnitType(mod.unit_type || "unknown unit type");
        } catch (error) {
          console.log(error);
        } finally {
          setIsPending(false);
        }
      }
    };

    fetchUnits();
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
  }, [active]);

  console.log(units);

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
