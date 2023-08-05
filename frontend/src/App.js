import { db } from "./firebase_config";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import FinishLogin from "./pages/login/FinishLogin";
import CourseDetail from "./pages/courseDetail/CourseDetail";
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
            <Route exact path="/" element={<Home />} />
            <Route
              path="signup"
              element={
                // redirect to home if user is logged in
                user ? <Navigate to="/courses" replace={true} /> : <Signup />
              }
            />
            <Route
              path="login"
              element={
                // redirect to dashboard if user is logged in
                user ? <Navigate to="/dashboard" replace={true} /> : <Login />
              }
            />
            <Route
              path="finishLogin"
              element={
                user ? (
                  // redirect to dashboard if user is logged in
                  <Navigate to="/dashboard" replace={true} />
                ) : (
                  <FinishLogin />
                )
              }
            />
            <Route
              path="dashboard"
              element={
                // prompt user to login if not logged in
                user ? <Dashboard /> : <Navigate to="/login" replace={true} />
              }
            />
            {/* Unguarded Courses page */}
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
