import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    locationCoordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [77.2090, 28.6139], // Default Delhi
      },
    },
    causeCategories: {
      type: [String],
      default: [],
      index: true,
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    darpanId: {
      type: String,
      default: '',
    },
    establishedYear: {
      type: Number,
      default: 2018,
    },
    taxExemption80G: {
      type: Boolean,
      default: true,
    },
    section12A: {
      type: Boolean,
      default: true,
    },
    mission: {
      type: String,
      default: '',
    },
    beneficiariesSupported: {
      type: String,
      default: '12,500+ Lives Impacted',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'suspended'],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    verificationDocuments: {
      type: [String],
      default: [],
      select: false, // Hidden by default from public queries
    },
  },
  {
    timestamps: true,
  }
);

ngoSchema.index({ verificationStatus: 1, city: 1, state: 1 });
ngoSchema.index({ locationCoordinates: '2dsphere' });

export const NGO = mongoose.model('NGO', ngoSchema);
