import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createInfo, getInfo } from '../controllers/information.controller.js';

const router = Router();

router.route('/create-info').post(verifyJWT, createInfo);
router.route('/get-info').get(getInfo);

export default router;
