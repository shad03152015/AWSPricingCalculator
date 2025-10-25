import mongoose, { Document, Schema, Types } from 'mongoose';

interface CostBreakdown {
  compute?: number;
  storage?: number;
  dataTransfer?: number;
  requests?: number;
  other?: Record<string, number>;
}

interface ServiceConfig {
  serviceCode: string;
  serviceName: string;
  configuration: Record<string, any>;
  costBreakdown: CostBreakdown;
  monthlyCost: number;
  annualCost: number;
}

export interface IEstimate extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  services: ServiceConfig[];
  totalMonthlyCost: number;
  totalAnnualCost: number;
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const costBreakdownSchema = new Schema(
  {
    compute: { type: Number },
    storage: { type: Number },
    dataTransfer: { type: Number },
    requests: { type: Number },
    other: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const serviceConfigSchema = new Schema(
  {
    serviceCode: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    configuration: {
      type: Schema.Types.Mixed,
      required: true,
    },
    costBreakdown: {
      type: costBreakdownSchema,
      required: true,
    },
    monthlyCost: {
      type: Number,
      required: true,
      min: 0,
    },
    annualCost: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const estimateSchema = new Schema<IEstimate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Estimate name is required'],
      trim: true,
      minlength: [1, 'Estimate name must be at least 1 character'],
      maxlength: [200, 'Estimate name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    services: {
      type: [serviceConfigSchema],
      default: [],
    },
    totalMonthlyCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalAnnualCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
estimateSchema.index({ userId: 1, updatedAt: -1 });
estimateSchema.index({ shareToken: 1 }, { unique: true, sparse: true });
estimateSchema.index({ updatedAt: -1 });

// Calculate totals before saving
estimateSchema.pre('save', function (next) {
  this.totalMonthlyCost = this.services.reduce(
    (sum, service) => sum + service.monthlyCost,
    0
  );
  this.totalAnnualCost = this.services.reduce(
    (sum, service) => sum + service.annualCost,
    0
  );
  next();
});

export const Estimate = mongoose.model<IEstimate>('Estimate', estimateSchema);
