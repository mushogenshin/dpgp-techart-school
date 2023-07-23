import { ProjectFirestore, ProjectAuth } from "./firebase_config";
import { collection, addDoc } from "firebase/firestore";
// import { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

// try {
//   const docRef = await addDoc(collection(ProjectFirestore, "blehh"), {
//     first: "Ada",
//     last: "Lovelaceeee",
//     born: 1815,
//   });
//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// }

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
