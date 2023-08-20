import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase_config";
import { onSnapshot } from "firebase/firestore";

import styles from "./Unit.module.css";

export default function UnitDetail({ courseId, moduleId, unit }) {
  const unlocked = (unit && unit.unlocked) || false;
  const [contents, setContents] = useState(null);

  // console.log("UnitDetail", unit);

  useEffect(() => {
    setContents(unit && unit.contents ? unit.contents : []);
  }, [unit]);

  return contents && <GuardedUnit contents={contents} unlocked={unlocked} />;
}

function GuardedUnit({ contents, unlocked }) {
  return (
    <div className={styles.unit}>
      {contents.length > 0 ? (
        unlocked ? (
          <p></p>
        ) : (
          <h3>
            🔏 Nội dung này còn đang bị khoá (vì chưa đến thời điểm được mở)
          </h3>
        )
      ) : (
        <h3>😳 Module này trống trơn, không tìm thấy nội dung nào.</h3>
      )}
    </div>
  );
}
