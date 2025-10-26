import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  calculateEC2Cost,
  calculateS3Cost,
  calculateLambdaCost,
  calculateRDSCost
} from '../services/awsPricing.js';

const router = express.Router();

// GET /api/pricing/services - Get list of supported AWS services
router.get('/services', (req, res) => {
  try {
    const services = [
      {
        code: 'AmazonEC2',
        name: 'EC2 (Elastic Compute Cloud)',
        category: 'Compute',
        description: 'Virtual servers in the cloud'
      },
      {
        code: 'AmazonS3',
        name: 'S3 (Simple Storage Service)',
        category: 'Storage',
        description: 'Object storage built to retrieve any amount of data'
      },
      {
        code: 'AmazonRDS',
        name: 'RDS (Relational Database Service)',
        category: 'Database',
        description: 'Managed relational database service'
      },
      {
        code: 'AWSLambda',
        name: 'Lambda',
        category: 'Compute',
        description: 'Run code without provisioning servers'
      },
      {
        code: 'AmazonCloudFront',
        name: 'CloudFront',
        category: 'Networking',
        description: 'Content delivery network (CDN)'
      },
      {
        code: 'AmazonDynamoDB',
        name: 'DynamoDB',
        category: 'Database',
        description: 'Managed NoSQL database'
      },
      {
        code: 'AmazonECS',
        name: 'ECS (Elastic Container Service)',
        category: 'Compute',
        description: 'Fully managed container orchestration'
      },
      {
        code: 'AmazonEBS',
        name: 'EBS (Elastic Block Store)',
        category: 'Storage',
        description: 'Block storage for EC2 instances'
      },
      {
        code: 'AmazonRoute53',
        name: 'Route 53',
        category: 'Networking',
        description: 'Scalable DNS and domain registration'
      },
      {
        code: 'AmazonElastiCache',
        name: 'ElastiCache',
        category: 'Database',
        description: 'In-memory caching service'
      }
    ];

    res.status(200).json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// POST /api/pricing/calculate - Calculate pricing for a service configuration
router.post('/calculate', [
  body('serviceCode')
    .notEmpty()
    .withMessage('Service code is required'),
  body('region')
    .notEmpty()
    .withMessage('Region is required'),
  body('configuration')
    .isObject()
    .withMessage('Configuration must be an object')
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

    const { serviceCode, region, configuration } = req.body;

    let result;

    // Calculate based on service type
    switch (serviceCode) {
      case 'AmazonEC2':
        result = await calculateEC2Cost(region, configuration);
        break;

      case 'AmazonS3':
        result = await calculateS3Cost(region, configuration);
        break;

      case 'AWSLambda':
        result = await calculateLambdaCost(region, configuration);
        break;

      case 'AmazonRDS':
        result = await calculateRDSCost(region, configuration);
        break;

      // Add more service calculations as needed
      case 'AmazonCloudFront':
      case 'AmazonDynamoDB':
      case 'AmazonECS':
      case 'AmazonEBS':
      case 'AmazonRoute53':
      case 'AmazonElastiCache':
        // Simplified pricing for these services (placeholder)
        result = {
          monthlyCost: 0,
          breakdown: {
            note: 'Detailed pricing calculation not yet implemented for this service'
          }
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported service code'
        });
    }

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Calculate pricing error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
});

export default router;
