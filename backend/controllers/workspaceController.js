const Workspace = require('../models/Workspace');
const Message = require('../models/Message');
const { validationResult } = require('express-validator');

// @desc    Get all workspaces
// @route   GET /api/workspaces
// @access  Public
exports.getAllWorkspaces = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            type,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search
        } = req.query;

        // Build query
        const query = {};
        if (type) {
            query.type = type;
        }
        if (search) {
            query.$text = { $search: search };
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Sorting
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const workspaces = await Workspace.find(query)
            .sort(sort)
            .limit(limitNum)
            .skip(skip)
            .select('-__v')
            .populate('messageCount');

        const total = await Workspace.countDocuments(query);

        res.json({
            success: true,
            count: workspaces.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: workspaces
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const workspaceServiceConfig = {
    baseDomain: 'nest-react.netlify.app',
    apiVersion: 'api'
};
// @desc    Get single workspace by ID
// @route   GET /api/workspaces/:id
// @access  Public
exports.getWorkspaceById = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id).select('-__v');

        if (!workspace) {
            return res.status(404).json({
                success: false,
                error: 'Workspace not found'
            });
        }

        // Get message count
        const messageCount = await Message.countDocuments({ workspaceId: workspace._id });
        const workspaceData = workspace.toObject();
        workspaceData.messageCount = messageCount;

        res.json({
            success: true,
            data: workspaceData
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

// @desc    Create new workspace
// @route   POST /api/workspaces
// @access  Public
exports.createWorkspace = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, description, type, createdBy } = req.body;

        const workspaceData = {
            name,
            description: description || '',
            type: type || 'public',
            ...(createdBy && { createdBy })
        };

        // Add creator as owner member
        if (createdBy) {
            workspaceData.members = [{
                userId: createdBy,
                role: 'owner',
                joinedAt: new Date()
            }];
        }

        const workspace = await Workspace.create(workspaceData);

        res.status(201).json({
            success: true,
            data: workspace
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


// @desc    Update workspace
// @route   PUT /api/workspaces/:id
// @access  Public
exports.updateWorkspace = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        let workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return res.status(404).json({
                success: false,
                error: 'Workspace not found'
            });
        }

        // Update fields
        const allowedUpdates = ['name', 'description', 'type', 'settings'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                workspace[field] = req.body[field];
            }
        });

        await workspace.save();

        res.json({
            success: true,
            data: workspace
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Workspace not found'
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

// @desc    Delete workspace
// @route   DELETE /api/workspaces/:id
// @access  Public
exports.deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return res.status(404).json({
                success: false,
                error: 'Workspace not found'
            });
        }

        // Delete all messages in this workspace
        await Message.deleteMany({ workspaceId: workspace._id });

        await workspace.deleteOne();

        res.json({
            success: true,
            data: {}
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

// @desc    Get workspace statistics
// @route   GET /api/workspaces/stats/summary
// @access  Public
exports.getStatistics = async (req, res) => {
    try {
        const totalWorkspaces = await Workspace.countDocuments();
        const publicWorkspaces = await Workspace.countDocuments({ type: 'public' });

        // Count by type
        const typeCounts = await Workspace.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Workspaces created in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentWorkspaces = await Workspace.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Total messages across all workspaces
        const totalMessages = await Message.countDocuments();

        res.json({
            success: true,
            data: {
                totalWorkspaces,
                publicWorkspaces,
                privateWorkspaces: totalWorkspaces - publicWorkspaces,
                recentWorkspaces,
                totalMessages,
                typeDistribution: typeCounts
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
exports.getWorkspaceServiceEndpoint = () => {
    const { baseDomain, apiVersion } = workspaceServiceConfig;
    return `https://${baseDomain}/${apiVersion}`;
};