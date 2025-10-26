import Redis from 'ioredis';

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
};

// Create Redis client
const redis = new Redis(redisConfig);

// Redis event handlers
redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redis.on('ready', () => {
  console.log('🚀 Redis is ready to accept commands');
});

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  PRICING_DATA: 24 * 60 * 60, // 24 hours
  CALCULATIONS: 60 * 60, // 1 hour
  SERVICE_METADATA: 6 * 60 * 60, // 6 hours
  POPULAR_CONFIGS: 2 * 60 * 60, // 2 hours
  USER_SESSION: 7 * 24 * 60 * 60, // 7 days
};

// Cache key prefixes
export const CACHE_KEYS = {
  PRICING: 'pricing',
  CALCULATION: 'calc',
  SERVICE: 'service',
  POPULAR: 'popular',
  ESTIMATE: 'estimate',
};

/**
 * Generate cache key with namespace
 */
export function generateCacheKey(prefix, ...parts) {
  return `${prefix}:${parts.join(':')}`;
}

/**
 * Hash object to create consistent cache keys
 */
export async function hashConfig(config) {
  const crypto = await import('crypto');
  const hash = crypto.createHash('md5');
  hash.update(JSON.stringify(config));
  return hash.digest('hex');
}

/**
 * Get data from cache
 */
export async function getCache(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set data in cache with TTL
 */
export async function setCache(key, value, ttl = CACHE_TTL.CALCULATIONS) {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

/**
 * Delete key from cache
 */
export async function deleteCache(key) {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}

/**
 * Delete keys matching pattern
 */
export async function deleteCachePattern(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Cache pattern delete error:', error);
    return false;
  }
}

/**
 * Check if key exists in cache
 */
export async function cacheExists(key) {
  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('Cache exists error:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  try {
    const info = await redis.info('stats');
    const keyspace = await redis.info('keyspace');
    return { info, keyspace };
  } catch (error) {
    console.error('Cache stats error:', error);
    return null;
  }
}

export default redis;
