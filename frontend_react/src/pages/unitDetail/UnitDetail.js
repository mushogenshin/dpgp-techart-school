import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { useNavigateFirstLesson } from "../../hooks/firestore/useNavigateFirstLesson";
import { useFetchContents } from "../../hooks/firestore/useFetchContents";

import Sidebar from "./Sidebar";
import Lesson from "../lesson/Lesson";
import ContentBlock from "../../components/contentBlock/ContentBlock";

import styles from "./Unit.module.css";

export default function UnitDetail({ isPurchased, unitData, setShowSidebar }) {
  const { ignoreLockedModules } = useCoursesContext();
  // unit is considered unlocked if it's explicitly unlocked or if there's admin override
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

  // TODO: show sidebar even for non-paying customers, but limit the content
  useEffect(() => {
    // only show sidebar if the unit is unlocked and there are actual contents to show
    const should_open = unlocked && contentIds.length > 0 ? true : false;
    setShowSidebar(should_open);
  }, [unitData, contentIds, unlocked, setShowSidebar]);

  return unlocked ? (
    <div className={styles["unit-content"]}>
      {/* pinned preface, won't be shown in teasers */}
      {isPurchased && preface && <Pin blocks={preface} />}

      {/* modify fetched contents if the Unit is locked */}
      {
        <PreviewAndContents
          isPurchased={isPurchased}
          contentIds={contentIds}
          bypass={!unlocked}
        />
      }

      {/* pinned postscript, won't be shown in teasers */}
      {isPurchased && postscript && <Pin blocks={postscript} />}
    </div>
  ) : (
    <h3>🔏 Nội dung này còn đang bị khoá (vì chưa đến thời điểm được mở)</h3>
  );
}

/**
 * Fetches the contents of the Unit, but renders only the content of the active
 * Lesson.
 * @param {boolean} bypass: if true, bypass fetching contents, e.g. when the
 * Unit is locked
 */
function PreviewAndContents({ isPurchased, contentIds, bypass }) {
  const navigate = useNavigate();
  const { modId, lessonId: lessonParam } = useParams();
  // TODO: fetch partially if not purchased, i.e. teasers
  const { contents, error, isPending } = useFetchContents(contentIds, bypass);
  const [targetLesson, setTargetLesson] = useState(null);

  useEffect(() => {
    // find the lesson with the specified lesson ID
    if (lessonParam && contents) {
      // NOTE: some the content doc may contain undefined lessons
      const lessons = contents.map((content) => content?.lessons ?? []).flat();
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

  return isPurchased ? (
    <div>
      {contentIds.length > 0 ? (
        <div>
          {error && <h2>😳 Failed to fetch content: {error}</h2>}
          {isPending ? (
            <p>Đợi xíu nha 😙...</p>
          ) : (
            contents && (
              <div>
                {/* renders the full sidebar tree */}
                <Sidebar contents={contents} />

                {/* renders only the active lesson */}
                {/* TODO: check if it belongs to teaser lessons and render conditionally */}
                {targetLesson && <Lesson lesson={targetLesson} />}
              </div>
            )
          )}
        </div>
      ) : (
        <h3>😳 Unit này trống trơn, không tìm thấy nội dung nào.</h3>
      )}
    </div>
  ) : (
    <h3>
      📺 Để xem toàn bộ video bài giảng, hãy liên lạc DPGP để mua module này (👉{" "}
      {modId})
    </h3>
  );
}

/**
 * Contents that stay throughout the unit regardless of active lesson.
 * @param {Array<ContentBlock>} blocks
 */
function Pin({ blocks }) {
  return (
    <div className={styles.pin}>
      {blocks.map((block, index) => (
        <ContentBlock key={index} inner={block} />
      ))}
    </div>
  );
}
