// Kinesis (Streaming) Pricing Data
export const KINESIS_SHARD_HOUR = 0.015;
export const KINESIS_PUT_PAYLOAD_UNIT = 0.014;
export const KINESIS_EXTENDED_RETENTION = 0.023;
export const KINESIS_ENHANCED_FANOUT_SHARD = 0.015;
export const KINESIS_ENHANCED_FANOUT_DATA = 0.013;
export function calculateKinesisCost(config) {
  const { shards = 10, putPayloadUnits = 100000000, extendedRetentionHours = 0, enhancedFanoutConsumers = 0, enhancedFanoutDataGB = 0 } = config;
  const shardCost = shards * KINESIS_SHARD_HOUR * 730;
  const putCost = (putPayloadUnits / 1000000) * KINESIS_PUT_PAYLOAD_UNIT;
  const extendedRetentionCost = (extendedRetentionHours > 0) ? shards * KINESIS_EXTENDED_RETENTION * extendedRetentionHours : 0;
  const enhancedFanoutShardCost = enhancedFanoutConsumers * shards * KINESIS_ENHANCED_FANOUT_SHARD * 730;
  const enhancedFanoutDataCost = enhancedFanoutDataGB * KINESIS_ENHANCED_FANOUT_DATA;
  const monthlyCost = shardCost + putCost + extendedRetentionCost + enhancedFanoutShardCost + enhancedFanoutDataCost;
  return {
    service: 'Kinesis', shardCost, putCost, extendedRetentionCost, enhancedFanoutShardCost, enhancedFanoutDataCost, monthlyCost, annualCost: monthlyCost * 12,
    breakdown: [
      { category: 'Shard Hours', description: shards + ' shards', monthlyCost: shardCost },
      { category: 'PUT Payload Units', description: Math.round(putPayloadUnits/1000000) + 'M units', monthlyCost: putCost },
      { category: 'Extended Retention', description: extendedRetentionHours + ' hours', monthlyCost: extendedRetentionCost },
      { category: 'Enhanced Fan-out', description: enhancedFanoutConsumers + ' consumers', monthlyCost: enhancedFanoutShardCost + enhancedFanoutDataCost },
    ],
    configuration: { shards, putPayloadUnits, extendedRetentionHours, enhancedFanoutConsumers, enhancedFanoutDataGB },
  };
}
export const KINESIS_USE_CASE_TEMPLATES = [
  { name: 'Basic Streaming', config: { shards: 5, putPayloadUnits: 50000000, extendedRetentionHours: 0, enhancedFanoutConsumers: 0, enhancedFanoutDataGB: 0 } },
  { name: 'High Throughput', config: { shards: 50, putPayloadUnits: 1000000000, extendedRetentionHours: 168, enhancedFanoutConsumers: 3, enhancedFanoutDataGB: 1000 } },
];
