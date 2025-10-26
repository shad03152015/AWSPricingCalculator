// ECS Launch Types
export const ECS_LAUNCH_TYPES = [
  {
    value: 'fargate',
    label: 'AWS Fargate',
    description: 'Serverless compute for containers - pay only for resources used',
    icon: '🚀',
  },
  {
    value: 'ec2',
    label: 'Amazon EC2',
    description: 'Run containers on self-managed EC2 instances',
    icon: '🖥️',
  },
];

// Fargate CPU Options (vCPU)
export const FARGATE_CPU_OPTIONS = [
  { value: 0.25, label: '0.25 vCPU (256 CPU units)', pricePerHour: 0.04048 },
  { value: 0.5, label: '0.5 vCPU (512 CPU units)', pricePerHour: 0.04048 },
  { value: 1, label: '1 vCPU (1024 CPU units)', pricePerHour: 0.04048 },
  { value: 2, label: '2 vCPU (2048 CPU units)', pricePerHour: 0.08096 },
  { value: 4, label: '4 vCPU (4096 CPU units)', pricePerHour: 0.16192 },
  { value: 8, label: '8 vCPU (8192 CPU units)', pricePerHour: 0.32384 },
  { value: 16, label: '16 vCPU (16384 CPU units)', pricePerHour: 0.64768 },
];

// Fargate Memory Options by CPU (in GB)
export const FARGATE_MEMORY_OPTIONS = {
  0.25: [
    { value: 0.5, label: '0.5 GB', pricePerHour: 0.004445 },
    { value: 1, label: '1 GB', pricePerHour: 0.004445 },
    { value: 2, label: '2 GB', pricePerHour: 0.004445 },
  ],
  0.5: [
    { value: 1, label: '1 GB', pricePerHour: 0.004445 },
    { value: 2, label: '2 GB', pricePerHour: 0.004445 },
    { value: 3, label: '3 GB', pricePerHour: 0.004445 },
    { value: 4, label: '4 GB', pricePerHour: 0.004445 },
  ],
  1: [
    { value: 2, label: '2 GB', pricePerHour: 0.004445 },
    { value: 3, label: '3 GB', pricePerHour: 0.004445 },
    { value: 4, label: '4 GB', pricePerHour: 0.004445 },
    { value: 5, label: '5 GB', pricePerHour: 0.004445 },
    { value: 6, label: '6 GB', pricePerHour: 0.004445 },
    { value: 7, label: '7 GB', pricePerHour: 0.004445 },
    { value: 8, label: '8 GB', pricePerHour: 0.004445 },
  ],
  2: [
    { value: 4, label: '4 GB', pricePerHour: 0.004445 },
    { value: 8, label: '8 GB', pricePerHour: 0.004445 },
    { value: 12, label: '12 GB', pricePerHour: 0.004445 },
    { value: 16, label: '16 GB', pricePerHour: 0.004445 },
  ],
  4: [
    { value: 8, label: '8 GB', pricePerHour: 0.004445 },
    { value: 16, label: '16 GB', pricePerHour: 0.004445 },
    { value: 24, label: '24 GB', pricePerHour: 0.004445 },
    { value: 30, label: '30 GB', pricePerHour: 0.004445 },
  ],
  8: [
    { value: 16, label: '16 GB', pricePerHour: 0.004445 },
    { value: 32, label: '32 GB', pricePerHour: 0.004445 },
    { value: 48, label: '48 GB', pricePerHour: 0.004445 },
    { value: 60, label: '60 GB', pricePerHour: 0.004445 },
  ],
  16: [
    { value: 32, label: '32 GB', pricePerHour: 0.004445 },
    { value: 64, label: '64 GB', pricePerHour: 0.004445 },
    { value: 96, label: '96 GB', pricePerHour: 0.004445 },
    { value: 120, label: '120 GB', pricePerHour: 0.004445 },
  ],
};

// Fargate Spot Pricing (70% discount)
export const FARGATE_SPOT_DISCOUNT = 0.7; // 70% savings

// Fargate Ephemeral Storage (default is 20 GB free)
export const FARGATE_STORAGE = {
  freeStorage: 20, // GB
  additionalStoragePrice: 0.000111, // per GB per hour (beyond 20 GB)
  maxStorage: 200, // GB
};

// ECS Container Insights (monitoring)
export const CONTAINER_INSIGHTS = {
  pricePerTask: 0.00, // First 10 metrics per container per month are free
  pricePerMetric: 0.30, // per custom metric per month
  pricePerLog: 0.50, // per GB ingested
};

// Operating System Options
export const ECS_OS_OPTIONS = [
  { value: 'linux', label: 'Linux', multiplier: 1.0 },
  { value: 'windows', label: 'Windows', multiplier: 2.0 }, // Windows Fargate is more expensive
];

// Architecture Options
export const ECS_ARCHITECTURE = [
  { value: 'x86_64', label: 'x86_64 (Intel/AMD)', multiplier: 1.0 },
  { value: 'arm64', label: 'ARM64 (Graviton2)', multiplier: 0.8 }, // 20% cheaper
];

// AWS Regions for ECS
export const ECS_REGIONS = [
  { code: 'us-east-1', name: 'US East (N. Virginia)', priceMultiplier: 1.0 },
  { code: 'us-east-2', name: 'US East (Ohio)', priceMultiplier: 1.0 },
  { code: 'us-west-1', name: 'US West (N. California)', priceMultiplier: 1.08 },
  { code: 'us-west-2', name: 'US West (Oregon)', priceMultiplier: 1.0 },
  { code: 'ca-central-1', name: 'Canada (Central)', priceMultiplier: 1.03 },
  { code: 'eu-west-1', name: 'EU (Ireland)', priceMultiplier: 1.08 },
  { code: 'eu-west-2', name: 'EU (London)', priceMultiplier: 1.10 },
  { code: 'eu-west-3', name: 'EU (Paris)', priceMultiplier: 1.10 },
  { code: 'eu-central-1', name: 'EU (Frankfurt)', priceMultiplier: 1.11 },
  { code: 'eu-north-1', name: 'EU (Stockholm)', priceMultiplier: 1.02 },
  { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)', priceMultiplier: 1.08 },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', priceMultiplier: 1.13 },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)', priceMultiplier: 1.11 },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', priceMultiplier: 1.11 },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', priceMultiplier: 1.13 },
  { code: 'sa-east-1', name: 'South America (São Paulo)', priceMultiplier: 1.28 },
];

// ECS Task Placement Strategies
export const TASK_PLACEMENT_STRATEGIES = [
  {
    value: 'spread',
    label: 'Spread',
    description: 'Place tasks evenly across availability zones',
  },
  {
    value: 'binpack',
    label: 'Binpack',
    description: 'Place tasks based on least available CPU or memory',
  },
  {
    value: 'random',
    label: 'Random',
    description: 'Place tasks randomly',
  },
];

// Data Transfer Pricing (similar to other AWS services)
export const ECS_DATA_TRANSFER = {
  outToInternet: {
    first1GB: 0.0, // Free
    first10TB: 0.09,
    next40TB: 0.085,
    next100TB: 0.07,
    over150TB: 0.05,
  },
  betweenAZs: 0.01, // per GB
  betweenRegions: 0.02, // per GB
  inbound: 0.0, // Free
};

// Helper function to get available memory options for a given CPU
export function getMemoryOptionsForCPU(cpu) {
  return FARGATE_MEMORY_OPTIONS[cpu] || [];
}

// Helper function to calculate Fargate cost
export function calculateFargateCost(config) {
  const {
    region = 'us-east-1',
    cpu = 1,
    memory = 2,
    numberOfTasks = 1,
    hoursPerMonth = 730,
    operatingSystem = 'linux',
    architecture = 'x86_64',
    useFargateSpot = false,
    ephemeralStorage = 20, // GB
    dataTransferOut = 0, // GB
  } = config;

  // Find region multiplier
  const regionDetails = ECS_REGIONS.find((r) => r.code === region);
  const regionMultiplier = regionDetails?.priceMultiplier || 1.0;

  // Find CPU pricing
  const cpuOption = FARGATE_CPU_OPTIONS.find((c) => c.value === cpu);
  if (!cpuOption) {
    return { monthlyCost: 0, breakdown: {} };
  }

  // Find memory pricing
  const memoryOptions = getMemoryOptionsForCPU(cpu);
  const memoryOption = memoryOptions.find((m) => m.value === memory);
  if (!memoryOption) {
    return { monthlyCost: 0, breakdown: {} };
  }

  // Calculate base compute cost
  let cpuCost = cpuOption.pricePerHour * cpu;
  let memoryCost = memoryOption.pricePerHour * memory;

  // Apply OS multiplier
  const osOption = ECS_OS_OPTIONS.find((os) => os.value === operatingSystem);
  if (osOption) {
    cpuCost *= osOption.multiplier;
    memoryCost *= osOption.multiplier;
  }

  // Apply architecture multiplier
  const archOption = ECS_ARCHITECTURE.find((arch) => arch.value === architecture);
  if (archOption) {
    cpuCost *= archOption.multiplier;
    memoryCost *= archOption.multiplier;
  }

  // Apply region multiplier
  cpuCost *= regionMultiplier;
  memoryCost *= regionMultiplier;

  // Apply Fargate Spot discount
  if (useFargateSpot) {
    cpuCost *= (1 - FARGATE_SPOT_DISCOUNT);
    memoryCost *= (1 - FARGATE_SPOT_DISCOUNT);
  }

  // Calculate total compute cost
  const computeCost = (cpuCost + memoryCost) * hoursPerMonth * numberOfTasks;

  // Calculate ephemeral storage cost
  let storageCost = 0;
  if (ephemeralStorage > FARGATE_STORAGE.freeStorage) {
    const additionalStorage = ephemeralStorage - FARGATE_STORAGE.freeStorage;
    storageCost = additionalStorage * FARGATE_STORAGE.additionalStoragePrice * hoursPerMonth * numberOfTasks * regionMultiplier;
  }

  // Calculate data transfer cost
  let transferCost = 0;
  if (dataTransferOut > 0) {
    const pricing = ECS_DATA_TRANSFER.outToInternet;
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

  const monthlyCost = computeCost + storageCost + transferCost;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      computeCost: Math.round(computeCost * 100) / 100,
      storageCost: Math.round(storageCost * 100) / 100,
      transferCost: Math.round(transferCost * 100) / 100,
      hourlyRate: Math.round((cpuCost + memoryCost) * 10000) / 10000,
    },
  };
}

// Helper function to calculate ECS cost (main entry point)
export function calculateECSCost(config) {
  const { launchType = 'fargate' } = config;

  if (launchType === 'fargate') {
    return calculateFargateCost(config);
  } else {
    // For EC2 launch type, the cost is just the EC2 instances
    // ECS itself doesn't charge extra for EC2 launch type
    return {
      monthlyCost: 0,
      breakdown: {
        note: 'EC2 launch type uses your existing EC2 instances. Calculate EC2 costs separately.',
      },
    };
  }
}

// Helper function to get CPU details
export function getCPUDetails(cpu) {
  return FARGATE_CPU_OPTIONS.find((c) => c.value === cpu);
}

// Helper function to get memory details
export function getMemoryDetails(cpu, memory) {
  const memoryOptions = getMemoryOptionsForCPU(cpu);
  return memoryOptions.find((m) => m.value === memory);
}

// Helper function to estimate cost per task per hour
export function getCostPerTaskPerHour(cpu, memory, os = 'linux', arch = 'x86_64') {
  const cpuOption = getCPUDetails(cpu);
  const memoryOption = getMemoryDetails(cpu, memory);

  if (!cpuOption || !memoryOption) return 0;

  let cost = cpuOption.pricePerHour * cpu + memoryOption.pricePerHour * memory;

  const osOption = ECS_OS_OPTIONS.find((o) => o.value === os);
  if (osOption) cost *= osOption.multiplier;

  const archOption = ECS_ARCHITECTURE.find((a) => a.value === arch);
  if (archOption) cost *= archOption.multiplier;

  return Math.round(cost * 10000) / 10000;
}
