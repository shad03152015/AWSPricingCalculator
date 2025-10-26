/**
 * AWS Aurora Database Pricing Data
 * Aurora is AWS's cloud-native relational database built for the cloud
 * Prices are in USD and based on us-east-1 region
 */

// Aurora Compatibility Options
export const AURORA_COMPATIBILITY = [
  {
    value: 'mysql',
    label: 'Aurora MySQL',
    versions: ['8.0.mysql_aurora.3.x', '5.7.mysql_aurora.2.x'],
    description: 'MySQL 5.7 and 8.0 compatible',
    features: ['Up to 5x performance of MySQL', 'Storage auto-scaling', 'Read replicas'],
  },
  {
    value: 'postgresql',
    label: 'Aurora PostgreSQL',
    versions: ['16.x', '15.x', '14.x', '13.x'],
    description: 'PostgreSQL 13-16 compatible',
    features: ['Up to 3x performance of PostgreSQL', 'Storage auto-scaling', 'Read replicas'],
  },
];

// Aurora Configuration Types
export const AURORA_CONFIG_TYPES = [
  {
    value: 'serverless-v2',
    label: 'Aurora Serverless v2',
    description: 'Auto-scaling database with instant scaling',
    features: ['Scales to zero', 'Per-second billing', 'Automatic scaling'],
  },
  {
    value: 'provisioned',
    label: 'Aurora Provisioned',
    description: 'Predictable workloads with dedicated capacity',
    features: ['Fixed capacity', 'Read replicas', 'Global database support'],
  },
  {
    value: 'global-database',
    label: 'Aurora Global Database',
    description: 'Multi-region database for disaster recovery',
    features: ['Cross-region replication', '<1 second latency', 'Disaster recovery'],
  },
];

// Aurora Serverless v2 ACU Options
export const AURORA_SERVERLESS_ACU = {
  minACU: 0.5,
  maxACU: 128,
  pricePerACUPerHour: 0.12, // $0.12 per ACU-hour
  description: '1 ACU = 2 GiB RAM, CPU, and networking',
};

// Aurora Provisioned Instance Classes
export const AURORA_INSTANCE_CLASSES = [
  // R6g (Graviton2) - Memory Optimized
  { family: 'R6g', type: 'db.r6g.large', vcpu: 2, memory: 16, arch: 'ARM', pricePerHour: 0.26 },
  { family: 'R6g', type: 'db.r6g.xlarge', vcpu: 4, memory: 32, arch: 'ARM', pricePerHour: 0.52 },
  { family: 'R6g', type: 'db.r6g.2xlarge', vcpu: 8, memory: 64, arch: 'ARM', pricePerHour: 1.04 },
  { family: 'R6g', type: 'db.r6g.4xlarge', vcpu: 16, memory: 128, arch: 'ARM', pricePerHour: 2.08 },
  { family: 'R6g', type: 'db.r6g.8xlarge', vcpu: 32, memory: 256, arch: 'ARM', pricePerHour: 4.16 },
  { family: 'R6g', type: 'db.r6g.12xlarge', vcpu: 48, memory: 384, arch: 'ARM', pricePerHour: 6.24 },
  { family: 'R6g', type: 'db.r6g.16xlarge', vcpu: 64, memory: 512, arch: 'ARM', pricePerHour: 8.32 },

  // R5 - Memory Optimized (x86)
  { family: 'R5', type: 'db.r5.large', vcpu: 2, memory: 16, arch: 'x86', pricePerHour: 0.29 },
  { family: 'R5', type: 'db.r5.xlarge', vcpu: 4, memory: 32, arch: 'x86', pricePerHour: 0.58 },
  { family: 'R5', type: 'db.r5.2xlarge', vcpu: 8, memory: 64, arch: 'x86', pricePerHour: 1.16 },
  { family: 'R5', type: 'db.r5.4xlarge', vcpu: 16, memory: 128, arch: 'x86', pricePerHour: 2.32 },
  { family: 'R5', type: 'db.r5.8xlarge', vcpu: 32, memory: 256, arch: 'x86', pricePerHour: 4.64 },
  { family: 'R5', type: 'db.r5.12xlarge', vcpu: 48, memory: 384, arch: 'x86', pricePerHour: 6.96 },
  { family: 'R5', type: 'db.r5.16xlarge', vcpu: 64, memory: 512, arch: 'x86', pricePerHour: 9.28 },

  // R6i - Memory Optimized (Latest Intel)
  { family: 'R6i', type: 'db.r6i.large', vcpu: 2, memory: 16, arch: 'x86', pricePerHour: 0.29 },
  { family: 'R6i', type: 'db.r6i.xlarge', vcpu: 4, memory: 32, arch: 'x86', pricePerHour: 0.58 },
  { family: 'R6i', type: 'db.r6i.2xlarge', vcpu: 8, memory: 64, arch: 'x86', pricePerHour: 1.16 },
  { family: 'R6i', type: 'db.r6i.4xlarge', vcpu: 16, memory: 128, arch: 'x86', pricePerHour: 2.32 },
  { family: 'R6i', type: 'db.r6i.8xlarge', vcpu: 32, memory: 256, arch: 'x86', pricePerHour: 4.64 },
  { family: 'R6i', type: 'db.r6i.12xlarge', vcpu: 48, memory: 384, arch: 'x86', pricePerHour: 6.96 },
  { family: 'R6i', type: 'db.r6i.16xlarge', vcpu: 64, memory: 512, arch: 'x86', pricePerHour: 9.28 },

  // X2g - Memory Optimized (Extreme)
  { family: 'X2g', type: 'db.x2g.large', vcpu: 4, memory: 32, arch: 'ARM', pricePerHour: 0.334 },
  { family: 'X2g', type: 'db.x2g.xlarge', vcpu: 8, memory: 64, arch: 'ARM', pricePerHour: 0.668 },
  { family: 'X2g', type: 'db.x2g.2xlarge', vcpu: 16, memory: 128, arch: 'ARM', pricePerHour: 1.336 },
  { family: 'X2g', type: 'db.x2g.4xlarge', vcpu: 32, memory: 256, arch: 'ARM', pricePerHour: 2.672 },
];

// Aurora Storage Pricing
export const AURORA_STORAGE = {
  standard: {
    label: 'Aurora Standard',
    pricePerGBMonth: 0.10,
    description: 'Default storage with I/O charges',
    ioRequestPrice: 0.20 / 1000000, // per million I/O requests
  },
  ioOptimized: {
    label: 'Aurora I/O-Optimized',
    pricePerGBMonth: 0.25,
    description: 'No I/O charges, 40% savings for I/O-intensive workloads',
    ioRequestPrice: 0, // No I/O charges
  },
};

// Aurora Backup Storage
export const AURORA_BACKUP_STORAGE = {
  pricePerGBMonth: 0.021, // $0.021/GB-month (cheaper than RDS)
  description: 'Automated backups and snapshots',
};

// Aurora Backtrack
export const AURORA_BACKTRACK = {
  pricePerChangeRecordMillion: 0.012, // per million change records
  description: 'Rewind database to a point in time',
};

// Aurora Global Database Pricing
export const AURORA_GLOBAL_DATABASE = {
  replicationDataTransfer: 0.02, // per GB replicated
  description: 'Cross-region replication for disaster recovery',
};

// Regional Pricing Multipliers
export const AURORA_REGIONAL_MULTIPLIERS = {
  'us-east-1': { name: 'US East (N. Virginia)', multiplier: 1.0 },
  'us-east-2': { name: 'US East (Ohio)', multiplier: 1.0 },
  'us-west-1': { name: 'US West (N. California)', multiplier: 1.1 },
  'us-west-2': { name: 'US West (Oregon)', multiplier: 1.0 },
  'ca-central-1': { name: 'Canada (Central)', multiplier: 1.05 },
  'eu-west-1': { name: 'EU (Ireland)', multiplier: 1.05 },
  'eu-west-2': { name: 'EU (London)', multiplier: 1.08 },
  'eu-west-3': { name: 'EU (Paris)', multiplier: 1.08 },
  'eu-central-1': { name: 'EU (Frankfurt)', multiplier: 1.1 },
  'eu-north-1': { name: 'EU (Stockholm)', multiplier: 1.0 },
  'ap-southeast-1': { name: 'Asia Pacific (Singapore)', multiplier: 1.1 },
  'ap-southeast-2': { name: 'Asia Pacific (Sydney)', multiplier: 1.15 },
  'ap-northeast-1': { name: 'Asia Pacific (Tokyo)', multiplier: 1.12 },
  'ap-northeast-2': { name: 'Asia Pacific (Seoul)', multiplier: 1.1 },
  'ap-south-1': { name: 'Asia Pacific (Mumbai)', multiplier: 1.08 },
  'sa-east-1': { name: 'South America (São Paulo)', multiplier: 1.25 },
};

/**
 * Calculate Aurora total monthly cost
 */
export function calculateAuroraCost(config) {
  const {
    region = 'us-east-1',
    compatibility = 'mysql',
    configType = 'serverless-v2',

    // Serverless v2 Config
    serverlessMinACU = 0.5,
    serverlessMaxACU = 2,
    serverlessAvgACU = 1,

    // Provisioned Config
    provisionedInstanceType = 'db.r6g.large',
    provisionedInstanceCount = 1,
    readReplicaCount = 0,

    // Global Database Config
    globalPrimaryRegion = 'us-east-1',
    globalSecondaryRegions = 0,
    globalReplicationGB = 0, // GB/month

    // Storage Config
    storageGB = 10,
    storageType = 'standard', // 'standard' or 'ioOptimized'
    ioRequestsPerMonth = 0, // millions

    // Backup Config
    backupStorageGB = 0,
    enableBacktrack = false,
    backtrackChangeRecords = 0, // millions

  } = config;

  const regionalMultiplier = AURORA_REGIONAL_MULTIPLIERS[region]?.multiplier || 1.0;

  let computeCost = 0;
  let storageCost = 0;
  let ioCost = 0;
  let backupCost = 0;
  let backtrackCost = 0;
  let globalReplicationCost = 0;
  let breakdown = [];

  // Calculate compute cost based on config type
  if (configType === 'serverless-v2') {
    // Serverless v2 pricing
    const avgACUHours = serverlessAvgACU * 730; // hours per month
    computeCost = avgACUHours * AURORA_SERVERLESS_ACU.pricePerACUPerHour * regionalMultiplier;

    breakdown.push({
      category: 'Compute - Serverless v2',
      description: `${serverlessAvgACU} avg ACU (${serverlessMinACU}-${serverlessMaxACU} ACU range)`,
      monthlyCost: computeCost,
    });

  } else if (configType === 'provisioned') {
    // Provisioned instances
    const instance = AURORA_INSTANCE_CLASSES.find(i => i.type === provisionedInstanceType);
    if (instance) {
      const writerCost = instance.pricePerHour * 730 * provisionedInstanceCount * regionalMultiplier;
      const readerCost = instance.pricePerHour * 730 * readReplicaCount * regionalMultiplier;
      computeCost = writerCost + readerCost;

      breakdown.push({
        category: 'Compute - Writer Instance(s)',
        description: `${provisionedInstanceCount}x ${instance.type} (${instance.vcpu} vCPU, ${instance.memory}GB)`,
        monthlyCost: writerCost,
      });

      if (readReplicaCount > 0) {
        breakdown.push({
          category: 'Compute - Read Replicas',
          description: `${readReplicaCount}x ${instance.type} replicas`,
          monthlyCost: readerCost,
        });
      }
    }

  } else if (configType === 'global-database') {
    // Global Database: Primary + Secondary regions
    const instance = AURORA_INSTANCE_CLASSES.find(i => i.type === provisionedInstanceType);
    if (instance) {
      // Primary region cost
      const primaryMultiplier = AURORA_REGIONAL_MULTIPLIERS[globalPrimaryRegion]?.multiplier || 1.0;
      const primaryCost = instance.pricePerHour * 730 * provisionedInstanceCount * primaryMultiplier;

      // Secondary regions cost (assuming same instance type)
      const secondaryCost = instance.pricePerHour * 730 * provisionedInstanceCount * globalSecondaryRegions * regionalMultiplier;

      computeCost = primaryCost + secondaryCost;

      breakdown.push({
        category: 'Compute - Primary Region',
        description: `${provisionedInstanceCount}x ${instance.type} in ${AURORA_REGIONAL_MULTIPLIERS[globalPrimaryRegion]?.name}`,
        monthlyCost: primaryCost,
      });

      if (globalSecondaryRegions > 0) {
        breakdown.push({
          category: 'Compute - Secondary Region(s)',
          description: `${globalSecondaryRegions}x secondary region(s) with ${provisionedInstanceCount} instance(s) each`,
          monthlyCost: secondaryCost,
        });
      }

      // Global replication cost
      globalReplicationCost = globalReplicationGB * AURORA_GLOBAL_DATABASE.replicationDataTransfer;

      if (globalReplicationCost > 0) {
        breakdown.push({
          category: 'Global Replication',
          description: `${globalReplicationGB}GB cross-region data transfer`,
          monthlyCost: globalReplicationCost,
        });
      }
    }
  }

  // Calculate storage cost
  const storageConfig = AURORA_STORAGE[storageType];
  storageCost = storageGB * storageConfig.pricePerGBMonth * regionalMultiplier;

  // Calculate I/O cost (only for standard storage)
  if (storageType === 'standard' && ioRequestsPerMonth > 0) {
    ioCost = (ioRequestsPerMonth * 1000000) * storageConfig.ioRequestPrice * regionalMultiplier;
  }

  breakdown.push({
    category: `Storage - ${storageConfig.label}`,
    description: `${storageGB}GB ${storageConfig.description}`,
    monthlyCost: storageCost,
  });

  if (ioCost > 0) {
    breakdown.push({
      category: 'I/O Requests',
      description: `${ioRequestsPerMonth}M I/O requests`,
      monthlyCost: ioCost,
    });
  }

  // Backup storage cost
  if (backupStorageGB > 0) {
    backupCost = backupStorageGB * AURORA_BACKUP_STORAGE.pricePerGBMonth * regionalMultiplier;
    breakdown.push({
      category: 'Backup Storage',
      description: `${backupStorageGB}GB backup storage`,
      monthlyCost: backupCost,
    });
  }

  // Backtrack cost
  if (enableBacktrack && backtrackChangeRecords > 0) {
    backtrackCost = backtrackChangeRecords * AURORA_BACKTRACK.pricePerChangeRecordMillion * regionalMultiplier;
    breakdown.push({
      category: 'Backtrack',
      description: `${backtrackChangeRecords}M change records`,
      monthlyCost: backtrackCost,
    });
  }

  const totalMonthlyCost = computeCost + storageCost + ioCost + backupCost + backtrackCost + globalReplicationCost;

  return {
    service: 'Aurora',
    compatibility,
    configType,
    region,
    regionalMultiplier,
    computeCost,
    storageCost,
    ioCost,
    backupCost,
    backtrackCost,
    globalReplicationCost,
    monthlyCost: totalMonthlyCost,
    annualCost: totalMonthlyCost * 12,
    breakdown,
    configuration: {
      configType,
      compatibility: AURORA_COMPATIBILITY.find(c => c.value === compatibility)?.label,
      region: AURORA_REGIONAL_MULTIPLIERS[region]?.name || region,
    },
  };
}

// Use Case Templates
export const AURORA_USE_CASE_TEMPLATES = [
  {
    name: 'Development/Testing',
    description: 'Small serverless database for dev/test',
    config: {
      compatibility: 'mysql',
      configType: 'serverless-v2',
      serverlessMinACU: 0.5,
      serverlessMaxACU: 1,
      serverlessAvgACU: 0.5,
      storageGB: 10,
      storageType: 'standard',
      ioRequestsPerMonth: 1,
    },
  },
  {
    name: 'Production - Variable Load',
    description: 'Serverless v2 for unpredictable workloads',
    config: {
      compatibility: 'postgresql',
      configType: 'serverless-v2',
      serverlessMinACU: 1,
      serverlessMaxACU: 16,
      serverlessAvgACU: 4,
      storageGB: 100,
      storageType: 'standard',
      ioRequestsPerMonth: 50,
      backupStorageGB: 50,
    },
  },
  {
    name: 'Production - High Performance',
    description: 'Provisioned instances with read replicas',
    config: {
      compatibility: 'mysql',
      configType: 'provisioned',
      provisionedInstanceType: 'db.r6g.xlarge',
      provisionedInstanceCount: 1,
      readReplicaCount: 2,
      storageGB: 500,
      storageType: 'ioOptimized',
      backupStorageGB: 250,
    },
  },
  {
    name: 'Global Application',
    description: 'Multi-region for disaster recovery',
    config: {
      compatibility: 'postgresql',
      configType: 'global-database',
      globalPrimaryRegion: 'us-east-1',
      globalSecondaryRegions: 2,
      provisionedInstanceType: 'db.r6g.2xlarge',
      provisionedInstanceCount: 2,
      storageGB: 1000,
      storageType: 'ioOptimized',
      globalReplicationGB: 500,
      backupStorageGB: 500,
    },
  },
];
