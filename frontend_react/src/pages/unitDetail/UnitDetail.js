import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCoursesContext } from "../../hooks/auth/useCoursesContext";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useNavigateFirstLesson } from "../../hooks/firestore/useNavigateFirstLesson";
import { useFetchContents } from "../../hooks/firestore/useFetchContents";

import Sidebar from "./Sidebar";
import Lesson from "../lesson/Lesson";
import ContentBlock from "../../components/contentBlock/ContentBlock";

import styles from "./Unit.module.css";

export default function UnitDetail({ unitData, isPurchased, setShowSidebar }) {
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
          contentIds={contentIds}
          bypass={!unlocked}
          isPurchased={isPurchased}
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
 * @param {Array<string>} contentIds: content references for the Unit
 * @param {boolean} bypass: if true, bypass fetching contents, e.g. when the
 * Unit is locked, or the content refs is empty
 */
function PreviewAndContents({ contentIds, bypass, isPurchased }) {
  const navigate = useNavigate();
  const { elevatedRole } = useAuthContext();
  const { modId, lessonId: lessonParam } = useParams();
  const { contents, error, isPending } = useFetchContents(
    contentIds,
    bypass,
    !isPurchased // only fetch teasers if not purchased
  );
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

  return (
    <>
      {/* ADMIN: show the content IDs for ease of backtracking  */}
      {elevatedRole && (
        <div className={styles.debug}>
          <h3>🔑 Content IDs: </h3>
          <ul>
            {contentIds.map((id) => (
              <li key={id}>
                <pre>{id}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contentIds.length > 0 ? (
        <>
          {error && <h2>😳 Failed to fetch content: {error}</h2>}

          {isPending ? (
            <p>Đợi xíu nha 😙...</p>
          ) : (
            <>
              {contents && (
                <>
                  {/* renders the full sidebar tree */}
                  <Sidebar contents={contents} />

                  {/* renders only the active lesson */}
                  {targetLesson && <Lesson lesson={targetLesson} />}
                </>
              )}

              {/* prompt users to purchase if they are viewing teasers */}
              {!isPurchased && (
                <h3>
                  📺 Để xem toàn bộ video bài giảng, hãy liên lạc DPGP để mua
                  module này (👉 {modId})
                </h3>
              )}
            </>
          )}
        </>
      ) : (
        <h3>😳 Unit này trống trơn, không tìm thấy nội dung nào</h3>
      )}
    </>
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
