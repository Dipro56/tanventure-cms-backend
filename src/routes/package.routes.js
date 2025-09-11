import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createPackage,
  getPackages,
  deletePackage,
  updatePackage,
  getPackageById,
} from '../controllers/package.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/create-package').post(
  verifyJWT,
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
  ]),
  createPackage
);

router.route('/get-packages').get(getPackages);
router.route('/delete-package/:id').delete(verifyJWT, deletePackage);
router.route('/update-package/:id').put(
  verifyJWT,
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
  ]),
  updatePackage
);
router.route('/get-package/:id').get(getPackageById);

export default router;
