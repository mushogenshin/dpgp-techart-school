import React from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../../components/CodeBlock";

import styles from "./StudyNote.module.css";

export default function StudyNote({ note, complete = true }) {
  const date = new Date(note.attributes.createdAt);

  let markdown_body;
  if (complete) {
    markdown_body = (
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
    markdown_body = (
      <div>
        <ReactMarkdown>{`${note.attributes.body.substring(
          0,
          200
        )}...`}</ReactMarkdown>

        <Link to={`/study-note/${note.id}`}>Đọc nốt</Link>
      </div>
    );
  }

  return (
    <div key={note.id} className={styles["study-note"]}>
      {/* note title */}
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
            className={styles["prog-lang"]}
            style={{
              color: lang.attributes.color,
              backgroundColor: lang.attributes.background_color,
            }}
          >
            {lang.attributes.name}
          </small>
        );
      })}

      {/* note content */}
      {markdown_body}
    </div>
  );
}
