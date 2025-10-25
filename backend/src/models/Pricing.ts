import mongoose, { Document, Schema } from 'mongoose';

export interface IPricing extends Document {
  serviceCode: string;
  region: string;
  pricingType: 'compute' | 'storage' | 'request' | 'data-transfer' | 'other';
  pricingData: Record<string, any>;
  effectiveDate: Date;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const pricingSchema = new Schema<IPricing>(
  {
    serviceCode: {
      type: String,
      required: true,
      lowercase: true,
    },
    region: {
      type: String,
      required: true,
      lowercase: true,
    },
    pricingType: {
      type: String,
      required: true,
      enum: ['compute', 'storage', 'request', 'data-transfer', 'other'],
    },
    pricingData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
pricingSchema.index({ serviceCode: 1, region: 1 });
pricingSchema.index({ serviceCode: 1 });
pricingSchema.index({ effectiveDate: -1 });

export const Pricing = mongoose.model<IPricing>('Pricing', pricingSchema);
