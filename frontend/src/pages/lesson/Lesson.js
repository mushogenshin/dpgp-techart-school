import ReactMarkdown from "react-markdown";
import Vimeo from "../../components/vimeo";

import styles from "./Lesson.module.css";

export default function Lesson({ lesson }) {
  // console.log("Lesson", lesson);

  return (
    <div className={styles.lesson}>
      {lesson.blocks &&
        lesson.blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}
    </div>
  );
}

function Block({ block }) {
  return (
    <div>
      {block.type === "text" ? (
        <ReactMarkdown>{block.data}</ReactMarkdown>
      ) : block.type === "video" ? (
        <Vimeo id={block.data} />
      ) : null}
    </div>
  );
}
