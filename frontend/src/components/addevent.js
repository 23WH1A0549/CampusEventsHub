import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import "./dashboard.css";

function AddEvent() {

  const location = useLocation();
  const navigate = useNavigate();
  const [image,setImage] = useState("");

  const params = new URLSearchParams(location.search);
  const eventId = params.get("id");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    maxRegistrations: ""
  });

  // ✅ LOAD EVENT DATA WHEN EDITING
  useEffect(() => {
    if (eventId) {
      API.get("/events")
        .then((res) => {
          const event = res.data.find((e) => e._id === eventId);

          if (event) {
            setForm({
              title: event.title,
              description: event.description,
              date: event.date,
              startTime: event.startTime,
              endTime: event.endTime,
              venue: event.venue,
              maxRegistrations: event.maxRegistrations
            });
             setImage(event.image || "");
          }
        })
        .catch((err) => console.log("Fetch Event Error:", err));
    }
  }, [eventId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ ADD OR UPDATE EVENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const eventData = {
        ...form,
        image: image,
        createdBy: localStorage.getItem("email")
      };

      if (eventId) {
        await API.put(`/events/${eventId}`, eventData);
        alert("Event Updated Successfully ✏");
      } else {
        await API.post("/events", eventData);
        alert("Event Added Successfully ✅");
      }

      navigate("/admin-dashboard");

    } catch (err) {
      console.log(err);
      alert("Operation failed ❌");
    }
  };

  return (
    <div className="dashboard-main">

      <h2>{eventId ? "Edit Event" : "Add New Event"}</h2>

      <form className="event-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e)=>setImage(e.target.value)}
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={form.venue}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="maxRegistrations"
          placeholder="Max Registrations"
          value={form.maxRegistrations}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {eventId ? "Update Event" : "Create Event"}
        </button>

      </form>

    </div>
  );
}

export default AddEvent;