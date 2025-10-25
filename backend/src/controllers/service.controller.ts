import { Request, Response } from 'express';
import { Service } from '../models/Service';
import { Region } from '../models/Region';

export class ServiceController {
  // Get all services with optional filtering
  static async getServices(req: Request, res: Response): Promise<void> {
    try {
      const { category, search } = req.query;

      let query: any = { isActive: true };

      if (category) {
        query.category = category;
      }

      if (search) {
        query.$text = { $search: search as string };
      }

      const services = await Service.find(query)
        .select('code name fullName description category icon')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        data: { services },
      });
    } catch (error: any) {
      console.error('Get services error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch services',
      });
    }
  }

  // Get single service by code
  static async getServiceByCode(req: Request, res: Response): Promise<void> {
    try {
      const { serviceCode } = req.params;

      const service = await Service.findOne({
        code: serviceCode.toLowerCase(),
        isActive: true,
      });

      if (!service) {
        res.status(404).json({
          success: false,
          error: 'Service not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { service },
      });
    } catch (error: any) {
      console.error('Get service error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch service',
      });
    }
  }

  // Get available regions for a service
  static async getServiceRegions(req: Request, res: Response): Promise<void> {
    try {
      const { serviceCode } = req.params;

      const service = await Service.findOne({
        code: serviceCode.toLowerCase(),
        isActive: true,
      }).select('availableRegions');

      if (!service) {
        res.status(404).json({
          success: false,
          error: 'Service not found',
        });
        return;
      }

      // Get region details
      const regions = await Region.find({
        code: { $in: service.availableRegions },
        isActive: true,
      }).select('code name location');

      res.status(200).json({
        success: true,
        data: { regions },
      });
    } catch (error: any) {
      console.error('Get service regions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch service regions',
      });
    }
  }

  // Get all regions
  static async getAllRegions(req: Request, res: Response): Promise<void> {
    try {
      const regions = await Region.find({ isActive: true })
        .select('code name location')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        data: { regions },
      });
    } catch (error: any) {
      console.error('Get regions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch regions',
      });
    }
  }
}
