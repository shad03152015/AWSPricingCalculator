// Neptune (Graph Database) Pricing Data

export const NEPTUNE_INSTANCE_TYPES = {
  'db.t3.medium': { vcpu: 2, memory: 4, hourlyPrice: 0.073 },
  'db.t4g.medium': { vcpu: 2, memory: 4, hourlyPrice: 0.082 },
  'db.r5.large': { vcpu: 2, memory: 16, hourlyPrice: 0.348 },
  'db.r5.xlarge': { vcpu: 4, memory: 32, hourlyPrice: 0.696 },
  'db.r6g.large': { vcpu: 2, memory: 16, hourlyPrice: 0.303 },
  'db.r6g.xlarge': { vcpu: 4, memory: 32, hourlyPrice: 0.606 },
};

export const NEPTUNE_STORAGE = { pricePerGBMonth: 0.10, ioRequestPrice: 0.20 };
export const NEPTUNE_BACKUP_STORAGE = 0.021;

export function calculateNeptuneCost(config) {
  const { instanceType = 'db.r6g.large', numberOfInstances = 2, storageGB = 100, ioRequestsPerMonth = 50000000, backupStorageGB = 100 } = config;
  const instanceDetails = NEPTUNE_INSTANCE_TYPES[instanceType];
  if (!instanceDetails) return { service: 'Neptune', monthlyCost: 0, breakdown: [] };

  const instanceCost = instanceDetails.hourlyPrice * 730 * numberOfInstances;
  const storageCost = storageGB * NEPTUNE_STORAGE.pricePerGBMonth;
  const ioCost = (ioRequestsPerMonth / 1000000) * NEPTUNE_STORAGE.ioRequestPrice;
  const backupCost = backupStorageGB * NEPTUNE_BACKUP_STORAGE;
  const monthlyCost = instanceCost + storageCost + ioCost + backupCost;

  return {
    service: 'Neptune',
    instanceCost,
    storageCost,
    ioCost,
    backupCost,
    monthlyCost,
    annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Instances', description: `${numberOfInstances}x ${instanceType}`, monthlyCost: instanceCost },
      { category: 'Storage', description: `${storageGB} GB`, monthlyCost: storageCost },
      { category: 'I/O', description: `${(ioRequestsPerMonth/1000000).toFixed(0)}M requests`, monthlyCost: ioCost },
      { category: 'Backup', description: `${backupStorageGB} GB`, monthlyCost: backupCost },
    ],
    configuration: { instanceType, numberOfInstances, storageGB, ioRequestsPerMonth, backupStorageGB },
  };
}

export const NEPTUNE_USE_CASE_TEMPLATES = [
  { name: 'Development', config: { instanceType: 'db.t4g.medium', numberOfInstances: 1, storageGB: 50, ioRequestsPerMonth: 10000000, backupStorageGB: 50 } },
  { name: 'Production', config: { instanceType: 'db.r6g.xlarge', numberOfInstances: 3, storageGB: 500, ioRequestsPerMonth: 200000000, backupStorageGB: 500 } },
];
