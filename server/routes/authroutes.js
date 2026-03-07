const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            role: "student"
        });

        // Save user in MongoDB
        await user.save();

        res.status(201).json({
            message: "User Registered Successfully"
        });

    } catch (err) {
        console.log("REGISTER ERROR:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        // Check credentials
        if (!user || user.password !== password) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT Token
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
        console.log("LOGIN ERROR:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;