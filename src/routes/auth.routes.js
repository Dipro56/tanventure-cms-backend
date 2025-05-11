import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

//secured routes
router.route('/login').post(login);

export default router;
