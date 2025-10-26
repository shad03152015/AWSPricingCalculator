// Redshift (Data Warehouse) Pricing Data
export const REDSHIFT_NODE_TYPES = {
  'dc2.large': { vCPU: 2, memory: 15, storage: 160, hourlyPrice: 0.25 },
  'dc2.8xlarge': { vCPU: 32, memory: 244, storage: 2560, hourlyPrice: 4.80 },
  'ra3.xlplus': { vCPU: 4, memory: 32, storage: 'managed', hourlyPrice: 1.086 },
  'ra3.4xlarge': { vCPU: 12, memory: 96, storage: 'managed', hourlyPrice: 3.26 },
  'ra3.16xlarge': { vCPU: 48, memory: 384, storage: 'managed', hourlyPrice: 13.04 },
};
export const REDSHIFT_MANAGED_STORAGE = 0.024;
export const REDSHIFT_SPECTRUM = 5.00;
export const REDSHIFT_CONCURRENCY_SCALING = 5.00;
export function calculateRedshiftCost(config) {
  const { nodeType = 'ra3.4xlarge', numberOfNodes = 2, managedStorageGB = 1000, spectrumDataScannedTB = 0, concurrencyScalingSeconds = 0 } = config;
  const nodeDetails = REDSHIFT_NODE_TYPES[nodeType];
  if (!nodeDetails) return { service: 'Redshift', monthlyCost: 0, breakdown: [] };
  const nodeCost = nodeDetails.hourlyPrice * 730 * numberOfNodes;
  const storageCost = nodeDetails.storage === 'managed' ? managedStorageGB * REDSHIFT_MANAGED_STORAGE : 0;
  const spectrumCost = spectrumDataScannedTB * REDSHIFT_SPECTRUM;
  const concurrencyScalingCost = (concurrencyScalingSeconds / 3600) * REDSHIFT_CONCURRENCY_SCALING;
  const monthlyCost = nodeCost + storageCost + spectrumCost + concurrencyScalingCost;
  return {
    service: 'Redshift', nodeCost, storageCost, spectrumCost, concurrencyScalingCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Nodes', description: numberOfNodes + 'x ' + nodeType, monthlyCost: nodeCost },
      { category: 'Managed Storage', description: managedStorageGB + ' GB', monthlyCost: storageCost },
      { category: 'Spectrum', description: spectrumDataScannedTB + ' TB scanned', monthlyCost: spectrumCost },
      { category: 'Concurrency Scaling', description: Math.round(concurrencyScalingSeconds/3600) + ' hours', monthlyCost: concurrencyScalingCost },
    ],
    configuration: { nodeType, numberOfNodes, managedStorageGB, spectrumDataScannedTB, concurrencyScalingSeconds },
  };
}
export const REDSHIFT_USE_CASE_TEMPLATES = [
  { name: 'Small Warehouse', config: { nodeType: 'dc2.large', numberOfNodes: 2, managedStorageGB: 0, spectrumDataScannedTB: 0, concurrencyScalingSeconds: 0 } },
  { name: 'Production Warehouse', config: { nodeType: 'ra3.4xlarge', numberOfNodes: 4, managedStorageGB: 5000, spectrumDataScannedTB: 10, concurrencyScalingSeconds: 36000 } },
];
