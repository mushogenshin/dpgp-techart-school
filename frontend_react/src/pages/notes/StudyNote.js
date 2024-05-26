import { Link } from "react-router-dom";
import EnhancedMarkDown from "../../components/EnhancedMarkDown";

import styles from "./StudyNote.module.css";

export default function StudyNote({ note, complete = true }) {
  const date = new Date(note.attributes.createdAt);

  return (
    <div key={note.id} className={styles["study-note"]}>
      {/* note title */}
      <Link to={`/study-note/${note.id}`}>
        <h2>{note.attributes.title}</h2>
      </Link>

      <small>{date.toLocaleString()}</small>

      {/* all the language tags */}
      {note.attributes.prog_langs.data.map((lang) => {
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
      {complete ? (
        <EnhancedMarkDown>{note.attributes.body}</EnhancedMarkDown>
      ) : (
        <div>
          <EnhancedMarkDown>{`${note.attributes.body.substring(
            0,
            200
          )}...`}</EnhancedMarkDown>

          <Link to={`/study-note/${note.id}`}>Đọc nốt</Link>
        </div>
      )}
    </div>
  );
}
