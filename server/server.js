require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const eventRoutes = require("./routes/eventroutes");
const authRoutes = require("./routes/authroutes");

const app = express();   // ✅ FIRST create app

app.use(cors());
app.use(express.json());

// ✅ THEN use routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Atlas Connected"))
.catch(err => console.log("Mongo Error:", err));

app.get("/", (req, res) => {
    res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
