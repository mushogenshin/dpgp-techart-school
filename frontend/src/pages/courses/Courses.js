import React from "react";
import ClassList from "../../components/ClassList";
import { useCollection } from "../../hooks/useCollection";

export default function Courses() {
  //   TODO: prevent reload
  const { documents, error } = useCollection("classes");

  return (
    <div>
      <h3>ALL COURSES</h3>
      {error && <p>{error}</p>}
      {documents && <ClassList classes={documents} />}
    </div>
  );
}
