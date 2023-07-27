import { db } from "./firebase_config";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import FinishLogin from "./pages/login/FinishLogin";
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
            {/* unguarded Home page */}
            <Route exact path="/" element={<Home />}></Route>
            <Route
              path="/signup"
              // redirect to home if user is logged in
              element={
                user ? <Navigate to="/courses" replace={true} /> : <Signup />
              }
            />
            <Route
              path="/login"
              // redirect to dashboard if user is logged in
              element={
                user ? <Navigate to="/dashboard" replace={true} /> : <Login />
              }
            />
            <Route
              path="/finishLogin"
              // redirect to dashboard if user is logged in
              element={
                user ? (
                  <Navigate to="/dashboard" replace={true} />
                ) : (
                  <FinishLogin />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                // prompt user to login if not logged in
                user ? <Dashboard /> : <Navigate to="/login" replace={true} />
              }
            ></Route>
            {/* Unguarded Courses page */}
            <Route path="/courses" element={<Courses />}></Route>
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
