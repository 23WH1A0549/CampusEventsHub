const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ✅ GET ALL EVENTS (THIS WAS MISSING)
router.get("/", async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        console.log("Fetch Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ ADD EVENT
router.post("/", async (req, res) => {
    try {
        console.log("Event request received");

        const event = new Event({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            venue: req.body.venue,
            createdBy: req.body.createdBy
        });

        await event.save();

        res.status(201).json(event);

    } catch (err) {
        console.log("Event Save Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
    
});
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/:id/register", async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);

    const email = req.body.email;

    // already registered check
    const alreadyRegistered = event.registrations.find(
      r => r.studentEmail === email
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already Registered" });
    }

    // max registration check
    if (event.registrations.length >= event.maxRegistrations) {
      return res.status(400).json({ message: "Event Full" });
    }

    event.registrations.push({ studentEmail: email });

    await event.save();

    res.json({ message: "Registered Successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/student/:email", async (req, res) => {
  try {

    const events = await Event.find({
      "registrations.studentEmail": req.params.email
    });

    res.json(events);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;