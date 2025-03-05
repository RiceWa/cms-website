require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// ✅ CORS Configuration
const corsOptions = {
    origin: ["https://ricewa.ca", "http://ricewa.ca"], // ✅ Allow frontend domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // ✅ Allow cookies/auth headers
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions)); // ✅ Apply CORS settings

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
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
