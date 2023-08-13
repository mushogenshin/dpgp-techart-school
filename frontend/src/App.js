import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import FinishLogin from "./pages/login/FinishLogin";
import CourseDetail from "./pages/courseDetail/CourseDetail";
import Dashboard from "./pages/dashboard/Dashboard";
import Admin from "./pages/admin/Admin";
import Courses from "./pages/courses/Courses";

function App() {
  const { user, elevatedRole } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
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
                // redirect to courses if user is logged in
                <Navigate to="/courses" replace={true} />
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
          <Route
            path="admin"
            element={
              elevatedRole ? <Admin /> : <Navigate to="/login" replace={true} />
            }
          />
          <Route
            path="courses"
            //  Unguarded Courses page
            element={<Courses />}
          />
          <Route
            path="courses/:id"
            element={
              // Unguarded CourseDetail page
              <CourseDetail />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
