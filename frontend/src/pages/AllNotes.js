import React from "react";
import { useQuery, gql } from "@apollo/client";

import StudyNote from "./StudyNote";

const STUDY_NOTES = gql`
  query GetStudyNotes {
    studyNotes {
      data {
        id
        attributes {
          title
          createdAt
          body
          langs {
            data {
              id
              attributes {
                name
                color
                background_color
              }
            }
          }
        }
      }
    }
  }
`;

export default function AllNotes() {
  const { loading, error, data } = useQuery(STUDY_NOTES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 😰: {error.message}</p>;

  return (
    <div>
      {[...data.studyNotes.data].reverse().map((note) => {
        return <StudyNote key={note.id} note={note} excerpt={true} />;
      })}
    </div>
  );
}
