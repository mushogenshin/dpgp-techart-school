import { useState } from "react";

import styles from "./Admin.module.css";

export default function InsertUnitContent() {
  const [collapsed, setCollapsed] = useState(true);
  const [unitName, setUnitName] = useState("");

  //   TODO: make a form which allows user to input:
  // 1. document ID for the unit
  // 2. a "block" object in the shape of {type: "SOME_TYPE", data: "some text"}
  //   where SOME_TYPE is one of the following: "text", "video", we should have a dropdown menu for this
  //3. a index number (integer) to indicate the order of the block in the unit
}
