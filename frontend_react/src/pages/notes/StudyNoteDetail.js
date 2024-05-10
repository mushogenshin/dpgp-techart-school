import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

import StudyNote from "./StudyNote";

const NOTE_DETAIL = gql`
  query GetNoteDetail($id: ID!) {
    studyNote(id: $id) {
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

export default function StudyNoteDetail() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(NOTE_DETAIL, {
    variables: { id: id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <StudyNote note={data.studyNote.data} />;
}
