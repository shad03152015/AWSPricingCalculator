// ElastiCache (Redis/Memcached) Pricing Data

// Engine types
export const ELASTICACHE_ENGINES = [
  { value: 'redis', label: 'Redis', description: 'In-memory data structure store' },
  { value: 'memcached', label: 'Memcached', description: 'High-performance distributed memory cache' },
];

// Node types (current generation)
export const ELASTICACHE_NODE_TYPES = {
  // Cache nodes (t3, t4g, m6g, m7g, r6g, r7g)
  't3.micro': { memory: 0.5, vcpu: 2, hourlyPrice: 0.017 },
  't3.small': { memory: 1.37, vcpu: 2, hourlyPrice: 0.034 },
  't3.medium': { memory: 3.09, vcpu: 2, hourlyPrice: 0.068 },
  't4g.micro': { memory: 0.5, vcpu: 2, hourlyPrice: 0.016 },
  't4g.small': { memory: 1.37, vcpu: 2, hourlyPrice: 0.032 },
  't4g.medium': { memory: 3.09, vcpu: 2, hourlyPrice: 0.063 },
  'm6g.large': { memory: 6.38, vcpu: 2, hourlyPrice: 0.147 },
  'm6g.xlarge': { memory: 12.93, vcpu: 4, hourlyPrice: 0.294 },
  'm6g.2xlarge': { memory: 26.04, vcpu: 8, hourlyPrice: 0.588 },
  'm6g.4xlarge': { memory: 52.26, vcpu: 16, hourlyPrice: 1.176 },
  'm7g.large': { memory: 6.76, vcpu: 2, hourlyPrice: 0.161 },
  'm7g.xlarge': { memory: 13.65, vcpu: 4, hourlyPrice: 0.322 },
  'm7g.2xlarge': { memory: 27.44, vcpu: 8, hourlyPrice: 0.644 },
  'r6g.large': { memory: 13.07, vcpu: 2, hourlyPrice: 0.195 },
  'r6g.xlarge': { memory: 26.32, vcpu: 4, hourlyPrice: 0.390 },
  'r6g.2xlarge': { memory: 52.82, vcpu: 8, hourlyPrice: 0.780 },
  'r6g.4xlarge': { memory: 105.81, vcpu: 16, hourlyPrice: 1.560 },
  'r7g.large': { memory: 13.87, vcpu: 2, hourlyPrice: 0.213 },
  'r7g.xlarge': { memory: 27.88, vcpu: 4, hourlyPrice: 0.426 },
  'r7g.2xlarge': { memory: 55.90, vcpu: 8, hourlyPrice: 0.852 },
};

// Backup storage pricing (per GB-month)
export const ELASTICACHE_BACKUP_STORAGE = 0.085;

// Data transfer pricing (per GB)
export const ELASTICACHE_DATA_TRANSFER = {
  inbound: 0.00, // Free
  outboundFirst1GB: 0.00,
  outbound: 0.09,
};

// Main cost calculation function
export function calculateElastiCacheCost(config) {
  const {
    engine = 'redis',
    nodeType = 'r6g.large',
    numberOfNodes = 2,
    backupStorageGB = 100,
    dataTransferOutGB = 100,
    region = 'us-east-1',
  } = config;

  const nodeDetails = ELASTICACHE_NODE_TYPES[nodeType];

  if (!nodeDetails) {
    return {
      service: 'ElastiCache',
      monthlyCost: 0,
      breakdown: [],
    };
  }

  // Node cost (730 hours per month)
  const nodeCost = nodeDetails.hourlyPrice * 730 * numberOfNodes;

  // Backup storage cost
  const backupCost = backupStorageGB * ELASTICACHE_BACKUP_STORAGE;

  // Data transfer cost
  let dataTransferCost = 0;
  if (dataTransferOutGB > 1) {
    dataTransferCost = (dataTransferOutGB - 1) * ELASTICACHE_DATA_TRANSFER.outbound;
  }

  const monthlyCost = nodeCost + backupCost + dataTransferCost;

  return {
    service: 'ElastiCache',
    engine,
    nodeType,
    numberOfNodes,
    nodeCost,
    backupCost,
    dataTransferCost,
    monthlyCost,
    annualCost: monthlyCost * 12,
    breakdown: [
      {
        category: `${engine} Nodes`,
        description: `${numberOfNodes}x ${nodeType} (${nodeDetails.memory}GB RAM, ${nodeDetails.vcpu} vCPU)`,
        monthlyCost: nodeCost,
      },
      {
        category: 'Backup Storage',
        description: `${backupStorageGB} GB`,
        monthlyCost: backupCost,
      },
      {
        category: 'Data Transfer Out',
        description: `${dataTransferOutGB} GB`,
        monthlyCost: dataTransferCost,
      },
    ],
    configuration: {
      engine,
      nodeType,
      numberOfNodes,
      backupStorageGB,
      dataTransferOutGB,
      region,
    },
  };
}

// Use case templates
export const ELASTICACHE_USE_CASE_TEMPLATES = [
  {
    name: 'Development/Testing',
    description: 'Small cache for dev/test',
    config: {
      engine: 'redis',
      nodeType: 't4g.micro',
      numberOfNodes: 1,
      backupStorageGB: 10,
      dataTransferOutGB: 10,
      region: 'us-east-1',
    },
  },
  {
    name: 'Production Cache',
    description: 'Redis cluster for production caching',
    config: {
      engine: 'redis',
      nodeType: 'r6g.large',
      numberOfNodes: 3,
      backupStorageGB: 100,
      dataTransferOutGB: 500,
      region: 'us-east-1',
    },
  },
  {
    name: 'Session Store',
    description: 'Redis for session management',
    config: {
      engine: 'redis',
      nodeType: 'm6g.xlarge',
      numberOfNodes: 2,
      backupStorageGB: 50,
      dataTransferOutGB: 200,
      region: 'us-east-1',
    },
  },
  {
    name: 'Memcached Cluster',
    description: 'High-performance Memcached cluster',
    config: {
      engine: 'memcached',
      nodeType: 'r6g.xlarge',
      numberOfNodes: 5,
      backupStorageGB: 0,
      dataTransferOutGB: 1000,
      region: 'us-east-1',
    },
  },
];
