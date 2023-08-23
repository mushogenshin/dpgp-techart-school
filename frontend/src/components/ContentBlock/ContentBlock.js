import ReactMarkdown from "react-markdown";
import Vimeo from "../Vimeo";
import styles from "./ContentBlock.module.css";

export default function ContentBlock({ block }) {
  return (
    <div>
      {block.type === "text" ? (
        <ReactMarkdown>{block.data}</ReactMarkdown>
      ) : block.type === "video" ? (
        <Vimeo id={block.data} />
      ) : block.type === "file" ? (
        <div className={styles.download}>
          <a href={block.data} download={block.name || "Resources"}>
            📎 Download {block.name || "Resources"}
          </a>
        </div>
      ) : // TODO: add support for other block types, e.g. image, audio, etc.
      null}
    </div>
  );
}
