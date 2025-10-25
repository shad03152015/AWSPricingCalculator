import { Router } from 'express';
import authRoutes from './auth.routes';
import estimateRoutes from './estimate.routes';
import serviceRoutes from './service.routes';
import calculatorRoutes from './calculator.routes';
import { ServiceController } from '../controllers/service.controller';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: 'connected',
    redis: 'connected',
  });
});

// Regions endpoint
router.get('/regions', ServiceController.getAllRegions);

// Mount route modules
router.use('/auth', authRoutes);
router.use('/estimates', estimateRoutes);
router.use('/services', serviceRoutes);
router.use('/', calculatorRoutes);

export default router;
