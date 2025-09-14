import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const bannerSchema = new Schema(
  {
    bannerTitle: {
      type: String,
      trim: true,
      index: true,
    },
    bannerDescription: {
      type: String,
    },
    bannerImage: {
      type: String, // cloudinary url
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

bannerSchema.methods.isPasswordCorrect = async function (password) {
  console.log('checking', password, this.password);
  return await bcrypt.compare(password, this.password);
};

bannerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET
    // {
    //   expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    // }
  );
};

export const Banner = mongoose.model('Banner', bannerSchema);
