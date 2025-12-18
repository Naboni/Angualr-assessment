const express = require('express');
const router = express.Router();
const {
  getAllWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getStatistics
} = require('../controllers/workspaceController');
const { validateCreateWorkspace, validateUpdateWorkspace } = require('../middleware/validators');

// Statistics route (before :id to avoid conflict)
router.get('/stats/summary', getStatistics);

// Get all workspaces
router.get('/', getAllWorkspaces);

// Get single workspace
router.get('/:id', getWorkspaceById);

// Create new workspace
router.post('/', validateCreateWorkspace, createWorkspace);

// Update workspace
router.put('/:id', validateUpdateWorkspace, updateWorkspace);

// Delete workspace
router.delete('/:id', deleteWorkspace);

module.exports = router;
