// CloudWatch Pricing Data
export const CLOUDWATCH_METRIC = 0.30;
export const CLOUDWATCH_LOGS_INGESTION = 0.50;
export const CLOUDWATCH_LOGS_STORAGE = 0.03;
export const CLOUDWATCH_DASHBOARD = 3.00;
export function calculateCloudWatchCost(config) {
  const { metrics = 50, logsIngestionGB = 10, logsStorageGB = 50, dashboards = 1 } = config;
  const freeMetrics = 10;
  const billableMetrics = Math.max(0, metrics - freeMetrics);
  const metricCost = billableMetrics * CLOUDWATCH_METRIC;
  const ingestionCost = logsIngestionGB * CLOUDWATCH_LOGS_INGESTION;
  const storageCost = logsStorageGB * CLOUDWATCH_LOGS_STORAGE;
  const dashboardCost = dashboards * CLOUDWATCH_DASHBOARD;
  const monthlyCost = metricCost + ingestionCost + storageCost + dashboardCost;
  return {
    service: 'CloudWatch', metricCost, ingestionCost, storageCost, dashboardCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Metrics', description: metrics + ' metrics (' + billableMetrics + ' billable)', monthlyCost: metricCost },
      { category: 'Logs Ingestion', description: logsIngestionGB + ' GB', monthlyCost: ingestionCost },
      { category: 'Logs Storage', description: logsStorageGB + ' GB', monthlyCost: storageCost },
      { category: 'Dashboards', description: dashboards + ' dashboards', monthlyCost: dashboardCost },
    ],
    configuration: { metrics, logsIngestionGB, logsStorageGB, dashboards },
  };
}
export const CLOUDWATCH_USE_CASE_TEMPLATES = [
  { name: 'Small Application', config: { metrics: 20, logsIngestionGB: 5, logsStorageGB: 20, dashboards: 1 } },
  { name: 'Large Application', config: { metrics: 500, logsIngestionGB: 500, logsStorageGB: 2000, dashboards: 10 } },
];
