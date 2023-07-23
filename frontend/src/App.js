import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
