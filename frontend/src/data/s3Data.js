// S3 Storage Classes
export const S3_STORAGE_CLASSES = [
  {
    value: 'STANDARD',
    label: 'S3 Standard',
    description: 'General purpose storage for frequently accessed data',
    pricePerGB: 0.023,
    requestPricing: {
      put: 0.005 / 1000, // per 1000 requests
      get: 0.0004 / 1000,
      other: 0.0004 / 1000,
    },
    minimumStorage: 0,
    minimumStorageDays: 0,
    retrievalFee: 0,
    durability: '99.999999999%',
    availability: '99.99%',
  },
  {
    value: 'INTELLIGENT_TIERING',
    label: 'S3 Intelligent-Tiering',
    description: 'Automatic cost optimization for data with unknown or changing access patterns',
    pricePerGB: 0.023, // Frequent Access tier
    monitoringFee: 0.0025, // per 1000 objects
    requestPricing: {
      put: 0.005 / 1000,
      get: 0.0004 / 1000,
      other: 0.0004 / 1000,
    },
    minimumStorage: 0,
    minimumStorageDays: 0,
    retrievalFee: 0,
    durability: '99.999999999%',
    availability: '99.9%',
  },
  {
    value: 'STANDARD_IA',
    label: 'S3 Standard-IA',
    description: 'Infrequently accessed data requiring rapid access',
    pricePerGB: 0.0125,
    requestPricing: {
      put: 0.01 / 1000,
      get: 0.001 / 1000,
      other: 0.001 / 1000,
    },
    minimumStorage: 128, // KB
    minimumStorageDays: 30,
    retrievalFee: 0.01, // per GB
    durability: '99.999999999%',
    availability: '99.9%',
  },
  {
    value: 'ONE_ZONE_IA',
    label: 'S3 One Zone-IA',
    description: 'Lower-cost option for infrequently accessed data in a single AZ',
    pricePerGB: 0.01,
    requestPricing: {
      put: 0.01 / 1000,
      get: 0.001 / 1000,
      other: 0.001 / 1000,
    },
    minimumStorage: 128, // KB
    minimumStorageDays: 30,
    retrievalFee: 0.01, // per GB
    durability: '99.999999999%',
    availability: '99.5%',
  },
  {
    value: 'GLACIER_INSTANT',
    label: 'S3 Glacier Instant Retrieval',
    description: 'Archive data requiring instant access once per quarter',
    pricePerGB: 0.004,
    requestPricing: {
      put: 0.02 / 1000,
      get: 0.01 / 1000,
      other: 0.01 / 1000,
    },
    minimumStorage: 128, // KB
    minimumStorageDays: 90,
    retrievalFee: 0.03, // per GB
    durability: '99.999999999%',
    availability: '99.9%',
  },
  {
    value: 'GLACIER_FLEXIBLE',
    label: 'S3 Glacier Flexible Retrieval',
    description: 'Archive data accessed 1-2 times per year with flexible retrieval',
    pricePerGB: 0.0036,
    requestPricing: {
      put: 0.03 / 1000,
      get: 0.0004 / 1000,
      other: 0.0004 / 1000,
    },
    minimumStorage: 40, // KB
    minimumStorageDays: 90,
    retrievalOptions: {
      expedited: { pricePerGB: 0.03, minutes: '1-5' },
      standard: { pricePerGB: 0.01, hours: '3-5' },
      bulk: { pricePerGB: 0.0025, hours: '5-12' },
    },
    durability: '99.999999999%',
    availability: '99.99%',
  },
  {
    value: 'GLACIER_DEEP_ARCHIVE',
    label: 'S3 Glacier Deep Archive',
    description: 'Lowest-cost storage for long-term archive and digital preservation',
    pricePerGB: 0.00099,
    requestPricing: {
      put: 0.05 / 1000,
      get: 0.0004 / 1000,
      other: 0.0004 / 1000,
    },
    minimumStorage: 40, // KB
    minimumStorageDays: 180,
    retrievalOptions: {
      standard: { pricePerGB: 0.02, hours: '12' },
      bulk: { pricePerGB: 0.0025, hours: '48' },
    },
    durability: '99.999999999%',
    availability: '99.99%',
  },
];

// S3 Request Types
export const S3_REQUEST_TYPES = [
  { value: 'PUT', label: 'PUT, COPY, POST, LIST requests', unit: '1000 requests' },
  { value: 'GET', label: 'GET, SELECT requests', unit: '1000 requests' },
  { value: 'LIFECYCLE', label: 'Lifecycle Transition requests', unit: '1000 requests' },
];

// Data Transfer Pricing (similar to EC2 but S3-specific)
export const S3_DATA_TRANSFER_PRICING = {
  outToInternet: {
    first1GB: 0.0, // First 1 GB free
    first10TB: 0.09,
    next40TB: 0.085,
    next100TB: 0.07,
    over150TB: 0.05,
  },
  betweenRegionsSameClass: 0.02, // per GB
  betweenRegionsDifferentClass: 0.02,
  toCloudFront: 0.00, // Free
  inbound: 0.00, // Free
  sameRegion: 0.00, // Free
};

// AWS Regions for S3
export const S3_REGIONS = [
  { code: 'us-east-1', name: 'US East (N. Virginia)', priceMultiplier: 1.0 },
  { code: 'us-east-2', name: 'US East (Ohio)', priceMultiplier: 1.0 },
  { code: 'us-west-1', name: 'US West (N. California)', priceMultiplier: 1.05 },
  { code: 'us-west-2', name: 'US West (Oregon)', priceMultiplier: 1.0 },
  { code: 'ca-central-1', name: 'Canada (Central)', priceMultiplier: 1.02 },
  { code: 'eu-west-1', name: 'EU (Ireland)', priceMultiplier: 1.0 },
  { code: 'eu-west-2', name: 'EU (London)', priceMultiplier: 1.02 },
  { code: 'eu-west-3', name: 'EU (Paris)', priceMultiplier: 1.02 },
  { code: 'eu-central-1', name: 'EU (Frankfurt)', priceMultiplier: 1.02 },
  { code: 'eu-north-1', name: 'EU (Stockholm)', priceMultiplier: 0.95 },
  { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)', priceMultiplier: 1.05 },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', priceMultiplier: 1.05 },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)', priceMultiplier: 1.03 },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', priceMultiplier: 1.05 },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', priceMultiplier: 1.05 },
  { code: 'sa-east-1', name: 'South America (São Paulo)', priceMultiplier: 1.15 },
];

// S3 Features/Options
export const S3_FEATURES = {
  versioning: {
    label: 'S3 Versioning',
    description: 'Keep multiple versions of objects',
    note: 'Each version is billed as a separate object',
  },
  replication: {
    label: 'S3 Replication',
    description: 'Cross-region or same-region replication',
    pricePerGB: 0.015, // Replication PUT request cost
  },
  analytics: {
    label: 'S3 Analytics',
    description: 'Storage class analysis',
    pricePerMillion: 0.1, // per million objects monitored per month
  },
  inventory: {
    label: 'S3 Inventory',
    description: 'List objects and metadata',
    pricePerMillion: 0.0025, // per million objects listed
  },
};

// Helper function to calculate S3 cost
export function calculateS3Cost(config) {
  const {
    region = 'us-east-1',
    storageClass = 'STANDARD',
    storageAmount = 0, // in GB
    putRequests = 0, // per month
    getRequests = 0, // per month
    dataTransferOut = 0, // in GB per month
    dataRetrieved = 0, // in GB per month (for IA and Glacier)
    enableReplication = false,
    replicationAmount = 0, // in GB
    numberOfObjects = 0, // for Intelligent-Tiering monitoring
  } = config;

  // Find storage class details
  const storageClassDetails = S3_STORAGE_CLASSES.find((sc) => sc.value === storageClass);
  if (!storageClassDetails) {
    return { monthlyCost: 0, breakdown: {} };
  }

  // Find region multiplier
  const regionDetails = S3_REGIONS.find((r) => r.code === region);
  const regionMultiplier = regionDetails?.priceMultiplier || 1.0;

  // Calculate storage cost
  let storageCost = storageAmount * storageClassDetails.pricePerGB * regionMultiplier;

  // Add monitoring fee for Intelligent-Tiering
  let monitoringCost = 0;
  if (storageClass === 'INTELLIGENT_TIERING' && numberOfObjects > 0) {
    monitoringCost = (numberOfObjects / 1000) * storageClassDetails.monitoringFee;
  }

  // Calculate request costs
  const putRequestCost = (putRequests / 1000) * storageClassDetails.requestPricing.put * regionMultiplier;
  const getRequestCost = (getRequests / 1000) * storageClassDetails.requestPricing.get * regionMultiplier;
  const requestCost = putRequestCost + getRequestCost;

  // Calculate retrieval cost (for IA and Glacier classes)
  let retrievalCost = 0;
  if (dataRetrieved > 0 && storageClassDetails.retrievalFee) {
    retrievalCost = dataRetrieved * storageClassDetails.retrievalFee * regionMultiplier;
  }

  // Calculate data transfer out cost
  let transferCost = 0;
  if (dataTransferOut > 0) {
    const pricing = S3_DATA_TRANSFER_PRICING.outToInternet;
    if (dataTransferOut <= 1) {
      transferCost = 0; // First 1 GB free
    } else if (dataTransferOut <= 10240) {
      transferCost = (dataTransferOut - 1) * pricing.first10TB;
    } else if (dataTransferOut <= 51200) {
      transferCost =
        (10240 - 1) * pricing.first10TB +
        (dataTransferOut - 10240) * pricing.next40TB;
    } else if (dataTransferOut <= 153600) {
      transferCost =
        (10240 - 1) * pricing.first10TB +
        40960 * pricing.next40TB +
        (dataTransferOut - 51200) * pricing.next100TB;
    } else {
      transferCost =
        (10240 - 1) * pricing.first10TB +
        40960 * pricing.next40TB +
        102400 * pricing.next100TB +
        (dataTransferOut - 153600) * pricing.over150TB;
    }
  }

  // Calculate replication cost
  let replicationCost = 0;
  if (enableReplication && replicationAmount > 0) {
    replicationCost = replicationAmount * S3_FEATURES.replication.pricePerGB;
  }

  const monthlyCost =
    storageCost +
    monitoringCost +
    requestCost +
    retrievalCost +
    transferCost +
    replicationCost;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      storageCost: Math.round(storageCost * 100) / 100,
      monitoringCost: Math.round(monitoringCost * 100) / 100,
      requestCost: Math.round(requestCost * 100) / 100,
      retrievalCost: Math.round(retrievalCost * 100) / 100,
      transferCost: Math.round(transferCost * 100) / 100,
      replicationCost: Math.round(replicationCost * 100) / 100,
    },
  };
}

// Helper function to get storage class by value
export function getStorageClassDetails(storageClass) {
  return S3_STORAGE_CLASSES.find((sc) => sc.value === storageClass);
}

// Helper function to estimate cost per GB for quick reference
export function getCostPerGBEstimate(storageClass, region = 'us-east-1') {
  const storageClassDetails = getStorageClassDetails(storageClass);
  if (!storageClassDetails) return 0;

  const regionDetails = S3_REGIONS.find((r) => r.code === region);
  const regionMultiplier = regionDetails?.priceMultiplier || 1.0;

  return storageClassDetails.pricePerGB * regionMultiplier;
}
