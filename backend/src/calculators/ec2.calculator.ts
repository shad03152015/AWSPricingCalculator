import { BaseCalculator } from './base.calculator';

interface EC2Configuration {
  region: string;
  instanceType: string;
  operatingSystem: string;
  pricingModel: string;
  usage: number;
  instances: number;
  ebsVolume?: {
    volumeType: string;
    size: number;
    iops?: number;
    throughput?: number;
  };
  dataTransferOut?: number;
}

export class EC2Calculator extends BaseCalculator {
  constructor() {
    super('ec2');
  }

  async calculate(config: EC2Configuration): Promise<{
    costBreakdown: Record<string, number>;
    monthlyCost: number;
    annualCost: number;
  }> {
    // Get pricing data
    const pricingData = await this.getPricingData(config.region, 'compute');

    // Calculate compute cost
    const computeCost = this.calculateComputeCost(
      pricingData,
      config.instanceType,
      config.operatingSystem,
      config.pricingModel,
      config.usage,
      config.instances
    );

    // Calculate EBS cost if configured
    let storageCost = 0;
    if (config.ebsVolume) {
      storageCost = this.calculateEBSCost(
        pricingData,
        config.ebsVolume.volumeType,
        config.ebsVolume.size,
        config.ebsVolume.iops,
        config.ebsVolume.throughput,
        config.instances
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

    const monthlyCost = this.round(computeCost + storageCost + dataTransferCost);
    const annualCost = this.calculateAnnualCost(monthlyCost);

    return {
      costBreakdown: {
        compute: this.round(computeCost),
        storage: this.round(storageCost),
        dataTransfer: this.round(dataTransferCost),
      },
      monthlyCost,
      annualCost,
    };
  }

  private calculateComputeCost(
    pricingData: any,
    instanceType: string,
    os: string,
    pricingModel: string,
    usage: number,
    instances: number
  ): number {
    const instancePricing = pricingData.instanceTypes?.[instanceType];
    if (!instancePricing) {
      throw new Error(`Pricing not found for instance type: ${instanceType}`);
    }

    let hourlyRate = 0;

    if (pricingModel === 'On-Demand') {
      const osKey = os.toLowerCase().replace(' ', '');
      hourlyRate = instancePricing.onDemand?.[osKey] || instancePricing.onDemand?.linux || 0;
    } else if (pricingModel.startsWith('Reserved')) {
      // Simplified reserved instance pricing
      const term = pricingModel.includes('1-year') ? 'reserved1Year' : 'reserved3Year';
      hourlyRate = instancePricing[term]?.noUpfront || 0;
    } else if (pricingModel === 'Spot') {
      const osKey = os.toLowerCase().replace(' ', '');
      const onDemandRate = instancePricing.onDemand?.[osKey] || instancePricing.onDemand?.linux || 0;
      const spotDiscount = instancePricing.spotDiscount || 0.70;
      hourlyRate = onDemandRate * spotDiscount;
    }

    return hourlyRate * usage * instances;
  }

  private calculateEBSCost(
    pricingData: any,
    volumeType: string,
    size: number,
    iops?: number,
    throughput?: number,
    instances?: number
  ): number {
    const ebsPricing = pricingData.ebs || {};
    const multiplier = instances || 1;

    let cost = 0;

    switch (volumeType) {
      case 'gp2':
        cost = size * (ebsPricing.gp2 || 0.10);
        break;
      case 'gp3':
        cost = size * (ebsPricing.gp3 || 0.08);
        if (iops && iops > 3000) {
          cost += (iops - 3000) * (ebsPricing.gp3Iops || 0.005);
        }
        if (throughput && throughput > 125) {
          cost += (throughput - 125) * (ebsPricing.gp3Throughput || 0.04);
        }
        break;
      case 'io1':
      case 'io2':
        cost = size * (ebsPricing.io1Storage || 0.125);
        if (iops) {
          cost += iops * (ebsPricing.io1Iops || 0.065);
        }
        break;
      case 'st1':
        cost = size * (ebsPricing.st1 || 0.045);
        break;
      case 'sc1':
        cost = size * (ebsPricing.sc1 || 0.015);
        break;
      default:
        cost = size * 0.10;
    }

    return cost * multiplier;
  }
}
