import mongoose, { Schema, Document } from 'mongoose';
import { Review as ReviewType } from '@/types';

export interface ReviewDocument extends Omit<ReviewType, '_id'>, Document {}

const reviewSchema = new Schema({
  order_id: {
    type: String,
    required: true,
    ref: 'Order'
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  provider_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    maxlength: 1000
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ order_id: 1 }, { unique: true });
reviewSchema.index({ provider_id: 1, rating: 1 });
reviewSchema.index({ user_id: 1 });
reviewSchema.index({ created_at: -1 });

// Virtual for user details
reviewSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for provider details
reviewSchema.virtual('provider', {
  ref: 'User',
  localField: 'provider_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for order details
reviewSchema.virtual('order', {
  ref: 'Order',
  localField: 'order_id',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to ensure one review per order
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existingReview = await (this.constructor as any).findOne({ order_id: this.order_id });
    if (existingReview) {
      return next(new Error('Review already exists for this order'));
    }
  }
  next();
});

export const Review = mongoose.models.Review || mongoose.model<ReviewDocument>('Review', reviewSchema);
