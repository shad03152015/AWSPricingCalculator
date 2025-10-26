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
 * Calculate EC2 cost
 */
export const calculateEC2Cost = async (region, configuration) => {
  const { instanceType, operatingSystem, quantity, usageHours, pricingModel } = configuration;

  const filters = [
    { Type: 'TERM_MATCH', Field: 'location', Value: mapRegionToLocation(region) },
    { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType },
    { Type: 'TERM_MATCH', Field: 'operatingSystem', Value: operatingSystem || 'Linux' },
    { Type: 'TERM_MATCH', Field: 'tenancy', Value: 'Shared' },
    { Type: 'TERM_MATCH', Field: 'preInstalledSw', Value: 'NA' },
    { Type: 'TERM_MATCH', Field: 'capacitystatus', Value: 'Used' }
  ];

  const pricingData = await getProductPricing('AmazonEC2', filters);

  if (!pricingData || pricingData.length === 0) {
    throw new Error('No pricing data found for the specified configuration');
  }

  // Extract pricing from OnDemand terms
  const product = pricingData[0];
  const onDemandTerms = Object.values(product.terms?.OnDemand || {})[0];
  const priceDimensions = Object.values(onDemandTerms?.priceDimensions || {})[0];
  const pricePerHour = parseFloat(priceDimensions?.pricePerUnit?.USD || 0);

  // Calculate monthly cost
  const monthlyCost = pricePerHour * (usageHours || 730) * (quantity || 1);

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      pricePerHour,
      usageHours: usageHours || 730,
      quantity: quantity || 1
    }
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
