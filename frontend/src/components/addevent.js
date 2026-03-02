import React, { useState } from "react";
import API from "../api";

function AddEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    createdBy: ""
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
      await API.post("/events", form);
      alert("Event added successfully");

      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        createdBy: ""
      });

    } catch (err) {
      alert("Event creation failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Event</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <br /><br />

        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <br /><br />

        <input name="date" placeholder="Date" value={form.date} onChange={handleChange} />
        <br /><br />

        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <br /><br />

        <input name="createdBy" placeholder="Created By Email" value={form.createdBy} onChange={handleChange} />
        <br /><br />

        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}

export default AddEvent;
