// Step Functions Pricing Data
export const STEP_FUNCTIONS_STANDARD = 0.025;
export const STEP_FUNCTIONS_EXPRESS_REQUESTS = 1.00;
export const STEP_FUNCTIONS_EXPRESS_DURATION = 0.00001667;
export function calculateStepFunctionsCost(config) {
  const { workflowType = 'standard', stateTransitions = 1000000, expressRequests = 0, expressGBSeconds = 0 } = config;
  let cost = 0;
  if (workflowType === 'standard') {
    cost = (stateTransitions / 1000) * STEP_FUNCTIONS_STANDARD;
  } else {
    const requestCost = (expressRequests / 1000000) * STEP_FUNCTIONS_EXPRESS_REQUESTS;
    const durationCost = expressGBSeconds * STEP_FUNCTIONS_EXPRESS_DURATION;
    cost = requestCost + durationCost;
  }
  const monthlyCost = cost;
  return {
    service: 'StepFunctions', workflowType, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: workflowType === 'standard' ? 'State Transitions' : 'Express Requests', description: workflowType === 'standard' ? stateTransitions + ' transitions' : expressRequests + ' requests', monthlyCost: cost },
    ],
    configuration: { workflowType, stateTransitions, expressRequests, expressGBSeconds },
  };
}
export const STEP_FUNCTIONS_USE_CASE_TEMPLATES = [
  { name: 'Standard Workflow', config: { workflowType: 'standard', stateTransitions: 1000000, expressRequests: 0, expressGBSeconds: 0 } },
  { name: 'Express Workflow', config: { workflowType: 'express', stateTransitions: 0, expressRequests: 100000000, expressGBSeconds: 50000 } },
];
