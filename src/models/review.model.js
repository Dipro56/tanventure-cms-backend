import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Review description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    stars: {
      type: Number,
      required: [true, 'Star rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Optional: Better serialization
    toObject: { virtuals: true }, // Optional: Better serialization
  }
);

reviewSchema.index({ name: 'text', description: 'text' });

export const Review = mongoose.model('Review', reviewSchema);
