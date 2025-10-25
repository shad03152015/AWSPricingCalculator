import mongoose, { Document, Schema } from 'mongoose';

export interface IRegion extends Document {
  code: string;
  name: string;
  location: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const regionSchema = new Schema<IRegion>(
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
    location: {
      type: String,
      required: true,
      trim: true,
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
regionSchema.index({ code: 1 }, { unique: true });
regionSchema.index({ isActive: 1 });

export const Region = mongoose.model<IRegion>('Region', regionSchema);
