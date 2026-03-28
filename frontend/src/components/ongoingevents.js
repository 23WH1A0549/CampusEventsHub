import axios from "axios";
import { useEffect, useState } from "react";

function OngoingEvents() {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const studentEmail = localStorage.getItem("email");

  useEffect(() => {

    const fetchEvents = () => {

      axios.get("http://localhost:5000/api/events")
        .then((res) => {

          const now = new Date();

          const ongoing = res.data.filter(event => {

            const start = new Date(`${event.date}T${event.startTime}`);
            const end = new Date(`${event.date}T${event.endTime}`);

            return now >= start && now <= end;

          });

          setEvents(ongoing);

        })
        .catch(err => console.log(err));

    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 60000);

    return () => clearInterval(interval);

  }, []);

  // ✅ FIXED REGISTER FUNCTION
  const registerEvent = async (id) => {

    try {

      await axios.post(
        `http://localhost:5000/api/events/${id}/register`,  // ✅ correct URL
        { email: studentEmail } // ✅ correct body
      );

      alert("Registered Successfully ✅");
      window.location.reload();

    } catch (err) {

      if (err.response && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration Failed ❌");
      }

    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>Ongoing Events</h1>

      <p style={{
        fontStyle: "italic",
        color: "gray",
        marginBottom: "20px"
      }}>
        "Don't miss the moment — participate now!"
      </p>

      <input
        type="text"
        placeholder="Search Events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", width: "250px", marginBottom: "25px" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "25px" }}>

        {events
          .filter(event =>
            event.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((event) => {

            // ✅ FIXED COUNT
            const registeredCount = event.registrationCount || 0;

            const maxSeats = Number(event.maxRegistrations) || 0;
            const seatsLeft = maxSeats - registeredCount;

            const percentage =
              maxSeats > 0 ? (registeredCount / maxSeats) * 100 : 0;

            return (

              <div key={event._id}

                style={{
                  width: "300px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  background: "white"
                }}>

                <img
                  src={event.image || "https://via.placeholder.com/300x150"}
                  alt="event"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover"
                  }}
                />

                <div style={{ padding: "15px" }}>

                  <h3>{event.title}</h3>

                  <p style={{ fontSize: "14px", color: "gray" }}>
                    {event.description}
                  </p>

                  <p>📅 {event.date}</p>
                  <p>🕒 {event.startTime} - {event.endTime}</p>
                  <p>📍 {event.venue}</p>

                  <p>
                    Registrations: {registeredCount} / {event.maxRegistrations}
                  </p>

                  {/* Progress Bar */}
                  <div style={{
                    height: "8px",
                    background: "#ddd",
                    borderRadius: "5px",
                    marginBottom: "10px"
                  }}>

                    <div style={{
                      width: `${percentage}%`,
                      height: "8px",
                      background: "#4CAF50",
                      borderRadius: "5px"
                    }} />

                  </div>

                  <p style={{ color: seatsLeft < 5 ? "red" : "green" }}>
                    Seats Left: {seatsLeft}
                  </p>

                  <button
                    onClick={() => registerEvent(event._id)}
                    disabled={seatsLeft <= 0 || !studentEmail}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      background: seatsLeft <= 0 ? "gray" : "#007bff",
                      color: "white",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >

                    {seatsLeft <= 0
                      ? "Event Full"
                      : !studentEmail
                        ? "Login Required"
                        : "Register"}

                  </button>

                </div>

              </div>

            );

          })}

      </div>

    </div>

  );

}

export default OngoingEvents;