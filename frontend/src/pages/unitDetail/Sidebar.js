// import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ contents }) {
  console.log("Content", contents);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHandle}></div>
      <p>A</p>
      <p>A</p>
      <p>A</p>
      <p>A</p>
      <p>A</p>
      <p>A</p>
      <p>A</p>
      <p>A</p>
      <p>A</p>
    </div>
  );
}
