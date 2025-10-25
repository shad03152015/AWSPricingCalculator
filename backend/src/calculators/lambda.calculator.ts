import { BaseCalculator } from './base.calculator';

interface LambdaConfiguration {
  region: string;
  architecture: 'x86_64' | 'arm64';
  memoryMB: number;
  avgDurationMs: number;
  requests: number;
  ephemeralStorageGB?: number;
}

export class LambdaCalculator extends BaseCalculator {
  constructor() {
    super('lambda');
  }

  async calculate(config: LambdaConfiguration): Promise<{
    costBreakdown: Record<string, number>;
    monthlyCost: number;
    annualCost: number;
  }> {
    const pricingData = await this.getPricingData(config.region, 'compute');

    // Free tier: 1M requests and 400,000 GB-seconds per month
    const FREE_TIER_REQUESTS = 1_000_000;
    const FREE_TIER_GB_SECONDS = 400_000;

    // Calculate billable requests (after free tier)
    const billableRequests = Math.max(0, config.requests - FREE_TIER_REQUESTS);

    // Request cost
    const requestCost = (billableRequests / 1_000_000) * (pricingData.requestPrice || 0.20);

    // Calculate GB-seconds
    const memoryGB = config.memoryMB / 1024;
    const durationSeconds = config.avgDurationMs / 1000;
    const totalGBSeconds = memoryGB * durationSeconds * config.requests;

    // Apply free tier for GB-seconds
    const billableGBSeconds = Math.max(0, totalGBSeconds - FREE_TIER_GB_SECONDS);

    // Compute cost (different rates for x86 vs ARM)
    const computeRate = config.architecture === 'arm64'
      ? (pricingData.computeRateArm || 0.0000133334)
      : (pricingData.computeRateX86 || 0.0000166667);

    const computeCost = (billableGBSeconds / 1_000_000) * computeRate;

    // Ephemeral storage cost (storage beyond 512 MB)
    let storageCost = 0;
    if (config.ephemeralStorageGB && config.ephemeralStorageGB > 0.512) {
      const additionalStorage = config.ephemeralStorageGB - 0.512;
      const storageGBSeconds = additionalStorage * durationSeconds * config.requests;
      storageCost = storageGBSeconds * (pricingData.ephemeralStorageRate || 0.0000000309);
    }

    const monthlyCost = this.round(requestCost + computeCost + storageCost);
    const annualCost = this.calculateAnnualCost(monthlyCost);

    return {
      costBreakdown: {
        requests: this.round(requestCost),
        compute: this.round(computeCost),
        storage: this.round(storageCost),
      },
      monthlyCost,
      annualCost,
    };
  }
}
