import mongoose, { Schema } from 'mongoose';

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    type: {
      type: String, // This will store the file path or URL
      required: [true, 'Icon is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
serviceSchema.index({ isActive: 1, order: 1 });

export const Service = mongoose.model('Service', serviceSchema);
