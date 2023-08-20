import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../../firebase_config";
// import { onSnapshot } from "firebase/firestore";
import Sidebar from "./Sidebar";

import styles from "./Unit.module.css";

export default function UnitDetail({ courseId, moduleId, unit }) {
  const unlocked = (unit && unit.unlocked) || false;
  const [contentIds, setContentIds] = useState(null);

  useEffect(() => {
    setContentIds(unit && unit.contents ? unit.contents : []);
  }, [unit]);

  return (
    contentIds && <GuardedUnit contents={contentIds} unlocked={unlocked} />
  );
}

function GuardedUnit({ contents, unlocked }) {
  return (
    <div className={styles["unit-content"]}>
      {contents.length > 0 ? (
        unlocked ? (
          <div>
            <Sidebar />
            {contents.map((content, index) => (
              <Content key={index} contentId={content} />
            ))}
          </div>
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

function Content({ contentId }) {
  console.log("Content", contentId);

  return <div>{contentId}</div>;
}
