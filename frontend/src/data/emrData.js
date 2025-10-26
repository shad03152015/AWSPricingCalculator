// EMR (Big Data) Pricing Data - EC2 + 25% EMR charge
export const EMR_INSTANCE_TYPES = {
  'm5.xlarge': { ec2Price: 0.192, emrCharge: 0.048, totalPrice: 0.240 },
  'm5.2xlarge': { ec2Price: 0.384, emrCharge: 0.096, totalPrice: 0.480 },
  'm5.4xlarge': { ec2Price: 0.768, emrCharge: 0.192, totalPrice: 0.960 },
  'r5.xlarge': { ec2Price: 0.252, emrCharge: 0.063, totalPrice: 0.315 },
  'r5.2xlarge': { ec2Price: 0.504, emrCharge: 0.126, totalPrice: 0.630 },
  'r5.4xlarge': { ec2Price: 1.008, emrCharge: 0.252, totalPrice: 1.260 },
  'c5.xlarge': { ec2Price: 0.170, emrCharge: 0.043, totalPrice: 0.213 },
  'c5.2xlarge': { ec2Price: 0.340, emrCharge: 0.085, totalPrice: 0.425 },
};
export const EMR_EBS_STORAGE = 0.10;
export function calculateEMRCost(config) {
  const { instanceType = 'm5.xlarge', numberOfInstances = 5, hoursPerMonth = 730, ebsStorageGB = 500 } = config;
  const instanceDetails = EMR_INSTANCE_TYPES[instanceType];
  if (!instanceDetails) return { service: 'EMR', monthlyCost: 0, breakdown: [] };
  const computeCost = instanceDetails.totalPrice * numberOfInstances * hoursPerMonth;
  const storageCost = ebsStorageGB * EMR_EBS_STORAGE;
  const monthlyCost = computeCost + storageCost;
  return {
    service: 'EMR', computeCost, storageCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Compute', description: numberOfInstances + 'x ' + instanceType + ' (' + hoursPerMonth + ' hrs)', monthlyCost: computeCost },
      { category: 'EBS Storage', description: ebsStorageGB + ' GB', monthlyCost: storageCost },
    ],
    configuration: { instanceType, numberOfInstances, hoursPerMonth, ebsStorageGB },
  };
}
export const EMR_USE_CASE_TEMPLATES = [
  { name: 'Development', config: { instanceType: 'm5.xlarge', numberOfInstances: 3, hoursPerMonth: 200, ebsStorageGB: 100 } },
  { name: 'Production', config: { instanceType: 'r5.4xlarge', numberOfInstances: 10, hoursPerMonth: 730, ebsStorageGB: 2000 } },
];
