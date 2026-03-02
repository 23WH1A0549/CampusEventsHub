const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({
            name,
            email,
            password,
            role
        });

        await user.save();

        res.status(201).json({
            message: "User Registered Successfully"
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


// LOGIN
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
res.json({
    message: "Login successful",
    token,
    role: user.role,
    email: user.email,
    name: user.name
});

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;