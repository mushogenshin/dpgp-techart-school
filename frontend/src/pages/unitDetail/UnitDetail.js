import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchContents } from "../../hooks/firestore/useFetchContents";
import Sidebar from "./Sidebar";
import Lesson from "../lesson/Lesson";
import ContentBlock from "../../components/ContentBlock/ContentBlock";

import styles from "./Unit.module.css";

export default function UnitDetail({ unit, setShowSidebar }) {
  const unlocked = (unit && unit.unlocked) || false;
  const contentIds = useMemo(
    () => (unit && unit.contents ? unit.contents : []),
    [unit]
  );
  const preface = unit && unit.preface_blocks ? unit.preface_blocks : [];
  const postscript =
    unit && unit.postscript_blocks ? unit.postscript_blocks : [];

  useEffect(() => {
    // only show sidebar if there are contents and the unit is unlocked
    setShowSidebar(contentIds && unlocked ? true : false);
  }, [unit, contentIds, unlocked, setShowSidebar]);

  return unlocked ? (
    <div className={styles["unit-content"]}>
      {preface && <Pin blocks={preface} />}
      {/* bypass fetching contents if the unit is locked */}
      {<GuardedUnit contentIds={contentIds} bypass={!unlocked} />}
      {postscript && <Pin blocks={postscript} />}
    </div>
  ) : (
    <h3>🔏 Nội dung này còn đang bị khoá (vì chưa đến thời điểm được mở)</h3>
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

function GuardedUnit({ contentIds, bypass }) {
  const navigate = useNavigate();
  const { lessonId: lessonParam } = useParams();
  const { contents, error, isPending } = useFetchContents(contentIds, bypass);
  const [targetLesson, setTargetLesson] = useState(null);

  useEffect(() => {
    if (lessonParam && contents) {
      // find the lesson with the specified lesson ID
      const lessons = contents.flatMap((content) => content.lessons);
      const lessonLookup = lessons.find((lesson) => lesson.id === lessonParam);

      if (!lessonLookup) {
        setTargetLesson(null);
        navigate("/404");
        return;
      } else {
        setTargetLesson(lessonLookup);
      }
    } else {
      setTargetLesson(null);
    }
  }, [contents, lessonParam, navigate]);

  return (
    <div>
      {contentIds.length > 0 ? (
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
        <h3>😳 Unit này trống trơn, không tìm thấy nội dung nào.</h3>
      )}
    </div>
  );
}
