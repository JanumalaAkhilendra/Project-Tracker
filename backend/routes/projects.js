const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  joinProject,
} = require('../controllers/projects');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router(); // ✅ This was missing

// List projects for the logged-in user (both roles can access)
router.route('/')
  .get(protect, getProjects) // owners & members can see their projects
  .post(protect, authorize('owner'), createProject); // only owner can create

// Get a single project
router.route('/:id')
  .get(protect, getProject) // both can view
  .put(protect, authorize('owner'), updateProject) // only owner can update
  .delete(protect, authorize('owner'), deleteProject); // only owner can delete

// Join project via invite code (members only)
router.post('/join/:inviteCode', protect, authorize('member'), joinProject);

module.exports = router; // ✅ Make sure to export
