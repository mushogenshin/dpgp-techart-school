import { useState } from "react";

import styles from "./Admin.module.css";

export default function InsertContentBlock() {
  const [collapsed, setCollapsed] = useState(true);
  const [contentId, setContentId] = useState("");
  const [blockType, setBlockType] = useState("text");
  const [blockData, setBlockData] = useState("");
  const [blockIndex, setBlockIndex] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO: handle form submission
  };

  const label = `${collapsed ? "👉" : "👇"} Chèn nội dung`;

  return (
    <div>
      <button
        className={styles.collapsibleHeader}
        onClick={() => setCollapsed(!collapsed)}
      >
        <h2>{label}</h2>
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

          <label htmlFor="blockType">Loại:</label>
          <select
            id="blockType"
            value={blockType}
            onChange={(event) => setBlockType(event.target.value)}
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
          </select>

          <label htmlFor="blockData">Nội dung:</label>
          <input
            type="text"
            id="blockData"
            value={blockData}
            onChange={(event) => setBlockData(event.target.value)}
          />

          <label htmlFor="blockIndex">Thứ tự:</label>
          <input
            type="number"
            id="blockIndex"
            value={blockIndex}
            onChange={(event) => setBlockIndex(event.target.value)}
          />

          <div>
            <button type="submit" className="btn">
              Chèn
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
