// Lambda Memory Options (in MB)
export const LAMBDA_MEMORY_OPTIONS = [
  { value: 128, label: '128 MB', vcpu: 0.08 },
  { value: 256, label: '256 MB', vcpu: 0.17 },
  { value: 512, label: '512 MB', vcpu: 0.33 },
  { value: 1024, label: '1024 MB (1 GB)', vcpu: 0.58 },
  { value: 1536, label: '1536 MB (1.5 GB)', vcpu: 0.88 },
  { value: 2048, label: '2048 MB (2 GB)', vcpu: 1.0 },
  { value: 3008, label: '3008 MB (3 GB)', vcpu: 1.5 },
  { value: 4096, label: '4096 MB (4 GB)', vcpu: 2.0 },
  { value: 5120, label: '5120 MB (5 GB)', vcpu: 2.5 },
  { value: 6144, label: '6144 MB (6 GB)', vcpu: 3.0 },
  { value: 7168, label: '7168 MB (7 GB)', vcpu: 3.5 },
  { value: 8192, label: '8192 MB (8 GB)', vcpu: 4.0 },
  { value: 9216, label: '9216 MB (9 GB)', vcpu: 4.5 },
  { value: 10240, label: '10240 MB (10 GB)', vcpu: 5.83 },
];

// Lambda Architecture Options
export const LAMBDA_ARCHITECTURES = [
  {
    value: 'x86_64',
    label: 'x86_64',
    description: 'Standard Intel/AMD architecture',
    requestPrice: 0.20 / 1000000, // per million requests
    durationPrice: 0.0000166667, // per GB-second
  },
  {
    value: 'arm64',
    label: 'ARM64 (Graviton2)',
    description: '20% price reduction and better performance',
    requestPrice: 0.20 / 1000000, // per million requests (same as x86)
    durationPrice: 0.0000133334, // per GB-second (20% cheaper)
  },
];

// Lambda Free Tier
export const LAMBDA_FREE_TIER = {
  requests: 1000000, // 1 million requests per month
  computeGBSeconds: 400000, // 400,000 GB-seconds per month
  ephemeralStorage: 512, // 512 MB included
};

// Lambda Ephemeral Storage (/tmp)
export const LAMBDA_EPHEMERAL_STORAGE = {
  included: 512, // MB included free
  max: 10240, // 10 GB maximum
  pricePerGB: 0.0000000309, // per GB-second
};

// Lambda Provisioned Concurrency
export const LAMBDA_PROVISIONED_CONCURRENCY = {
  pricePerGBHour: 0.0000041667, // per GB-hour
  pricePerRequest: 0.0000001, // per request (in addition to standard request price)
  description: 'Keep functions initialized and ready to respond in double-digit milliseconds',
};

// AWS Regions for Lambda
export const LAMBDA_REGIONS = [
  { code: 'us-east-1', name: 'US East (N. Virginia)', priceMultiplier: 1.0 },
  { code: 'us-east-2', name: 'US East (Ohio)', priceMultiplier: 1.0 },
  { code: 'us-west-1', name: 'US West (N. California)', priceMultiplier: 1.13 },
  { code: 'us-west-2', name: 'US West (Oregon)', priceMultiplier: 1.0 },
  { code: 'ca-central-1', name: 'Canada (Central)', priceMultiplier: 1.0 },
  { code: 'eu-west-1', name: 'EU (Ireland)', priceMultiplier: 1.11 },
  { code: 'eu-west-2', name: 'EU (London)', priceMultiplier: 1.11 },
  { code: 'eu-west-3', name: 'EU (Paris)', priceMultiplier: 1.11 },
  { code: 'eu-central-1', name: 'EU (Frankfurt)', priceMultiplier: 1.17 },
  { code: 'eu-north-1', name: 'EU (Stockholm)', priceMultiplier: 1.0 },
  { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)', priceMultiplier: 1.09 },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', priceMultiplier: 1.18 },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)', priceMultiplier: 1.09 },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', priceMultiplier: 1.18 },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', priceMultiplier: 1.18 },
  { code: 'sa-east-1', name: 'South America (São Paulo)', priceMultiplier: 1.38 },
];

// Common use case templates
export const LAMBDA_USE_CASES = [
  {
    name: 'API Backend',
    description: 'REST API with moderate traffic',
    defaultConfig: {
      memory: 1024,
      avgDuration: 200, // ms
      requestsPerMonth: 1000000,
    },
  },
  {
    name: 'Data Processing',
    description: 'Process files or data transformations',
    defaultConfig: {
      memory: 3008,
      avgDuration: 5000, // ms
      requestsPerMonth: 100000,
    },
  },
  {
    name: 'Scheduled Jobs',
    description: 'Cron jobs or scheduled tasks',
    defaultConfig: {
      memory: 512,
      avgDuration: 1000, // ms
      requestsPerMonth: 43200, // Once per minute for a month
    },
  },
  {
    name: 'Event Processing',
    description: 'Process events from S3, DynamoDB, etc.',
    defaultConfig: {
      memory: 2048,
      avgDuration: 500, // ms
      requestsPerMonth: 5000000,
    },
  },
];

// Helper function to get memory option details
export function getMemoryOption(memory) {
  return LAMBDA_MEMORY_OPTIONS.find((m) => m.value === memory);
}

// Helper function to get architecture pricing
export function getArchitecturePricing(architecture) {
  return LAMBDA_ARCHITECTURES.find((a) => a.value === architecture);
}

// Helper function to calculate Lambda cost
export function calculateLambdaCost(config) {
  const {
    region = 'us-east-1',
    architecture = 'x86_64',
    memory = 1024, // MB
    avgDuration = 200, // milliseconds
    requestsPerMonth = 1000000,
    ephemeralStorage = 512, // MB
    useProvisionedConcurrency = false,
    provisionedConcurrency = 0, // number of instances
    provisionedConcurrencyHours = 730, // hours per month
    applyFreeTier = true,
  } = config;

  // Find region multiplier
  const regionDetails = LAMBDA_REGIONS.find((r) => r.code === region);
  const regionMultiplier = regionDetails?.priceMultiplier || 1.0;

  // Get architecture pricing
  const archPricing = getArchitecturePricing(architecture);
  if (!archPricing) {
    return { monthlyCost: 0, breakdown: {} };
  }

  // Calculate billable requests (after free tier)
  let billableRequests = requestsPerMonth;
  if (applyFreeTier) {
    billableRequests = Math.max(0, requestsPerMonth - LAMBDA_FREE_TIER.requests);
  }

  // Calculate request cost
  const requestCost = billableRequests * archPricing.requestPrice * regionMultiplier;

  // Calculate compute GB-seconds
  const memoryGB = memory / 1024;
  const durationSeconds = avgDuration / 1000;
  const totalGBSeconds = requestsPerMonth * memoryGB * durationSeconds;

  // Calculate billable GB-seconds (after free tier)
  let billableGBSeconds = totalGBSeconds;
  if (applyFreeTier) {
    billableGBSeconds = Math.max(0, totalGBSeconds - LAMBDA_FREE_TIER.computeGBSeconds);
  }

  // Calculate duration cost
  const durationCost = billableGBSeconds * archPricing.durationPrice * regionMultiplier;

  // Calculate ephemeral storage cost
  let storageCost = 0;
  if (ephemeralStorage > LAMBDA_EPHEMERAL_STORAGE.included) {
    const additionalStorageGB = (ephemeralStorage - LAMBDA_EPHEMERAL_STORAGE.included) / 1024;
    // Storage cost is per GB-second
    const storageDurationSeconds = requestsPerMonth * durationSeconds;
    storageCost = additionalStorageGB * storageDurationSeconds * LAMBDA_EPHEMERAL_STORAGE.pricePerGB * regionMultiplier;
  }

  // Calculate provisioned concurrency cost
  let provisionedConcurrencyCost = 0;
  let provisionedConcurrencyRequestCost = 0;
  if (useProvisionedConcurrency && provisionedConcurrency > 0) {
    // Provisioned concurrency is charged per GB-hour
    const provisionedGBHours = (memory / 1024) * provisionedConcurrency * provisionedConcurrencyHours;
    provisionedConcurrencyCost = provisionedGBHours * LAMBDA_PROVISIONED_CONCURRENCY.pricePerGBHour * regionMultiplier;

    // Additional request cost for provisioned concurrency
    provisionedConcurrencyRequestCost = requestsPerMonth * LAMBDA_PROVISIONED_CONCURRENCY.pricePerRequest * regionMultiplier;
  }

  const monthlyCost =
    requestCost +
    durationCost +
    storageCost +
    provisionedConcurrencyCost +
    provisionedConcurrencyRequestCost;

  // Calculate free tier savings
  const freeTierSavings = applyFreeTier
    ? Math.min(LAMBDA_FREE_TIER.requests, requestsPerMonth) * archPricing.requestPrice * regionMultiplier +
      Math.min(LAMBDA_FREE_TIER.computeGBSeconds, totalGBSeconds) * archPricing.durationPrice * regionMultiplier
    : 0;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      requestCost: Math.round(requestCost * 100) / 100,
      durationCost: Math.round(durationCost * 100) / 100,
      storageCost: Math.round(storageCost * 100) / 100,
      provisionedConcurrencyCost: Math.round(provisionedConcurrencyCost * 100) / 100,
      provisionedConcurrencyRequestCost: Math.round(provisionedConcurrencyRequestCost * 100) / 100,
      freeTierSavings: Math.round(freeTierSavings * 100) / 100,
      totalGBSeconds: Math.round(totalGBSeconds * 100) / 100,
      billableGBSeconds: Math.round(billableGBSeconds * 100) / 100,
      billableRequests,
    },
  };
}

// Helper function to estimate cost per invocation
export function getCostPerInvocation(memory, duration, architecture = 'x86_64', region = 'us-east-1') {
  const config = {
    region,
    architecture,
    memory,
    avgDuration: duration,
    requestsPerMonth: 1,
    applyFreeTier: false,
  };

  const cost = calculateLambdaCost(config);
  return cost.monthlyCost;
}

// Helper function to calculate GB-seconds
export function calculateGBSeconds(memory, durationMs, invocations) {
  const memoryGB = memory / 1024;
  const durationSeconds = durationMs / 1000;
  return memoryGB * durationSeconds * invocations;
}

// Helper function to format GB-seconds
export function formatGBSeconds(gbSeconds) {
  if (gbSeconds < 1) {
    return `${(gbSeconds * 1000).toFixed(2)} MB-seconds`;
  } else if (gbSeconds < 1000) {
    return `${gbSeconds.toFixed(2)} GB-seconds`;
  } else {
    return `${(gbSeconds / 1000).toFixed(2)} TB-seconds`;
  }
}

// Helper function to check if within free tier
export function isWithinFreeTier(requestsPerMonth, gbSeconds) {
  return (
    requestsPerMonth <= LAMBDA_FREE_TIER.requests &&
    gbSeconds <= LAMBDA_FREE_TIER.computeGBSeconds
  );
}

// Helper function to get estimated vCPU based on memory
export function getEstimatedVCPU(memory) {
  const memoryOption = getMemoryOption(memory);
  return memoryOption?.vcpu || 0;
}
