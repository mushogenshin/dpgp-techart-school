import React from "react";
import CourseList from "../../components/CourseList";
import { useCollection } from "../../hooks/useCollection";

export default function Courses() {
  const { documents, error } = useCollection("classes");

  return (
    <div>
      <h2>ALL COURSES</h2>
      {error && <p>{error}</p>}
      {documents && <CourseList courses={documents} />}
    </div>
  );
}
