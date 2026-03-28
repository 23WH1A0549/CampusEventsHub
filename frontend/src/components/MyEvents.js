import axios from "axios";
import { useEffect, useState } from "react";

function MyEvents() {

  const [events, setEvents] = useState([]);
  const studentEmail = localStorage.getItem("email");

  useEffect(() => {

    const fetchMyEvents = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/events/my-events/${studentEmail}`
        );

        setEvents(res.data);

      } catch (err) {
        console.log(err);
      }

    };

    if (studentEmail) {
      fetchMyEvents();
    }

  }, [studentEmail]);

  return (

    <div style={{ padding: "30px" }}>

      <h1>My Events</h1>

      <p style={{
        fontStyle: "italic",
        color: "gray",
        marginBottom: "25px"
      }}>
        "Your journey of learning through events."
      </p>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "25px"
      }}>

        {events.length === 0 && (
          <p>You haven't registered for any events yet.</p>
        )}

        {events.map((event) => {

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

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default MyEvents;