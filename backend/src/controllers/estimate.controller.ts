import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Estimate } from '../models/Estimate';
import { v4 as uuidv4 } from 'uuid';

export class EstimateController {
  // Get all estimates for current user
  static async getUserEstimates(req: AuthRequest, res: Response): Promise<void> {
    try {
      const estimates = await Estimate.find({ userId: req.userId })
        .sort({ updatedAt: -1 })
        .select('-__v');

      res.status(200).json({
        success: true,
        data: { estimates },
      });
    } catch (error: any) {
      console.error('Get estimates error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch estimates',
      });
    }
  }

  // Get single estimate by ID
  static async getEstimateById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const estimate = await Estimate.findOne({
        _id: id,
        userId: req.userId,
      }).select('-__v');

      if (!estimate) {
        res.status(404).json({
          success: false,
          error: 'Estimate not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { estimate },
      });
    } catch (error: any) {
      console.error('Get estimate error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch estimate',
      });
    }
  }

  // Create new estimate
  static async createEstimate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, description, services } = req.body;

      if (!name || name.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Estimate name is required',
        });
        return;
      }

      const estimate = new Estimate({
        userId: req.userId,
        name: name.trim(),
        description: description?.trim(),
        services: services || [],
      });

      await estimate.save();

      res.status(201).json({
        success: true,
        data: { estimate },
      });
    } catch (error: any) {
      console.error('Create estimate error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create estimate',
      });
    }
  }

  // Update estimate
  static async updateEstimate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, services } = req.body;

      const estimate = await Estimate.findOne({
        _id: id,
        userId: req.userId,
      });

      if (!estimate) {
        res.status(404).json({
          success: false,
          error: 'Estimate not found',
        });
        return;
      }

      if (name !== undefined) estimate.name = name.trim();
      if (description !== undefined) estimate.description = description?.trim();
      if (services !== undefined) estimate.services = services;

      await estimate.save();

      res.status(200).json({
        success: true,
        data: { estimate },
      });
    } catch (error: any) {
      console.error('Update estimate error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update estimate',
      });
    }
  }

  // Delete estimate
  static async deleteEstimate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const estimate = await Estimate.findOneAndDelete({
        _id: id,
        userId: req.userId,
      });

      if (!estimate) {
        res.status(404).json({
          success: false,
          error: 'Estimate not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Estimate deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete estimate error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete estimate',
      });
    }
  }

  // Duplicate estimate
  static async duplicateEstimate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const originalEstimate = await Estimate.findOne({
        _id: id,
        userId: req.userId,
      });

      if (!originalEstimate) {
        res.status(404).json({
          success: false,
          error: 'Estimate not found',
        });
        return;
      }

      const duplicateName = name || `Copy of ${originalEstimate.name}`;

      const newEstimate = new Estimate({
        userId: req.userId,
        name: duplicateName,
        description: originalEstimate.description,
        services: originalEstimate.services,
      });

      await newEstimate.save();

      res.status(201).json({
        success: true,
        data: { estimate: newEstimate },
      });
    } catch (error: any) {
      console.error('Duplicate estimate error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to duplicate estimate',
      });
    }
  }

  // Generate share token
  static async generateShareToken(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const estimate = await Estimate.findOne({
        _id: id,
        userId: req.userId,
      });

      if (!estimate) {
        res.status(404).json({
          success: false,
          error: 'Estimate not found',
        });
        return;
      }

      if (!estimate.shareToken) {
        estimate.shareToken = uuidv4();
        await estimate.save();
      }

      const shareUrl = `${process.env.FRONTEND_URL}/shared/${estimate.shareToken}`;

      res.status(200).json({
        success: true,
        data: {
          shareToken: estimate.shareToken,
          shareUrl,
        },
      });
    } catch (error: any) {
      console.error('Generate share token error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate share link',
      });
    }
  }

  // Get shared estimate (public)
  static async getSharedEstimate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { shareToken } = req.params;

      const estimate = await Estimate.findOne({ shareToken }).select(
        'name description services totalMonthlyCost totalAnnualCost createdAt -_id'
      );

      if (!estimate) {
        res.status(404).json({
          success: false,
          error: 'Shared estimate not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { estimate },
      });
    } catch (error: any) {
      console.error('Get shared estimate error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch shared estimate',
      });
    }
  }
}
