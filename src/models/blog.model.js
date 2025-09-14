import mongoose, { Schema } from 'mongoose';

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Blog description is required'],
      trim: true,
    },

    content: {
      type: String,
      required: [true, 'Blog content is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Blog image URL is required'],
    },
    readTime: {
      type: String,
      required: [true, 'Read time is required'],
    },
    category: {
      type: String,
      required: [true, 'Blog category is required'],
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ title: 'text', description: 'text', category: 1 });

export const Blog = mongoose.model('Blog', blogSchema);
