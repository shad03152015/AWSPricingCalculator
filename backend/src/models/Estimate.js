import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  serviceCode: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  configuration: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  monthlyCost: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const estimateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Estimate name is required'],
    trim: true,
    maxlength: [100, 'Name must not exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description must not exceed 500 characters']
  },
  services: {
    type: [serviceSchema],
    default: []
  },
  totalMonthlyCost: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalAnnualCost: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
estimateSchema.index({ userId: 1 });
estimateSchema.index({ createdAt: -1 });

// Pre-save hook to update timestamps
estimateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Estimate = mongoose.model('Estimate', estimateSchema);

export default Estimate;
