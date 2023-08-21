import styles from "./LessonBlock.module.css";

export default function InsertLessonBlock({ blocks, setBlocks }) {
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
    <div>
      {blocks.map((block, index) => (
        <div key={index} className={styles.block}>
          {/* Block type */}
          <div>
            <label htmlFor={`block-type-${index}`}>Block Type:</label>
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
            <label htmlFor={`block-data-${index}`}>Block Data:</label>
            <input
              type="text"
              id={`block-data-${index}`}
              value={block.data}
              onChange={(event) =>
                handleBlockChange(index, "data", event.target.value)
              }
              placeholder="Markdown text hoặc Vimeo embed ID..."
            />
          </div>

          <button
            type="button"
            onClick={() => handleRemoveBlock(index)}
            className={styles.remove}
          >
            🗑️ Xoá
          </button>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          onClick={handleAddBlock}
          className={styles["add-block"]}
        >
          ➕ Thêm Block
        </button>
      </div>
    </div>
  );
}
