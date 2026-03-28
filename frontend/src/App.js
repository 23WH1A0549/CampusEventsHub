import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AddEvent from "./components/addevent";
import AdminDashboard from "./components/admindashboard";
import AdminScanner from "./components/AdminScanner";
import Attendance from "./components/attendance";
import Certificate from "./components/certificates";
import CompletedEvents from "./components/completedevents";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./components/login";
import MyEvents from "./components/MyEvents";
import OngoingEvents from "./components/ongoingevents";
import Register from "./components/register";
import StudentAttendance from "./components/StudentAttendance";
import StudentDashboard from "./components/studentdashboard";
import UpcomingEvents from "./components/upcomingevents";



function App() {
  return (
    <Router>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-scan" element={<AdminScanner />} />
        <Route path="/addevent" element={<AddEvent />} />

        {/* Student Dashboard Layout */}
        <Route path="/student-dashboard" element={<DashboardLayout />}>
        <Route path="attendance" element={<StudentAttendance />} />

          {/* Default Dashboard Page */}
          <Route index element={<StudentDashboard />} />

          <Route path="upcoming" element={<UpcomingEvents />} />
          <Route path="ongoing" element={<OngoingEvents />} />
          <Route path="completed" element={<CompletedEvents />} />
          <Route path="myevents" element={<MyEvents />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="certificate" element={<Certificate />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;