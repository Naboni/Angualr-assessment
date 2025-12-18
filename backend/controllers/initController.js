const mongoose = require('mongoose');
const Workspace = require('../models/Workspace');
const Message = require('../models/Message');

// @desc    Initialize project - check connections, seed data if needed
// @route   GET /api/init
// @access  Public
exports.initializeProject = async (req, res) => {
    try {
        const initResults = {
            timestamp: new Date().toISOString(),
            database: {
                connected: false,
                status: 'unknown'
            },
            workspaces: {
                count: 0,
                seeded: false
            },
            messages: {
                count: 0,
                seeded: false
            },
            externalApi: {
                status: 'unknown',
                message: ''
            },
            server: {
                status: 'running',
                environment: process.env.NODE_ENV || 'development',
                port: process.env.PORT || 3000
            }
        };

        // Check MongoDB connection
        try {
            if (mongoose.connection.readyState === 1) {
                initResults.database.connected = true;
                initResults.database.status = 'connected';

                // Count existing workspaces
                const workspaceCount = await Workspace.countDocuments();
                initResults.workspaces.count = workspaceCount;

                // Check if database is already seeded
                if (workspaceCount > 0) {
                    const messageCount = await Message.countDocuments();
                    initResults.messages.count = messageCount;
                    initResults.workspaces.seeded = false;
                    initResults.workspaces.message = 'Database already seeded';
                    console.log('✓ Database already contains workspaces, skipping seed');

                    return res.json({
                        success: true,
                        message: 'Database already seeded, no action taken',
                        data: initResults
                    });
                }

                // Seed data if no workspaces exist
                if (workspaceCount === 0) {
                    const sampleWorkspaces = [
                        {
                            name: "Frontend Development Team",
                            description: "A workspace for our frontend development team to collaborate on Angular projects",
                            type: "public",
                            createdBy: "admin",
                            members: [
                                { userId: "admin", role: "owner", joinedAt: new Date() },
                                { userId: "dev1", role: "member", joinedAt: new Date() }
                            ]
                        },
                        {
                            name: "Design Collaboration",
                            description: "Workspace for designers to share ideas and collaborate on UI/UX projects",
                            type: "public",
                            createdBy: "designer1",
                            members: [
                                { userId: "designer1", role: "owner", joinedAt: new Date() }
                            ]
                        },
                        {
                            name: "Product Planning",
                            description: "Private workspace for product managers to plan features and roadmap",
                            type: "private",
                            createdBy: "pm1",
                            members: [
                                { userId: "pm1", role: "owner", joinedAt: new Date() },
                                { userId: "pm2", role: "admin", joinedAt: new Date() }
                            ]
                        },
                        {
                            name: "Backend Team",
                            description: "Backend developers workspace for API discussions and architecture",
                            type: "public",
                            createdBy: "backend1",
                            members: [
                                { userId: "backend1", role: "owner", joinedAt: new Date() }
                            ]
                        },
                        {
                            name: "QA Testing",
                            description: "Quality assurance team workspace for bug reports and testing coordination",
                            type: "public",
                            createdBy: "qa1",
                            members: [
                                { userId: "qa1", role: "owner", joinedAt: new Date() }
                            ]
                        }
                    ];

                    const createdWorkspaces = await Workspace.insertMany(sampleWorkspaces);
                    initResults.workspaces.seeded = true;
                    initResults.workspaces.count = createdWorkspaces.length;
                    console.log('✓ Seeded database with sample workspaces');

                    // Seed messages for the first workspace
                    if (createdWorkspaces.length > 0) {
                        const firstWorkspaceId = createdWorkspaces[0]._id;
                        const sampleMessages = [
                            {
                                workspaceId: firstWorkspaceId,
                                content: "Welcome to the Frontend Development Team workspace! Let's collaborate on building amazing Angular applications.",
                                author: { name: "Admin", userId: "admin" },
                                type: "system"
                            },
                            {
                                workspaceId: firstWorkspaceId,
                                content: "Hey team! I've been working on implementing the new component library. Should we schedule a review?",
                                author: { name: "John Developer", userId: "dev1" },
                                type: "text"
                            },
                            {
                                workspaceId: firstWorkspaceId,
                                content: "Great idea! I can review it tomorrow morning. Also, has anyone looked into the performance optimization we discussed?",
                                author: { name: "Admin", userId: "admin" },
                                type: "text"
                            },
                            {
                                workspaceId: firstWorkspaceId,
                                content: "I've started working on the virtual scrolling implementation. It should help with the large lists we're rendering.",
                                author: { name: "John Developer", userId: "dev1" },
                                type: "text"
                            },
                            {
                                workspaceId: firstWorkspaceId,
                                content: "Perfect! Let's make sure we add unit tests for the new components as well.",
                                author: { name: "Admin", userId: "admin" },
                                type: "text"
                            }
                        ];

                        await Message.insertMany(sampleMessages);
                        initResults.messages.seeded = true;
                        initResults.messages.count = sampleMessages.length;
                        console.log('✓ Seeded database with sample messages');
                    }
                }
            } else {
                initResults.database.status = 'not connected';
                initResults.database.connected = false;
            }
        } catch (dbError) {
            initResults.database.status = 'error';
            initResults.database.error = dbError.message;
            console.error('Database check error:', dbError);
        }

        const allChecksPassed = initResults.database.connected;

        res.json({
            success: allChecksPassed,
            message: 'Project initialized successfully',
            data: initResults
        });

    } catch (error) {
        console.error('Initialization error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            data: null
        });
    }
};

