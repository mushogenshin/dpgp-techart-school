import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchContents } from "../../hooks/useFetchContents";
import Sidebar from "./Sidebar";
import Lesson from "../lesson/Lesson";
import ContentBlock from "../../components/ContentBlock/ContentBlock";

import styles from "./Unit.module.css";

export default function UnitDetail({ unit, setShowSidebar }) {
  const unlocked = (unit && unit.unlocked) || false;
  const [contentIds, setContentIds] = useState(null);
  const [preface, setPreface] = useState(null);
  const [postscript, setPostscript] = useState(null);

  useEffect(() => {
    // wait for unit to be fetched before setting contentIds
    setContentIds(unit && unit.contents ? unit.contents : []);
    setPreface(unit && unit.preface_blocks ? unit.preface_blocks : []);
    setPostscript(unit && unit.postscript_blocks ? unit.postscript_blocks : []);

    // only show sidebar if there are contents and the unit is unlocked
    setShowSidebar(contentIds && unlocked ? true : false);
  }, [unit, contentIds, unlocked, setShowSidebar]);

  return (
    <div className={styles["unit-content"]}>
      {preface && <Pin blocks={preface} />}
      {contentIds && (
        <GuardedUnit contentIds={contentIds} unlocked={unlocked} />
      )}
      {postscript && <Pin blocks={postscript} />}
    </div>
  );
}

// Blocks that are stayed throughout the unit regardless of active lesson.
function Pin({ blocks }) {
  return (
    <div className={styles.pin}>
      {blocks.map((block, index) => (
        <ContentBlock key={index} block={block} />
      ))}
    </div>
  );
}

function GuardedUnit({ contentIds, unlocked }) {
  const navigate = useNavigate();
  const { courseId, modId, unitId, lessonId: lessonParam } = useParams();
  const { contents, error, isPending } = useFetchContents(contentIds, unlocked);
  const [targetLesson, setTargetLesson] = useState(null);

  useEffect(() => {
    if (contents && lessonParam) {
      // find the lesson with the specified lesson ID
      const lessons = contents.flatMap((content) => content.lessons);
      const lessonLookup = lessons.find((lesson) => lesson.id === lessonParam);

      if (!lessonLookup) {
        navigate("/404");
        return;
      } else {
        setTargetLesson(lessonLookup);
      }
    } else {
      setTargetLesson(null);
    }

    // if (!lessonParam && contents && contents.length > 0) {
    //   // if no lesson param is specified, redirect to the first lesson
    //   navigate(
    //     `/course/${courseId}/${modId}/${unitId}/${contents[0].lessons[0].id}`,
    //     { replace: true }
    //   );
    // }
  }, [contents, lessonParam, navigate]);

  return (
    <div>
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
                  {targetLesson && <Lesson lesson={targetLesson} />}
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
