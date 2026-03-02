import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import AddEvent from "./components/addevent";
import StudentDashboard from "./components/studentdashboard";
import AdminDashboard from "./components/admindashboard";
import UpcomingEvents from "./components/upcomingevents";
import OngoingEvents from "./components/ongoingevents";
import CompletedEvents from "./components/completedevents";
import Attendance from "./components/attendance";
import Certificate from "./components/certificates";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addevent" element={<AddEvent />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
<Route path="/admin-dashboard" element={<AdminDashboard />} />
<Route path="/student/upcoming" element={<UpcomingEvents />} />
<Route path="/student/ongoing" element={<OngoingEvents />} />
<Route path="/student/completed" element={<CompletedEvents />} />
<Route path="/student/attendance" element={<Attendance />} />
<Route path="/student/certificate" element={<Certificate />} />
      </Routes>
    </Router>
  );
}

export default App;