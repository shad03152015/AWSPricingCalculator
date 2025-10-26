import { PricingClient, GetProductsCommand } from '@aws-sdk/client-pricing';

// Initialize Pricing Client (always use us-east-1 for Pricing API)
const pricingClient = new PricingClient({ region: 'us-east-1' });

// In-memory cache for pricing data
const pricingCache = {};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Map AWS region code to Pricing API location name
 */
export const mapRegionToLocation = (regionCode) => {
  const regionMap = {
    'us-east-1': 'US East (N. Virginia)',
    'us-east-2': 'US East (Ohio)',
    'us-west-1': 'US West (N. California)',
    'us-west-2': 'US West (Oregon)',
    'eu-west-1': 'EU (Ireland)',
    'eu-west-2': 'EU (London)',
    'eu-west-3': 'EU (Paris)',
    'eu-central-1': 'EU (Frankfurt)',
    'eu-north-1': 'EU (Stockholm)',
    'ap-south-1': 'Asia Pacific (Mumbai)',
    'ap-northeast-1': 'Asia Pacific (Tokyo)',
    'ap-northeast-2': 'Asia Pacific (Seoul)',
    'ap-northeast-3': 'Asia Pacific (Osaka)',
    'ap-southeast-1': 'Asia Pacific (Singapore)',
    'ap-southeast-2': 'Asia Pacific (Sydney)',
    'ca-central-1': 'Canada (Central)',
    'sa-east-1': 'South America (Sao Paulo)',
    'ap-east-1': 'Asia Pacific (Hong Kong)',
    'me-south-1': 'Middle East (Bahrain)',
    'af-south-1': 'Africa (Cape Town)'
  };

  return regionMap[regionCode] || 'US East (N. Virginia)';
};

/**
 * Get product pricing from AWS Pricing API with caching
 */
export const getProductPricing = async (serviceCode, filters) => {
  try {
    // Generate cache key
    const cacheKey = `${serviceCode}:${JSON.stringify(filters)}`;

    // Check cache
    if (pricingCache[cacheKey]) {
      const { data, timestamp } = pricingCache[cacheKey];
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    // Fetch from AWS Pricing API
    const command = new GetProductsCommand({
      ServiceCode: serviceCode,
      Filters: filters,
      MaxResults: 100
    });

    const response = await pricingClient.send(command);

    // Parse price list
    const parsedPricing = response.PriceList.map(item => JSON.parse(item));

    // Cache result
    pricingCache[cacheKey] = {
      data: parsedPricing,
      timestamp: Date.now()
    };

    return parsedPricing;
  } catch (error) {
    console.error('AWS Pricing API error:', error);
    throw new Error('Failed to fetch pricing data from AWS');
  }
};

/**
 * EC2 Pricing Data (matches frontend data structure)
 * In production, this would be fetched from AWS Pricing API and cached in Redis
 */
const EC2_PRICING_DATA = {
  families: {
    'General Purpose': {
      types: [
        { type: 't3.nano', vcpu: 2, memory: 0.5, hourlyPrice: 0.0052 },
        { type: 't3.micro', vcpu: 2, memory: 1, hourlyPrice: 0.0104 },
        { type: 't3.small', vcpu: 2, memory: 2, hourlyPrice: 0.0208 },
        { type: 't3.medium', vcpu: 2, memory: 4, hourlyPrice: 0.0416 },
        { type: 't3.large', vcpu: 2, memory: 8, hourlyPrice: 0.0832 },
        { type: 't3.xlarge', vcpu: 4, memory: 16, hourlyPrice: 0.1664 },
        { type: 't3.2xlarge', vcpu: 8, memory: 32, hourlyPrice: 0.3328 },
        { type: 't4g.nano', vcpu: 2, memory: 0.5, hourlyPrice: 0.0042 },
        { type: 't4g.micro', vcpu: 2, memory: 1, hourlyPrice: 0.0084 },
        { type: 't4g.small', vcpu: 2, memory: 2, hourlyPrice: 0.0168 },
        { type: 't4g.medium', vcpu: 2, memory: 4, hourlyPrice: 0.0336 },
        { type: 't4g.large', vcpu: 2, memory: 8, hourlyPrice: 0.0672 },
        { type: 'm5.large', vcpu: 2, memory: 8, hourlyPrice: 0.096 },
        { type: 'm5.xlarge', vcpu: 4, memory: 16, hourlyPrice: 0.192 },
        { type: 'm5.2xlarge', vcpu: 8, memory: 32, hourlyPrice: 0.384 },
        { type: 'm5.4xlarge', vcpu: 16, memory: 64, hourlyPrice: 0.768 },
        { type: 'm6i.large', vcpu: 2, memory: 8, hourlyPrice: 0.096 },
        { type: 'm6i.xlarge', vcpu: 4, memory: 16, hourlyPrice: 0.192 },
        { type: 'm6i.2xlarge', vcpu: 8, memory: 32, hourlyPrice: 0.384 },
      ],
    },
    'Compute Optimized': {
      types: [
        { type: 'c5.large', vcpu: 2, memory: 4, hourlyPrice: 0.085 },
        { type: 'c5.xlarge', vcpu: 4, memory: 8, hourlyPrice: 0.17 },
        { type: 'c5.2xlarge', vcpu: 8, memory: 16, hourlyPrice: 0.34 },
        { type: 'c5.4xlarge', vcpu: 16, memory: 32, hourlyPrice: 0.68 },
        { type: 'c6i.large', vcpu: 2, memory: 4, hourlyPrice: 0.085 },
        { type: 'c6i.xlarge', vcpu: 4, memory: 8, hourlyPrice: 0.17 },
        { type: 'c6i.2xlarge', vcpu: 8, memory: 16, hourlyPrice: 0.34 },
        { type: 'c6i.4xlarge', vcpu: 16, memory: 32, hourlyPrice: 0.68 },
      ],
    },
    'Memory Optimized': {
      types: [
        { type: 'r5.large', vcpu: 2, memory: 16, hourlyPrice: 0.126 },
        { type: 'r5.xlarge', vcpu: 4, memory: 32, hourlyPrice: 0.252 },
        { type: 'r5.2xlarge', vcpu: 8, memory: 64, hourlyPrice: 0.504 },
        { type: 'r5.4xlarge', vcpu: 16, memory: 128, hourlyPrice: 1.008 },
        { type: 'r6i.large', vcpu: 2, memory: 16, hourlyPrice: 0.126 },
        { type: 'r6i.xlarge', vcpu: 4, memory: 32, hourlyPrice: 0.252 },
        { type: 'r6i.2xlarge', vcpu: 8, memory: 64, hourlyPrice: 0.504 },
        { type: 'x2gd.medium', vcpu: 1, memory: 16, hourlyPrice: 0.167 },
        { type: 'x2gd.large', vcpu: 2, memory: 32, hourlyPrice: 0.334 },
      ],
    },
    'Storage Optimized': {
      types: [
        { type: 'i3.large', vcpu: 2, memory: 15.25, storage: 475, hourlyPrice: 0.156 },
        { type: 'i3.xlarge', vcpu: 4, memory: 30.5, storage: 950, hourlyPrice: 0.312 },
        { type: 'i3.2xlarge', vcpu: 8, memory: 61, storage: 1900, hourlyPrice: 0.624 },
        { type: 'd3.xlarge', vcpu: 4, memory: 32, storage: 6000, hourlyPrice: 0.166 },
        { type: 'd3.2xlarge', vcpu: 8, memory: 64, storage: 12000, hourlyPrice: 0.333 },
      ],
    },
    'Accelerated Computing': {
      types: [
        { type: 'p3.2xlarge', vcpu: 8, memory: 61, gpu: 1, hourlyPrice: 3.06 },
        { type: 'p3.8xlarge', vcpu: 32, memory: 244, gpu: 4, hourlyPrice: 12.24 },
        { type: 'g4dn.xlarge', vcpu: 4, memory: 16, gpu: 1, hourlyPrice: 0.526 },
        { type: 'g4dn.2xlarge', vcpu: 8, memory: 32, gpu: 1, hourlyPrice: 0.752 },
      ],
    },
  },
  osMultipliers: {
    'Linux': 1.0,
    'Windows': 1.6,
    'RHEL': 1.3,
    'SUSE': 1.2,
    'Ubuntu Pro': 1.15,
  },
  pricingModelDiscounts: {
    'On-Demand': 0,
    'Reserved-1yr-No': 0.40,
    'Reserved-1yr-Partial': 0.42,
    'Reserved-1yr-All': 0.45,
    'Reserved-3yr-No': 0.56,
    'Reserved-3yr-Partial': 0.59,
    'Reserved-3yr-All': 0.62,
    'Savings Plan': 0.50,
    'Spot': 0.70,
  },
  tenancyMultipliers: {
    'Shared': 1.0,
    'Dedicated Instance': 2.0,
    'Dedicated Host': 2.5,
  },
  ebsVolumeTypes: {
    'gp3': { pricePerGB: 0.08, additionalIOPS: 0.005, additionalThroughput: 0.04 },
    'gp2': { pricePerGB: 0.10 },
    'io2': { pricePerGB: 0.125, pricePerIOPS: 0.065 },
    'io1': { pricePerGB: 0.125, pricePerIOPS: 0.065 },
    'st1': { pricePerGB: 0.045 },
    'sc1': { pricePerGB: 0.015 },
  },
  dataTransferPricing: {
    first10TB: 0.09,
    next40TB: 0.085,
    next100TB: 0.07,
    over150TB: 0.05,
  },
};

/**
 * Calculate EC2 cost with comprehensive pricing logic
 */
export const calculateEC2Cost = async (region, config) => {
  const {
    instanceType,
    operatingSystem,
    quantity = 1,
    hoursPerMonth = 730,
    pricingModel,
    tenancy,
    ebsVolumes = [],
    dataTransferOut = 0,
  } = config;

  // Find instance type details
  let instanceDetails = null;
  for (const family of Object.values(EC2_PRICING_DATA.families)) {
    instanceDetails = family.types.find((t) => t.type === instanceType);
    if (instanceDetails) break;
  }

  if (!instanceDetails) {
    throw new Error('Instance type not found in pricing data');
  }

  // Base hourly price
  let hourlyPrice = instanceDetails.hourlyPrice;

  // Apply OS multiplier
  const osMultiplier = EC2_PRICING_DATA.osMultipliers[operatingSystem] || 1.0;
  hourlyPrice *= osMultiplier;

  // Apply tenancy multiplier
  const tenancyMultiplier = EC2_PRICING_DATA.tenancyMultipliers[tenancy] || 1.0;
  hourlyPrice *= tenancyMultiplier;

  // Apply pricing model discount
  const discount = EC2_PRICING_DATA.pricingModelDiscounts[pricingModel] || 0;
  if (discount > 0) {
    hourlyPrice *= (1 - discount);
  }

  // Calculate instance cost
  const instanceCost = hourlyPrice * hoursPerMonth * quantity;

  // Calculate EBS cost
  let ebsCost = 0;
  ebsVolumes.forEach((volume) => {
    const volumeType = EC2_PRICING_DATA.ebsVolumeTypes[volume.type];
    if (volumeType) {
      ebsCost += volumeType.pricePerGB * volume.size;
      if (volume.iops && volumeType.pricePerIOPS) {
        ebsCost += volumeType.pricePerIOPS * volume.iops;
      }
    }
  });
  ebsCost *= quantity; // Multiply by number of instances

  // Calculate data transfer cost
  let transferCost = 0;
  if (dataTransferOut > 0) {
    const pricing = EC2_PRICING_DATA.dataTransferPricing;
    if (dataTransferOut <= 10240) {
      transferCost = dataTransferOut * pricing.first10TB;
    } else if (dataTransferOut <= 51200) {
      transferCost = 10240 * pricing.first10TB + (dataTransferOut - 10240) * pricing.next40TB;
    } else if (dataTransferOut <= 153600) {
      transferCost =
        10240 * pricing.first10TB +
        40960 * pricing.next40TB +
        (dataTransferOut - 51200) * pricing.next100TB;
    } else {
      transferCost =
        10240 * pricing.first10TB +
        40960 * pricing.next40TB +
        102400 * pricing.next100TB +
        (dataTransferOut - 153600) * pricing.over150TB;
    }
  }

  const monthlyCost = instanceCost + ebsCost + transferCost;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      instanceCost: Math.round(instanceCost * 100) / 100,
      ebsCost: Math.round(ebsCost * 100) / 100,
      transferCost: Math.round(transferCost * 100) / 100,
      hourlyRate: Math.round(hourlyPrice * 10000) / 10000,
    },
  };
};

/**
 * Calculate S3 cost (simplified)
 */
export const calculateS3Cost = async (region, configuration) => {
  const { storageAmount, storageClass, dataTransferOut, requests } = configuration;

  // Simplified pricing (would need more detailed implementation in production)
  const storagePricePerGB = {
    'Standard': 0.023,
    'Intelligent-Tiering': 0.023,
    'Standard-IA': 0.0125,
    'One Zone-IA': 0.01,
    'Glacier Instant': 0.004,
    'Glacier Flexible': 0.0036,
    'Glacier Deep Archive': 0.00099
  };

  const storagePrice = storagePricePerGB[storageClass || 'Standard'] || 0.023;
  const storageCost = (storageAmount || 0) * storagePrice;
  const transferCost = (dataTransferOut || 0) * 0.09; // Simplified transfer pricing
  const requestCost = ((requests?.PUT || 0) * 0.005 / 1000) + ((requests?.GET || 0) * 0.0004 / 1000);

  const monthlyCost = storageCost + transferCost + requestCost;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      storageCost: Math.round(storageCost * 100) / 100,
      transferCost: Math.round(transferCost * 100) / 100,
      requestCost: Math.round(requestCost * 100) / 100
    }
  };
};

/**
 * Calculate Lambda cost
 */
export const calculateLambdaCost = async (region, configuration) => {
  const { memory, duration, requests } = configuration;

  // Lambda pricing (simplified)
  const memoryGB = (memory || 128) / 1024;
  const durationSeconds = (duration || 100) / 1000;
  const gbSeconds = memoryGB * durationSeconds * (requests || 0);

  const computeCost = gbSeconds * 0.0000166667; // $0.0000166667 per GB-second
  const requestCost = (requests || 0) * 0.0000002; // $0.20 per 1M requests

  const monthlyCost = computeCost + requestCost;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      computeCost: Math.round(computeCost * 100) / 100,
      requestCost: Math.round(requestCost * 100) / 100
    }
  };
};

/**
 * Calculate RDS cost (simplified)
 */
export const calculateRDSCost = async (region, configuration) => {
  const { instanceType, engine, deployment, storage } = configuration;

  // Simplified RDS pricing
  const baseHourlyCost = {
    'db.t3.micro': 0.018,
    'db.t3.small': 0.036,
    'db.t3.medium': 0.072,
    'db.m5.large': 0.18,
    'db.m5.xlarge': 0.36
  };

  const instanceCost = (baseHourlyCost[instanceType] || 0.018) * 730;
  const multiAZMultiplier = deployment === 'Multi-AZ' ? 2 : 1;
  const storageCost = (storage || 20) * 0.115; // GP2 pricing

  const monthlyCost = (instanceCost * multiAZMultiplier) + storageCost;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      instanceCost: Math.round(instanceCost * multiAZMultiplier * 100) / 100,
      storageCost: Math.round(storageCost * 100) / 100
    }
  };
};
