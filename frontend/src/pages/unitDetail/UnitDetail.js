import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchContents } from "../../hooks/useFetchContents";
import Sidebar from "./Sidebar";

import styles from "./Unit.module.css";

export default function UnitDetail({ unit, setShowSidebar }) {
  const unlocked = (unit && unit.unlocked) || false;
  const [contentIds, setContentIds] = useState(null);

  useEffect(() => {
    // wait for unit to be fetched before setting contentIds
    setContentIds(unit && unit.contents ? unit.contents : []);

    // only show sidebar if there are contents and the unit is unlocked
    setShowSidebar(contentIds && unlocked ? true : false);
  }, [unit, contentIds, unlocked, setShowSidebar]);

  return (
    contentIds && <GuardedUnit contentIds={contentIds} unlocked={unlocked} />
  );
}

function GuardedUnit({ contentIds, unlocked }) {
  const navigate = useNavigate();
  const { contentId: contentParam } = useParams();
  const { contents, error, isPending } = useFetchContents(contentIds, unlocked);
  const [targetLesson, setTargetLesson] = useState(null);

  useEffect(() => {
    if (contents && contentParam) {
      // find the lesson with the specified content ID
      const lessons = contents.flatMap((content) => content.lessons);
      // const contentLookup = contents.find(
      //   (content) => content.id === contentParam
      // );

      console.log("Contents:", contents);
      console.log("Content param:", contentParam);
      console.log("Lessons:", lessons);

      // if (!contentLookup) {
      //   navigate("/404");
      //   return;
      // }
    }
  }, [contents, contentParam, navigate]);

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
                  {/* {contents.map((content, index) => (
                    <Content key={index} content={content} />
                  ))} */}
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
  const { contentId } = useParams();

  return <div>TODO: show {contentId}</div>;
}
