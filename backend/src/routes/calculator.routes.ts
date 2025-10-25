import { Router } from 'express';
import { CalculatorController } from '../controllers/calculator.controller';

const router = Router();

// Public endpoints (allow guest calculations)
router.post('/calculate', CalculatorController.calculate);
router.post('/calculate/batch', CalculatorController.calculateBatch);
router.get('/supported', CalculatorController.getSupportedServices);

export default router;
