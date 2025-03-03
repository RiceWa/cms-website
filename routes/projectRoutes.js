const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

// 📌 Get all projects (READ)
router.get("/", async (req, res) => {
    try {
        let filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const projects = await Project.find(filter);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Create a new project (Protected)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const newProject = new Project({
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            category: req.body.category, // ✅ Add category
            tags: req.body.tags || []    // ✅ Add tags (default to empty array)
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
            {
                title: req.body.title,
                description: req.body.description,
                link: req.body.link,
                category: req.body.category, // ✅ Update category
                tags: req.body.tags || []    // ✅ Update tags
            },
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
