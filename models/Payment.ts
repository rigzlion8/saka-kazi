import mongoose, { Schema, Document } from 'mongoose';
import { Payment as PaymentType, PaymentStatus, PaymentMethod } from '@/types';

export interface PaymentDocument extends Omit<PaymentType, '_id'>, Document {}

const paymentSchema = new Schema<PaymentDocument>({
  order_id: {
    type: String,
    ref: 'Order',
    required: true
  },
  paystack_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },
  method: {
    type: String,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.ONLINE
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
paymentSchema.index({ order_id: 1 });
paymentSchema.index({ paystack_id: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ created_at: -1 });

// Virtual for order details
paymentSchema.virtual('order', {
  ref: 'Order',
  localField: 'order_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for customer details
paymentSchema.virtual('customer', {
  ref: 'Order',
  localField: 'order_id',
  foreignField: '_id',
  justOne: true,
  populate: {
    path: 'user_id',
    select: 'name email phone'
  }
});

// Virtual for provider details
paymentSchema.virtual('provider', {
  ref: 'Order',
  localField: 'order_id',
  foreignField: '_id',
  justOne: true,
  populate: {
    path: 'provider_id',
    select: 'name email phone'
  }
});

// Pre-save middleware to validate order exists
paymentSchema.pre('save', async function(next) {
  try {
    const Order = mongoose.model('Order');
    const order = await Order.findById(this.order_id);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Validate amount matches order total
    if (this.amount !== order.total_amount) {
      throw new Error('Payment amount does not match order total');
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Post-save middleware to update order payment status
paymentSchema.post('save', async function(doc) {
  try {
    const Order = mongoose.model('Order');
    
    if (doc.status === PaymentStatus.PAID) {
      await Order.findByIdAndUpdate(doc.order_id, {
        payment_status: PaymentStatus.PAID,
        paid_on: new Date()
      });
    } else if (doc.status === PaymentStatus.FAILED) {
      await Order.findByIdAndUpdate(doc.order_id, {
        payment_status: PaymentStatus.FAILED
      });
    }
  } catch (error) {
    console.error('Error updating order payment status:', error);
  }
});

// Static method to find payments by status
paymentSchema.statics.findByStatus = function(status: PaymentStatus) {
  return this.find({ status }).populate('order');
};

// Static method to find payments by date range
paymentSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    created_at: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('order');
};

// Static method to find payments by provider
paymentSchema.statics.findByProvider = function(providerId: string) {
  return this.find().populate({
    path: 'order',
    match: { provider_id: providerId }
  });
};

// Static method to find payments by customer
paymentSchema.statics.findByCustomer = function(customerId: string) {
  return this.find().populate({
    path: 'order',
    match: { user_id: customerId }
  });
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
  
  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      totalAmount: stat.totalAmount
    };
    return acc;
  }, {});
};

export const Payment = mongoose.models.Payment || mongoose.model<PaymentDocument>('Payment', paymentSchema);
