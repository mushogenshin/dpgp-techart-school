import { useState, useEffect } from "react";
import { db } from "../../firebase_config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCollection } from "../../hooks/firestore/useCollection";
import LessonBlockForm from "./LessonBlockForm";

import styles from "./Admin.module.css";

export default function InsertLesson() {
  const [collapsed, setCollapsed] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // context for the form
  const { documents: allContents } = useCollection("contents");
  const [contentIds, setContentIds] = useState(null);
  const [query, setQuery] = useState("");
  const [filteredContentIds, setFilteredContentIds] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);

  // the form fields
  const [lessonId, setLessonId] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [appendLesson, setAppendLesson] = useState(true);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [blocks, setBlocks] = useState([{ type: "", data: "" }]);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  useEffect(() => {
    // this will help us keep the filtered list of content IDs populated
    // at the start, and for subsequent form submissions
    const filtered = query
      ? contentIds.filter((id) => id.toLowerCase().includes(query))
      : contentIds;
    setFilteredContentIds(filtered);
  }, [contentIds, query]);

  useEffect(() => {
    setContentIds(
      (allContents && allContents.map((content) => content.id)) || []
    );
  }, [allContents]);

  const insertLessonAtIndex = async (insertion) => {
    const docRef = doc(db, "contents", selectedContentId);

    // Get the current lesson array
    const docSnap = await getDoc(docRef);
    const lessons = docSnap.data().lessons || [];

    // function to insert the new element at the specified index
    const inserted = () => {
      const pre = lessons.slice(0, lessonIndex);
      const post = lessons.slice(lessonIndex);
      return [...pre, insertion, ...post];
    };

    const updated = appendLesson ? [...lessons, insertion] : inserted();

    // Update with the modified array
    await updateDoc(docRef, {
      lessons: updated,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // return if any of the required fields are empty
    if (!selectedContentId || lessonId === "" || lessonName === "") {
      setError("Cần điền đủ thông tin");
      setSuccess(false);
      return;
    }

    setError(null);
    setSuccess(false);

    // prepare the new Lesson object
    const newLesson = {
      id: lessonId,
      name: lessonName,
      blocks: blocks,
    };

    console.log(newLesson);

    insertLessonAtIndex(newLesson)
      .then(() => {
        setError(null);
        setSuccess(true);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess(false);
      });
  };

  const label = `${collapsed ? "👉" : "👇"} Chèn nội dung Lesson`;

  return (
    <div>
      <button
        className={styles.collapsibleHeader}
        onClick={() => setCollapsed(!collapsed)}
      >
        {label}
      </button>

      {!collapsed && (
        <div className={collapsed ? "" : styles.section}>
          <form onSubmit={handleSubmit}>
            {/* List of available contents, with filtering */}
            <label htmlFor="contentId">Parent Content ID:</label>
            <div>
              🔍{" "}
              <input
                type="text"
                value={query}
                placeholder="Filter content IDs"
                onChange={(event) => {
                  setQuery(event.target.value.toLowerCase());
                }}
              />
            </div>

            {selectedContentId && (
              <span className={styles.preview}>
                Đang chọn 👉: "{selectedContentId}"
              </span>
            )}

            {/* filtered results */}
            <div className={styles["list-container"]}>
              <ul className={styles.comboList}>
                {filteredContentIds.map((id) => (
                  <li
                    key={id}
                    onClick={() => setSelectedContentId(id)}
                    className={selectedContentId === id ? styles.selected : ""}
                  >
                    {id}
                  </li>
                ))}
              </ul>
            </div>

            <label htmlFor="lessonId">New Lesson ID:</label>
            <input
              type="text"
              id="lessonId"
              placeholder="vd: oil-painting-techniques (ảnh hưởng URL)"
              value={lessonId}
              onChange={(event) =>
                setLessonId(sanitizeInput(event.target.value))
              }
            />

            <label htmlFor="lessonName">New Lesson name:</label>
            <input
              type="text"
              id="lessonName"
              placeholder="vd: 🎨 Thực hành kỹ thuật sơn dầu"
              value={lessonName}
              onChange={(event) => setLessonName(event.target.value)}
            />

            <div>
              <input
                type="checkbox"
                id="appendLesson"
                checked={appendLesson}
                className={styles.checkbox}
                onChange={(event) => setAppendLesson(event.target.checked)}
              />
              <label htmlFor="appendLesson" className={styles.checkboxLabel}>
                Append
              </label>
            </div>

            <label htmlFor="lessonIndex">New Lesson index:</label>
            <input
              type="number"
              id="lessonIndex"
              value={lessonIndex}
              disabled={appendLesson}
              onChange={(event) => setLessonIndex(event.target.value)}
            />

            <LessonBlockForm blocks={blocks} setBlocks={setBlocks} />

            <div>
              <button type="submit" className="btn">
                Chèn Lesson
              </button>
            </div>
          </form>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>Success!</div>}
        </div>
      )}
    </div>
  );
}
