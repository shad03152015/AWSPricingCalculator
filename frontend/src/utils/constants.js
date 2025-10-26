// AWS Regions
export const AWS_REGIONS = [
  { code: 'us-east-1', name: 'US East (N. Virginia)' },
  { code: 'us-east-2', name: 'US East (Ohio)' },
  { code: 'us-west-1', name: 'US West (N. California)' },
  { code: 'us-west-2', name: 'US West (Oregon)' },
  { code: 'eu-west-1', name: 'EU (Ireland)' },
  { code: 'eu-west-2', name: 'EU (London)' },
  { code: 'eu-west-3', name: 'EU (Paris)' },
  { code: 'eu-central-1', name: 'EU (Frankfurt)' },
  { code: 'eu-north-1', name: 'EU (Stockholm)' },
  { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
  { code: 'ca-central-1', name: 'Canada (Central)' },
  { code: 'sa-east-1', name: 'South America (Sao Paulo)' },
];

// Service Categories
export const SERVICE_CATEGORIES = {
  Compute: ['AmazonEC2', 'AWSLambda', 'AmazonECS'],
  Storage: ['AmazonS3', 'AmazonEBS'],
  Database: ['AmazonRDS', 'AmazonDynamoDB', 'AmazonElastiCache'],
  Networking: ['AmazonCloudFront', 'AmazonRoute53'],
};

// Pricing Models
export const PRICING_MODELS = [
  'On-Demand',
  'Reserved 1yr',
  'Reserved 3yr',
  'Spot',
];

// EC2 Instance Types (organized by family)
export const EC2_INSTANCE_TYPES = {
  'General Purpose': ['t3.micro', 't3.small', 't3.medium', 't3.large', 't3.xlarge', 't3.2xlarge'],
  'Compute Optimized': ['c5.large', 'c5.xlarge', 'c5.2xlarge', 'c5.4xlarge'],
  'Memory Optimized': ['r5.large', 'r5.xlarge', 'r5.2xlarge', 'r5.4xlarge'],
  'Storage Optimized': ['i3.large', 'i3.xlarge', 'i3.2xlarge'],
};

// S3 Storage Classes
export const S3_STORAGE_CLASSES = [
  'Standard',
  'Intelligent-Tiering',
  'Standard-IA',
  'One Zone-IA',
  'Glacier Instant',
  'Glacier Flexible',
  'Glacier Deep Archive',
];

// Operating Systems
export const OPERATING_SYSTEMS = [
  'Linux',
  'Windows',
  'RHEL',
  'SUSE',
  'Ubuntu Pro',
];

// RDS Database Engines
export const RDS_ENGINES = [
  'MySQL',
  'PostgreSQL',
  'MariaDB',
  'Oracle',
  'SQL Server',
  'Aurora MySQL',
  'Aurora PostgreSQL',
];

// RDS Instance Types
export const RDS_INSTANCE_TYPES = [
  'db.t3.micro',
  'db.t3.small',
  'db.t3.medium',
  'db.t3.large',
  'db.m5.large',
  'db.m5.xlarge',
  'db.m5.2xlarge',
  'db.r5.large',
  'db.r5.xlarge',
];

// RDS Deployment Options
export const RDS_DEPLOYMENTS = [
  'Single-AZ',
  'Multi-AZ',
];

// RDS Storage Types
export const RDS_STORAGE_TYPES = [
  'GP2 (SSD)',
  'GP3 (SSD)',
  'io1 (Provisioned IOPS)',
  'Magnetic',
];
