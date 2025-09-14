import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Package } from '../models/package.model.js';
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from '../utils/cloudinary.js';
import { Banner } from '../models/banner.model.js';
import { Blog } from '../models/blog.model.js';

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category, readTime, content } = req.body;

  console.log('req.body', req.body);

  try {
    // Validate required fields
    if (!title || !description || !category || !readTime || !content) {
      throw new ApiError(
        400,
        'Title, description, category, content and read time are required'
      );
    }

    // Ensure blog image is uploaded
    if (!req.files || !req.files.blogImage) {
      throw new ApiError(400, 'Blog image is required');
    }

    const blogImageLocalPath = req.files.blogImage?.[0]?.path;
    if (!blogImageLocalPath) {
      throw new ApiError(400, 'Invalid blog image path');
    }

    const blogImg = await uploadOnCloudinary(blogImageLocalPath);
    if (!blogImg?.url) {
      throw new ApiError(400, 'Failed to upload blog image');
    }

    // Create new blog
    const blog = await Blog.create({
      title,
      description,
      category,
      readTime,
      content,
      image: blogImg.url,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, blog, 'Blog created successfully'));
  } catch (error) {
    console.error('Error in createBlog:', error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }

    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'Internal Server Error'));
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });

  if (!blogs || blogs.length === 0) {
    throw new ApiError(404, 'No blogs found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { blogs }, 'Blogs retrieved successfully'));
});

const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!id) {
    throw new ApiError(400, 'Invalid blog ID');
  }

  try {
    // Find blog by ID
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { blog }, 'Blog retrieved successfully'));
  } catch (error) {
    if (error.name === 'CastError') {
      throw new ApiError(400, 'Invalid blog ID');
    }
    throw error;
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category, readTime, content } = req.body;

  // Check if blog exists
  const blogToUpdate = await Blog.findById(id);
  if (!blogToUpdate) {
    throw new ApiError(404, 'Blog not found');
  }

  let blogImage = blogToUpdate.image;

  // Handle new image upload if provided
  if (req.files && req.files.blogImage && req.files.blogImage[0]) {
    const blogImageLocalPath = req.files.blogImage?.[0].path;

    if (blogImageLocalPath) {
      const uploadedImage = await uploadOnCloudinary(blogImageLocalPath);
      if (!uploadedImage?.url) {
        throw new ApiError(400, 'Failed to upload blog image');
      }
      blogImage = uploadedImage.url;
    }
  }

  // Build update object (only update provided fields)
  const updateData = {
    title: title || blogToUpdate.title,
    description: description || blogToUpdate.description,
    category: category || blogToUpdate.category,
    readTime: readTime || blogToUpdate.readTime,
    content: content || blogToUpdate.content,
    image: blogImage,
  };

  // Update blog
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedBlog) {
    throw new ApiError(500, 'Failed to update blog');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBlog, 'Blog updated successfully'));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if blog exists
  const blogToDelete = await Blog.findById(id);
  if (!blogToDelete) {
    throw new ApiError(404, 'Blog not found');
  }

  // Optional: Delete image from Cloudinary
  if (blogToDelete.image) {
    try {
      await deleteFromCloudinary(blogToDelete.image);
    } catch (err) {
      console.warn('Failed to delete blog image from Cloudinary:', err);
    }
  }

  // Delete blog from DB
  await Blog.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Blog deleted successfully'));
});

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
