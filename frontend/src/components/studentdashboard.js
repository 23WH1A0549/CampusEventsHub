import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function StudentDashboard() {

  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const username = localStorage.getItem("name") || "Student";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Event Counts
  const upcomingCount = events.length;
  const ongoingCount = 0;
  const completedCount = 0;

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🎓 Campus Hub</h2>

        <p onClick={() => navigate("/student/upcoming")}>
          📅 Upcoming Events
        </p>

        <p onClick={() => navigate("/student/ongoing")}>
          🔥 Ongoing Events
        </p>

        <p onClick={() => navigate("/student/completed")}>
          ✅ Completed Events
        </p>

        <p onClick={() => navigate("/student/attendance")}>
          🎟 Attendance
        </p>

        <p onClick={() => navigate("/student/certificate")}>
          📜 Certificates
        </p>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-main">

        <h1>👋 Welcome {username}</h1>

        {/* Summary Cards */}
        <div className="card-grid">

          <div className="summary-card">
            📅 Upcoming Events
            <h2>{upcomingCount}</h2>
          </div>

          <div className="summary-card">
            🔥 Ongoing Events
            <h2>{ongoingCount}</h2>
          </div>

          <div className="summary-card">
            ✅ Completed Events
            <h2>{completedCount}</h2>
          </div>

        </div>

        {/* Latest Events */}
        <h2 style={{ marginTop: "30px" }}>Latest Events</h2>

        <div className="event-grid">

          {events.map(ev => (
            <div className="event-card" key={ev._id}>
              <h3>{ev.title}</h3>
              <p>{ev.description}</p>
              <p>📍 {ev.location}</p>
              <p>📅 {new Date(ev.date).toDateString()}</p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;