import axios from "axios";
import { useEffect, useState } from "react";

function UpcomingEvents() {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const studentEmail = localStorage.getItem("email");

  useEffect(() => {

    const fetchEvents = () => {

      axios.get("http://localhost:5000/api/events")
        .then((res) => {

          const now = new Date();

          const upcoming = res.data.filter(event => {

            const start = new Date(`${event.date}T${event.startTime}`);

            return start > now;

          });

          // Sort by nearest event
          upcoming.sort(
            (a, b) =>
              new Date(`${a.date}T${a.startTime}`) -
              new Date(`${b.date}T${b.startTime}`)
          );

          setEvents(upcoming);

        })
        .catch(err => console.log(err));

    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 60000);

    return () => clearInterval(interval);

  }, []);

  const registerEvent = async (id) => {

  try {

    await axios.post(
      `http://localhost:5000/api/events/${id}/register`,
      { email: studentEmail }
    );

    alert("Registered Successfully");
    window.location.reload();

  } catch (err) {

    if (err.response && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert("Registration Failed");
    }

  }

};
  return (

    <div style={{ padding: "30px" }}>

      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Upcoming Events
      </h1>

      <p style={{
        fontStyle: "italic",
        marginBottom: "20px",
        color: "gray"
      }}>
        "The future belongs to those who participate today."
      </p>

      <p style={{ marginBottom: "15px", color: "#555" }}>
        {events.length} upcoming events
      </p>

      <input
        type="text"
        placeholder="Search Events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "250px",
          marginBottom: "25px"
        }}
      />

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "25px"
      }}>

        {events
          .filter(event =>
            event.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((event) => {

            const maxSeats = event.maxRegistrations || 0;
            const registeredCount = event.registrations?.length || 0;
            const seatsLeft = maxSeats - registeredCount;

            const alreadyRegistered = event.registrations?.some(
              r => r.studentEmail === studentEmail
            );

            const percentage =
            maxSeats > 0 ? (registeredCount / maxSeats) * 100 : 0;

            return (

              <div
                key={event._id}
                style={{
                  width: "300px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  background: "white"
                }}
              >

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

                  <p><b>Date:</b> {event.date}</p>

                  <p>
                    <b>Time:</b> {event.startTime} - {event.endTime}
                  </p>

                  <p><b>Venue:</b> {event.venue}</p>

                  <p>
                    <b>Registrations:</b> {registeredCount} / {maxSeats}
                  </p>

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

                    disabled={alreadyRegistered || seatsLeft <= 0}

                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      background: alreadyRegistered
                        ? "gray"
                        : "#007bff",
                      color: "white",
                      borderRadius: "6px",
                      cursor: alreadyRegistered ? "not-allowed" : "pointer"
                    }}

                  >

                    {alreadyRegistered
                      ? "Already Registered"
                      : seatsLeft <= 0
                        ? "Event Full"
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

export default UpcomingEvents;