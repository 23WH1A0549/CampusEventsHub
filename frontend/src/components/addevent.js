import { useState } from "react";
import API from "../api";
import "./dashboard.css";

function AddEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    maxRegistrations: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const eventData = {
        ...form,
        createdBy: localStorage.getItem("email")
      };

      await API.post("/events", eventData);

      alert("Event Added Successfully ✅");

      setForm({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        maxRegistrations: ""
      });

    } catch (err) {
      console.log(err);
      alert("Event creation failed ❌");
    }
  };

  return (
    <div className="dashboard-main">
      <h2>Add New Event</h2>

      <form className="event-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Event Title"
          value={form.title} onChange={handleChange} required />

        <input type="text" name="description" placeholder="Description"
          value={form.description} onChange={handleChange} required />

        <input type="date" name="date"
          value={form.date} onChange={handleChange} required />

        <input type="time" name="startTime"
          value={form.startTime} onChange={handleChange} required />

        <input type="time" name="endTime"
          value={form.endTime} onChange={handleChange} required />

        <input type="text" name="location" placeholder="Venue"
          value={form.location} onChange={handleChange} required />

        <input type="number" name="maxRegistrations"
          placeholder="Max Registrations"
          value={form.maxRegistrations}
          onChange={handleChange}
          required />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default AddEvent;