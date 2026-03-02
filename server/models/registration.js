const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({

 userEmail:String,
 eventId:String,
 attendanceStatus:{
   type:String,
   default:"not_attended"
 },
 certificateUrl:String

},{timestamps:true});

module.exports = mongoose.model("Registration",registrationSchema);