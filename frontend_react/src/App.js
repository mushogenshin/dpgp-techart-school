import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/auth/useAuthContext";

import Navbar from "./components/navbar/Navbar";
import Buy from "./pages/buy/Buy";
import About from "./pages/about/About";
import Instructors from "./pages/instructors/Instructors";
import Login from "./pages/login/Login";
import FinishLogin from "./pages/login/FinishLogin";
import CourseDetail from "./pages/courseDetail/CourseDetail";
import Dashboard from "./pages/dashboard/Dashboard";
import Admin from "./pages/admin/Admin";
import AllCourses from "./pages/courses/AllCourses";
import SubscribeSuccess from "./pages/subscription/SubscribeSuccess";
import UnsubscribeSuccess from "./pages/subscription/UnsubscribeSuccess";
// import AllNotes from "./pages/notes/AllNotes"; // fetch from Strapi CMS=
// import StudyNoteDetail from "./pages/notes/StudyNoteDetail";
import LongAp from "./pages/longAp/LongAp";
import Poi from "./pages/dfs/Poi";
import NotFound from "./pages/404/404";

function App() {
  const { user, elevatedRole } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<AllCourses />} />
          <Route path="about" element={<About />} />
          <Route path="instructors" element={<Instructors />} />
          <Route
            path="login"
            element={
              // redirect to dashboard if user is logged in
              user ? <Navigate to="/dashboard" replace={true} /> : <Login />
            }
          />
          <Route
            path="finish-login"
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
              // prompt user to login if not logged in, and not shown if not elevated role
              user && elevatedRole ? (
                <Admin />
              ) : (
                <Navigate to="/login" replace={true} />
              )
            }
          />
          <Route path="buy" element={<Buy />} />
          <Route path="courses" element={<AllCourses />} />
          <Route path="course/:courseId" element={<CourseDetail />} />
          <Route path="course/:courseId/:modId" element={<CourseDetail />} />
          <Route
            path="course/:courseId/:modId/:unitId"
            element={<CourseDetail />}
          />
          <Route
            path="course/:courseId/:modId/:unitId/:lessonId"
            element={<CourseDetail />}
          />
          <Route path="subscribe-success" element={<SubscribeSuccess />} />
          <Route path="unsubscribe-success" element={<UnsubscribeSuccess />} />
          {/* <Route path="wiki" element={<AllNotes />} /> */}
          {/* <Route path="study-note/:id" element={<StudyNoteDetail />} /> */}
          <Route path="long-ap" element={<LongAp />} />
          <Route path="poi" element={<Poi />} />

          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
