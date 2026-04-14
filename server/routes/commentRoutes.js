const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/ticket/:ticketId')
  .get(protect, async (req, res) => {
    try {
      const comments = await Comment.find({ ticket: req.params.ticketId }).populate('user', 'name');
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, async (req, res) => {
    const { text } = req.body;
    try {
      const comment = await Comment.create({
        text, ticket: req.params.ticketId, user: req.user._id
      });
      const populatedComment = await Comment.findById(comment._id).populate('user', 'name');
      res.status(201).json(populatedComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
