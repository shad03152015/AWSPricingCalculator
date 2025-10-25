import mongoose, { Document, Schema } from 'mongoose';

interface ConfigField {
  name: string;
  type: 'text' | 'number' | 'dropdown' | 'searchable-dropdown' | 'checkbox' | 'slider';
  label: string;
  required: boolean;
  default?: any;
  min?: number;
  max?: number;
  options?: string[] | 'fetch_from_regions';
  helpText?: string;
}

interface ConfigSchema {
  fields: ConfigField[];
}

export interface IService extends Document {
  code: string;
  name: string;
  fullName: string;
  description: string;
  category: string;
  icon?: string;
  configSchema: ConfigSchema;
  availableRegions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const configFieldSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'number', 'dropdown', 'searchable-dropdown', 'checkbox', 'slider'],
      required: true,
    },
    label: { type: String, required: true },
    required: { type: Boolean, required: true },
    default: { type: Schema.Types.Mixed },
    min: { type: Number },
    max: { type: Number },
    options: { type: Schema.Types.Mixed },
    helpText: { type: String },
  },
  { _id: false }
);

const configSchemaSchema = new Schema(
  {
    fields: [configFieldSchema],
  },
  { _id: false }
);

const serviceSchema = new Schema<IService>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'compute',
        'storage',
        'database',
        'networking',
        'security',
        'management',
        'analytics',
        'integration',
        'developer-tools',
        'machine-learning',
      ],
    },
    icon: {
      type: String,
    },
    configSchema: {
      type: configSchemaSchema,
      required: true,
    },
    availableRegions: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
serviceSchema.index({ code: 1 }, { unique: true });
serviceSchema.index({ category: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

export const Service = mongoose.model<IService>('Service', serviceSchema);
