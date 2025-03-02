const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Login Route
router.post("/login", [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: "Invalid username or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
