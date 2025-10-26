// SQS (Simple Queue Service) Pricing Data

// Queue types
export const SQS_QUEUE_TYPES = [
  { value: 'standard', label: 'Standard Queue', description: 'Unlimited throughput, at-least-once delivery' },
  { value: 'fifo', label: 'FIFO Queue', description: 'Exactly-once processing, ordered messages' },
];

// Request pricing (per million)
export const SQS_REQUEST_PRICING = {
  standard: 0.40, // per million requests
  fifo: 0.50, // per million requests (first 1M free per month)
};

// Data transfer pricing (per GB out to internet)
export const SQS_DATA_TRANSFER = {
  first1GB: 0.00,
  next9_999GB: 0.09,
  over10TB: 0.085,
};

// Free tier
export const SQS_FREE_TIER = {
  requestsPerMonth: 1000000, // 1 million requests free
};

// Main cost calculation function
export function calculateSQSCost(config) {
  const {
    queueType = 'standard',
    requests = 10000000, // 10 million
    dataTransferGB = 10,
  } = config;

  // Request cost (accounting for free tier)
  let requestCost = 0;
  const chargeableRequests = Math.max(0, requests - SQS_FREE_TIER.requestsPerMonth);

  if (queueType === 'standard') {
    requestCost = (chargeableRequests / 1000000) * SQS_REQUEST_PRICING.standard;
  } else {
    requestCost = (chargeableRequests / 1000000) * SQS_REQUEST_PRICING.fifo;
  }

  // Data transfer cost
  let dataTransferCost = 0;
  let remaining = dataTransferGB;

  if (remaining > 1) {
    remaining -= 1; // First 1GB free
    const next9_999 = Math.min(remaining, 9999);
    dataTransferCost += next9_999 * SQS_DATA_TRANSFER.next9_999GB;
    remaining -= next9_999;

    if (remaining > 0) {
      dataTransferCost += remaining * SQS_DATA_TRANSFER.over10TB;
    }
  }

  const monthlyCost = requestCost + dataTransferCost;

  return {
    service: 'SQS',
    queueType,
    requestCost,
    dataTransferCost,
    monthlyCost,
    annualCost: monthlyCost * 12,
    breakdown: [
      {
        category: `${queueType.toUpperCase()} Queue Requests`,
        description: `${requests.toLocaleString()} requests (${chargeableRequests.toLocaleString()} billable)`,
        monthlyCost: requestCost,
      },
      {
        category: 'Data Transfer',
        description: `${dataTransferGB} GB`,
        monthlyCost: dataTransferCost,
      },
    ],
    configuration: {
      queueType,
      requests,
      dataTransferGB,
    },
  };
}

// Use case templates
export const SQS_USE_CASE_TEMPLATES = [
  {
    name: 'Small Application',
    description: 'Low-volume message queue',
    config: {
      queueType: 'standard',
      requests: 2000000,
      dataTransferGB: 5,
    },
  },
  {
    name: 'High-Volume Standard Queue',
    description: 'High throughput asynchronous processing',
    config: {
      queueType: 'standard',
      requests: 100000000,
      dataTransferGB: 100,
    },
  },
  {
    name: 'FIFO Order Processing',
    description: 'Order processing with guaranteed ordering',
    config: {
      queueType: 'fifo',
      requests: 10000000,
      dataTransferGB: 50,
    },
  },
  {
    name: 'Microservices Integration',
    description: 'Service-to-service communication',
    config: {
      queueType: 'standard',
      requests: 500000000,
      dataTransferGB: 500,
    },
  },
];
