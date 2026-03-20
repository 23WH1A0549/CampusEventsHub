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

            location: req.body.location,

            venue: req.body.venue,
            maxRegistrations: req.body.maxRegistrations,
            image: req.body.image,
            createdBy: req.body.createdBy
        });

        await event.save();

        res.status(201).json(event);

    } catch (err) {
        console.log("Event Save Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;