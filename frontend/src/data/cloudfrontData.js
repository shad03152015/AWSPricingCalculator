// CloudFront (CDN) Pricing Data

// Regional pricing zones
export const CLOUDFRONT_PRICE_CLASSES = [
  { value: 'PriceClass_All', label: 'All Edge Locations (Best Performance)', description: 'Use all edge locations worldwide' },
  { value: 'PriceClass_200', label: 'Price Class 200', description: 'US, Europe, Asia, Middle East, and Africa' },
  { value: 'PriceClass_100', label: 'Price Class 100', description: 'US, Europe, and Israel only' },
];

// Data transfer out pricing (per GB, first 10TB/month for US/Europe)
export const CLOUDFRONT_DATA_TRANSFER_OUT = {
  'PriceClass_All': {
    first10TB: 0.085,
    next40TB: 0.080,
    next100TB: 0.060,
    next350TB: 0.040,
    over500TB: 0.030,
  },
  'PriceClass_200': {
    first10TB: 0.085,
    next40TB: 0.080,
    next100TB: 0.060,
    next350TB: 0.040,
    over500TB: 0.030,
  },
  'PriceClass_100': {
    first10TB: 0.085,
    next40TB: 0.080,
    next100TB: 0.060,
    next350TB: 0.040,
    over500TB: 0.030,
  },
};

// HTTP/HTTPS requests pricing (per 10,000 requests)
export const CLOUDFRONT_REQUEST_PRICING = {
  http: 0.0075,  // per 10,000 requests
  https: 0.0100, // per 10,000 requests
};

// Invalidation pricing
export const CLOUDFRONT_INVALIDATION = {
  freePathsPerMonth: 1000,
  pricePerPathOver1000: 0.005,
};

// Calculate tiered data transfer cost
function calculateTieredDataTransferCost(dataTransferGB, priceClass) {
  const pricing = CLOUDFRONT_DATA_TRANSFER_OUT[priceClass];
  let cost = 0;
  let remaining = dataTransferGB;

  // First 10 TB
  if (remaining > 0) {
    const amount = Math.min(remaining, 10240); // 10TB in GB
    cost += amount * pricing.first10TB;
    remaining -= amount;
  }

  // Next 40 TB
  if (remaining > 0) {
    const amount = Math.min(remaining, 40960);
    cost += amount * pricing.next40TB;
    remaining -= amount;
  }

  // Next 100 TB
  if (remaining > 0) {
    const amount = Math.min(remaining, 102400);
    cost += amount * pricing.next100TB;
    remaining -= amount;
  }

  // Next 350 TB
  if (remaining > 0) {
    const amount = Math.min(remaining, 358400);
    cost += amount * pricing.next350TB;
    remaining -= amount;
  }

  // Over 500 TB
  if (remaining > 0) {
    cost += remaining * pricing.over500TB;
  }

  return cost;
}

// Main cost calculation function
export function calculateCloudFrontCost(config) {
  const {
    priceClass = 'PriceClass_All',
    dataTransferOutGB = 1000,
    httpRequests = 1000000,
    httpsRequests = 9000000,
    invalidationPaths = 0,
  } = config;

  // Data transfer cost
  const dataTransferCost = calculateTieredDataTransferCost(dataTransferOutGB, priceClass);

  // Request costs
  const httpRequestCost = (httpRequests / 10000) * CLOUDFRONT_REQUEST_PRICING.http;
  const httpsRequestCost = (httpsRequests / 10000) * CLOUDFRONT_REQUEST_PRICING.https;
  const requestCost = httpRequestCost + httpsRequestCost;

  // Invalidation cost
  let invalidationCost = 0;
  if (invalidationPaths > CLOUDFRONT_INVALIDATION.freePathsPerMonth) {
    const chargeablePaths = invalidationPaths - CLOUDFRONT_INVALIDATION.freePathsPerMonth;
    invalidationCost = chargeablePaths * CLOUDFRONT_INVALIDATION.pricePerPathOver1000;
  }

  const monthlyCost = dataTransferCost + requestCost + invalidationCost;

  return {
    service: 'CloudFront',
    priceClass,
    dataTransferCost,
    requestCost,
    httpRequestCost,
    httpsRequestCost,
    invalidationCost,
    monthlyCost,
    annualCost: monthlyCost * 12,
    breakdown: [
      {
        category: 'Data Transfer Out',
        description: `${dataTransferOutGB.toLocaleString()} GB`,
        monthlyCost: dataTransferCost,
      },
      {
        category: 'HTTP Requests',
        description: `${httpRequests.toLocaleString()} requests`,
        monthlyCost: httpRequestCost,
      },
      {
        category: 'HTTPS Requests',
        description: `${httpsRequests.toLocaleString()} requests`,
        monthlyCost: httpsRequestCost,
      },
      {
        category: 'Invalidations',
        description: `${invalidationPaths.toLocaleString()} paths`,
        monthlyCost: invalidationCost,
      },
    ],
    configuration: {
      priceClass,
      dataTransferOutGB,
      httpRequests,
      httpsRequests,
      invalidationPaths,
    },
  };
}

// Use case templates
export const CLOUDFRONT_USE_CASE_TEMPLATES = [
  {
    name: 'Small Website',
    description: 'Personal blog or small business site',
    config: {
      priceClass: 'PriceClass_100',
      dataTransferOutGB: 100,
      httpRequests: 100000,
      httpsRequests: 900000,
      invalidationPaths: 100,
    },
  },
  {
    name: 'Medium Application',
    description: 'Growing web application with moderate traffic',
    config: {
      priceClass: 'PriceClass_200',
      dataTransferOutGB: 1000,
      httpRequests: 1000000,
      httpsRequests: 9000000,
      invalidationPaths: 500,
    },
  },
  {
    name: 'Large Scale Application',
    description: 'High traffic application with global users',
    config: {
      priceClass: 'PriceClass_All',
      dataTransferOutGB: 10000,
      httpRequests: 10000000,
      httpsRequests: 90000000,
      invalidationPaths: 2000,
    },
  },
  {
    name: 'Video Streaming',
    description: 'Video content delivery platform',
    config: {
      priceClass: 'PriceClass_All',
      dataTransferOutGB: 50000,
      httpRequests: 5000000,
      httpsRequests: 45000000,
      invalidationPaths: 100,
    },
  },
];
