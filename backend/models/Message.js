const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  author: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    userId: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      trim: true
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'file', 'system'],
    default: 'text'
  },
  metadata: {
    fileName: {
      type: String,
      trim: true
    },
    fileSize: {
      type: Number
    },
    fileType: {
      type: String,
      trim: true
    },
    fileUrl: {
      type: String,
      trim: true
    }
  },
  editedAt: {
    type: Date
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  reactions: [{
    emoji: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
MessageSchema.index({ workspaceId: 1, createdAt: -1 });
MessageSchema.index({ 'author.userId': 1 });
MessageSchema.index({ createdAt: -1 });

// Virtual for formatted timestamp
MessageSchema.virtual('formattedTime').get(function () {
  return this.createdAt.toISOString();
});

module.exports = mongoose.model('Message', MessageSchema);
