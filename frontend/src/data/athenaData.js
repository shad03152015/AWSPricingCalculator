// Athena (Query) Pricing Data
export const ATHENA_PRICE_PER_TB_SCANNED = 5.00;
export function calculateAthenaCost(config) {
  const { dataScannedTB = 1 } = config;
  const queryCost = dataScannedTB * ATHENA_PRICE_PER_TB_SCANNED;
  const monthlyCost = queryCost;
  return {
    service: 'Athena', queryCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Data Scanned', description: dataScannedTB + ' TB', monthlyCost: queryCost },
    ],
    configuration: { dataScannedTB },
  };
}
export const ATHENA_USE_CASE_TEMPLATES = [
  { name: 'Light Usage', config: { dataScannedTB: 1 } },
  { name: 'Heavy Usage', config: { dataScannedTB: 50 } },
];
