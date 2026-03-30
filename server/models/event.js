const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    startDate: String,
    endDate: String,
    startTime: String,
    endTime: String,
    venue: String,
    image: String,
    maxRegistrations: Number,
    createdBy: String,
    registrations: { type: [String], default: [] }  // 👈 Add this
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);