import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

//secured routes
router.route('/login').post(verifyJWT, login);

export default router;
