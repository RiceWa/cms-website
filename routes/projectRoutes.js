const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

// 📌 Get all projects (Public)
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 }); // Newest first
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Create a project (Protected)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const newProject = new Project({
            title: req.body.title,
            description: req.body.description,
            link: req.body.link
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Edit a project (Protected)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, description: req.body.description, link: req.body.link },
            { new: true }
        );
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Delete a project (Protected)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
