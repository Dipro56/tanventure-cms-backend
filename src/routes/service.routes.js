import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createService,
  getAllServices,
  updateService,
  deleteService,
} from '../controllers/service.controller.js';

const router = Router();

// Service routes
router.route('/get-all-services').get(getAllServices);

router.route('/create-service').post(verifyJWT, createService);

router.route('/update-service/:id').put(verifyJWT, updateService);

router.route('/delete-service/:id').delete(verifyJWT, deleteService);

export default router;
