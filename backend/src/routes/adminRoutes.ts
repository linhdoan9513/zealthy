import { Router } from 'express';
import {
  getOnboardingConfig,
  updateOnboardingConfig,
  initializeDefaultConfig
} from '../controllers/adminController';

const router = Router();

// Admin routes
router.get('/config', getOnboardingConfig);
router.put('/config', updateOnboardingConfig);
router.post('/config/init', initializeDefaultConfig);

export default router; 