import React from "react";

export default function ClassList({ classes }) {
  return (
    <div>
      <h3>ALL CLASSES</h3>
      {classes.map((cls) => (
        <li key={cls.id}>
          {cls.name} ({cls.id})
        </li>
      ))}
    </div>
  );
}
