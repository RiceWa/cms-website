const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

// Helper function to process tags
const processTags = (tags) => {
  if (!tags) return [];
  if (typeof tags === "string") {
    // Split the string by commas, trim whitespace, and remove empty strings
    return tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  return tags; // assume it's already an array
};

// 📌 Get all posts (READ)
router.get("/", async (req, res) => {
    try {
        let filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const posts = await Post.find(filter);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Create a new post (Protected)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user.userId,
            category: req.body.category,
            tags: processTags(req.body.tags)
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Edit a post (Protected)
// Now updating title, content, category, and tags
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                tags: processTags(req.body.tags)
            },
            { new: true }
        );
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Delete a post (Protected)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
