// RDS Database Engines
export const RDS_DATABASE_ENGINES = [
  {
    value: 'mysql',
    label: 'MySQL',
    versions: ['8.0', '5.7'],
    description: 'Popular open-source relational database',
    licenseCost: 0, // Open source
  },
  {
    value: 'postgres',
    label: 'PostgreSQL',
    versions: ['16', '15', '14', '13'],
    description: 'Advanced open-source relational database',
    licenseCost: 0, // Open source
  },
  {
    value: 'mariadb',
    label: 'MariaDB',
    versions: ['10.11', '10.6'],
    description: 'MySQL-compatible open-source database',
    licenseCost: 0, // Open source
  },
  {
    value: 'aurora-mysql',
    label: 'Amazon Aurora MySQL',
    versions: ['8.0', '5.7'],
    description: 'MySQL-compatible enterprise database built for the cloud',
    licenseCost: 0,
    isAurora: true,
  },
  {
    value: 'aurora-postgresql',
    label: 'Amazon Aurora PostgreSQL',
    versions: ['16', '15', '14'],
    description: 'PostgreSQL-compatible enterprise database built for the cloud',
    licenseCost: 0,
    isAurora: true,
  },
  {
    value: 'sqlserver-ex',
    label: 'SQL Server Express',
    versions: ['2022', '2019'],
    description: 'Free entry-level database (10 GB storage limit)',
    licenseCost: 0, // Express is free
  },
  {
    value: 'sqlserver-web',
    label: 'SQL Server Web',
    versions: ['2022', '2019'],
    description: 'Low TCO for web applications',
    licenseCost: 0.08, // License included per hour
  },
  {
    value: 'sqlserver-se',
    label: 'SQL Server Standard',
    versions: ['2022', '2019'],
    description: 'Core database capabilities',
    licenseCost: 0.24, // License included per hour (approximate)
  },
  {
    value: 'sqlserver-ee',
    label: 'SQL Server Enterprise',
    versions: ['2022', '2019'],
    description: 'Premium database with advanced features',
    licenseCost: 1.0, // License included per hour (approximate)
  },
  {
    value: 'oracle-se2',
    label: 'Oracle Standard Edition Two',
    versions: ['19c', '21c'],
    description: 'Standard database features',
    licenseCost: 0.35, // License included per hour (approximate)
  },
  {
    value: 'oracle-ee',
    label: 'Oracle Enterprise Edition',
    versions: ['19c', '21c'],
    description: 'Enterprise-grade database',
    licenseCost: 1.4, // License included per hour (approximate)
  },
];

// RDS Instance Classes (similar to EC2 but DB-optimized)
export const RDS_INSTANCE_CLASSES = {
  'General Purpose (Latest Generation)': [
    { type: 'db.t3.micro', vcpu: 2, memory: 1, networkPerf: 'Low to Moderate', hourlyPrice: 0.017 },
    { type: 'db.t3.small', vcpu: 2, memory: 2, networkPerf: 'Low to Moderate', hourlyPrice: 0.034 },
    { type: 'db.t3.medium', vcpu: 2, memory: 4, networkPerf: 'Low to Moderate', hourlyPrice: 0.068 },
    { type: 'db.t3.large', vcpu: 2, memory: 8, networkPerf: 'Moderate', hourlyPrice: 0.136 },
    { type: 'db.t3.xlarge', vcpu: 4, memory: 16, networkPerf: 'Moderate', hourlyPrice: 0.272 },
    { type: 'db.t3.2xlarge', vcpu: 8, memory: 32, networkPerf: 'Moderate', hourlyPrice: 0.544 },
    { type: 'db.m5.large', vcpu: 2, memory: 8, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.096 },
    { type: 'db.m5.xlarge', vcpu: 4, memory: 16, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.192 },
    { type: 'db.m5.2xlarge', vcpu: 8, memory: 32, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.384 },
    { type: 'db.m5.4xlarge', vcpu: 16, memory: 64, networkPerf: '10 Gbps', hourlyPrice: 0.768 },
    { type: 'db.m6i.large', vcpu: 2, memory: 8, networkPerf: 'Up to 12.5 Gbps', hourlyPrice: 0.096 },
    { type: 'db.m6i.xlarge', vcpu: 4, memory: 16, networkPerf: 'Up to 12.5 Gbps', hourlyPrice: 0.192 },
    { type: 'db.m6i.2xlarge', vcpu: 8, memory: 32, networkPerf: 'Up to 12.5 Gbps', hourlyPrice: 0.384 },
    { type: 'db.m6i.4xlarge', vcpu: 16, memory: 64, networkPerf: '12.5 Gbps', hourlyPrice: 0.768 },
  ],
  'Memory Optimized (Latest Generation)': [
    { type: 'db.r5.large', vcpu: 2, memory: 16, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.126 },
    { type: 'db.r5.xlarge', vcpu: 4, memory: 32, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.252 },
    { type: 'db.r5.2xlarge', vcpu: 8, memory: 64, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.504 },
    { type: 'db.r5.4xlarge', vcpu: 16, memory: 128, networkPerf: '10 Gbps', hourlyPrice: 1.008 },
    { type: 'db.r6i.large', vcpu: 2, memory: 16, networkPerf: 'Up to 12.5 Gbps', hourlyPrice: 0.126 },
    { type: 'db.r6i.xlarge', vcpu: 4, memory: 32, networkPerf: 'Up to 12.5 Gbps', hourlyPrice: 0.252 },
    { type: 'db.r6i.2xlarge', vcpu: 8, memory: 64, networkPerf: 'Up to 12.5 Gbps', hourlyPrice: 0.504 },
    { type: 'db.r6i.4xlarge', vcpu: 16, memory: 128, networkPerf: '12.5 Gbps', hourlyPrice: 1.008 },
    { type: 'db.x2g.large', vcpu: 4, memory: 32, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.334 },
    { type: 'db.x2g.xlarge', vcpu: 8, memory: 64, networkPerf: 'Up to 15 Gbps', hourlyPrice: 0.668 },
  ],
  'Burstable Performance': [
    { type: 'db.t4g.micro', vcpu: 2, memory: 1, networkPerf: 'Up to 5 Gbps', hourlyPrice: 0.016, arch: 'ARM' },
    { type: 'db.t4g.small', vcpu: 2, memory: 2, networkPerf: 'Up to 5 Gbps', hourlyPrice: 0.032, arch: 'ARM' },
    { type: 'db.t4g.medium', vcpu: 2, memory: 4, networkPerf: 'Up to 5 Gbps', hourlyPrice: 0.064, arch: 'ARM' },
    { type: 'db.t4g.large', vcpu: 2, memory: 8, networkPerf: 'Up to 5 Gbps', hourlyPrice: 0.128, arch: 'ARM' },
  ],
};

// Aurora-specific instance classes
export const AURORA_INSTANCE_CLASSES = {
  'Aurora Serverless v2': [
    {
      type: 'Aurora Serverless v2',
      description: 'Auto-scaling database',
      minACU: 0.5,
      maxACU: 128,
      pricePerACU: 0.12, // per hour per ACU
    },
  ],
  'Aurora Provisioned': [
    { type: 'db.r5.large', vcpu: 2, memory: 16, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.29 },
    { type: 'db.r5.xlarge', vcpu: 4, memory: 32, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.58 },
    { type: 'db.r5.2xlarge', vcpu: 8, memory: 64, networkPerf: 'Up to 10 Gbps', hourlyPrice: 1.16 },
    { type: 'db.r5.4xlarge', vcpu: 16, memory: 128, networkPerf: '10 Gbps', hourlyPrice: 2.32 },
    { type: 'db.r6g.large', vcpu: 2, memory: 16, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.26, arch: 'ARM' },
    { type: 'db.r6g.xlarge', vcpu: 4, memory: 32, networkPerf: 'Up to 10 Gbps', hourlyPrice: 0.52, arch: 'ARM' },
    { type: 'db.r6g.2xlarge', vcpu: 8, memory: 64, networkPerf: 'Up to 10 Gbps', hourlyPrice: 1.04, arch: 'ARM' },
  ],
};

// Deployment Options
export const RDS_DEPLOYMENT_OPTIONS = [
  {
    value: 'single-az',
    label: 'Single-AZ',
    description: 'Database in a single availability zone',
    multiplier: 1.0,
  },
  {
    value: 'multi-az',
    label: 'Multi-AZ',
    description: 'Standby replica in another AZ for high availability',
    multiplier: 2.0,
  },
  {
    value: 'multi-az-cluster',
    label: 'Multi-AZ DB Cluster',
    description: 'Two readable standbys in different AZs',
    multiplier: 3.0,
  },
];

// Storage Types
export const RDS_STORAGE_TYPES = [
  {
    value: 'gp3',
    label: 'General Purpose SSD (gp3)',
    description: 'Cost-effective storage, 3000 IOPS baseline',
    pricePerGB: 0.115,
    baselineIOPS: 3000,
    maxIOPS: 16000,
    additionalIOPSPrice: 0.02, // per IOPS/month over 3000
  },
  {
    value: 'gp2',
    label: 'General Purpose SSD (gp2)',
    description: 'Previous generation, IOPS scale with size',
    pricePerGB: 0.115,
    iopsPerGB: 3, // 3 IOPS per GB
  },
  {
    value: 'io1',
    label: 'Provisioned IOPS (io1)',
    description: 'High-performance storage for I/O intensive workloads',
    pricePerGB: 0.125,
    pricePerIOPS: 0.10, // per month
    minIOPS: 1000,
    maxIOPS: 64000,
  },
  {
    value: 'magnetic',
    label: 'Magnetic (Standard)',
    description: 'Previous generation, not recommended',
    pricePerGB: 0.10,
    pricePerIORequest: 0.10 / 1000000, // per million I/O requests
  },
];

// Aurora Storage (different from RDS)
export const AURORA_STORAGE = {
  pricePerGB: 0.10, // per GB-month
  pricePerIORequest: 0.20 / 1000000, // per million I/O requests
  description: 'Aurora storage automatically scales',
  minStorage: 10, // GB
  maxStorage: 128000, // 128 TB
};

// Backup Storage
export const BACKUP_STORAGE = {
  pricePerGB: 0.095, // per GB-month beyond free tier
  freeTier: 'Equal to provisioned storage', // Free backup storage
};

// Snapshot Export to S3
export const SNAPSHOT_EXPORT = {
  pricePerGB: 0.01, // per GB exported
};

// AWS Regions for RDS
export const RDS_REGIONS = [
  { code: 'us-east-1', name: 'US East (N. Virginia)', priceMultiplier: 1.0 },
  { code: 'us-east-2', name: 'US East (Ohio)', priceMultiplier: 1.0 },
  { code: 'us-west-1', name: 'US West (N. California)', priceMultiplier: 1.10 },
  { code: 'us-west-2', name: 'US West (Oregon)', priceMultiplier: 1.0 },
  { code: 'ca-central-1', name: 'Canada (Central)', priceMultiplier: 1.05 },
  { code: 'eu-west-1', name: 'EU (Ireland)', priceMultiplier: 1.05 },
  { code: 'eu-west-2', name: 'EU (London)', priceMultiplier: 1.08 },
  { code: 'eu-west-3', name: 'EU (Paris)', priceMultiplier: 1.08 },
  { code: 'eu-central-1', name: 'EU (Frankfurt)', priceMultiplier: 1.10 },
  { code: 'eu-north-1', name: 'EU (Stockholm)', priceMultiplier: 1.00 },
  { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)', priceMultiplier: 1.08 },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', priceMultiplier: 1.12 },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)', priceMultiplier: 1.10 },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', priceMultiplier: 1.10 },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', priceMultiplier: 1.12 },
  { code: 'sa-east-1', name: 'South America (São Paulo)', priceMultiplier: 1.25 },
];

// Helper function to get all RDS instance types
export function getAllRDSInstanceTypes() {
  const allTypes = [];
  Object.entries(RDS_INSTANCE_CLASSES).forEach(([family, instances]) => {
    instances.forEach((instance) => {
      allTypes.push({
        ...instance,
        family,
        label: `${instance.type} (${instance.vcpu} vCPU, ${instance.memory} GB RAM)`,
      });
    });
  });
  return allTypes;
}

// Helper function to get Aurora instance types
export function getAuroraInstanceTypes() {
  const allTypes = [];
  Object.entries(AURORA_INSTANCE_CLASSES).forEach(([family, instances]) => {
    instances.forEach((instance) => {
      allTypes.push({
        ...instance,
        family,
        label: instance.type === 'Aurora Serverless v2'
          ? instance.type
          : `${instance.type} (${instance.vcpu} vCPU, ${instance.memory} GB RAM)`,
      });
    });
  });
  return allTypes;
}

// Helper function to calculate RDS cost
export function calculateRDSCost(config) {
  const {
    region = 'us-east-1',
    engine = 'mysql',
    instanceType = null,
    deploymentOption = 'single-az',
    storageType = 'gp3',
    storageAmount = 100, // GB
    provisionedIOPS = 0,
    backupStorageAmount = 0, // GB beyond free tier
    isAuroraServerless = false,
    auroraACU = 2, // Average ACU for serverless
    auroraIORequests = 0, // per month
  } = config;

  // Find region multiplier
  const regionDetails = RDS_REGIONS.find((r) => r.code === region);
  const regionMultiplier = regionDetails?.priceMultiplier || 1.0;

  // Find database engine
  const engineDetails = RDS_DATABASE_ENGINES.find((e) => e.value === engine);
  const isAurora = engineDetails?.isAurora || false;

  let instanceCost = 0;
  let storageCost = 0;

  if (isAurora) {
    if (isAuroraServerless) {
      // Aurora Serverless v2 pricing
      instanceCost = auroraACU * AURORA_INSTANCE_CLASSES['Aurora Serverless v2'][0].pricePerACU * 730 * regionMultiplier;
    } else {
      // Aurora Provisioned
      const auroraInstances = getAuroraInstanceTypes();
      const instance = auroraInstances.find((i) => i.type === instanceType);
      if (instance && instance.hourlyPrice) {
        instanceCost = instance.hourlyPrice * 730 * regionMultiplier;
      }
    }

    // Aurora storage
    storageCost = storageAmount * AURORA_STORAGE.pricePerGB * regionMultiplier;

    // Aurora I/O costs
    const ioCost = (auroraIORequests / 1000000) * AURORA_STORAGE.pricePerIORequest;
    storageCost += ioCost;
  } else {
    // Standard RDS
    const allInstances = getAllRDSInstanceTypes();
    const instance = allInstances.find((i) => i.type === instanceType);

    if (instance) {
      let baseInstanceCost = instance.hourlyPrice * 730 * regionMultiplier;

      // Add license cost for commercial databases
      if (engineDetails?.licenseCost > 0) {
        baseInstanceCost += engineDetails.licenseCost * 730 * regionMultiplier;
      }

      instanceCost = baseInstanceCost;
    }

    // Storage cost
    const storage = RDS_STORAGE_TYPES.find((s) => s.value === storageType);
    if (storage) {
      storageCost = storageAmount * storage.pricePerGB * regionMultiplier;

      // Add provisioned IOPS cost if applicable
      if (storageType === 'io1' && provisionedIOPS > 0) {
        storageCost += provisionedIOPS * storage.pricePerIOPS * regionMultiplier;
      } else if (storageType === 'gp3' && provisionedIOPS > storage.baselineIOPS) {
        const additionalIOPS = provisionedIOPS - storage.baselineIOPS;
        storageCost += additionalIOPS * storage.additionalIOPSPrice * regionMultiplier;
      }
    }
  }

  // Apply deployment option multiplier
  const deployment = RDS_DEPLOYMENT_OPTIONS.find((d) => d.value === deploymentOption);
  const deploymentMultiplier = deployment?.multiplier || 1.0;
  instanceCost *= deploymentMultiplier;

  // Backup storage cost (beyond free tier)
  const backupCost = backupStorageAmount * BACKUP_STORAGE.pricePerGB * regionMultiplier;

  const monthlyCost = instanceCost + storageCost + backupCost;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      instanceCost: Math.round(instanceCost * 100) / 100,
      storageCost: Math.round(storageCost * 100) / 100,
      backupCost: Math.round(backupCost * 100) / 100,
    },
  };
}

// Helper function to get database engine details
export function getDatabaseEngineDetails(engine) {
  return RDS_DATABASE_ENGINES.find((e) => e.value === engine);
}

// Helper function to get storage type details
export function getStorageTypeDetails(storageType) {
  return RDS_STORAGE_TYPES.find((s) => s.value === storageType);
}
