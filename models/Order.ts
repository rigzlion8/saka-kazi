import mongoose, { Schema, Document } from 'mongoose';
import { Order as OrderType, OrderStatus, PaymentStatus } from '@/types';

export interface OrderDocument extends Omit<OrderType, '_id'>, Document {}

const orderSchema = new Schema<OrderDocument>({
  user_id: {
    type: String,
    ref: 'User',
    required: true
  },
  provider_id: {
    type: String,
    ref: 'User',
    required: true
  },
  service_id: {
    type: String,
    ref: 'Service',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  payment_status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },
  paid_on: {
    type: Date,
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
      required: true
    },
    address: {
      type: String,
      default: null
    }
  },
  activation_fee: {
    type: Number,
    required: true,
    min: [0, 'Activation fee cannot be negative']
  },
  total_amount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  service_details: {
    service_name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true,
      min: [0, 'Rate cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    }
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
orderSchema.index({ user_id: 1 });
orderSchema.index({ provider_id: 1 });
orderSchema.index({ service_id: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ payment_status: 1 });
orderSchema.index({ location: '2dsphere' });
orderSchema.index({ created_at: -1 });

// Virtual for customer details
orderSchema.virtual('customer', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for provider details
orderSchema.virtual('provider', {
  ref: 'User',
  localField: 'provider_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for service details
orderSchema.virtual('service', {
  ref: 'Service',
  localField: 'service_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for payment details
orderSchema.virtual('payment', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'order_id',
  justOne: true
});

// Virtual for review
orderSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'order_id',
  justOne: true
});

// Pre-save middleware to validate provider is active
orderSchema.pre('save', async function(next) {
  try {
    const User = mongoose.model('User');
    const provider = await User.findById(this.provider_id);
    
    if (!provider) {
      throw new Error('Provider not found');
    }
    
    if (provider.status !== 'active') {
      throw new Error('Provider is not active');
    }
    
    if (provider.role !== 'provider') {
      throw new Error('User is not a provider');
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Static method to find orders by user role
orderSchema.statics.findByUserRole = function(userId: string, role: 'customer' | 'provider') {
  const query = role === 'customer' ? { user_id: userId } : { provider_id: userId };
  
  return this.find(query)
    .populate('customer', 'name email phone')
    .populate('provider', 'name email phone')
    .populate('service', 'name description')
    .populate('payment')
    .populate('review')
    .sort({ created_at: -1 });
};

// Static method to find active orders
orderSchema.statics.findActive = function() {
  return this.find({
    status: { $in: [OrderStatus.PENDING, OrderStatus.ACTIVE] }
  }).populate('customer provider service');
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status: OrderStatus) {
  return this.find({ status }).populate('customer provider service');
};

// Static method to find orders by payment status
orderSchema.statics.findByPaymentStatus = function(paymentStatus: PaymentStatus) {
  return this.find({ payment_status: paymentStatus }).populate('customer provider service');
};

export const Order = mongoose.models.Order || mongoose.model<OrderDocument>('Order', orderSchema);
