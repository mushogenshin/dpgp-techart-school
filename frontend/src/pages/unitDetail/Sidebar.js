// import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ contents }) {
  console.log("Content", contents);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHandle}></div>
      {contents.map((content, index) => {
        return (
          <div>
            <h3 key={index}>{content.name}</h3>
            <ul>
              {content.lessons.map((lesson, index) => {
                return <li key={index}>TODO</li>;
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
