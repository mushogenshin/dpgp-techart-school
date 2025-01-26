import { useState, useEffect } from "react";
import { db } from "../../firebase_config";
import { onSnapshot, query, collection, where } from "firebase/firestore";

/**
 * Fetches contents from Firestore based on an array of content IDs.
 * @param {Array<string>} contentIds: an array of content IDs to fetch
 * @param {boolean} bypass: if true, bypass fetching contents
 * @param {boolean} onlyTeasers: if true, modify the fetched contents to show only teasers
 * @returns {Object} an object containing the fetched contents, error, and pending status
 */
export function useFetchContents(
  contentIds,
  bypass = false,
  onlyTeasers = false
) {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [contents, setContents] = useState(null);

  useEffect(() => {
    setContents(null);
    setError(null);
    setIsPending(true);
    let unsubscribe;

    if (bypass) {
      return;
    }

    if (contentIds.length > 0) {
      // fetch contents from content IDs
      const contentRef = query(
        collection(db, "contents"),
        where("__name__", "in", contentIds)
      );
      unsubscribe = onSnapshot(
        contentRef,
        (contentSnapshot) => {
          // NOTE: `onSnapshot` is async, therefore there is a chance that the
          // contentData objects may be returned in a different order
          const results = contentSnapshot.docs.map((contentDoc) => {
            const contentData = contentDoc.data();
            console.log("Fetched contentData:", contentData);
            return {
              ...contentData,
              id: contentDoc.id,
            };
          });

          // therefore we must sort the results array based on the order of the
          // contentIds array
          const sortedResults = contentIds.map((id) =>
            results.find((result) => result.id === id)
          );

          if (onlyTeasers) {
            // modify the fetched content to show only teasers
            sortedResults.forEach((content) => {
              // some content doc may be undefined
              if (content && content.lessons) {
                content.lessons = content.lessons.map((lesson) => {
                  if (lesson.allows_peek || false) {
                    return lesson;
                  } else {
                    return {
                      ...lesson,
                      blocks: lesson.blocks.map((block) => {
                        return {
                          ...block,
                          type: "image",
                          data: "https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/login-instructions%2Flock_icon_128x128.png?alt=media&token=af5e3630-8cb8-45c9-9bf0-ef50e0b8ebd6",
                        };
                      }),
                    };
                  }
                });
              }
            });
          }

          setError(null);
          setContents(sortedResults);
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
      setContents([]);
      setIsPending(false);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [contentIds, bypass]);

  return { contents, error, isPending };
}
