const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    startTime: String,
    endTime: String,
    venue: String,
    maxRegistrations: Number,
    createdBy: String,
    image: String,
    registrations: [
    {
      studentEmail: String
    }
  ]
},{ timestamps:true });

module.exports = mongoose.model("Event", eventSchema);