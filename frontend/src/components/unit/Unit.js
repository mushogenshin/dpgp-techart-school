import ReactMarkdown from "react-markdown";
import Vimeo from "../vimeo";

export default function Unit({ contents, unlocked }) {
  console.log("Switching to unit", contents);

  return (
    <div>
      {unlocked ? (
        <div>
          {contents.map((content) => (
            <div key={content.id}>
              {content.lessons.map((block, index) => (
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
      ) : (
        <div>
          🔏 Nội dung này còn đang bị khoá (vì chưa đến thời điểm được mở)
        </div>
      )}
    </div>
  );
}
