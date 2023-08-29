import { useState } from "react";
import { db } from "../../firebase_config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import LessonBlockForm from "./LessonBlockForm";

import styles from "./Admin.module.css";

export default function InsertLesson() {
  const [collapsed, setCollapsed] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [contentId, setContentId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [insertAtEnd, setInsertAtEnd] = useState(true);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [blocks, setBlocks] = useState([{ type: "", data: "" }]);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const insertLessonAtIndex = async (insertion) => {
    const docRef = doc(db, "contents", contentId);

    // Get the current lesson array
    const docSnap = await getDoc(docRef);
    const lessons = docSnap.data().lessons || [];

    // function to insert the new element at the specified index
    const inserted = () => {
      const pre = lessons.slice(0, lessonIndex);
      const post = lessons.slice(lessonIndex);
      return [...pre, insertion, ...post];
    };

    const updated = insertAtEnd ? [...lessons, insertion] : inserted();

    // Update with the modified array
    await updateDoc(docRef, {
      lessons: updated,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // return if any of the required fields are empty
    if (contentId === "" || lessonId === "" || lessonName === "") {
      setError("Cần điền đủ thông tin");
      setSuccess(false);
      return;
    }

    setError(null);
    setSuccess(false);

    // construct Lesson object
    const lesson = {
      id: lessonId,
      name: lessonName,
      blocks: blocks,
    };

    console.log("Lesson", lesson);

    insertLessonAtIndex(lesson)
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
            <label htmlFor="contentId">Parent Content ID:</label>
            <input
              type="text"
              id="contentId"
              value={contentId}
              onChange={(event) =>
                setContentId(sanitizeInput(event.target.value))
              }
            />

            <label htmlFor="lessonId">Lesson ID:</label>
            <input
              type="text"
              id="lessonId"
              value={lessonId}
              onChange={(event) =>
                setLessonId(sanitizeInput(event.target.value))
              }
            />

            <label htmlFor="lessonName">Lesson Name:</label>
            <input
              type="text"
              id="lessonName"
              value={lessonName}
              onChange={(event) => setLessonName(event.target.value)}
            />

            <div>
              <input
                type="checkbox"
                id="insertAtEnd"
                checked={insertAtEnd}
                className={styles.checkbox}
                onChange={(event) => setInsertAtEnd(event.target.checked)}
              />
              <label className={styles.checkboxLabel} htmlFor="insertAtEnd">
                Cuối dãy
              </label>
            </div>

            <label htmlFor="lessonIndex">Thứ tự của Lesson:</label>
            <input
              type="number"
              id="lessonIndex"
              value={lessonIndex}
              disabled={insertAtEnd}
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
