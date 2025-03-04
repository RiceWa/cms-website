const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to protect routes
const authMiddleware = (req, res, next) => {

    console.log("Authorization Header:", req.headers.authorization);
    const token = req.header("Authorization"); // Get token from request header

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET); // Verify token
        req.user = verified; // Attach user data to request
        next(); // Continue to the next function
    } catch (err) {
        res.status(401).json({ error: "Invalid token." });
    }
};

module.exports = authMiddleware;
