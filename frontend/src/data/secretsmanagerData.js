// Secrets Manager Pricing Data
export const SECRETS_MANAGER_SECRET = 0.40;
export const SECRETS_MANAGER_API_CALLS = 0.05;
export function calculateSecretsManagerCost(config) {
  const { secrets = 10, apiCalls = 100000 } = config;
  const secretCost = secrets * SECRETS_MANAGER_SECRET;
  const apiCallCost = (apiCalls / 10000) * SECRETS_MANAGER_API_CALLS;
  const monthlyCost = secretCost + apiCallCost;
  return {
    service: 'SecretsManager', secretCost, apiCallCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Secrets', description: secrets + ' secrets', monthlyCost: secretCost },
      { category: 'API Calls', description: Math.round(apiCalls/1000) + 'k calls', monthlyCost: apiCallCost },
    ],
    configuration: { secrets, apiCalls },
  };
}
export const SECRETS_MANAGER_USE_CASE_TEMPLATES = [
  { name: 'Small Application', config: { secrets: 5, apiCalls: 50000 } },
  { name: 'Large Application', config: { secrets: 100, apiCalls: 10000000 } },
];
