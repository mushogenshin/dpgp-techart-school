import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../../firebase_config";
// import { onSnapshot } from "firebase/firestore";
import Sidebar from "./Sidebar";

import styles from "./Unit.module.css";

export default function UnitDetail({
  courseId,
  moduleId,
  unit,
  setShowSidebar,
}) {
  const unlocked = (unit && unit.unlocked) || false;
  const [contentIds, setContentIds] = useState(null);

  useEffect(() => {
    setContentIds(unit && unit.contents ? unit.contents : []);
    setShowSidebar(contentIds && unlocked ? true : false);
  }, [unit, contentIds, unlocked, setShowSidebar]);

  return (
    contentIds && <GuardedUnit contentIds={contentIds} unlocked={unlocked} />
  );
}

function GuardedUnit({ contentIds, unlocked }) {
  return (
    <div className={styles["unit-content"]}>
      {contentIds.length > 0 ? (
        unlocked ? (
          <div>
            <Sidebar />
            {contentIds.map((content, index) => (
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
