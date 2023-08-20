import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHandle}></div>
      HEY YOU!!! HEY YOU!!! HEY YOU!!! HEY YOU!!! HEY YOU!!! HEY YOU!!! HEY
      YOU!!! HEY YOU!!!
      {/* <a href="#">Link 1</a>
      <a href="#">Link 2</a>
      <a href="#">Link 3</a> */}
    </div>
  );
}
