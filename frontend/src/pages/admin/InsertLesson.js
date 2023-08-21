import { useState } from "react";

import styles from "./Admin.module.css";

export default function InsertLesson() {
  const [collapsed, setCollapsed] = useState(true);
  const [contentId, setContentId] = useState("");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [blocks, setBlocks] = useState([
    { type: "text", data: "Some text or video embed ID..." },
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();

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
          <label htmlFor="contentId">Content ID:</label>
          <input
            type="text"
            id="contentId"
            value={contentId}
            onChange={(event) => setContentId(event.target.value)}
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
    setBlocks([
      ...blocks,
      { type: "text", data: "Some text or video embed ID..." },
    ]);
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
