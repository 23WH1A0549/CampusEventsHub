// File: routes/eventroutes.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Registration = require("../models/registration");

// =======================
// GET ALL EVENTS
// =======================
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();

    // Add registration count for each event
    const eventsWithCount = await Promise.all(
      events.map(async (ev) => {
        const regCount = await Registration.countDocuments({ eventId: ev._id });
        return {
          ...ev._doc,
          registrationCount: regCount,
        };
      })
    );

    res.status(200).json(eventsWithCount);
  } catch (err) {
    console.log("Fetch Events Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// ADD NEW EVENT
// =======================
router.post("/", async (req, res) => {
  try {
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      venue: req.body.venue,
      image: req.body.image,
      maxRegistrations: req.body.maxRegistrations,
      createdBy: req.body.createdBy,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.log("Add Event Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// UPDATE EVENT
// =======================
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        venue: req.body.venue,
        image: req.body.image,
        maxRegistrations: req.body.maxRegistrations,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.log("Update Event Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// DELETE EVENT
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ eventId: req.params.id });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.log("Delete Event Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// REGISTER STUDENT FOR EVENT
// =======================
router.post("/:id/register", async (req, res) => {
  try {
    const { email } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Already registered?
    const alreadyRegistered = await Registration.findOne({
      userEmail: email,
      eventId: event._id,
    });
    if (alreadyRegistered)
      return res.status(400).json({ message: "Already registered" });

    // Max capacity?
    const totalRegs = await Registration.countDocuments({ eventId: event._id });
    if (totalRegs >= event.maxRegistrations)
      return res.status(400).json({ message: "Event is full" });

    // Save registration
    const registration = new Registration({
      userEmail: email,
      eventId: event._id,
    });

    await registration.save();
    res.status(200).json({ message: "Registered successfully" });
  } catch (err) {
    console.log("Registration Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;