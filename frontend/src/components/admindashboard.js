import React, { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {

  const [events, setEvents] = useState([]);

  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();

  }, []);

  return (
    <div>
      <h2>Admin / Host Dashboard</h2>

      <h3>Manage Events</h3>

      <ul>
        {events.map(ev => (
          <li key={ev._id}>
            {ev.title} - {ev.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;