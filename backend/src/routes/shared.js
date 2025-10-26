import express from 'express';
import SharedEstimate from '../models/SharedEstimate.js';
import Estimate from '../models/Estimate.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/shared/:shareToken - Get shared estimate by token
router.get('/:shareToken', async (req, res) => {
  try {
    const { shareToken } = req.params;
    const { password } = req.query;

    // Find shared estimate and populate the estimate data
    const sharedEstimate = await SharedEstimate.findOne({ shareToken })
      .populate('estimateId');

    if (!sharedEstimate) {
      return res.status(404).json({
        success: false,
        error: 'Shared link not found'
      });
    }

    // Check if expired
    if (sharedEstimate.isExpired()) {
      return res.status(410).json({
        success: false,
        error: 'Link has expired',
        expired: true
      });
    }

    // Check if private (requires authentication)
    if (sharedEstimate.accessType === 'private') {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          requiresAuth: true
        });
      }
    }

    // Check if password protected
    if (sharedEstimate.password) {
      if (!password) {
        return res.status(403).json({
          success: false,
          error: 'Password required',
          requiresPassword: true
        });
      }

      const isPasswordValid = await sharedEstimate.checkPassword(password);
      if (!isPasswordValid) {
        return res.status(403).json({
          success: false,
          error: 'Incorrect password'
        });
      }
    }

    // Increment view count
    await sharedEstimate.incrementViewCount();

    // Get user who created the share
    const user = await User.findById(sharedEstimate.userId).select('name');

    res.status(200).json({
      success: true,
      estimate: sharedEstimate.estimateId,
      sharedBy: user?.name || 'Unknown',
      sharedAt: sharedEstimate.createdAt
    });
  } catch (error) {
    console.error('Get shared estimate error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;
