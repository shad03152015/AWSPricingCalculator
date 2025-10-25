import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';

const router = Router();

router.get('/', ServiceController.getServices);
router.get('/:serviceCode', ServiceController.getServiceByCode);
router.get('/:serviceCode/regions', ServiceController.getServiceRegions);

export default router;
