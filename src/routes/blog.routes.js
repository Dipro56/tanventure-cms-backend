import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller.js';

const router = Router();

router
  .route('/create-blog')
  .post(
    verifyJWT,
    upload.fields([{ name: 'blogImage', maxCount: 1 }]),
    createBlog
  );

router.route('/get-blogs').get(getAllBlogs);
router.route('/get-blogs/:id').get(getBlogById);

router
  .route('/update-blog/:id')
  .put(
    verifyJWT,
    upload.fields([{ name: 'blogImage', maxCount: 1 }]),
    updateBlog
  );

router.route('/delete-blog/:id').delete(verifyJWT, deleteBlog);

export default router;
