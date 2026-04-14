const express = require('express');
const Ticket = require('../models/Ticket');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/project/:projectId')
  .get(protect, async (req, res) => {
    try {
      const tickets = await Ticket.find({ project: req.params.projectId })
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email');
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/')
  .post(protect, async (req, res) => {
    const { title, description, status, priority, assignee, project } = req.body;
    try {
      const ticket = await Ticket.create({
        title, description, status, priority, assignee, project, createdBy: req.user._id
      });
      const populatedTicket = await Ticket.findById(ticket._id)
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email');
      res.status(201).json(populatedTicket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    const { title, description, status, priority, assignee } = req.body;
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (ticket) {
        ticket.title = title || ticket.title;
        ticket.description = description !== undefined ? description : ticket.description;
        ticket.status = status || ticket.status;
        ticket.priority = priority || ticket.priority;
        ticket.assignee = assignee !== undefined ? assignee : ticket.assignee;
        
        const updatedTicket = await ticket.save();
        const populatedUpdate = await Ticket.findById(updatedTicket._id)
          .populate('assignee', 'name email')
          .populate('createdBy', 'name email');
        res.json(populatedUpdate);
      } else {
        res.status(404).json({ message: 'Ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const ticket = await Ticket.findByIdAndDelete(req.params.id);
      if (ticket) {
        res.json({ message: 'Ticket removed' });
      } else {
        res.status(404).json({ message: 'Ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
