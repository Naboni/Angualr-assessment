const { body } = require('express-validator');

// Workspace validators
exports.validateCreateWorkspace = [
  body('name')
    .notEmpty()
    .withMessage('Workspace name is required')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Workspace name must be between 1 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('type')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Type must be either "public" or "private"'),

  body('createdBy')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('CreatedBy must not exceed 100 characters')
];

exports.validateUpdateWorkspace = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Workspace name must be between 1 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('type')
    .optional()
    .isIn(['public', 'private'])
    .withMessage('Type must be either "public" or "private"')
];

// Message validators
exports.validateSendMessage = [
  body('content')
    .notEmpty()
    .withMessage('Message content is required')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message content must be between 1 and 5000 characters'),

  body('author.name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters'),

  body('author.userId')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Author userId must not exceed 100 characters'),

  body('author.avatar')
    .optional()
    .trim()
    .isURL()
    .withMessage('Author avatar must be a valid URL'),

  body('type')
    .optional()
    .isIn(['text', 'file', 'system'])
    .withMessage('Message type must be "text", "file", or "system"'),

  body('metadata.fileName')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('File name must not exceed 255 characters'),

  body('metadata.fileSize')
    .optional()
    .isInt({ min: 0 })
    .withMessage('File size must be a positive integer'),

  body('metadata.fileType')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('File type must not exceed 100 characters')
];

exports.validateUpdateMessage = [
  body('content')
    .notEmpty()
    .withMessage('Message content is required')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message content must be between 1 and 5000 characters')
];
