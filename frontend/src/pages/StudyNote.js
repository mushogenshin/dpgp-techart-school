import React from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../components/CodeBlock";

export default function StudyNote({ note, excerpt = false }) {
  const date = new Date(note.attributes.createdAt);

  let body;
  if (!excerpt) {
    body = (
      <div>
        <ReactMarkdown
          children={note.attributes.body}
          components={{
            code({ ...props }) {
              return CodeBlock({ ...props });
            },
          }}
        />
      </div>
    );
  } else {
    body = (
      <div>
        <ReactMarkdown>{`${note.attributes.body.substring(
          0,
          200
        )}...`}</ReactMarkdown>

        <Link to={`/study-note/${note.id}`}>Đọc nốt</Link>
      </div>
    );
  }

  // we must use `return` keyword here
  return (
    <div key={note.id} className="study-note">
      {/* note title in a `Link` */}
      <Link to={`/study-note/${note.id}`}>
        <h2>{note.attributes.title}</h2>
      </Link>
      <small>{date.toLocaleString()}</small>
      {/* all the language tags */}
      {note.attributes.langs.data.map((lang) => {
        // we must use `return` keyword here
        return (
          <small
            key={lang.id}
            className="prog-lang"
            style={{
              color: lang.attributes.color,
              backgroundColor: lang.attributes.background_color,
            }}
          >
            {lang.attributes.name}
          </small>
        );
      })}
      {body}
    </div>
  );
}
