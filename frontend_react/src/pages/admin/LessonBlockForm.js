import styles from "./LessonBlock.module.css";

export default function LessonBlockForm({ blocks, setBlocks }) {
  const handleAddBlock = () => {
    const lastBlock = blocks[blocks.length - 1];
    const newBlock = {
      type: lastBlock ? lastBlock.type : "vimeo",
      data: "",
      name: "",
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleRemoveBlock = (index) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const getPlaceholder = (type) => {
    switch (type) {
      case "text":
        return "Markdown text...";
      case "html":
        return "HTML...";
      case "image":
        return "URL đến tấm hình...";
      case "file":
        return "URL đến file...";
      case "vimeo":
        return "Vimeo embed ID...";
      case "youtube":
        return "YouTube embed ID...";
      case "sketchfab":
        return "Sketchfab embed ID...";
      default:
        return "";
    }
  };

  const handleBlockChange = (index, field, value) => {
    const newBlocks = [...blocks];

    // replace the block at the specified index and specified field with the new value
    newBlocks[index][field] = value;

    // if current block type is not `file`, makes sure to remove the `name` field
    if (newBlocks[index]["type"] !== "file") {
      if (newBlocks[index].name !== undefined) {
        delete newBlocks[index].name;
      }
    } else if (field === "type" && value === "file") {
      // users changed back to `file` type, so we need to add back the `name` field
      newBlocks[index].name = "";
    }

    // if the block type is `vimeo` and the block data is a URL, extract the video ID
    if (
      newBlocks[index].type === "vimeo" &&
      newBlocks[index].data.startsWith("https://vimeo.com/")
    ) {
      console.log("Extracting vimeo ID...");
      const regex = /https:\/\/vimeo\.com\/(?:[^/]+\/)*(\d+)/;
      const match = newBlocks[index].data.match(regex);
      if (match) {
        newBlocks[index].data = match[1];
      }
    }

    setBlocks(newBlocks);
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
              <option value="html">HTML</option>
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
              placeholder={getPlaceholder(block.type)}
            />
          </div>

          <button
            type="button"
            onClick={() => handleRemoveBlock(index)}
            className={styles["remove-block"]}
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
