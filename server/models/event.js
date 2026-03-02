const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    startTime: String,
    endTime: String,
    location: String,
    createdBy: String
},{ timestamps:true });

module.exports = mongoose.model("Event", eventSchema);