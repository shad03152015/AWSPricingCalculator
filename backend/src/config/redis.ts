import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  try {
    const client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB || '0', 10),
    });

    client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    client.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    client.on('reconnecting', () => {
      console.warn('Redis reconnecting...');
    });

    client.on('end', () => {
      console.warn('Redis connection closed');
    });

    await client.connect();
    redisClient = client;

    return client;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    console.warn('Application will continue without Redis caching');
    throw error;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('Redis disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    }
  }
};
