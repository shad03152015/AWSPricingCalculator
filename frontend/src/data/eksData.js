/**
 * AWS EKS (Elastic Kubernetes Service) Pricing Data
 * Prices are in USD and based on us-east-1 region
 */

// EKS Cluster Base Pricing
export const EKS_CLUSTER_HOURLY_COST = 0.10; // $0.10/hour per cluster
export const EKS_CLUSTER_MONTHLY_COST = EKS_CLUSTER_HOURLY_COST * 730; // ~$73/month

// EKS Compute Types
export const EKS_COMPUTE_TYPES = [
  {
    value: 'ec2',
    label: 'EC2 Node Groups',
    description: 'Managed node groups using EC2 instances',
  },
  {
    value: 'fargate',
    label: 'AWS Fargate',
    description: 'Serverless compute for pods without managing nodes',
  },
  {
    value: 'hybrid',
    label: 'Hybrid (EC2 + Fargate)',
    description: 'Mix of EC2 node groups and Fargate pods',
  },
];

// EC2 Instance Types for EKS Node Groups
export const EKS_EC2_INSTANCE_TYPES = [
  // General Purpose - T3
  { family: 'T3', value: 't3.micro', label: 't3.micro', vcpu: 2, memory: 1, pricePerHour: 0.0104 },
  { family: 'T3', value: 't3.small', label: 't3.small', vcpu: 2, memory: 2, pricePerHour: 0.0208 },
  { family: 'T3', value: 't3.medium', label: 't3.medium', vcpu: 2, memory: 4, pricePerHour: 0.0416 },
  { family: 'T3', value: 't3.large', label: 't3.large', vcpu: 2, memory: 8, pricePerHour: 0.0832 },
  { family: 'T3', value: 't3.xlarge', label: 't3.xlarge', vcpu: 4, memory: 16, pricePerHour: 0.1664 },
  { family: 'T3', value: 't3.2xlarge', label: 't3.2xlarge', vcpu: 8, memory: 32, pricePerHour: 0.3328 },

  // General Purpose - M5
  { family: 'M5', value: 'm5.large', label: 'm5.large', vcpu: 2, memory: 8, pricePerHour: 0.096 },
  { family: 'M5', value: 'm5.xlarge', label: 'm5.xlarge', vcpu: 4, memory: 16, pricePerHour: 0.192 },
  { family: 'M5', value: 'm5.2xlarge', label: 'm5.2xlarge', vcpu: 8, memory: 32, pricePerHour: 0.384 },
  { family: 'M5', value: 'm5.4xlarge', label: 'm5.4xlarge', vcpu: 16, memory: 64, pricePerHour: 0.768 },
  { family: 'M5', value: 'm5.8xlarge', label: 'm5.8xlarge', vcpu: 32, memory: 128, pricePerHour: 1.536 },

  // Compute Optimized - C5
  { family: 'C5', value: 'c5.large', label: 'c5.large', vcpu: 2, memory: 4, pricePerHour: 0.085 },
  { family: 'C5', value: 'c5.xlarge', label: 'c5.xlarge', vcpu: 4, memory: 8, pricePerHour: 0.17 },
  { family: 'C5', value: 'c5.2xlarge', label: 'c5.2xlarge', vcpu: 8, memory: 16, pricePerHour: 0.34 },
  { family: 'C5', value: 'c5.4xlarge', label: 'c5.4xlarge', vcpu: 16, memory: 32, pricePerHour: 0.68 },

  // Memory Optimized - R5
  { family: 'R5', value: 'r5.large', label: 'r5.large', vcpu: 2, memory: 16, pricePerHour: 0.126 },
  { family: 'R5', value: 'r5.xlarge', label: 'r5.xlarge', vcpu: 4, memory: 32, pricePerHour: 0.252 },
  { family: 'R5', value: 'r5.2xlarge', label: 'r5.2xlarge', vcpu: 8, memory: 64, pricePerHour: 0.504 },
  { family: 'R5', value: 'r5.4xlarge', label: 'r5.4xlarge', vcpu: 16, memory: 128, pricePerHour: 1.008 },
];

// Fargate Pod Pricing for EKS (per vCPU and per GB memory)
export const EKS_FARGATE_PRICING = {
  perVCPUPerHour: 0.04048,
  perGBPerHour: 0.004445,
};

// Fargate Pod Size Options
export const EKS_FARGATE_POD_SIZES = [
  { vcpu: 0.25, memory: [0.5, 1, 2], label: '0.25 vCPU' },
  { vcpu: 0.5, memory: [1, 2, 3, 4], label: '0.5 vCPU' },
  { vcpu: 1, memory: [2, 3, 4, 5, 6, 7, 8], label: '1 vCPU' },
  { vcpu: 2, memory: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], label: '2 vCPU' },
  { vcpu: 4, memory: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], label: '4 vCPU' },
];

// EKS Add-ons and Features
export const EKS_ADDONS = [
  {
    value: 'vpc_cni',
    label: 'Amazon VPC CNI',
    description: 'Native VPC networking for pods',
    cost: 0,
    included: true,
  },
  {
    value: 'coredns',
    label: 'CoreDNS',
    description: 'DNS service discovery',
    cost: 0,
    included: true,
  },
  {
    value: 'kube_proxy',
    label: 'kube-proxy',
    description: 'Network proxy for Kubernetes services',
    cost: 0,
    included: true,
  },
  {
    value: 'ebs_csi',
    label: 'EBS CSI Driver',
    description: 'Persistent storage with EBS volumes',
    cost: 0,
    optional: true,
  },
  {
    value: 'efs_csi',
    label: 'EFS CSI Driver',
    description: 'Shared storage with EFS',
    cost: 0,
    optional: true,
  },
];

// Regional Pricing Multipliers
export const EKS_REGIONAL_MULTIPLIERS = {
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

// EBS Volume Types for Node Storage
export const EKS_EBS_VOLUME_TYPES = [
  {
    value: 'gp3',
    label: 'gp3 (General Purpose SSD)',
    pricePerGBMonth: 0.08,
    baseIOPS: 3000,
    baseThroughput: 125,
    description: 'Latest generation general purpose SSD',
  },
  {
    value: 'gp2',
    label: 'gp2 (General Purpose SSD)',
    pricePerGBMonth: 0.10,
    baseIOPS: 'Varies',
    description: 'Previous generation general purpose SSD',
  },
  {
    value: 'io2',
    label: 'io2 (Provisioned IOPS SSD)',
    pricePerGBMonth: 0.125,
    pricePerIOPS: 0.065,
    description: 'High performance SSD for critical workloads',
  },
];

/**
 * Calculate EKS total monthly cost
 */
export function calculateEKSCost(config) {
  const {
    region = 'us-east-1',
    clusterCount = 1,
    computeType = 'ec2',

    // EC2 Node Group Config
    ec2NodeCount = 3,
    ec2InstanceType = 't3.medium',
    ec2VolumeSize = 20,
    ec2VolumeType = 'gp3',

    // Fargate Config
    fargatePodCount = 0,
    fargatePodVCPU = 0.25,
    fargatePodMemory = 0.5,

    // Hybrid Config
    hybridEc2Nodes = 2,
    hybridFargatePods = 5,
  } = config;

  const regionalMultiplier = EKS_REGIONAL_MULTIPLIERS[region]?.multiplier || 1.0;

  // Base cluster cost
  const clusterCost = EKS_CLUSTER_MONTHLY_COST * clusterCount * regionalMultiplier;

  let computeCost = 0;
  let storageCost = 0;
  let breakdown = [];

  // Calculate based on compute type
  if (computeType === 'ec2') {
    // EC2 Node Groups
    const instanceData = EKS_EC2_INSTANCE_TYPES.find(i => i.value === ec2InstanceType) || EKS_EC2_INSTANCE_TYPES[2];
    const instanceMonthlyCost = instanceData.pricePerHour * 730 * regionalMultiplier;
    computeCost = instanceMonthlyCost * ec2NodeCount;

    // EBS Storage for nodes
    const volumeData = EKS_EBS_VOLUME_TYPES.find(v => v.value === ec2VolumeType) || EKS_EBS_VOLUME_TYPES[0];
    storageCost = volumeData.pricePerGBMonth * ec2VolumeSize * ec2NodeCount * regionalMultiplier;

    breakdown.push({
      category: 'Compute',
      description: `${ec2NodeCount}x ${instanceData.label} nodes`,
      monthlyCost: computeCost,
    });

    breakdown.push({
      category: 'Storage',
      description: `${ec2NodeCount}x ${ec2VolumeSize}GB ${volumeData.label} volumes`,
      monthlyCost: storageCost,
    });

  } else if (computeType === 'fargate') {
    // Fargate Pods
    const podHourlyCost = (
      fargatePodVCPU * EKS_FARGATE_PRICING.perVCPUPerHour +
      fargatePodMemory * EKS_FARGATE_PRICING.perGBPerHour
    ) * regionalMultiplier;

    const podMonthlyCost = podHourlyCost * 730;
    computeCost = podMonthlyCost * fargatePodCount;

    breakdown.push({
      category: 'Compute',
      description: `${fargatePodCount}x Fargate pods (${fargatePodVCPU} vCPU, ${fargatePodMemory}GB)`,
      monthlyCost: computeCost,
    });

  } else if (computeType === 'hybrid') {
    // Hybrid: EC2 + Fargate
    const instanceData = EKS_EC2_INSTANCE_TYPES.find(i => i.value === ec2InstanceType) || EKS_EC2_INSTANCE_TYPES[2];
    const instanceMonthlyCost = instanceData.pricePerHour * 730 * regionalMultiplier;
    const ec2Cost = instanceMonthlyCost * hybridEc2Nodes;

    const volumeData = EKS_EBS_VOLUME_TYPES.find(v => v.value === ec2VolumeType) || EKS_EBS_VOLUME_TYPES[0];
    storageCost = volumeData.pricePerGBMonth * ec2VolumeSize * hybridEc2Nodes * regionalMultiplier;

    const podHourlyCost = (
      fargatePodVCPU * EKS_FARGATE_PRICING.perVCPUPerHour +
      fargatePodMemory * EKS_FARGATE_PRICING.perGBPerHour
    ) * regionalMultiplier;

    const fargateCalc = podHourlyCost * 730 * hybridFargatePods;

    computeCost = ec2Cost + fargateCalc;

    breakdown.push({
      category: 'Compute - EC2',
      description: `${hybridEc2Nodes}x ${instanceData.label} nodes`,
      monthlyCost: ec2Cost,
    });

    breakdown.push({
      category: 'Compute - Fargate',
      description: `${hybridFargatePods}x Fargate pods (${fargatePodVCPU} vCPU, ${fargatePodMemory}GB)`,
      monthlyCost: fargateCalc,
    });

    breakdown.push({
      category: 'Storage',
      description: `${hybridEc2Nodes}x ${ec2VolumeSize}GB ${volumeData.label} volumes`,
      monthlyCost: storageCost,
    });
  }

  const totalMonthlyCost = clusterCost + computeCost + storageCost;

  return {
    service: 'EKS',
    region,
    regionalMultiplier,
    clusterCost,
    computeCost,
    storageCost,
    monthlyCost: totalMonthlyCost,
    annualCost: totalMonthlyCost * 12,
    breakdown: [
      {
        category: 'EKS Cluster',
        description: `${clusterCount}x EKS cluster${clusterCount > 1 ? 's' : ''}`,
        monthlyCost: clusterCost,
      },
      ...breakdown,
    ],
    configuration: {
      clusterCount,
      computeType,
      region: EKS_REGIONAL_MULTIPLIERS[region]?.name || region,
    },
  };
}

// Use Case Templates
export const EKS_USE_CASE_TEMPLATES = [
  {
    name: 'Development/Testing',
    description: 'Small cluster for dev/test workloads',
    config: {
      clusterCount: 1,
      computeType: 'ec2',
      ec2NodeCount: 2,
      ec2InstanceType: 't3.medium',
      ec2VolumeSize: 20,
      ec2VolumeType: 'gp3',
    },
  },
  {
    name: 'Production - Small',
    description: 'Production-ready cluster for small applications',
    config: {
      clusterCount: 1,
      computeType: 'ec2',
      ec2NodeCount: 3,
      ec2InstanceType: 'm5.large',
      ec2VolumeSize: 50,
      ec2VolumeType: 'gp3',
    },
  },
  {
    name: 'Production - Large',
    description: 'High-availability cluster for large applications',
    config: {
      clusterCount: 1,
      computeType: 'hybrid',
      hybridEc2Nodes: 5,
      ec2InstanceType: 'm5.2xlarge',
      ec2VolumeSize: 100,
      ec2VolumeType: 'gp3',
      hybridFargatePods: 10,
      fargatePodVCPU: 1,
      fargatePodMemory: 2,
    },
  },
  {
    name: 'Serverless Workloads',
    description: 'Fargate-only for serverless containers',
    config: {
      clusterCount: 1,
      computeType: 'fargate',
      fargatePodCount: 15,
      fargatePodVCPU: 0.5,
      fargatePodMemory: 1,
    },
  },
];
