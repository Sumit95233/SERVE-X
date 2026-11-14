import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    passwordHash: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['donor', 'ngo', 'admin'],
      default: 'donor',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublicDonor: {
      type: Boolean,
      default: true,
      index: true,
    },
    emailPreferences: {
      donationReceipts: {
        type: Boolean,
        default: true,
      },
      platformUpdates: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export const User = mongoose.model('User', userSchema);
