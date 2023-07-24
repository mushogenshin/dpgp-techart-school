import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";

function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              exact
              path="/"
              element={
                user ? <Home /> : <Navigate to="/login" replace={true} />
              }
            ></Route>
            <Route
              path="/signup"
              element={user ? <Navigate to="/" replace={true} /> : <Signup />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace={true} /> : <Login />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
