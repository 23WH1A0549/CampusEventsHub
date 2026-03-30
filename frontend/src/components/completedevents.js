import axios from "axios";
import { useEffect, useState } from "react";

function CompletedEvents() {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const fetchEvents = () => {

      axios.get("http://localhost:5000/api/events")
        .then((res) => {

          const now = new Date();

          // ✅ FIX: use endDate
          const completed = res.data.filter(event => {

            const end = new Date(`${event.endDate}T${event.endTime}`);

            return end < now;

          });

          // ✅ FIX: sorting using endDate
          completed.sort(
            (a, b) =>
              new Date(`${b.endDate}T${b.endTime}`) -
              new Date(`${a.endDate}T${a.endTime}`)
          );

          setEvents(completed);

        })
        .catch(err => console.log(err));

    };

    fetchEvents();

    const interval = setInterval(fetchEvents, 60000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div style={{ padding: "30px" }}>

      <h1>Completed Events</h1>

      <input
        type="text"
        placeholder="Search Events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "20px" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>

        {events
          .filter(event =>
            event.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((event) => (

            <div key={event._id}
              style={{
                width: "300px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                borderRadius: "10px",
                padding: "15px",
                background: "#f5f5f5"
              }}>

              <h3>{event.title}</h3>
              <p>{event.description}</p>

              {/* ✅ DATE RANGE */}
              <p>
                📅 {
                  event.startDate === event.endDate
                    ? new Date(event.startDate).toDateString()
                    : `${new Date(event.startDate).toDateString()} - ${new Date(event.endDate).toDateString()}`
                }
              </p>

              <p>🕒 {event.startTime} - {event.endTime}</p>
              <p>📍 {event.venue}</p>

              <p style={{ color: "gray" }}>
                Event Completed
              </p>

            </div>

          ))}

      </div>

    </div>

  );

}

export default CompletedEvents;