import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const packageSchema = new Schema(
  {
    packagename: {
      type: String,
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

packageSchema.methods.isPasswordCorrect = async function (password) {
  console.log('checking', password, this.password);
  return await bcrypt.compare(password, this.password);
};

packageSchema.methods.generateAccessToken = function () {
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

export const Package = mongoose.model('Package', packageSchema);
