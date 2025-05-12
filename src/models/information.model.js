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
  },
  {
    timestamps: true,
  }
);

informationSchema.pre('save', async function (next) {
  next();
});

export const Information = mongoose.model('Information', informationSchema);
