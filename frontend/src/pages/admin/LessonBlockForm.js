import styles from "./LessonBlock.module.css";

export default function LessonBlockForm({
  blocks,
  setBlocks,
  placeholders,
  setPlaceholders,
}) {
  const handleAddBlock = () => {
    setBlocks([...blocks, { type: "text", data: "", name: "" }]);
  };

  const handleRemoveBlock = (index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const handleBlockChange = (index, field, value) => {
    const newBlocks = [...blocks];
    // replace the block at the specified index and specified field with the new value
    newBlocks[index][field] = value;
    // if the block type is not file, remove the name field
    if (field === "type" && value !== "file") {
      delete newBlocks[index].name;
    } else if (field === "type" && value === "file") {
      newBlocks[index].name = "";
    }
    // placeholder
    const newPlaceholders = [...placeholders];
    if (field === "type") {
      newPlaceholders[index] =
        value === "text"
          ? "Markdown text..."
          : value === "image"
          ? "URL đến tấm hình..."
          : value === "file"
          ? "URL đến file..."
          : value === "vimeo"
          ? "Vimeo embed ID..."
          : value === "youtube"
          ? "YouTube embed ID..."
          : value === "sketchfab"
          ? "Sketchfab embed ID..."
          : "";
    }
    setBlocks(newBlocks);
    setPlaceholders(newPlaceholders);
  };

  return (
    <div>
      {blocks.map((block, index) => (
        <div key={index} className={styles["lesson-block"]}>
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
              <option value="image">Image</option>
              <option value="file">File</option>
              <option value="vimeo">Vimeo</option>
              <option value="youtube">YouTube</option>
              <option value="sketchfab">Sketchfab</option>
            </select>
          </div>

          {/* Block name */}
          {block.type === "file" && (
            <div>
              <label htmlFor={`block-name-${index}`}>Block Name:</label>
              <input
                type="text"
                id={`block-name-${index}`}
                value={block.name}
                onChange={(event) =>
                  handleBlockChange(index, "name", event.target.value)
                }
              />
            </div>
          )}

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
              placeholder={placeholders[index]}
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
