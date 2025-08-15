import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as UserType, UserRole, UserStatus } from '@/types';

export interface UserDocument extends UserType, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^(\+254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number']
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER,
    required: true
  },
  avatar_url: {
    type: String,
    default: null
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: undefined
    }
  },
  gold_member: {
    type: Boolean,
    default: false
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true, transform: (doc, ret) => {
    delete ret.password_hash;
    return ret;
  }},
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ gold_member: 1, is_verified: 1 });

// Virtual for provider profile
userSchema.virtual('providerProfile', {
  ref: 'ProviderProfile',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true
});

// Virtual for orders as customer
userSchema.virtual('customerOrders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user_id'
});

// Virtual for orders as provider
userSchema.virtual('providerOrders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'provider_id'
});

// Virtual for reviews received
userSchema.virtual('reviewsReceived', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'provider_id'
});

// Virtual for reviews given
userSchema.virtual('reviewsGiven', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user_id'
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Static method to find providers by location and service
userSchema.statics.findProvidersByLocationAndService = function(
  coordinates: [number, number],
  maxDistance: number = 10000, // 10km default
  service?: string
) {
  const query: any = {
    role: UserRole.PROVIDER,
    status: UserStatus.ACTIVE,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: maxDistance
      }
    }
  };

  if (service) {
    query['providerProfile.services_offered'] = service;
  }

  return this.find(query)
    .populate('providerProfile')
    .populate('reviewsReceived')
    .exec();
};

// Static method to find gold members
userSchema.statics.findGoldMembers = function() {
  return this.find({
    role: UserRole.PROVIDER,
    gold_member: true,
    status: UserStatus.ACTIVE,
    is_verified: true
  }).populate('providerProfile');
};

export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
