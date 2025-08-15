import mongoose, { Schema, Document } from 'mongoose';
import { ProviderProfile as ProviderProfileType } from '@/types';

export interface ProviderProfileDocument extends ProviderProfileType, Document {}

const providerProfileSchema = new Schema<ProviderProfileDocument>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  certification: {
    type: String,
    default: null
  },
  services_offered: [{
    type: String,
    required: true,
    trim: true
  }],
  rate_card_url: {
    type: String,
    default: null
  },
  is_visible: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
providerProfileSchema.index({ user_id: 1 });
providerProfileSchema.index({ services_offered: 1 });
providerProfileSchema.index({ is_visible: 1 });

// Virtual for user details
providerProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for rate cards
providerProfileSchema.virtual('rateCards', {
  ref: 'RateCard',
  localField: '_id',
  foreignField: 'provider_id'
});

// Virtual for active orders
providerProfileSchema.virtual('activeOrders', {
  ref: 'Order',
  localField: 'user_id',
  foreignField: 'provider_id',
  match: { status: { $in: ['pending', 'active'] } }
});

// Virtual for completed orders
providerProfileSchema.virtual('completedOrders', {
  ref: 'Order',
  localField: 'user_id',
  foreignField: 'provider_id',
  match: { status: 'completed' }
});

// Virtual for average rating
providerProfileSchema.virtual('averageRating').get(function() {
  // This would be calculated in the application layer
  return 0;
});

// Virtual for total orders
providerProfileSchema.virtual('totalOrders').get(function() {
  // This would be calculated in the application layer
  return 0;
});

// Pre-save middleware to ensure user is a provider
providerProfileSchema.pre('save', async function(next) {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(this.user_id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.role !== 'provider') {
      throw new Error('Only users with provider role can have provider profiles');
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Static method to find providers by service
providerProfileSchema.statics.findByService = function(service: string) {
  return this.find({
    services_offered: { $in: [service] },
    is_visible: true
  }).populate('user');
};

// Static method to find verified providers
providerProfileSchema.statics.findVerified = function() {
  return this.find({
    is_visible: true
  }).populate({
    path: 'user',
    match: { is_verified: true, status: 'active' }
  });
};

export const ProviderProfile = mongoose.models.ProviderProfile || 
  mongoose.model<ProviderProfileDocument>('ProviderProfile', providerProfileSchema);
