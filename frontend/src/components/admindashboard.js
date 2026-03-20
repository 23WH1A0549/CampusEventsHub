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

      // Sort latest events first
      const sorted = res.data.sort(
        (a, b) =>
          new Date(`${b.date}T${b.startTime}`) -
          new Date(`${a.date}T${a.startTime}`)
      );

      setEvents(sorted);

    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDelete = async (id) => {
    try {

      await API.delete(`/events/${id}`);

      fetchEvents();

    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  const now = new Date();

  // Stats
  const total = events.length;

  const upcoming = events.filter((e) => {
    const start = new Date(`${e.date}T${e.startTime}`);
    return start > now;
  }).length;

  const completed = events.filter((e) => {
    const end = new Date(`${e.date}T${e.endTime}`);
    return end < now;
  }).length;

  const ongoing = events.filter((e) => {
    const start = new Date(`${e.date}T${e.startTime}`);
    const end = new Date(`${e.date}T${e.endTime}`);
    return start <= now && end >= now;
  }).length;

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

      {/* Main Dashboard */}
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
            <h4>Ongoing</h4>
            <p>{ongoing}</p>
          </div>

          <div className="stat-card">
            <h4>Completed</h4>
            <p>{completed}</p>
          </div>

        </div>

        {/* Manage Events */}
        <h2>Manage Events</h2>

        <div className="event-grid">

          {events.map((ev) => {

            const start = new Date(`${ev.date}T${ev.startTime}`);
            const end = new Date(`${ev.date}T${ev.endTime}`);

            let status = "Upcoming";

            if (start <= now && end >= now) status = "Ongoing";
            else if (end < now) status = "Completed";

            const registered = ev.registrations?.length || 0;
            const maxSeats = ev.maxRegistrations || 0;

            return (

              <div key={ev._id} className="event-card">

                {/* Event Image */}
                <img
                  src={ev.image || "https://via.placeholder.com/300x160"}
                  alt="event"
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />

                <h3 className="event-title">
                  {ev.title}
                </h3>

                <p className="event-desc">
                  {ev.description}
                </p>

                <div className="event-info">

                  <p>📅 {new Date(ev.date).toDateString()}</p>

                  <p>📍 {ev.venue}</p>

                  <p>
                    🕒 {new Date(`1970-01-01T${ev.startTime}`)
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    {" - "}
                    {new Date(`1970-01-01T${ev.endTime}`)
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                  </p>

                  <p>
                    👥 {registered} / {maxSeats} Registered
                  </p>

                  <p>
                    Status:{" "}
                    <strong
                      style={{
                        color:
                          status === "Upcoming"
                            ? "green"
                            : status === "Ongoing"
                            ? "orange"
                            : "red"
                      }}
                    >
                      {status}
                    </strong>
                  </p>

                </div>

                <div className="card-buttons">

                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/addevent?id=${ev._id}`)}
                  >
                    ✏ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(ev._id)}
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;