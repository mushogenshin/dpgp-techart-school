import ReactMarkdown from "react-markdown";
import Vimeo from "../Vimeo";
import Sketchfab from "../Sketchfab";
import styles from "./ContentBlock.module.css";

export default function ContentBlock({ block }) {
  return (
    <div className={styles["content-block"]}>
      {block.type === "text" ? (
        <ReactMarkdown>{block.data}</ReactMarkdown>
      ) : block.type === "vimeo" ? (
        <Vimeo id={block.data} />
      ) : block.type === "file" ? (
        <div className={styles.download}>
          <a
            href={block.data}
            target="_blank"
            download={block.name || "Resources"}
          >
            📎 Download {block.name || "Resources"}
          </a>
        </div>
      ) : block.type == "sketchfab" ? (
        <Sketchfab id={block.data} />
      ) : // TODO: add support for other block types, e.g. image, audio, etc.
      null}
    </div>
  );
}
