const express = require('express');
const router = express.Router();
const {
  getWorkspaceMessages,
  sendMessage,
  updateMessage,
  deleteMessage
} = require('../controllers/messageController');
const { validateSendMessage, validateUpdateMessage } = require('../middleware/validators');

// Get messages for a workspace
router.get('/workspaces/:workspaceId/messages', getWorkspaceMessages);

// Send message to workspace
router.post('/workspaces/:workspaceId/messages', validateSendMessage, sendMessage);

// Update message
router.put('/messages/:id', validateUpdateMessage, updateMessage);

// Delete message
router.delete('/messages/:id', deleteMessage);

module.exports = router;
