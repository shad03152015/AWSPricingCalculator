import { Pricing } from '../models/Pricing';
import { getRedisClient } from '../config/redis';

interface PricingTier {
  upTo: number;
  pricePerGB?: number;
  pricePerUnit?: number;
}

export abstract class BaseCalculator {
  protected serviceCode: string;

  constructor(serviceCode: string) {
    this.serviceCode = serviceCode;
  }

  /**
   * Abstract method to be implemented by each service calculator
   */
  abstract calculate(configuration: Record<string, any>): Promise<{
    costBreakdown: Record<string, number>;
    monthlyCost: number;
    annualCost: number;
  }>;

  /**
   * Get pricing data from Redis cache or MongoDB
   */
  protected async getPricingData(
    region: string,
    pricingType?: string
  ): Promise<any> {
    const cacheKey = `pricing:${this.serviceCode}:${region}${pricingType ? `:${pricingType}` : ''}`;

    try {
      // Try Redis cache first
      const redisClient = getRedisClient();
      if (redisClient) {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }
    } catch (error) {
      console.warn('Redis cache error, falling back to MongoDB:', error);
    }

    // Fetch from MongoDB
    const query: any = {
      serviceCode: this.serviceCode,
      region: region.toLowerCase(),
    };

    if (pricingType) {
      query.pricingType = pricingType;
    }

    const pricingDoc = await Pricing.findOne(query)
      .sort({ effectiveDate: -1 })
      .lean();

    if (!pricingDoc) {
      throw new Error(
        `Pricing data not found for ${this.serviceCode} in ${region}`
      );
    }

    // Cache in Redis for 1 hour
    try {
      const redisClient = getRedisClient();
      if (redisClient) {
        await redisClient.setEx(
          cacheKey,
          3600,
          JSON.stringify(pricingDoc.pricingData)
        );
      }
    } catch (error) {
      console.warn('Failed to cache pricing data in Redis:', error);
    }

    return pricingDoc.pricingData;
  }

  /**
   * Apply tiered pricing calculation
   */
  protected applyTieredPricing(amount: number, tiers: PricingTier[]): number {
    let totalCost = 0;
    let remaining = amount;
    let previousLimit = 0;

    for (const tier of tiers) {
      const tierLimit = tier.upTo === Infinity ? Infinity : tier.upTo - previousLimit;
      const tierAmount = Math.min(remaining, tierLimit);

      if (tierAmount <= 0) break;

      const pricePerUnit = tier.pricePerGB || tier.pricePerUnit || 0;
      totalCost += tierAmount * pricePerUnit;

      remaining -= tierAmount;
      previousLimit = tier.upTo;

      if (remaining <= 0) break;
    }

    return totalCost;
  }

  /**
   * Round to 2 decimal places
   */
  protected round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Calculate annual cost from monthly
   */
  protected calculateAnnualCost(monthlyCost: number): number {
    return this.round(monthlyCost * 12);
  }
}
