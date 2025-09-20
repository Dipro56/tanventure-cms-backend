import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';

import {
  createContact,
  deleteContact,
  getAllContacts,
} from '../controllers/contact.controller.js';

const router = Router();

// Review routes
router.route('/create-contact').post(createContact);
router.route('/get-all-contacts').get(getAllContacts);
router.route('/delete-contact/:id').delete(verifyJWT, deleteContact);

export default router;
