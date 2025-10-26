import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import Estimate from '../models/Estimate.js';
import SharedEstimate from '../models/SharedEstimate.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/estimates - Get all estimates for authenticated user
router.get('/', async (req, res) => {
  try {
    const { sort = '-createdAt', search } = req.query;

    // Build query
    const query = { userId: req.user._id.toString() };
    console.log(`[Estimates] Fetching estimates for userId: ${req.user._id}`);

    // Add search filter if provided
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Fetch estimates
    const estimates = await Estimate.find(query).sort(sort);

    res.status(200).json({
      success: true,
      estimates
    });
  } catch (error) {
    console.error('Get estimates error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// GET /api/estimates/:id - Get single estimate by ID
router.get('/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }

    // Check ownership
    if (estimate.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden'
      });
    }

    res.status(200).json({
      success: true,
      estimate
    });
  } catch (error) {
    console.error('Get estimate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// POST /api/estimates - Create new estimate
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Estimate name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('services')
    .isArray()
    .withMessage('Services must be an array'),
  body('totalMonthlyCost')
    .isNumeric()
    .withMessage('Total monthly cost must be a number')
    .custom(value => value >= 0)
    .withMessage('Total monthly cost must be non-negative')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { name, description, services, totalMonthlyCost } = req.body;

    // Calculate total annual cost
    const totalAnnualCost = totalMonthlyCost * 12;

    // Create estimate
    const estimate = await Estimate.create({
      userId: req.user._id,
      name,
      description,
      services,
      totalMonthlyCost,
      totalAnnualCost
    });

    res.status(201).json({
      success: true,
      estimate
    });
  } catch (error) {
    console.error('Create estimate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// PATCH /api/estimates/:id - Update existing estimate
router.patch('/:id', [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('services')
    .optional()
    .isArray()
    .withMessage('Services must be an array'),
  body('totalMonthlyCost')
    .optional()
    .isNumeric()
    .withMessage('Total monthly cost must be a number')
    .custom(value => value >= 0)
    .withMessage('Total monthly cost must be non-negative')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }

    // Check ownership
    if (estimate.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden'
      });
    }

    // Update fields
    const { name, description, services, totalMonthlyCost } = req.body;

    if (name !== undefined) estimate.name = name;
    if (description !== undefined) estimate.description = description;
    if (services !== undefined) estimate.services = services;
    if (totalMonthlyCost !== undefined) {
      estimate.totalMonthlyCost = totalMonthlyCost;
      estimate.totalAnnualCost = totalMonthlyCost * 12;
    }

    estimate.updatedAt = new Date();
    await estimate.save();

    res.status(200).json({
      success: true,
      estimate
    });
  } catch (error) {
    console.error('Update estimate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// DELETE /api/estimates/:id - Delete estimate
router.delete('/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }

    // Check ownership
    if (estimate.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden'
      });
    }

    // Delete estimate
    await Estimate.deleteOne({ _id: req.params.id });

    // Delete associated shares
    await SharedEstimate.deleteMany({ estimateId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Estimate deleted'
    });
  } catch (error) {
    console.error('Delete estimate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// POST /api/estimates/:id/duplicate - Duplicate an estimate
router.post('/:id/duplicate', async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }

    // Check ownership
    if (estimate.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden'
      });
    }

    // Create duplicate
    const duplicate = await Estimate.create({
      userId: req.user._id,
      name: `${estimate.name} (Copy)`,
      description: estimate.description,
      services: estimate.services,
      totalMonthlyCost: estimate.totalMonthlyCost,
      totalAnnualCost: estimate.totalAnnualCost
    });

    res.status(201).json({
      success: true,
      estimate: duplicate
    });
  } catch (error) {
    console.error('Duplicate estimate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// POST /api/estimates/:id/share - Create shareable link for estimate
router.post('/:id/share', [
  body('accessType')
    .isIn(['public', 'private'])
    .withMessage('Access type must be either public or private'),
  body('password')
    .optional()
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expires at must be a valid date')
    .custom(value => new Date(value) > new Date())
    .withMessage('Expiry date must be in the future')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'Estimate not found'
      });
    }

    // Check ownership
    if (estimate.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden'
      });
    }

    const { accessType, password, expiresAt } = req.body;

    // Generate unique share token
    const shareToken = crypto.randomBytes(16).toString('hex');

    // Hash password if provided
    let hashedPassword = null;
    if (password && accessType === 'public') {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Create shared estimate
    const sharedEstimate = await SharedEstimate.create({
      estimateId: req.params.id,
      userId: req.user._id,
      shareToken,
      accessType,
      password: hashedPassword,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    // Construct share URL
    const shareUrl = `${process.env.FRONTEND_URL}/shared/${shareToken}`;

    res.status(201).json({
      success: true,
      shareUrl,
      shareToken
    });
  } catch (error) {
    console.error('Share estimate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
