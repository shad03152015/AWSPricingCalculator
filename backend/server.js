import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './src/routes/auth.js';
import estimateRoutes from './src/routes/estimates.js';
import pricingRoutes from './src/routes/pricing.js';
import sharedRoutes from './src/routes/shared.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const validateEnv = () => {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      console.error('ERROR: Missing required environment variables:', missing.join(', '));
      console.error('Please set these variables in your .env file or environment');
      process.exit(1);
    } else {
      // Development mode: provide default with warning
      console.warn('\n⚠️  WARNING: Missing environment variables:', missing.join(', '));
      console.warn('⚠️  Using default values for development. DO NOT use in production!\n');

      if (!process.env.JWT_SECRET) {
        process.env.JWT_SECRET = 'dev-secret-key-change-in-production-' + Date.now();
        console.warn('⚠️  JWT_SECRET: Using auto-generated development secret');
        console.warn('⚠️  To fix: Copy .env.example to .env and set JWT_SECRET\n');
      }
    }
  }
};

validateEnv();

// Create Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aws-pricing-calculator');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/shared', sharedRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
