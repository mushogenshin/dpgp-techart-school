import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase_config";
import { onSnapshot, query, collection, where } from "firebase/firestore";
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
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [contents, setContents] = useState(null);

  useEffect(() => {
    let unsubscribe;
    setError(null);
    setIsPending(true);

    if (contentIds.length > 0 && unlocked) {
      // fetch contents from content IDs
      const contentRef = query(
        collection(db, "contents"),
        where("__name__", "in", contentIds)
      );
      unsubscribe = onSnapshot(
        contentRef,
        (snapshot) => {
          const results = snapshot.docs.map((doc) => {
            const contentData = doc.data();
            return {
              ...contentData,
              id: doc.id,
            };
          });
          setError(null);
          setContents(results);
          setIsPending(false);
        },
        (error) => {
          setError(error.message);
          setContents(null);
          setIsPending(false);
        }
      );
    } else {
      setError(null);
      setContents(null);
      setIsPending(false);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [contentIds, unlocked]);

  return (
    <div className={styles["unit-content"]}>
      {contentIds.length > 0 ? (
        unlocked ? (
          <div>
            {error && <h2>😳 {error}</h2>}
            {isPending ? (
              <p>Đợi xíu nha 😙...</p>
            ) : (
              contents && (
                <div>
                  <Sidebar contents={contents} />
                  {contents.map((content, index) => (
                    <Content key={index} content={content} />
                  ))}
                </div>
              )
            )}
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

function Content({ content }) {
  return <div>TODO: show {content.id}</div>;
}
