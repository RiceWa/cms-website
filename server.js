require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");


const app = express();

app.use(cors());  // Enable CORS globally


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


// Basic Route
app.get("/", (req, res) => {
    res.send("CMS Backend is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
