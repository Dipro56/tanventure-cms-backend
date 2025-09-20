import mongoose, { Schema } from 'mongoose';

const informationSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
    },
    whatsAppNumber: {
      type: String,
      trim: true,
      index: true,
    },
    facebookLink: {
      type: String,
      trim: true,
      index: true,
    },
    instaLink: {
      type: String,
      trim: true,
      index: true,
    },
    ticktokLink: {
      type: String,
      trim: true,
      index: true,
    },
    aboutUs: {
      type: String,
      trim: true,
      maxlength: [2000, 'About us description cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

informationSchema.pre('save', async function (next) {
  // You can add any pre-save logic here if needed
  next();
});

export const Information = mongoose.model('Information', informationSchema);
