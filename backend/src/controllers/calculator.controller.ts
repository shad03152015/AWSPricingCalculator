import { Request, Response } from 'express';
import { CalculatorFactory } from '../calculators/calculator.factory';
import { Service } from '../models/Service';

export class CalculatorController {
  // Calculate cost for a single service
  static async calculate(req: Request, res: Response): Promise<void> {
    try {
      const { serviceCode, configuration } = req.body;

      if (!serviceCode || !configuration) {
        res.status(400).json({
          success: false,
          error: 'serviceCode and configuration are required',
        });
        return;
      }

      // Validate service exists
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

      // Check if calculator is implemented
      if (!CalculatorFactory.isSupported(serviceCode)) {
        res.status(501).json({
          success: false,
          error: `Pricing calculator not yet implemented for ${serviceCode}`,
        });
        return;
      }

      // Get calculator and perform calculation
      const calculator = CalculatorFactory.getCalculator(serviceCode);
      const result = await calculator.calculate(configuration);

      res.status(200).json({
        success: true,
        data: {
          serviceCode,
          serviceName: service.name,
          configuration,
          ...result,
        },
      });
    } catch (error: any) {
      console.error('Calculate error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to calculate cost',
      });
    }
  }

  // Calculate cost for multiple services
  static async calculateBatch(req: Request, res: Response): Promise<void> {
    try {
      const { services } = req.body;

      if (!services || !Array.isArray(services) || services.length === 0) {
        res.status(400).json({
          success: false,
          error: 'services array is required',
        });
        return;
      }

      const results = [];
      let totalMonthlyCost = 0;
      let totalAnnualCost = 0;

      for (const svc of services) {
        const { serviceCode, configuration } = svc;

        if (!serviceCode || !configuration) {
          results.push({
            serviceCode,
            error: 'Invalid service configuration',
          });
          continue;
        }

        try {
          // Validate service exists
          const service = await Service.findOne({
            code: serviceCode.toLowerCase(),
            isActive: true,
          });

          if (!service) {
            results.push({
              serviceCode,
              error: 'Service not found',
            });
            continue;
          }

          // Check if calculator is implemented
          if (!CalculatorFactory.isSupported(serviceCode)) {
            results.push({
              serviceCode,
              serviceName: service.name,
              error: 'Calculator not yet implemented',
            });
            continue;
          }

          // Calculate
          const calculator = CalculatorFactory.getCalculator(serviceCode);
          const result = await calculator.calculate(configuration);

          results.push({
            serviceCode,
            serviceName: service.name,
            configuration,
            ...result,
          });

          totalMonthlyCost += result.monthlyCost;
          totalAnnualCost += result.annualCost;
        } catch (error: any) {
          results.push({
            serviceCode,
            error: error.message || 'Calculation failed',
          });
        }
      }

      res.status(200).json({
        success: true,
        data: {
          services: results,
          totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
          totalAnnualCost: Math.round(totalAnnualCost * 100) / 100,
        },
      });
    } catch (error: any) {
      console.error('Batch calculate error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate batch costs',
      });
    }
  }

  // Get supported services
  static async getSupportedServices(req: Request, res: Response): Promise<void> {
    try {
      const supportedCodes = CalculatorFactory.getSupportedServices();

      const services = await Service.find({
        code: { $in: supportedCodes },
        isActive: true,
      }).select('code name fullName description category');

      res.status(200).json({
        success: true,
        data: { services },
      });
    } catch (error: any) {
      console.error('Get supported services error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch supported services',
      });
    }
  }
}
