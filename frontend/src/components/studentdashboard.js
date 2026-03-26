import { useEffect, useState } from "react";
import API from "../api";
import "./dashboard.css";
import QRCode from "react-qr-code"; // ✅ NEW LIBRARY

function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState("");

  // ✅ Store QR per event
  const [qrData, setQrData] = useState({});

  const username = localStorage.getItem("name") || "Student";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.log("Fetch Events Error:", err);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Register + QR generation
  const registerEvent = async (id) => {
    try {
      const email = localStorage.getItem("email");

      await API.post(`/events/${id}/register`, { email });

      alert("Registered Successfully ✅");

      // ✅ Generate QR
      const qrValue = `${email}_${id}`;
      setQrData((prev) => ({
        ...prev,
        [id]: qrValue,
      }));

      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  const currentTime = now;

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
      <h1>👋 Welcome {username}!</h1>

      <p className="welcome-quote">
        "Don’t just attend college — experience it. Join events, learn, and grow."
      </p>

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
          border: "1px solid #ccc",
        }}
      />

      <h2 style={{ marginTop: "30px" }}>🌟 Event Highlights</h2>

      <div className="event-grid">
        {events
          .filter(
            (ev) =>
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
            if (start <= currentTime && end >= currentTime) status = "Ongoing";
            else if (end < currentTime) status = "Completed";

            const registered = ev.registrationCount || 0;
            const maxSeats = ev.maxRegistrations || 1;
            const seatsLeft = maxSeats - registered;
            const percentage = (registered / maxSeats) * 100;

            return (
              <div className="event-card" key={ev._id}>
                <img
                  src={ev.image || "https://via.placeholder.com/400x200"}
                  alt="event"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />

                <h3 className="event-title">{ev.title}</h3>
                <p className="event-desc">{ev.description}</p>

                <div className="event-info">
                  <p>📍 {ev.venue}</p>
                  <p>📅 {new Date(ev.date).toDateString()}</p>
                  <p>👥 {registered} / {maxSeats} Registered</p>

                  <div
                    style={{
                      height: "8px",
                      background: "#eee",
                      borderRadius: "5px",
                      marginTop: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: percentage > 80 ? "red" : "#4CAF50",
                        borderRadius: "5px",
                      }}
                    />
                  </div>

                  <p style={{ color: seatsLeft < 5 ? "red" : "green" }}>
                    Seats Left: {seatsLeft}
                  </p>

                  <p>
                    🕒{" "}
                    {new Date(`1970-01-01T${ev.startTime}`).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit", hour12: true }
                    )}{" "}
                    -{" "}
                    {new Date(`1970-01-01T${ev.endTime}`).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit", hour12: true }
                    )}
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
                            : "red",
                      }}
                    >
                      {status}
                    </strong>
                  </p>

                  {status === "Upcoming" && (
                    <p style={{ color: "#007bff", fontWeight: "bold" }}>
                      ⏳ Starts in: {getCountdown(ev.date, ev.startTime)}
                    </p>
                  )}
                </div>

                <button
                  className="register-btn"
                  onClick={() => registerEvent(ev._id)}
                  disabled={status === "Completed" || seatsLeft <= 0}
                >
                  Register
                </button>

                {/* ✅ QR CODE */}
                {qrData[ev._id] && (
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <QRCode value={qrData[ev._id]} size={120} />
                    <p style={{ fontSize: "12px" }}>
                      Show this at entry
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default StudentDashboard;