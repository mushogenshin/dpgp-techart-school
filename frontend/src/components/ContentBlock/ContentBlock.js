import ReactMarkdown from "react-markdown";
import Image from "../Image";
import Vimeo from "../Vimeo";
import YouTube from "../YouTube";
import Sketchfab from "../Sketchfab";
import styles from "./ContentBlock.module.css";

export default function ContentBlock({ block }) {
  return (
    <div className={styles["content-block"]}>
      {block.type === "text" ? (
        <ReactMarkdown>{block.data}</ReactMarkdown>
      ) : block.type === "image" ? (
        <Image src={block.data} />
      ) : block.type === "vimeo" ? (
        <Vimeo id={block.data} />
      ) : block.type === "youtube" ? (
        <YouTube id={block.data} />
      ) : block.type === "file" ? (
        <div className={styles.download}>
          <a
            href={block.data}
            target="_blank"
            rel="noreferrer noopener"
            download={block.name || "Resources"}
          >
            📎 {block.name || "Resources"}
          </a>
        </div>
      ) : block.type === "sketchfab" ? (
        <Sketchfab id={block.data} />
      ) : // TODO: add support for other block types, e.g. image, audio, etc.
      null}
    </div>
  );
}
