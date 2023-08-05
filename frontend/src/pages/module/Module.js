import React from "react";

export default function LearningModule({ mod }) {
  return (
    // be sure to check if mod is undefined before trying to access its properties
    mod && (
      <div>
        <h2>{mod.description}</h2>
        <small>Starts: {mod.starts_at.toLocaleDateString()}</small>
        <br />
        <small>Ends: {mod.ends_at.toLocaleDateString()}</small>
      </div>
    )
  );
}
