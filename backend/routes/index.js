const express = require('express');
const router = express.Router();
const workspaceRoutes = require('./workspaceRoutes');
const messageRoutes = require('./messageRoutes');
const { initializeProject } = require('../controllers/initController');

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Initialize project
router.get('/init', initializeProject);

// API routes
router.use('/workspaces', workspaceRoutes);
router.use('/', messageRoutes); // Message routes include /workspaces/:id/messages

module.exports = router;

