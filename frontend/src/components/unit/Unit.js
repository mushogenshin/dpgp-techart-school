import ReactMarkdown from "react-markdown";

export default function Unit({ contents }) {
  console.log("Switching to unit", contents);

  return (
    <div>
      {contents.map((content) => (
        <div key={content.id}>
          {content.lessons.map((lesson, index) => (
            <div key={index}>
              {lesson.type === "text" ? (
                <ReactMarkdown>{lesson.data}</ReactMarkdown>
              ) : lesson.type === "video" ? (
                <iframe
                  src={lesson.data}
                  width="640"
                  height="360"
                  frameborder="0"
                  allowfullscreen
                  title={`Video ${index}`}
                ></iframe>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
