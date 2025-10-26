// WAF (Web Application Firewall) Pricing Data
export const WAF_WEB_ACL = 5.00;
export const WAF_RULE = 1.00;
export const WAF_REQUEST = 0.60;
export function calculateWAFCost(config) {
  const { webACLs = 1, rules = 10, requestsPerMonth = 10000000 } = config;
  const webACLCost = webACLs * WAF_WEB_ACL;
  const ruleCost = rules * WAF_RULE;
  const requestCost = (requestsPerMonth / 1000000) * WAF_REQUEST;
  const monthlyCost = webACLCost + ruleCost + requestCost;
  return {
    service: 'WAF', webACLCost, ruleCost, requestCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Web ACLs', description: webACLs + ' ACLs', monthlyCost: webACLCost },
      { category: 'Rules', description: rules + ' rules', monthlyCost: ruleCost },
      { category: 'Requests', description: Math.round(requestsPerMonth/1000000) + 'M requests', monthlyCost: requestCost },
    ],
    configuration: { webACLs, rules, requestsPerMonth },
  };
}
export const WAF_USE_CASE_TEMPLATES = [
  { name: 'Basic Protection', config: { webACLs: 1, rules: 5, requestsPerMonth: 1000000 } },
  { name: 'Advanced Protection', config: { webACLs: 3, rules: 30, requestsPerMonth: 100000000 } },
];
