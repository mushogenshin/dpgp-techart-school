import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Courses from "./pages/courses/Courses";

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
                // prompt user to login if not logged in
                user ? <Home /> : <Navigate to="/login" replace={true} />
              }
            ></Route>
            <Route
              path="/signup"
              // redirect to home if user is logged in
              element={
                user ? <Navigate to="/courses" replace={true} /> : <Signup />
              }
            />
            <Route
              path="/login"
              // redirect to home if user is logged in
              element={user ? <Navigate to="/" replace={true} /> : <Login />}
            />
            <Route
              path="/dashboard"
              element={
                // prompt user to login if not logged in
                user ? <Dashboard /> : <Navigate to="/login" replace={true} />
              }
            ></Route>
            <Route path="/courses" element={<Courses />}></Route>
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
