import React from "react";
import logo from "../../logo.svg";

import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      Welcome!
    </div>
  );
}
