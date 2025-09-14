import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';

import { upload } from '../middlewares/multer.middleware.js';
import {
  createBanner,
  getBannerDetails,
  updateBanner,
} from '../controllers/banner.controller.js';

const router = Router();

router.route('/create-banner').post(
  verifyJWT,
  upload.fields([
    {
      name: 'bannerImage',
      maxCount: 1,
    },
  ]),
  createBanner
);

router.route('/get-banner-details').get(getBannerDetails);
router.route('/update-banner/:id').put(
  verifyJWT,
  upload.fields([
    {
      name: 'bannerImage',
      maxCount: 1,
    },
  ]),
  updateBanner
);

export default router;
