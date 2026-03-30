import axios from "axios";
import { useEffect, useState } from "react";

function UpcomingEvents() {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [myEventIds, setMyEventIds] = useState([]);

  const studentEmail = localStorage.getItem("email");

  useEffect(() => {

    const fetchData = async () => {

      try {

        const eventRes = await axios.get("http://localhost:5000/api/events");

        const myRes = await axios.get(
          `http://localhost:5000/api/events/my-events/${studentEmail}`
        );

        const myIds = myRes.data.map(ev => ev._id);
        setMyEventIds(myIds);

        const now = new Date();

        // ✅ FIX: use startDate
        const upcoming = eventRes.data.filter(event => {
          const start = new Date(`${event.startDate}T${event.startTime}`);
          return start > now;
        });

        // ✅ FIX: sorting
        upcoming.sort(
          (a, b) =>
            new Date(`${a.startDate}T${a.startTime}`) -
            new Date(`${b.startDate}T${b.startTime}`)
        );

        setEvents(upcoming);

      } catch (err) {
        console.log(err);
      }

    };

    if (studentEmail) {
      fetchData();
    }

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);

  }, [studentEmail]);

  const registerEvent = async (id) => {

    try {

      await axios.post(
        `http://localhost:5000/api/events/${id}/register`,
        { email: studentEmail }
      );

      alert("Registered Successfully ✅");

      // better than reload
      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed ❌");
    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h1>Upcoming Events</h1>

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

            const maxSeats = Number(event.maxRegistrations) || 0;
            const registeredCount = event.registrationCount || 0;
            const seatsLeft = maxSeats - registeredCount;

            const alreadyRegistered = myEventIds.includes(event._id);

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

                  {/* ✅ DATE RANGE FIX */}
                  <p>
                    📅 {
                      event.startDate === event.endDate
                        ? new Date(event.startDate).toDateString()
                        : `${new Date(event.startDate).toDateString()} - ${new Date(event.endDate).toDateString()}`
                    }
                  </p>

                  <p>🕒 {event.startTime} - {event.endTime}</p>
                  <p>📍 {event.venue}</p>

                  <p>
                    Registrations: {registeredCount} / {maxSeats}
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
                    disabled={alreadyRegistered || seatsLeft <= 0}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      background: alreadyRegistered ? "gray" : "#007bff",
                      color: "white",
                      borderRadius: "6px"
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