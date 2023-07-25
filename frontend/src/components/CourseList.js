import React from "react";

export default function CourseList({ courses }) {
  return (
    <div>
      {courses.map((cls) => (
        <li key={cls.id}>
          {cls.name} ({cls.id})
        </li>
      ))}
    </div>
  );
}
