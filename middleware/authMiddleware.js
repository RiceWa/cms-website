const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: "Invalid token. User not found." });
        }

        req.user = user; // Attach user object (not just userId) to the request
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};


module.exports = authMiddleware;
