// Route 53 (DNS) Pricing Data

// Hosted zone pricing
export const ROUTE53_HOSTED_ZONE = {
  first25: 0.50,  // per hosted zone per month
  additional: 0.10, // per hosted zone per month after first 25
};

// Standard query pricing (per million queries)
export const ROUTE53_STANDARD_QUERIES = {
  first1Billion: 0.40,
  over1Billion: 0.20,
};

// Latency-based routing queries (per million)
export const ROUTE53_LATENCY_QUERIES = {
  first1Billion: 0.60,
  over1Billion: 0.30,
};

// Geo DNS queries (per million)
export const ROUTE53_GEO_QUERIES = {
  first1Billion: 0.70,
  over1Billion: 0.35,
};

// Health check pricing
export const ROUTE53_HEALTH_CHECKS = {
  awsEndpoint: 0.50,  // per health check per month
  nonAwsEndpoint: 0.75, // per health check per month
  withMetrics: 1.00,  // per health check with CloudWatch metrics
};

// Traffic flow pricing
export const ROUTE53_TRAFFIC_FLOW = {
  policyRecord: 50.00, // per policy record per month
  queriesPerMillion: 0.001, // per million queries
};

// Domain registration (annual, examples)
export const ROUTE53_DOMAIN_REGISTRATION = {
  '.com': 12.00,
  '.net': 11.00,
  '.org': 12.00,
  '.io': 39.00,
  '.co': 24.00,
};

// Calculate tiered query cost
function calculateTieredQueryCost(queries, pricePerMillion, pricePerMillionOver1B) {
  const queriesInMillions = queries / 1000000;
  let cost = 0;

  if (queriesInMillions <= 1000) {
    cost = queriesInMillions * pricePerMillion;
  } else {
    cost = 1000 * pricePerMillion;
    cost += (queriesInMillions - 1000) * pricePerMillionOver1B;
  }

  return cost;
}

// Main cost calculation function
export function calculateRoute53Cost(config) {
  const {
    hostedZones = 1,
    standardQueries = 10000000, // 10 million
    latencyQueries = 0,
    geoQueries = 0,
    awsHealthChecks = 0,
    nonAwsHealthChecks = 0,
    healthChecksWithMetrics = 0,
    trafficFlowPolicyRecords = 0,
    trafficFlowQueries = 0,
    domainRegistrations = 0,
    domainRegistrationType = '.com',
  } = config;

  // Hosted zone cost
  let hostedZoneCost = 0;
  if (hostedZones <= 25) {
    hostedZoneCost = hostedZones * ROUTE53_HOSTED_ZONE.first25;
  } else {
    hostedZoneCost = 25 * ROUTE53_HOSTED_ZONE.first25;
    hostedZoneCost += (hostedZones - 25) * ROUTE53_HOSTED_ZONE.additional;
  }

  // Query costs
  const standardQueryCost = calculateTieredQueryCost(
    standardQueries,
    ROUTE53_STANDARD_QUERIES.first1Billion,
    ROUTE53_STANDARD_QUERIES.over1Billion
  );

  const latencyQueryCost = calculateTieredQueryCost(
    latencyQueries,
    ROUTE53_LATENCY_QUERIES.first1Billion,
    ROUTE53_LATENCY_QUERIES.over1Billion
  );

  const geoQueryCost = calculateTieredQueryCost(
    geoQueries,
    ROUTE53_GEO_QUERIES.first1Billion,
    ROUTE53_GEO_QUERIES.over1Billion
  );

  const totalQueryCost = standardQueryCost + latencyQueryCost + geoQueryCost;

  // Health check costs
  const healthCheckCost =
    awsHealthChecks * ROUTE53_HEALTH_CHECKS.awsEndpoint +
    nonAwsHealthChecks * ROUTE53_HEALTH_CHECKS.nonAwsEndpoint +
    healthChecksWithMetrics * ROUTE53_HEALTH_CHECKS.withMetrics;

  // Traffic flow costs
  const trafficFlowCost =
    trafficFlowPolicyRecords * ROUTE53_TRAFFIC_FLOW.policyRecord +
    (trafficFlowQueries / 1000000) * ROUTE53_TRAFFIC_FLOW.queriesPerMillion;

  // Domain registration (monthly amortized cost)
  const domainCost = domainRegistrations * (ROUTE53_DOMAIN_REGISTRATION[domainRegistrationType] || 12) / 12;

  const monthlyCost = hostedZoneCost + totalQueryCost + healthCheckCost + trafficFlowCost + domainCost;

  return {
    service: 'Route53',
    hostedZoneCost,
    standardQueryCost,
    latencyQueryCost,
    geoQueryCost,
    totalQueryCost,
    healthCheckCost,
    trafficFlowCost,
    domainCost,
    monthlyCost,
    annualCost: monthlyCost * 12,
    breakdown: [
      {
        category: 'Hosted Zones',
        description: `${hostedZones} zone(s)`,
        monthlyCost: hostedZoneCost,
      },
      {
        category: 'Standard Queries',
        description: `${standardQueries.toLocaleString()} queries`,
        monthlyCost: standardQueryCost,
      },
      {
        category: 'Latency Queries',
        description: `${latencyQueries.toLocaleString()} queries`,
        monthlyCost: latencyQueryCost,
      },
      {
        category: 'Geo Queries',
        description: `${geoQueries.toLocaleString()} queries`,
        monthlyCost: geoQueryCost,
      },
      {
        category: 'Health Checks',
        description: `${awsHealthChecks + nonAwsHealthChecks + healthChecksWithMetrics} checks`,
        monthlyCost: healthCheckCost,
      },
      {
        category: 'Traffic Flow',
        description: `${trafficFlowPolicyRecords} policy records`,
        monthlyCost: trafficFlowCost,
      },
      {
        category: 'Domain Registration',
        description: `${domainRegistrations} domain(s)`,
        monthlyCost: domainCost,
      },
    ],
    configuration: {
      hostedZones,
      standardQueries,
      latencyQueries,
      geoQueries,
      awsHealthChecks,
      nonAwsHealthChecks,
      healthChecksWithMetrics,
      trafficFlowPolicyRecords,
      domainRegistrationType,
    },
  };
}

// Use case templates
export const ROUTE53_USE_CASE_TEMPLATES = [
  {
    name: 'Small Website',
    description: 'Single domain with basic DNS',
    config: {
      hostedZones: 1,
      standardQueries: 1000000,
      latencyQueries: 0,
      geoQueries: 0,
      awsHealthChecks: 1,
      nonAwsHealthChecks: 0,
      healthChecksWithMetrics: 0,
      trafficFlowPolicyRecords: 0,
      trafficFlowQueries: 0,
      domainRegistrations: 1,
      domainRegistrationType: '.com',
    },
  },
  {
    name: 'Multi-Region Application',
    description: 'Global application with latency routing',
    config: {
      hostedZones: 3,
      standardQueries: 50000000,
      latencyQueries: 20000000,
      geoQueries: 10000000,
      awsHealthChecks: 10,
      nonAwsHealthChecks: 0,
      healthChecksWithMetrics: 5,
      trafficFlowPolicyRecords: 5,
      trafficFlowQueries: 10000000,
      domainRegistrations: 2,
      domainRegistrationType: '.com',
    },
  },
  {
    name: 'Enterprise Multi-Domain',
    description: 'Large organization with many domains',
    config: {
      hostedZones: 50,
      standardQueries: 500000000,
      latencyQueries: 100000000,
      geoQueries: 50000000,
      awsHealthChecks: 30,
      nonAwsHealthChecks: 10,
      healthChecksWithMetrics: 20,
      trafficFlowPolicyRecords: 20,
      trafficFlowQueries: 50000000,
      domainRegistrations: 10,
      domainRegistrationType: '.com',
    },
  },
];
