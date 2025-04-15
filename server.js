require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// ✅ CORS Configuration
const corsOptions = {
    origin: ["http://ricewa.ca", "https://ricewa.ca", "http://localhost:3000"], // ✅ Allow both HTTP & HTTPS
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // ✅ Allow cookies/auth headers
    allowedHeaders: ["Content-Type", "Authorization"] // ✅ Explicitly allow necessary headers
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    dbName: "cms",
})
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// Load Models
require("./models/Post");
require("./models/User");
require("./models/Category");

// Middleware
app.use(express.json()); // Parses JSON requests

// API Routes
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

// Basic Route
app.get("/", (req, res) => {
    res.send("CMS Backend is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
