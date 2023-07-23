import { db } from "./firebase_config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [classes, setClasses] = useState([]);

  const getClasses = async () => {
    const querySnapshot = await getDocs(collection(db, "classes"));
    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });
    setClasses(querySnapshot.docs.map((doc) => doc.data()));
  };

  // useEffect(() => {
  //   getClasses();
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>DPGP TechArt School</p>
      </header>
    </div>
  );
}

export default App;
