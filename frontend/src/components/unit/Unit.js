import ReactMarkdown from "react-markdown";

export default function Unit({ contents, unlocked }) {
  console.log("Switching to unit", contents);

  return (
    <div>
      {unlocked ? (
        <div>
          {contents.map((content) => (
            <div key={content.id}>
              {content.lessons.map((lesson, index) => (
                <div key={index}>
                  {lesson.type === "text" ? (
                    <ReactMarkdown>{lesson.data}</ReactMarkdown>
                  ) : lesson.type === "video" ? (
                    <div
                      // Vimeo embed styling
                      style={{ padding: "56.25% 0 0 0", position: "relative" }}
                    >
                      <iframe
                        src={`${lesson.data}?badge=0&amp;autopause=0&amp`}
                        width="640"
                        height="360"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                        }}
                        title={`Video ${index}`}
                      ></iframe>
                    </div>
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
