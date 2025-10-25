import { Router } from 'express';
import { EstimateController } from '../controllers/estimate.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Public route for shared estimates
router.get('/shared/:shareToken', EstimateController.getSharedEstimate);

// Protected routes
router.get('/', authMiddleware, EstimateController.getUserEstimates);
router.get('/:id', authMiddleware, EstimateController.getEstimateById);
router.post('/', authMiddleware, EstimateController.createEstimate);
router.put('/:id', authMiddleware, EstimateController.updateEstimate);
router.delete('/:id', authMiddleware, EstimateController.deleteEstimate);
router.post('/:id/duplicate', authMiddleware, EstimateController.duplicateEstimate);
router.post('/:id/share', authMiddleware, EstimateController.generateShareToken);

export default router;
