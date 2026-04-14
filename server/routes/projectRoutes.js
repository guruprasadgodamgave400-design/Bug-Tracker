const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const projects = await Project.find({
        $or: [{ members: req.user._id }, { createdBy: req.user._id }]
      }).populate('members', 'name email');
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .post(protect, async (req, res) => {
    const { title, description } = req.body;
    try {
      const project = await Project.create({
        title, description, createdBy: req.user._id, members: [req.user._id]
      });
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .get(protect, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate('members', 'name email');
      if (project) res.json(project);
      else res.status(404).json({ message: 'Project not found' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .put(protect, async (req, res) => {
    const { title, description, members } = req.body;
    try {
      const project = await Project.findById(req.params.id);
      if (project) {
        project.title = title || project.title;
        project.description = description || project.description;
        if (members) project.members = members;
        const updatedProject = await project.save();
        res.json(updatedProject);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (project) {
        res.json({ message: 'Project removed' });
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
