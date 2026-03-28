// File: routes/eventroutes.js

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const sendRegistrationEmail = require("../utils/sendEmail");
const generateCertificate = require("../utils/generateCertificate");
const mongoose = require("mongoose");

// =======================
// GET MY EVENTS
// =======================
router.get("/my-events/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const registrations = await Registration.find({
      userEmail: email,
    });

    const eventIds = registrations.map((r) => r.eventId);

    const events = await Event.find({
      _id: { $in: eventIds },
    });

    const eventsWithCount = await Promise.all(
      events.map(async (ev) => {
        const regCount = await Registration.countDocuments({
          eventId: ev._id,
        });

        return {
          ...ev._doc,
          registrationCount: regCount,
        };
      })
    );

    res.json(eventsWithCount);

  } catch (err) {
    console.log("❌ My Events Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// GET ALL EVENTS
// =======================
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();

    const eventsWithCount = await Promise.all(
      events.map(async (ev) => {
        const regCount = await Registration.countDocuments({
          eventId: ev._id,
        });

        return {
          ...ev._doc,
          registrationCount: regCount,
        };
      })
    );

    res.status(200).json(eventsWithCount);
  } catch (err) {
    console.log("❌ Fetch Events Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// REGISTER
// =======================
router.post("/:id/register", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email required" });

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const exists = await Registration.findOne({
      userEmail: email,
      eventId: event._id,
    });

    if (exists)
      return res.status(400).json({ message: "Already registered" });

    const total = await Registration.countDocuments({
      eventId: event._id,
    });

    if (total >= event.maxRegistrations)
      return res.status(400).json({ message: "Event full" });

    const reg = new Registration({
      userEmail: email,
       userName: name,
      eventId: event._id,
    });

    await reg.save();

    console.log("📩 Sending Email...");
    await sendRegistrationEmail(email, event);
    console.log("✅ Email Sent");

    res.json({ message: "Registered & email sent ✅" });

  } catch (err) {
    console.log("❌ Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// MARK ATTENDANCE + CERTIFICATE
// =======================
router.post("/mark-attendance", async (req, res) => {
  try {
    const { email, eventId } = req.body;

    if (!email || !eventId) {
      return res.status(400).json({ message: "Missing data ❌" });
    }

    const registration = await Registration.findOne({
      userEmail: email,
      eventId: eventId,
    }).populate("eventId");

    if (!registration) {
      return res.status(404).json({ message: "Not registered ❌" });
    }

    if (registration.attendanceStatus === "attended") {
      return res.json({ message: "Already marked ✅" });
    }

    console.log("🎯 Generating certificate...");

    const studentName = registration.userName || "Student";
    const eventTitle = registration.eventId.title;

    const fileName = await generateCertificate(studentName, eventTitle);

    console.log("✅ Certificate created:", fileName);

    registration.attendanceStatus = "attended";
    registration.certificateUrl = `/certificates/${fileName}`;

    await registration.save();

    console.log("💾 Saved to DB");

    res.json({
      message: "Attendance marked & certificate generated 🎓",
    });

  } catch (err) {
    console.log("❌ Attendance Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
// =======================
// GET ATTENDANCE
// =======================
router.get("/attendance/:email", async (req, res) => {
  try {
    const regs = await Registration.find({
      userEmail: req.params.email,
    }).populate("eventId");

    const data = regs.map((r) => ({
      eventName: r.eventId?.title,
      date: r.eventId?.date,
      venue: r.eventId?.venue,
      status: r.attendanceStatus,
    }));

    res.json(data);
  } catch (err) {
    console.log("❌ Attendance Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =======================
// GET CERTIFICATES
// =======================
router.get("/certificates/:email", async (req, res) => {
  try {
    const regs = await Registration.find({
      userEmail: req.params.email,
      attendanceStatus: "attended",
      certificateUrl: { $ne: null },
    }).populate("eventId");

    const data = regs.map((r) => ({
      eventName: r.eventId?.title,
      date: r.eventId?.date,
      certificateUrl: r.certificateUrl,
    }));

    res.json(data);
  } catch (err) {
    console.log("❌ Cert Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;