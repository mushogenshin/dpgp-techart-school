import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase_config";
import { onSnapshot } from "firebase/firestore";

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
          contents.map((content, index) => (
            <Content key={index} contentId={content} />
          ))
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

  return (
    <div>
      {contentId}

      <div class={styles.sidebar}>
        {/* <h2>Menu</h2> */}
        <ul>
          <li>
            <a href="#">Itemaaaaaaaaaaaaaaaaaaaaaaaa 1</a>
          </li>
          <li>
            <a href="#">Itemaaaaaaaaaaaaaaaaaaaaaaaa 2</a>
          </li>
          <li>
            <a href="#">Itemaaaaaaaaaaaaaaaaaaaaaaaa 3</a>
          </li>
          <li>
            <a href="#">Itemaaaaaaaaaaaaaaaaaaaaaaaa 4</a>
          </li>
          <li>
            <a href="#">Itemaaaaaaaaaaaaaaaaaaaaaaaa 5</a>
          </li>
          <li>
            <a href="#">Itemaaaaaaaaaaaaaaaaaaaaaaaa 6</a>
          </li>
          <li>
            <a href="#">Itemaaaaaaaaaaaaaaaaaaaaaaaa 7</a>
          </li>
          <li>
            <a href="#">Itemaaaaaaaaaaaaaaaaaaaaaaaa 8</a>
          </li>
          <li>
            <a href="#">Itemaaaaaaaaaaaaaaaaaaaaaaaa 9</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
