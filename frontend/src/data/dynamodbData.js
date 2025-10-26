// DynamoDB Pricing Data

// Capacity modes
export const DYNAMODB_CAPACITY_MODES = [
  { value: 'onDemand', label: 'On-Demand', description: 'Pay per request, auto-scaling' },
  { value: 'provisioned', label: 'Provisioned', description: 'Reserve capacity, predictable costs' },
];

// On-Demand pricing
export const DYNAMODB_ON_DEMAND = {
  writeRequestUnit: 1.25, // per million write request units
  readRequestUnit: 0.25, // per million read request units
};

// Provisioned capacity pricing (per hour)
export const DYNAMODB_PROVISIONED = {
  writeCapacityUnit: 0.00065, // per WCU per hour
  readCapacityUnit: 0.00013, // per RCU per hour
};

// Storage pricing
export const DYNAMODB_STORAGE = {
  standardStorage: 0.25, // per GB-month
  infrequentAccessStorage: 0.10, // per GB-month
};

// Backup pricing
export const DYNAMODB_BACKUP = {
  continuousBackup: 0.20, // per GB-month
  onDemandBackup: 0.10, // per GB
  restore: 0.15, // per GB
};

// Global tables pricing (replication)
export const DYNAMODB_GLOBAL_TABLES = {
  replicatedWriteRequestUnit: 1.875, // per million rWRUs
};

// Streams pricing
export const DYNAMODB_STREAMS = {
  readRequestUnit: 0.02, // per 100,000 read request units
};

// Main cost calculation function
export function calculateDynamoDBCost(config) {
  const {
    capacityMode = 'onDemand',
    // On-demand
    writeRequests = 10000000, // 10 million per month
    readRequests = 50000000, // 50 million per month
    // Provisioned
    provisionedWriteCapacity = 100,
    provisionedReadCapacity = 500,
    // Storage
    storageGB = 100,
    infrequentAccessStorageGB = 0,
    // Features
    continuousBackupEnabled = false,
    onDemandBackupsGB = 0,
    globalTablesEnabled = false,
    streamsEnabled = false,
    streamsReadRequests = 0,
  } = config;

  let capacityCost = 0;

  if (capacityMode === 'onDemand') {
    // On-demand pricing
    const writeCost = (writeRequests / 1000000) * DYNAMODB_ON_DEMAND.writeRequestUnit;
    const readCost = (readRequests / 1000000) * DYNAMODB_ON_DEMAND.readRequestUnit;
    capacityCost = writeCost + readCost;
  } else {
    // Provisioned pricing (730 hours per month)
    const writeCost = provisionedWriteCapacity * DYNAMODB_PROVISIONED.writeCapacityUnit * 730;
    const readCost = provisionedReadCapacity * DYNAMODB_PROVISIONED.readCapacityUnit * 730;
    capacityCost = writeCost + readCost;
  }

  // Storage costs
  const standardStorageCost = storageGB * DYNAMODB_STORAGE.standardStorage;
  const iaStorageCost = infrequentAccessStorageGB * DYNAMODB_STORAGE.infrequentAccessStorage;
  const storageCost = standardStorageCost + iaStorageCost;

  // Backup costs
  const continuousBackupCost = continuousBackupEnabled
    ? storageGB * DYNAMODB_BACKUP.continuousBackup
    : 0;
  const onDemandBackupCost = onDemandBackupsGB * DYNAMODB_BACKUP.onDemandBackup;
  const backupCost = continuousBackupCost + onDemandBackupCost;

  // Global tables cost
  const globalTablesCost = globalTablesEnabled
    ? (writeRequests / 1000000) * DYNAMODB_GLOBAL_TABLES.replicatedWriteRequestUnit
    : 0;

  // Streams cost
  const streamsCost = streamsEnabled
    ? (streamsReadRequests / 100000) * DYNAMODB_STREAMS.readRequestUnit
    : 0;

  const monthlyCost = capacityCost + storageCost + backupCost + globalTablesCost + streamsCost;

  return {
    service: 'DynamoDB',
    capacityMode,
    capacityCost,
    storageCost,
    backupCost,
    globalTablesCost,
    streamsCost,
    monthlyCost,
    annualCost: monthlyCost * 12,
    breakdown: [
      {
        category: capacityMode === 'onDemand' ? 'On-Demand Capacity' : 'Provisioned Capacity',
        description: capacityMode === 'onDemand'
          ? `${writeRequests.toLocaleString()} writes, ${readRequests.toLocaleString()} reads`
          : `${provisionedWriteCapacity} WCUs, ${provisionedReadCapacity} RCUs`,
        monthlyCost: capacityCost,
      },
      {
        category: 'Storage',
        description: `${storageGB} GB standard${infrequentAccessStorageGB > 0 ? `, ${infrequentAccessStorageGB} GB IA` : ''}`,
        monthlyCost: storageCost,
      },
      {
        category: 'Backups',
        description: continuousBackupEnabled ? 'Continuous backup enabled' : 'On-demand only',
        monthlyCost: backupCost,
      },
      {
        category: 'Global Tables',
        description: globalTablesEnabled ? 'Enabled' : 'Disabled',
        monthlyCost: globalTablesCost,
      },
      {
        category: 'Streams',
        description: streamsEnabled ? `${streamsReadRequests.toLocaleString()} reads` : 'Disabled',
        monthlyCost: streamsCost,
      },
    ],
    configuration: {
      capacityMode,
      writeRequests,
      readRequests,
      provisionedWriteCapacity,
      provisionedReadCapacity,
      storageGB,
      continuousBackupEnabled,
      globalTablesEnabled,
      streamsEnabled,
    },
  };
}

// Use case templates
export const DYNAMODB_USE_CASE_TEMPLATES = [
  {
    name: 'Small Application',
    description: 'Low-traffic application with on-demand pricing',
    config: {
      capacityMode: 'onDemand',
      writeRequests: 1000000,
      readRequests: 5000000,
      storageGB: 10,
      infrequentAccessStorageGB: 0,
      continuousBackupEnabled: false,
      onDemandBackupsGB: 10,
      globalTablesEnabled: false,
      streamsEnabled: false,
      streamsReadRequests: 0,
    },
  },
  {
    name: 'Production Application',
    description: 'High-traffic application with provisioned capacity',
    config: {
      capacityMode: 'provisioned',
      writeRequests: 0,
      readRequests: 0,
      provisionedWriteCapacity: 500,
      provisionedReadCapacity: 2000,
      storageGB: 500,
      infrequentAccessStorageGB: 0,
      continuousBackupEnabled: true,
      onDemandBackupsGB: 500,
      globalTablesEnabled: false,
      streamsEnabled: true,
      streamsReadRequests: 10000000,
    },
  },
  {
    name: 'Global Application',
    description: 'Multi-region application with global tables',
    config: {
      capacityMode: 'onDemand',
      writeRequests: 50000000,
      readRequests: 250000000,
      storageGB: 1000,
      infrequentAccessStorageGB: 500,
      continuousBackupEnabled: true,
      onDemandBackupsGB: 0,
      globalTablesEnabled: true,
      streamsEnabled: true,
      streamsReadRequests: 50000000,
    },
  },
];
