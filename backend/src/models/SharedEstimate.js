import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sharedEstimateSchema = new mongoose.Schema({
  estimateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estimate',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shareToken: {
    type: String,
    required: true,
    unique: true
  },
  accessType: {
    type: String,
    enum: ['public', 'private'],
    required: true
  },
  password: {
    type: String,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 0
  }
});

// Indexes for performance
sharedEstimateSchema.index({ shareToken: 1 });
sharedEstimateSchema.index({ estimateId: 1 });
sharedEstimateSchema.index({ expiresAt: 1 });

// Method to check password
sharedEstimateSchema.methods.checkPassword = async function(candidatePassword) {
  if (!this.password) {
    return true; // No password set
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if share has expired
sharedEstimateSchema.methods.isExpired = function() {
  if (!this.expiresAt) {
    return false; // No expiry set
  }
  return new Date() > this.expiresAt;
};

// Method to increment view count
sharedEstimateSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  await this.save();
};

const SharedEstimate = mongoose.model('SharedEstimate', sharedEstimateSchema);

export default SharedEstimate;
