import { BaseCalculator } from './base.calculator';

interface RDSConfiguration {
  region: string;
  engine: string;
  instanceClass: string;
  deployment: 'single-az' | 'multi-az' | 'multi-az-3';
  pricingModel: string;
  storageType: string;
  storageAmount: number;
  provisionedIops?: number;
  usage: number;
  backupStorage?: number;
}

export class RDSCalculator extends BaseCalculator {
  constructor() {
    super('rds');
  }

  async calculate(config: RDSConfiguration): Promise<{
    costBreakdown: Record<string, number>;
    monthlyCost: number;
    annualCost: number;
  }> {
    const pricingData = await this.getPricingData(config.region, 'compute');

    // Calculate compute cost
    const computeCost = this.calculateComputeCost(
      pricingData,
      config.engine,
      config.instanceClass,
      config.deployment,
      config.pricingModel,
      config.usage
    );

    // Calculate storage cost
    const storageCost = this.calculateStorageCost(
      pricingData,
      config.storageType,
      config.storageAmount,
      config.provisionedIops,
      config.deployment
    );

    // Calculate backup storage cost
    let backupCost = 0;
    if (config.backupStorage) {
      // First 100% of database storage is free
      const freeBackup = config.storageAmount;
      const billableBackup = Math.max(0, config.backupStorage - freeBackup);
      backupCost = billableBackup * (pricingData.backupStorage || 0.095);
    }

    const monthlyCost = this.round(computeCost + storageCost + backupCost);
    const annualCost = this.calculateAnnualCost(monthlyCost);

    return {
      costBreakdown: {
        compute: this.round(computeCost),
        storage: this.round(storageCost),
        backup: this.round(backupCost),
      },
      monthlyCost,
      annualCost,
    };
  }

  private calculateComputeCost(
    pricingData: any,
    engine: string,
    instanceClass: string,
    deployment: string,
    pricingModel: string,
    usage: number
  ): number {
    const instancePricing = pricingData.instanceClasses?.[instanceClass];
    if (!instancePricing) {
      throw new Error(`Pricing not found for instance class: ${instanceClass}`);
    }

    let hourlyRate = 0;

    if (pricingModel === 'On-Demand') {
      hourlyRate = instancePricing.onDemand || 0;
    } else if (pricingModel.includes('Reserved')) {
      const term = pricingModel.includes('1-year') ? 'reserved1Year' : 'reserved3Year';
      hourlyRate = instancePricing[term]?.noUpfront || 0;
    }

    // Apply Multi-AZ multiplier
    let azMultiplier = 1;
    if (deployment === 'multi-az') {
      azMultiplier = 2;
    } else if (deployment === 'multi-az-3') {
      azMultiplier = 3;
    }

    return hourlyRate * usage * azMultiplier;
  }

  private calculateStorageCost(
    pricingData: any,
    storageType: string,
    amount: number,
    iops?: number,
    deployment?: string
  ): number {
    const storagePricing = pricingData.storage || {};

    let cost = 0;

    switch (storageType) {
      case 'gp2':
        cost = amount * (storagePricing.gp2 || 0.115);
        break;
      case 'gp3':
        cost = amount * (storagePricing.gp3 || 0.115);
        if (iops && iops > 3000) {
          cost += (iops - 3000) * (storagePricing.gp3Iops || 0.02);
        }
        break;
      case 'io1':
        cost = amount * (storagePricing.io1Storage || 0.125);
        if (iops) {
          cost += iops * (storagePricing.io1Iops || 0.10);
        }
        break;
      default:
        cost = amount * 0.115;
    }

    // Multi-AZ doubles storage cost
    if (deployment === 'multi-az' || deployment === 'multi-az-3') {
      cost *= 2;
    }

    return cost;
  }
}
