import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    days: {
      type: Number,
      required: [true, 'Number of days is required'],
      min: [1, 'Days must be at least 1'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    packageId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Package ID is required'],
      ref: 'Package', // Assuming you have a Package model
    },
    packageName: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
bookingSchema.index({ email: 1, createdAt: -1 });
bookingSchema.index({ packageId: 1, date: 1 });
bookingSchema.index({ status: 1 });

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function () {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

export const Booking = mongoose.model('Booking', bookingSchema);
