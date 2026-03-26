const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({

 userEmail:String,
 eventId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Event"
},
 attendanceStatus:{
   type:String,
   default:"not_attended"
 },
 certificateUrl:String

},{timestamps:true});

module.exports = mongoose.model("Registration",registrationSchema);