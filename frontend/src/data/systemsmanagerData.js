// Systems Manager Pricing Data
export const SYSTEMS_MANAGER_OPSCENTER = 0.10;
export const SYSTEMS_MANAGER_PARAMETER_STORE = 0.05;
export const SYSTEMS_MANAGER_AUTOMATION = 0.002;
export function calculateSystemsManagerCost(config) {
  const { opsItems = 100, parameterStoreAPICalls = 100000, automationSteps = 10000 } = config;
  const opsCenterCost = opsItems * SYSTEMS_MANAGER_OPSCENTER;
  const parameterStoreCost = (parameterStoreAPICalls / 10000) * SYSTEMS_MANAGER_PARAMETER_STORE;
  const automationCost = automationSteps * SYSTEMS_MANAGER_AUTOMATION;
  const monthlyCost = opsCenterCost + parameterStoreCost + automationCost;
  return {
    service: 'SystemsManager', opsCenterCost, parameterStoreCost, automationCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'OpsCenter', description: opsItems + ' OpsItems', monthlyCost: opsCenterCost },
      { category: 'Parameter Store', description: Math.round(parameterStoreAPICalls/1000) + 'k API calls', monthlyCost: parameterStoreCost },
      { category: 'Automation', description: automationSteps + ' steps', monthlyCost: automationCost },
    ],
    configuration: { opsItems, parameterStoreAPICalls, automationSteps },
  };
}
export const SYSTEMS_MANAGER_USE_CASE_TEMPLATES = [
  { name: 'Basic Operations', config: { opsItems: 50, parameterStoreAPICalls: 50000, automationSteps: 5000 } },
  { name: 'Enterprise Operations', config: { opsItems: 500, parameterStoreAPICalls: 1000000, automationSteps: 100000 } },
];
