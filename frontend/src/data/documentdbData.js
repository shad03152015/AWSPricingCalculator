// DocumentDB (MongoDB-compatible) Pricing Data

// Instance types
export const DOCUMENTDB_INSTANCE_TYPES = {
  'db.t3.medium': { vcpu: 2, memory: 4, hourlyPrice: 0.073 },
  'db.t4g.medium': { vcpu: 2, memory: 4, hourlyPrice: 0.065 },
  'db.r5.large': { vcpu: 2, memory: 16, hourlyPrice: 0.29 },
  'db.r5.xlarge': { vcpu: 4, memory: 32, hourlyPrice: 0.58 },
  'db.r5.2xlarge': { vcpu: 8, memory: 64, hourlyPrice: 1.16 },
  'db.r5.4xlarge': { vcpu: 16, memory: 128, hourlyPrice: 2.32 },
  'db.r6g.large': { vcpu: 2, memory: 16, hourlyPrice: 0.252 },
  'db.r6g.xlarge': { vcpu: 4, memory: 32, hourlyPrice: 0.504 },
  'db.r6g.2xlarge': { vcpu: 8, memory: 64, hourlyPrice: 1.008 },
};

// Storage pricing
export const DOCUMENTDB_STORAGE = {
  pricePerGBMonth: 0.10,
  ioRequestPrice: 0.20 / 1000000, // per million I/O requests
};

// Backup storage pricing
export const DOCUMENTDB_BACKUP_STORAGE = 0.021; // per GB-month

// Main cost calculation function
export function calculateDocumentDBCost(config) {
  const {
    instanceType = 'db.r6g.large',
    numberOfInstances = 3,
    storageGB = 100,
    ioRequestsPerMonth = 100000000,
    backupStorageGB = 100,
    region = 'us-east-1',
  } = config;

  const instanceDetails = DOCUMENTDB_INSTANCE_TYPES[instanceType];
  if (!instanceDetails) {
    return { service: 'DocumentDB', monthlyCost: 0, breakdown: [] };
  }

  const instanceCost = instanceDetails.hourlyPrice * 730 * numberOfInstances;
  const storageCost = storageGB * DOCUMENTDB_STORAGE.pricePerGBMonth;
  const ioCost = (ioRequestsPerMonth / 1000000) * DOCUMENTDB_STORAGE.ioRequestPrice * 1000000;
  const backupCost = backupStorageGB * DOCUMENTDB_BACKUP_STORAGE;
  const monthlyCost = instanceCost + storageCost + ioCost + backupCost;

  return {
    service: 'DocumentDB',
    instanceType,
    numberOfInstances,
    instanceCost,
    storageCost,
    ioCost,
    backupCost,
    monthlyCost,
    annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Instances', description: `${numberOfInstances}x ${instanceType}`, monthlyCost: instanceCost },
      { category: 'Storage', description: `${storageGB} GB`, monthlyCost: storageCost },
      { category: 'I/O Requests', description: `${ioRequestsPerMonth.toLocaleString()} requests`, monthlyCost: ioCost },
      { category: 'Backup Storage', description: `${backupStorageGB} GB`, monthlyCost: backupCost },
    ],
    configuration: { instanceType, numberOfInstances, storageGB, ioRequestsPerMonth, backupStorageGB, region },
  };
}

export const DOCUMENTDB_USE_CASE_TEMPLATES = [
  {
    name: 'Development',
    config: { instanceType: 'db.t4g.medium', numberOfInstances: 1, storageGB: 50, ioRequestsPerMonth: 10000000, backupStorageGB: 50, region: 'us-east-1' },
  },
  {
    name: 'Production',
    config: { instanceType: 'db.r6g.xlarge', numberOfInstances: 3, storageGB: 500, ioRequestsPerMonth: 500000000, backupStorageGB: 500, region: 'us-east-1' },
  },
];
