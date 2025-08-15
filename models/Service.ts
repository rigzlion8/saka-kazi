import mongoose, { Schema, Document } from 'mongoose';
import { Service as ServiceType } from '@/types';

export interface ServiceDocument extends Omit<ServiceType, '_id'>, Document {}

const serviceSchema = new Schema<ServiceDocument>({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [500, 'Service description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    trim: true,
    enum: [
      'electrical',
      'plumbing',
      'cleaning',
      'carpentry',
      'painting',
      'landscaping',
      'repair',
      'moving',
      'security',
      'maintenance',
      'other'
    ]
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
serviceSchema.index({ name: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ is_active: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

// Virtual for providers offering this service
serviceSchema.virtual('providers', {
  ref: 'ProviderProfile',
  localField: 'name',
  foreignField: 'services_offered'
});

// Virtual for orders for this service
serviceSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'service_id'
});

// Static method to find services by category
serviceSchema.statics.findByCategory = function(category: string) {
  return this.find({ 
    category, 
    is_active: true 
  }).sort({ name: 1 });
};

// Static method to find active services
serviceSchema.statics.findActive = function() {
  return this.find({ is_active: true }).sort({ category: 1, name: 1 });
};

// Static method to search services
serviceSchema.statics.search = function(query: string) {
  return this.find({
    $text: { $search: query },
    is_active: true
  }).sort({ score: { $meta: 'textScore' } });
};

// Static method to get service statistics
serviceSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        activeCount: {
          $sum: { $cond: ['$is_active', 1, 0] }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  return stats;
};

// Pre-save middleware to ensure unique service names per category
serviceSchema.pre('save', async function(next) {
  try {
    if (this.isModified('name') || this.isModified('category')) {
      const existingService = await (this.constructor as any).findOne({
        name: this.name,
        category: this.category,
        _id: { $ne: this._id }
      });
      
      if (existingService) {
        throw new Error('Service with this name already exists in this category');
      }
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Service = mongoose.models.Service || mongoose.model<ServiceDocument>('Service', serviceSchema);
