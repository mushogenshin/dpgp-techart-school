import ReactMarkdown from "react-markdown";
import Image from "./Image";
import Vimeo from "./Vimeo";
import YouTube from "./YouTube";
import Sketchfab from "./Sketchfab";
import styles from "./ContentBlock.module.css";

/**
 * Renders a block of content depending on its type.
 * @param {object} inner
 */
export default function ContentBlock({ inner }) {
  return (
    <div className={styles["content-block"]}>
      {inner.type === "text" ? (
        <ReactMarkdown>{inner.data}</ReactMarkdown>
      ) : // ) : block.type === "plain_text" ? (
      //   <pre>{block.data}</pre>
      inner.type === "html" ? (
        <div dangerouslySetInnerHTML={{ __html: inner.data }} />
      ) : inner.type === "image" ? (
        <Image src={inner.data} />
      ) : inner.type === "vimeo" ? (
        <Vimeo id={inner.data} />
      ) : inner.type === "youtube" ? (
        <YouTube id={inner.data} />
      ) : inner.type === "file" ? (
        <div className={styles.download}>
          <a
            href={inner.data}
            target="_blank"
            rel="noreferrer noopener"
            download={inner.name || "Resources"}
          >
            📎 {inner.name || "Resources"}
          </a>
        </div>
      ) : inner.type === "sketchfab" ? (
        <Sketchfab id={inner.data} />
      ) : // TODO: add support for other block types, e.g. audio, etc.
      null}
    </div>
  );
}
