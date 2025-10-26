// EventBridge Pricing Data
export const EVENTBRIDGE_CUSTOM_EVENTS = 1.00;
export const EVENTBRIDGE_SCHEMA_REGISTRY = 0.10;
export function calculateEventBridgeCost(config) {
  const { customEvents = 1000000, schemas = 0 } = config;
  const eventCost = (customEvents / 1000000) * EVENTBRIDGE_CUSTOM_EVENTS;
  const schemaCost = schemas * EVENTBRIDGE_SCHEMA_REGISTRY;
  const monthlyCost = eventCost + schemaCost;
  return {
    service: 'EventBridge', eventCost, schemaCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Custom Events', description: Math.round(customEvents/1000000) + 'M events', monthlyCost: eventCost },
      { category: 'Schema Registry', description: schemas + ' schemas', monthlyCost: schemaCost },
    ],
    configuration: { customEvents, schemas },
  };
}
export const EVENTBRIDGE_USE_CASE_TEMPLATES = [
  { name: 'Basic Events', config: { customEvents: 1000000, schemas: 5 } },
  { name: 'High Volume', config: { customEvents: 100000000, schemas: 50 } },
];
