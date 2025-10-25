import { BaseCalculator } from './base.calculator';

interface S3Configuration {
  region: string;
  storageClass: string;
  storageAmount: number;
  putRequests?: number;
  getRequests?: number;
  dataTransferOut?: number;
  dataRetrieval?: number;
}

export class S3Calculator extends BaseCalculator {
  constructor() {
    super('s3');
  }

  async calculate(config: S3Configuration): Promise<{
    costBreakdown: Record<string, number>;
    monthlyCost: number;
    annualCost: number;
  }> {
    const pricingData = await this.getPricingData(config.region, 'storage');

    // Calculate storage cost
    const storageCost = this.calculateStorageCost(
      pricingData,
      config.storageClass,
      config.storageAmount
    );

    // Calculate request costs
    let requestsCost = 0;
    if (config.putRequests || config.getRequests) {
      requestsCost = this.calculateRequestsCost(
        pricingData,
        config.putRequests || 0,
        config.getRequests || 0
      );
    }

    // Calculate data retrieval cost (for IA and Glacier classes)
    let retrievalCost = 0;
    if (config.dataRetrieval && config.storageClass !== 'standard') {
      retrievalCost = this.calculateRetrievalCost(
        pricingData,
        config.storageClass,
        config.dataRetrieval
      );
    }

    // Calculate data transfer cost
    let dataTransferCost = 0;
    if (config.dataTransferOut) {
      const dataTransferPricing = await this.getPricingData(config.region, 'data-transfer');
      dataTransferCost = this.applyTieredPricing(
        config.dataTransferOut,
        dataTransferPricing.tiers
      );
    }

    const monthlyCost = this.round(
      storageCost + requestsCost + retrievalCost + dataTransferCost
    );
    const annualCost = this.calculateAnnualCost(monthlyCost);

    return {
      costBreakdown: {
        storage: this.round(storageCost),
        requests: this.round(requestsCost),
        retrieval: this.round(retrievalCost),
        dataTransfer: this.round(dataTransferCost),
      },
      monthlyCost,
      annualCost,
    };
  }

  private calculateStorageCost(
    pricingData: any,
    storageClass: string,
    amount: number
  ): number {
    const classKey = storageClass.toLowerCase().replace(/-/g, '');
    const classPricing = pricingData.storageClasses?.[classKey];

    if (!classPricing) {
      throw new Error(`Pricing not found for storage class: ${storageClass}`);
    }

    // If tiered pricing
    if (classPricing.tiers) {
      return this.applyTieredPricing(amount, classPricing.tiers);
    }

    // If flat rate
    if (typeof classPricing.storage === 'number') {
      return amount * classPricing.storage;
    }

    // Default to standard pricing
    return amount * 0.023;
  }

  private calculateRequestsCost(
    pricingData: any,
    putRequests: number,
    getRequests: number
  ): number {
    const requests = pricingData.requests || {};
    const putCost = (putRequests / 1000) * (requests.put || 0.005);
    const getCost = (getRequests / 1000) * (requests.get || 0.0004);

    return putCost + getCost;
  }

  private calculateRetrievalCost(
    pricingData: any,
    storageClass: string,
    retrievalAmount: number
  ): number {
    const classKey = storageClass.toLowerCase().replace(/-/g, '');
    const classPricing = pricingData.storageClasses?.[classKey];

    if (classPricing && typeof classPricing.retrieval === 'number') {
      return retrievalAmount * classPricing.retrieval;
    }

    return 0;
  }
}
