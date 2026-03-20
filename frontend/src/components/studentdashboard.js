import { useEffect, useState } from "react";
import API from "../api";
import "./dashboard.css";

function StudentDashboard() {

  const [events, setEvents] = useState([]);
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState("");

  const username = localStorage.getItem("name") || "Student";

  // Fetch events
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

  // Live timer for countdown + status updates
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Register Event
  const registerEvent = async (id) => {
    try {

      const email = localStorage.getItem("email");

      await API.post(`/events/${id}/register`, {
        email: email
      });

      alert("Registered Successfully ✅");

      fetchEvents();

    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  const currentTime = now;

  // Event counts
  const upcomingEvents = events.filter((e) => {
    const start = new Date(`${e.date}T${e.startTime}`);
    return start > currentTime;
  });

  const ongoingEvents = events.filter((e) => {
    const start = new Date(`${e.date}T${e.startTime}`);
    const end = new Date(`${e.date}T${e.endTime}`);
    return start <= currentTime && end >= currentTime;
  });

  const completedEvents = events.filter((e) => {
    const end = new Date(`${e.date}T${e.endTime}`);
    return end < currentTime;
  });

  // Countdown function
  const getCountdown = (date, time) => {

    const eventStart = new Date(`${date}T${time}`);

    const diff = eventStart - now;

    if (diff <= 0) return "Started";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (

    <div>

      {/* Welcome */}
      <h1>👋 Welcome {username}!</h1>

      <p className="welcome-quote">
        "Don’t just attend college — experience it. Join events, learn, and grow."
      </p>

      {/* Summary Cards */}
      <div className="card-grid">

        <div className="summary-card">
          📅 Upcoming Events
          <h2>{upcomingEvents.length}</h2>
        </div>

        <div className="summary-card">
          🔥 Ongoing Events
          <h2>{ongoingEvents.length}</h2>
        </div>

        <div className="summary-card">
          ✅ Completed Events
          <h2>{completedEvents.length}</h2>
        </div>

      </div>
      <input
  type="text"
  placeholder="Search events..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: "8px",
    width: "250px",
    marginTop: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }}
/>

      {/* Event Highlights */}
      <h2 style={{ marginTop: "30px" }}>🌟 Event Highlights</h2>


      <div className="event-grid">

        {events
          .filter((ev) =>
            ev.title.toLowerCase().includes(search.toLowerCase()) ||
            ev.description.toLowerCase().includes(search.toLowerCase()) ||
            ev.venue.toLowerCase().includes(search.toLowerCase())
)
          .sort(
            (a, b) =>
              new Date(`${b.date}T${b.startTime}`) -
              new Date(`${a.date}T${a.startTime}`)
          )
          
          .map((ev) => {

            const start = new Date(`${ev.date}T${ev.startTime}`);
            const end = new Date(`${ev.date}T${ev.endTime}`);

            let status = "Upcoming";

            if (start <= currentTime && end >= currentTime) {
              status = "Ongoing";
            } else if (end < currentTime) {
              status = "Completed";
            }

            const registered = ev.registrations?.length || 0;
            const maxSeats = ev.maxRegistrations || 1;

            const percentage = (registered / maxSeats) * 100;

            const seatsLeft = maxSeats - registered;

            return (

  <div className="event-card" key={ev._id}>

    {/* ADD IMAGE HERE */}
    <img
      src={ev.image || "https://via.placeholder.com/400x200"}
      alt="event"
      style={{
        width: "100%",
        height: "180px",
        objectFit: "cover",
        borderRadius: "10px",
        marginBottom: "10px"
      }}
    />

    <h3 className="event-title">{ev.title}</h3>

    <p className="event-desc">{ev.description}</p>

                <div className="event-info">

                  <p>📍 {ev.venue}</p>

                  <p>📅 {new Date(ev.date).toDateString()}</p>

                  <p>
                    👥 {registered} / {maxSeats} Registered
                  </p>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: "8px",
                      background: "#eee",
                      borderRadius: "5px",
                      marginTop: "5px",
                      marginBottom: "10px"
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: percentage > 80 ? "red" : "#4CAF50",
                        borderRadius: "5px",
                        transition: "width 0.5s"
                      }}
                    />
                  </div>

                  <p style={{ color: seatsLeft < 5 ? "red" : "green" }}>
                    Seats Left: {seatsLeft}
                  </p>

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

                  {/* Countdown Timer */}
                  {status === "Upcoming" && (
                    <p
                      style={{
                        color: "#007bff",
                        fontWeight: "bold"
                      }}
                    >
                      ⏳ Starts in: {getCountdown(ev.date, ev.startTime)}
                    </p>
                  )}

                </div>

                <button
                  className="register-btn"
                  onClick={() => registerEvent(ev._id)}
                  disabled={status === "Completed"}
                >
                  Register
                </button>

              </div>

            );

          })}

      </div>

    </div>
  );
}

export default StudentDashboard;