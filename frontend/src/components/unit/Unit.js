import ReactMarkdown from "react-markdown";
import Vimeo from "../vimeo";

import styles from "./Unit.module.css";

export default function Unit({ groupedContents, unlocked }) {
  // console.log("Switching to unit", groupedContents);

  return (
    <div className={styles.unit}>
      {unlocked ? (
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
      )}
    </div>
  );
}
