import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
