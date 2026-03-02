const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const auth = require("../middleware/auth");

// REGISTER FOR EVENT
router.post("/", auth, async (req, res) => {

    try {

        const { userEmail, eventId } = req.body;

        const registration = new Registration({
            userEmail,
            eventId
        });

        await registration.save();

        res.status(201).json(registration);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }

});


// GET USER REGISTRATIONS
router.get("/", auth, async (req, res) => {

    try {

        const registrations = await Registration.find({
            userEmail: req.user.email
        });

        res.json(registrations);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }

});

module.exports = router;