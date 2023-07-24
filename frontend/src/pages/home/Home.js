import React from "react";
import { useCollection } from "../../hooks/useCollection";
import logo from "../../logo.svg";
import ClassList from "../../components/ClassList";

export default function Home() {
  const { documents, error } = useCollection("classes");

  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      {error && <p>{error}</p>}
      {documents && <ClassList classes={documents} />}
    </header>
  );
}
