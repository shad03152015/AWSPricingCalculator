import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  redisHost: string;
  redisPort: number;
  redisPassword?: string;
  redisDb: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  frontendUrl: string;
}

export const env: EnvConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aws-pricing-calculator',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisPassword: process.env.REDIS_PASSWORD,
  redisDb: parseInt(process.env.REDIS_DB || '0', 10),
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

// Validate critical env vars
if (!process.env.JWT_SECRET && env.nodeEnv === 'production') {
  console.error('FATAL ERROR: JWT_SECRET is not defined in production');
  process.exit(1);
}
