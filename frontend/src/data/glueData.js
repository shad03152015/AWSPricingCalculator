// Glue (ETL) Pricing Data
export const GLUE_DPU_HOUR = 0.44;
export const GLUE_CRAWLER_DPU_HOUR = 0.44;
export const GLUE_DATA_CATALOG_STORAGE = 1.00;
export const GLUE_DATA_CATALOG_REQUESTS = 1.00;
export function calculateGlueCost(config) {
  const { dpuHours = 100, crawlerDpuHours = 10, catalogObjects = 0, catalogRequests = 1000000 } = config;
  const dpuCost = dpuHours * GLUE_DPU_HOUR;
  const crawlerCost = crawlerDpuHours * GLUE_CRAWLER_DPU_HOUR;
  const catalogStorageCost = catalogObjects > 1000000 ? ((catalogObjects - 1000000) / 100000) * GLUE_DATA_CATALOG_STORAGE : 0;
  const catalogRequestCost = (catalogRequests / 1000000) * GLUE_DATA_CATALOG_REQUESTS;
  const monthlyCost = dpuCost + crawlerCost + catalogStorageCost + catalogRequestCost;
  return {
    service: 'Glue', dpuCost, crawlerCost, catalogStorageCost, catalogRequestCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'ETL DPU Hours', description: dpuHours + ' DPU-hours', monthlyCost: dpuCost },
      { category: 'Crawler DPU Hours', description: crawlerDpuHours + ' DPU-hours', monthlyCost: crawlerCost },
      { category: 'Data Catalog Storage', description: catalogObjects + ' objects', monthlyCost: catalogStorageCost },
      { category: 'Data Catalog Requests', description: Math.round(catalogRequests/1000000) + 'M requests', monthlyCost: catalogRequestCost },
    ],
    configuration: { dpuHours, crawlerDpuHours, catalogObjects, catalogRequests },
  };
}
export const GLUE_USE_CASE_TEMPLATES = [
  { name: 'Small ETL', config: { dpuHours: 50, crawlerDpuHours: 5, catalogObjects: 500000, catalogRequests: 100000 } },
  { name: 'Production ETL', config: { dpuHours: 1000, crawlerDpuHours: 100, catalogObjects: 5000000, catalogRequests: 10000000 } },
];
