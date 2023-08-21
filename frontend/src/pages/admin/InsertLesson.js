import { useState } from "react";

import styles from "./Admin.module.css";

export default function InsertLesson() {
  const [collapsed, setCollapsed] = useState(true);
  const [contentId, setContentId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [blocks, setBlocks] = useState([{ type: "text", data: "" }]);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // construct Lesson object
    const lesson = {
      blocks: blocks,
    };

    console.log("Lesson", lesson);

    // TODO: handle form submission
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
        <form
          className={collapsed ? "" : styles.section}
          onSubmit={handleSubmit}
        >
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
            onChange={(event) => setLessonId(sanitizeInput(event.target.value))}
          />

          <label htmlFor="lessonName">Lesson Name:</label>
          <input
            type="text"
            id="lessonName"
            value={lessonName}
            onChange={(event) => setLessonName(event.target.value)}
          />

          <label htmlFor="lessonIndex">Thứ tự của Lesson:</label>
          <input
            type="number"
            id="lessonIndex"
            value={lessonIndex}
            onChange={(event) => setLessonIndex(event.target.value)}
          />

          <BlockForm blocks={blocks} setBlocks={setBlocks} />

          <div>
            <button type="submit" className="btn">
              Chèn Lesson
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function BlockForm({ blocks, setBlocks }) {
  const handleAddBlock = () => {
    setBlocks([...blocks, { type: "text", data: "" }]);
  };

  const handleRemoveBlock = (index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const handleBlockChange = (index, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[index][field] = value;
    setBlocks(newBlocks);
  };

  return (
    <form>
      {blocks.map((block, index) => (
        <div key={index} className={styles.block}>
          {/* Block type */}
          <div>
            <label htmlFor={`block-type-${index}`}>Type:</label>
            <select
              id={`block-type-${index}`}
              value={block.type}
              onChange={(event) =>
                handleBlockChange(index, "type", event.target.value)
              }
            >
              <option value="">Select a type</option>
              <option value="text">Text</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* Block data */}
          <div>
            <label htmlFor={`block-data-${index}`}>Data:</label>
            <input
              type="text"
              id={`block-data-${index}`}
              value={block.data}
              onChange={(event) =>
                handleBlockChange(index, "data", event.target.value)
              }
              placeholder="Some text or video embed ID..."
            />
          </div>

          <button
            type="button"
            onClick={() => handleRemoveBlock(index)}
            className={styles.remove}
          >
            🗑️ Remove
          </button>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          onClick={handleAddBlock}
          className={styles["add-block"]}
        >
          ➕ Add Block
        </button>
      </div>
    </form>
  );
}
