import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase_config";
import { doc, getDoc } from "firebase/firestore";

/**
 * Automatically navigates to the first lesson of the unit if the URL params
 * don't already specify a lesson param.
 */
export function useNavigateFirstLesson(unitData) {
  const navigate = useNavigate();
  const { courseId, modId, unitId, lessonId: lessonParam } = useParams();

  useEffect(() => {
    if (
      !lessonParam &&
      unitId &&
      unitData.contents &&
      unitData.contents.length > 0
    ) {
      const contentRef = doc(db, "contents", unitData.contents[0]);

      getDoc(contentRef)
        .then((doc) => {
          if (doc.exists()) {
            const contentData = { ...doc.data(), id: doc.id };
            const firstLesson =
              contentData.lessons && contentData.lessons.length > 0
                ? contentData.lessons[0]
                : null;

            if (firstLesson) {
              navigate(
                `/course/${courseId}/${modId}/${unitId}/${firstLesson.id}`,
                {
                  replace: true,
                }
              );
            }
          }
        })
        .catch((error) => {
          console.warn("Error getting content:", error.message);
        });
    }
  }, [courseId, modId, unitId, lessonParam, unitData, navigate]);
}
