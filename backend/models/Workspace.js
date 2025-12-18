const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    required: true,
    enum: ['public', 'private'],
    default: 'public'
  },
  createdBy: {
    type: String,
    trim: true,
    maxlength: 100
  },
  members: [{
    userId: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    allowPublicJoin: {
      type: Boolean,
      default: true
    },
    maxMembers: {
      type: Number,
      default: 100
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
WorkspaceSchema.index({ name: 'text', description: 'text' });
WorkspaceSchema.index({ type: 1 });
WorkspaceSchema.index({ createdAt: -1 });
WorkspaceSchema.index({ 'members.userId': 1 });

// Virtual for message count (populated separately)
WorkspaceSchema.virtual('messageCount', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'workspaceId',
  count: true
});

module.exports = mongoose.model('Workspace', WorkspaceSchema);
