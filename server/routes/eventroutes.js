// File: routes/eventroutes.js

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Registration = require("../models/registration");
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
      startDate: r.eventId?.startDate,
      endDate: r.eventId?.endDate,
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
      startDate: r.eventId?.startDate,
      endDate: r.eventId?.endDate,  
      certificateUrl: r.certificateUrl,
    }));

    res.json(data);
  } catch (err) {
    console.log("❌ Cert Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
// =======================
// CREATE EVENT
// =======================
router.post("/", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();

    res.status(201).json(newEvent);

  } catch (err) {
    console.log("❌ Create Event Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
// =======================
// UPDATE EVENT
// =======================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Event not found ❌" });
    }

    res.json(updated);

  } catch (err) {
    console.log("❌ Update Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
// =======================
// DELETE EVENT
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Event not found ❌" });
    }

    res.json({ message: "Event deleted successfully 🗑" });

  } catch (err) {
    console.log("❌ Delete Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
// =======================
// EXPORT REGISTRATIONS TO EXCEL
// =======================
const ExcelJS = require("exceljs");

router.get("/:id/export-excel", async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found ❌" });
    }

    const regs = await Registration.find({ eventId });

    // 📄 Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Registrations");

    // 🎯 Columns
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Event", key: "event", width: 25 },
      { header: "Status", key: "status", width: 15 },
      { header: "Registered At", key: "date", width: 25 },
    ];

    // 🎯 Add rows
    regs.forEach((r) => {
      worksheet.addRow({
        name: r.userName,
        email: r.userEmail,
        event: event.title,
        status: r.attendanceStatus,
        date: r.createdAt,
      });
    });

    // 🎨 Style header
    worksheet.getRow(1).font = { bold: true };

    // 📥 Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${event.title}_registrations.xlsx`
    );

    // 📤 Send file
    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {
    console.log("❌ Excel Export Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;