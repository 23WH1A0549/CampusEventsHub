import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./dashboard.css";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "host" && role !== "admin") {
      navigate("/");
    }
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDelete = async (id) => {
    await API.delete(`/events/${id}`);
    fetchEvents();
  };

  // ✅ Auto calculate status using date
  const total = events.length;

  const upcoming = events.filter(
    (e) => new Date(e.date) > new Date()
  ).length;

  const completed = events.filter(
    (e) => new Date(e.date) < new Date()
  ).length;

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">🎓 Campus Hub</h2>
        <hr className="sidebar-divider" />

        <p className="active-link">
          📋 Manage Events
        </p>

        <p onClick={() => navigate("/addevent")}>
          ➕ Add Event
        </p>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="dashboard-main">

        <div className="welcome-header">
          <h1>👋 Welcome {name}</h1>
        </div>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <h4>Total Events</h4>
            <p>{total}</p>
          </div>

          <div className="stat-card">
            <h4>Upcoming</h4>
            <p>{upcoming}</p>
          </div>

          <div className="stat-card">
            <h4>Completed</h4>
            <p>{completed}</p>
          </div>
        </div>

        {/* Manage Events */}
        <h2>Manage Events</h2>

        <div className="event-grid">
          {events.map((ev) => (
            <div key={ev._id} className="event-card">
              <h4>{ev.title}</h4>
              <p>Date: {ev.date}</p>
              <p>Location: {ev.location}</p>

              <div className="card-buttons">
                <button onClick={() => navigate(`/addevent?id=${ev._id}`)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(ev._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;