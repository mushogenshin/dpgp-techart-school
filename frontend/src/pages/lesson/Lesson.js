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
      {/* {unlocked ? (
        <div>
          {groupedContents.map((content, index) => (
            <div key={index}>
              {content.lessons.map((grp, index) => (
                <div key={index}>
                  GROUP #{index + 1}
                  {grp.map((block, index) => (
                    <div key={index}>
                      {block.type === "text" ? (
                        <ReactMarkdown>{block.data}</ReactMarkdown>
                      ) : block.type === "video" ? (
                        <Vimeo id={block.data} />
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div>
          🔏 Nội dung này còn đang bị khoá (vì chưa đến thời điểm được mở)
        </div>
      )} */}
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
