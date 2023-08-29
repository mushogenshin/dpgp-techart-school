import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { useNavigateFirstLesson } from "../../hooks/firestore/useNavigateFirstLesson";
import { useFetchContents } from "../../hooks/firestore/useFetchContents";

import Sidebar from "./Sidebar";
import Lesson from "../lesson/Lesson";
import ContentBlock from "../../components/ContentBlock/ContentBlock";

import styles from "./Unit.module.css";

export default function UnitDetail({ unitData, setShowSidebar }) {
  const { ignoreLockedModules } = useCoursesContext();
  const unlocked =
    ignoreLockedModules || (unitData && unitData.unlocked) || false;

  const contentIds = useMemo(
    () => (unitData && unitData.contents ? unitData.contents : []),
    [unitData]
  );

  const preface =
    unitData && unitData.preface_blocks ? unitData.preface_blocks : [];
  const postscript =
    unitData && unitData.postscript_blocks ? unitData.postscript_blocks : [];

  useNavigateFirstLesson(unitData);

  useEffect(() => {
    // only show sidebar if there are contents and the unit is unlocked
    const should_open = unlocked && contentIds.length > 0 ? true : false;
    setShowSidebar(should_open);
  }, [unitData, contentIds, unlocked, setShowSidebar]);

  return unlocked ? (
    <div className={styles["unit-content"]}>
      {preface && <Pin blocks={preface} />}
      {/* bypass fetching contents if the unit is locked */}
      {<GuardedContents contentIds={contentIds} bypass={!unlocked} />}
      {postscript && <Pin blocks={postscript} />}
    </div>
  ) : (
    <h3>🔏 Nội dung này còn đang bị khoá (vì chưa đến thời điểm được mở)</h3>
  );
}

function GuardedContents({ contentIds, bypass }) {
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
