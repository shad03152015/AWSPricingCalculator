import { getCache, setCache, generateCacheKey, hashConfig } from '../config/redis.js';

/**
 * Cache middleware factory
 * Caches GET requests based on URL and query parameters
 */
export const cacheMiddleware = (keyPrefix, ttl) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key from request
      const cacheKey = generateCacheKey(
        keyPrefix,
        req.path,
        JSON.stringify(req.query),
        req.user?.id || 'anonymous'
      );

      // Try to get from cache
      const cachedData = await getCache(cacheKey);

      if (cachedData) {
        console.log(`🎯 Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`⚠️  Cache MISS: ${cacheKey}`);

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (data) => {
        // Cache the response
        setCache(cacheKey, data, ttl).catch(err => {
          console.error('Cache set error in middleware:', err);
        });

        // Call original json method
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      // Continue without caching if error occurs
      next();
    }
  };
};

/**
 * Pricing calculation cache middleware
 * Caches POST request results based on request body hash
 */
export const calculationCacheMiddleware = (ttl) => {
  return async (req, res, next) => {
    if (req.method !== 'POST') {
      return next();
    }

    try {
      // Generate cache key from request body
      const bodyHash = hashConfig(req.body);
      const cacheKey = generateCacheKey('calculation', bodyHash);

      // Try to get from cache
      const cachedData = await getCache(cacheKey);

      if (cachedData) {
        console.log(`🎯 Calculation Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`⚠️  Calculation Cache MISS: ${cacheKey}`);

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (data) => {
        // Cache the response
        setCache(cacheKey, data, ttl).catch(err => {
          console.error('Calculation cache set error:', err);
        });

        // Call original json method
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Calculation cache middleware error:', error);
      next();
    }
  };
};

/**
 * Invalidate cache by pattern
 */
export const invalidateCachePattern = (pattern) => {
  return async (req, res, next) => {
    try {
      const { deleteCachePattern } = await import('../config/redis.js');
      await deleteCachePattern(pattern);
      console.log(`🗑️  Cache invalidated: ${pattern}`);
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
    next();
  };
};

export default cacheMiddleware;
