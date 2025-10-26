// EC2 Instance Families and Types
export const EC2_FAMILIES = {
  'General Purpose': {
    description: 'Balance of compute, memory, and networking resources',
    types: [
      { type: 't3.nano', vcpu: 2, memory: 0.5, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0052, currentGen: true },
      { type: 't3.micro', vcpu: 2, memory: 1, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0104, currentGen: true },
      { type: 't3.small', vcpu: 2, memory: 2, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0208, currentGen: true },
      { type: 't3.medium', vcpu: 2, memory: 4, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0416, currentGen: true },
      { type: 't3.large', vcpu: 2, memory: 8, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0832, currentGen: true },
      { type: 't3.xlarge', vcpu: 4, memory: 16, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.1664, currentGen: true },
      { type: 't3.2xlarge', vcpu: 8, memory: 32, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.3328, currentGen: true },
      { type: 't4g.nano', vcpu: 2, memory: 0.5, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0042, arch: 'ARM', currentGen: true },
      { type: 't4g.micro', vcpu: 2, memory: 1, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0084, arch: 'ARM', currentGen: true },
      { type: 't4g.small', vcpu: 2, memory: 2, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0168, arch: 'ARM', currentGen: true },
      { type: 't4g.medium', vcpu: 2, memory: 4, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0336, arch: 'ARM', currentGen: true },
      { type: 't4g.large', vcpu: 2, memory: 8, network: 'Up to 5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0672, arch: 'ARM', currentGen: true },
      { type: 'm5.large', vcpu: 2, memory: 8, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.096, currentGen: true },
      { type: 'm5.xlarge', vcpu: 4, memory: 16, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.192, currentGen: true },
      { type: 'm5.2xlarge', vcpu: 8, memory: 32, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.384, currentGen: true },
      { type: 'm5.4xlarge', vcpu: 16, memory: 64, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.768, currentGen: true },
      { type: 'm6i.large', vcpu: 2, memory: 8, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.096, currentGen: true },
      { type: 'm6i.xlarge', vcpu: 4, memory: 16, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.192, currentGen: true },
      { type: 'm6i.2xlarge', vcpu: 8, memory: 32, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.384, currentGen: true },
      { type: 'm4.large', vcpu: 2, memory: 8, network: 'Moderate', storage: 'EBS only', hourlyPrice: 0.1, currentGen: false },
      { type: 'c5d.large', vcpu: 2, memory: 4, network: 'Up to 10 Gigabit', storage: '1 x 50 NVMe SSD', hourlyPrice: 0.096, currentGen: true },
      { type: 'c8gd.large', vcpu: 2, memory: 4, network: 'Up to 12500 Megabit', storage: '1 x 118 NVMe SSD', hourlyPrice: 0.09798, currentGen: true },
      { type: 'c4.large', vcpu: 2, memory: 3.75, network: 'Moderate', storage: 'EBS only', hourlyPrice: 0.1, currentGen: false },
      { type: 'm8i-flex.large', vcpu: 2, memory: 8, network: 'Up to 12500 Megabit', storage: 'EBS only', hourlyPrice: 0.10055, currentGen: true },
      { type: 'x8g.medium', vcpu: 1, memory: 16, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.0977, currentGen: true },
    ],
  },
  'Compute Optimized': {
    description: 'High performance processors for compute-intensive workloads',
    types: [
      { type: 'c5.large', vcpu: 2, memory: 4, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.085, currentGen: true },
      { type: 'c5.xlarge', vcpu: 4, memory: 8, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.17, currentGen: true },
      { type: 'c5.2xlarge', vcpu: 8, memory: 16, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.34, currentGen: true },
      { type: 'c5.4xlarge', vcpu: 16, memory: 32, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.68, currentGen: true },
      { type: 'c6i.large', vcpu: 2, memory: 4, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.085, currentGen: true },
      { type: 'c6i.xlarge', vcpu: 4, memory: 8, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.17, currentGen: true },
      { type: 'c6i.2xlarge', vcpu: 8, memory: 16, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.34, currentGen: true },
      { type: 'c6i.4xlarge', vcpu: 16, memory: 32, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.68, currentGen: true },
    ],
  },
  'Memory Optimized': {
    description: 'Fast performance for workloads that process large data sets in memory',
    types: [
      { type: 'r5.large', vcpu: 2, memory: 16, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.126, currentGen: true },
      { type: 'r5.xlarge', vcpu: 4, memory: 32, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.252, currentGen: true },
      { type: 'r5.2xlarge', vcpu: 8, memory: 64, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 0.504, currentGen: true },
      { type: 'r5.4xlarge', vcpu: 16, memory: 128, network: 'Up to 10 Gigabit', storage: 'EBS only', hourlyPrice: 1.008, currentGen: true },
      { type: 'r6i.large', vcpu: 2, memory: 16, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.126, currentGen: true },
      { type: 'r6i.xlarge', vcpu: 4, memory: 32, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.252, currentGen: true },
      { type: 'r6i.2xlarge', vcpu: 8, memory: 64, network: 'Up to 12.5 Gigabit', storage: 'EBS only', hourlyPrice: 0.504, currentGen: true },
      { type: 'x2gd.medium', vcpu: 1, memory: 16, network: 'Up to 15 Gigabit', storage: '1 x 59 NVMe SSD', hourlyPrice: 0.167, arch: 'ARM', currentGen: true },
      { type: 'x2gd.large', vcpu: 2, memory: 32, network: 'Up to 15 Gigabit', storage: '1 x 118 NVMe SSD', hourlyPrice: 0.334, arch: 'ARM', currentGen: true },
    ],
  },
  'Storage Optimized': {
    description: 'High, sequential read and write access to very large data sets',
    types: [
      { type: 'i3.large', vcpu: 2, memory: 15.25, network: 'Up to 10 Gigabit', storage: '1 x 475 NVMe SSD', hourlyPrice: 0.156, currentGen: true },
      { type: 'i3.xlarge', vcpu: 4, memory: 30.5, network: 'Up to 10 Gigabit', storage: '1 x 950 NVMe SSD', hourlyPrice: 0.312, currentGen: true },
      { type: 'i3.2xlarge', vcpu: 8, memory: 61, network: 'Up to 10 Gigabit', storage: '1 x 1900 NVMe SSD', hourlyPrice: 0.624, currentGen: true },
      { type: 'd3.xlarge', vcpu: 4, memory: 32, network: 'Up to 15 Gigabit', storage: '3 x 2000 HDD', hourlyPrice: 0.166, currentGen: true },
      { type: 'd3.2xlarge', vcpu: 8, memory: 64, network: 'Up to 15 Gigabit', storage: '6 x 2000 HDD', hourlyPrice: 0.333, currentGen: true },
    ],
  },
  'Accelerated Computing': {
    description: 'Hardware accelerators or co-processors for graphics processing and pattern matching',
    types: [
      { type: 'p3.2xlarge', vcpu: 8, memory: 61, network: 'Up to 10 Gigabit', storage: 'EBS only', gpu: 1, hourlyPrice: 3.06, currentGen: true },
      { type: 'p3.8xlarge', vcpu: 32, memory: 244, network: '10 Gigabit', storage: 'EBS only', gpu: 4, hourlyPrice: 12.24, currentGen: true },
      { type: 'g4dn.xlarge', vcpu: 4, memory: 16, network: 'Up to 25 Gigabit', storage: '1 x 125 NVMe SSD', gpu: 1, hourlyPrice: 0.526, currentGen: true },
      { type: 'g4dn.2xlarge', vcpu: 8, memory: 32, network: 'Up to 25 Gigabit', storage: '1 x 225 NVMe SSD', gpu: 1, hourlyPrice: 0.752, currentGen: true },
    ],
  },
};

// Operating Systems
export const OPERATING_SYSTEMS = [
  { value: 'Linux', label: 'Linux/UNIX', priceMultiplier: 1.0 },
  { value: 'Windows', label: 'Windows', priceMultiplier: 1.6 },
  { value: 'RHEL', label: 'Red Hat Enterprise Linux', priceMultiplier: 1.3 },
  { value: 'SUSE', label: 'SUSE Linux', priceMultiplier: 1.2 },
  { value: 'Ubuntu Pro', label: 'Ubuntu Pro', priceMultiplier: 1.15 },
];

// Pricing Models
export const PRICING_MODELS = [
  {
    value: 'On-Demand',
    label: 'On-Demand',
    description: 'Pay for compute capacity by the hour with no long-term commitments',
    discount: 0,
  },
  {
    value: 'Reserved-1yr-No',
    label: 'Reserved 1 Year - No Upfront',
    description: '1 year commitment, no upfront payment',
    discount: 0.40, // 40% savings
  },
  {
    value: 'Reserved-1yr-Partial',
    label: 'Reserved 1 Year - Partial Upfront',
    description: '1 year commitment, partial upfront payment',
    discount: 0.42,
  },
  {
    value: 'Reserved-1yr-All',
    label: 'Reserved 1 Year - All Upfront',
    description: '1 year commitment, all upfront payment',
    discount: 0.45,
  },
  {
    value: 'Reserved-3yr-No',
    label: 'Reserved 3 Years - No Upfront',
    description: '3 year commitment, no upfront payment',
    discount: 0.56,
  },
  {
    value: 'Reserved-3yr-Partial',
    label: 'Reserved 3 Years - Partial Upfront',
    description: '3 year commitment, partial upfront payment',
    discount: 0.59,
  },
  {
    value: 'Reserved-3yr-All',
    label: 'Reserved 3 Years - All Upfront',
    description: '3 year commitment, all upfront payment',
    discount: 0.62,
  },
  {
    value: 'Savings Plan',
    label: 'Compute Savings Plan',
    description: 'Flexible pricing model with up to 66% savings',
    discount: 0.50,
  },
  {
    value: 'Spot',
    label: 'Spot Instances',
    description: 'Spare capacity at up to 90% discount',
    discount: 0.70, // 70% savings
  },
];

// EBS Volume Types
export const EBS_VOLUME_TYPES = [
  {
    value: 'gp3',
    label: 'General Purpose SSD (gp3)',
    description: 'Latest generation, cost-effective',
    pricePerGB: 0.08,
    baseline: { iops: 3000, throughput: 125 },
    additionalIOPS: 0.005,
    additionalThroughput: 0.04,
  },
  {
    value: 'gp2',
    label: 'General Purpose SSD (gp2)',
    description: 'Previous generation',
    pricePerGB: 0.10,
    baseline: { iops: null, throughput: null }, // scales with size
  },
  {
    value: 'io2',
    label: 'Provisioned IOPS SSD (io2)',
    description: 'Highest performance, mission-critical workloads',
    pricePerGB: 0.125,
    pricePerIOPS: 0.065,
    maxIOPS: 64000,
  },
  {
    value: 'io1',
    label: 'Provisioned IOPS SSD (io1)',
    description: 'High performance',
    pricePerGB: 0.125,
    pricePerIOPS: 0.065,
    maxIOPS: 64000,
  },
  {
    value: 'st1',
    label: 'Throughput Optimized HDD (st1)',
    description: 'Low-cost HDD for frequently accessed data',
    pricePerGB: 0.045,
  },
  {
    value: 'sc1',
    label: 'Cold HDD (sc1)',
    description: 'Lowest cost HDD for infrequently accessed data',
    pricePerGB: 0.015,
  },
];

// Tenancy Options
export const TENANCY_OPTIONS = [
  {
    value: 'Shared',
    label: 'Shared Tenancy',
    description: 'Multiple customer instances on same hardware',
    multiplier: 1.0,
  },
  {
    value: 'Dedicated Instance',
    label: 'Dedicated Instance',
    description: 'Your instances run on single-tenant hardware',
    multiplier: 2.0,
  },
  {
    value: 'Dedicated Host',
    label: 'Dedicated Host',
    description: 'Physical server dedicated for your use',
    multiplier: 2.5,
  },
];

// Data Transfer Pricing (per GB)
export const DATA_TRANSFER_PRICING = {
  outToInternet: {
    first10TB: 0.09,
    next40TB: 0.085,
    next100TB: 0.07,
    over150TB: 0.05,
  },
  betweenRegions: 0.02,
  toCloudFront: 0.00, // Free
  inbound: 0.00, // Free
};

// Helper function to get all instance types as flat array
export function getAllInstanceTypes() {
  const allTypes = [];
  Object.entries(EC2_FAMILIES).forEach(([family, data]) => {
    data.types.forEach((type) => {
      allTypes.push({
        ...type,
        family,
        label: `${type.type} (${type.vcpu} vCPU, ${type.memory} GB RAM)`,
        network: type.network || 'Variable',
        storage: type.storage || 'EBS only',
        currentGen: type.currentGen !== undefined ? type.currentGen : true,
      });
    });
  });
  return allTypes;
}

// Helper function to get unique vCPU counts
export function getVCPUOptions() {
  const allTypes = getAllInstanceTypes();
  const vcpuSet = new Set(allTypes.map(t => t.vcpu));
  return Array.from(vcpuSet).sort((a, b) => a - b);
}

// Helper function to calculate EC2 cost
export function calculateEC2Cost(config) {
  const {
    instanceType,
    operatingSystem,
    quantity = 1,
    hoursPerMonth = 730,
    pricingModel,
    tenancy,
    ebsVolumes = [],
    dataTransferOut = 0,
  } = config;

  // Find instance type details
  let instanceDetails = null;
  for (const family of Object.values(EC2_FAMILIES)) {
    instanceDetails = family.types.find((t) => t.type === instanceType);
    if (instanceDetails) break;
  }

  if (!instanceDetails) {
    return { monthlyCost: 0, breakdown: {} };
  }

  // Base hourly price
  let hourlyPrice = instanceDetails.hourlyPrice;

  // Apply OS multiplier
  const os = OPERATING_SYSTEMS.find((o) => o.value === operatingSystem);
  if (os) {
    hourlyPrice *= os.priceMultiplier;
  }

  // Apply tenancy multiplier
  const tenancyOption = TENANCY_OPTIONS.find((t) => t.value === tenancy);
  if (tenancyOption) {
    hourlyPrice *= tenancyOption.multiplier;
  }

  // Apply pricing model discount
  const pricingOption = PRICING_MODELS.find((p) => p.value === pricingModel);
  if (pricingOption && pricingOption.discount > 0) {
    hourlyPrice *= (1 - pricingOption.discount);
  }

  // Calculate instance cost
  const instanceCost = hourlyPrice * hoursPerMonth * quantity;

  // Calculate EBS cost
  let ebsCost = 0;
  ebsVolumes.forEach((volume) => {
    const volumeType = EBS_VOLUME_TYPES.find((v) => v.value === volume.type);
    if (volumeType) {
      ebsCost += volumeType.pricePerGB * volume.size;
      if (volume.iops && volumeType.pricePerIOPS) {
        ebsCost += volumeType.pricePerIOPS * volume.iops;
      }
    }
  });
  ebsCost *= quantity; // Multiply by number of instances

  // Calculate data transfer cost
  let transferCost = 0;
  if (dataTransferOut > 0) {
    const pricing = DATA_TRANSFER_PRICING.outToInternet;
    if (dataTransferOut <= 10240) {
      transferCost = dataTransferOut * pricing.first10TB;
    } else if (dataTransferOut <= 51200) {
      transferCost = 10240 * pricing.first10TB + (dataTransferOut - 10240) * pricing.next40TB;
    } else if (dataTransferOut <= 153600) {
      transferCost =
        10240 * pricing.first10TB +
        40960 * pricing.next40TB +
        (dataTransferOut - 51200) * pricing.next100TB;
    } else {
      transferCost =
        10240 * pricing.first10TB +
        40960 * pricing.next40TB +
        102400 * pricing.next100TB +
        (dataTransferOut - 153600) * pricing.over150TB;
    }
  }

  const monthlyCost = instanceCost + ebsCost + transferCost;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    breakdown: {
      instanceCost: Math.round(instanceCost * 100) / 100,
      ebsCost: Math.round(ebsCost * 100) / 100,
      transferCost: Math.round(transferCost * 100) / 100,
      hourlyRate: Math.round(hourlyPrice * 10000) / 10000,
    },
  };
}
