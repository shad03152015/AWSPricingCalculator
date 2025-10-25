import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Connect to Redis (optional, app continues if Redis fails)
    try {
      await connectRedis();
    } catch (error) {
      console.warn('Redis connection failed, continuing without cache');
    }

    // Start listening
    app.listen(env.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   AWS Pricing Calculator API                          ║
║                                                       ║
║   Environment: ${env.nodeEnv.padEnd(36)}║
║   Port: ${env.port.toString().padEnd(42)}║
║   MongoDB: Connected                                  ║
║                                                       ║
║   API URL: http://localhost:${env.port}/api/v1${' '.repeat(16)}║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();
