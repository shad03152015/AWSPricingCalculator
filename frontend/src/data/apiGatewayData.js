// API Gateway Pricing Data

// API Types
export const API_GATEWAY_TYPES = [
  { value: 'REST', label: 'REST API', description: 'Full-featured REST APIs' },
  { value: 'HTTP', label: 'HTTP API', description: 'Lower cost, streamlined REST APIs' },
  { value: 'WebSocket', label: 'WebSocket API', description: 'Real-time two-way communication' },
];

// REST API Pricing (per million requests)
export const REST_API_PRICING = {
  first333Million: 3.50,
  next667Million: 2.80,
  next19Billion: 2.38,
  over20Billion: 1.51,
};

// HTTP API Pricing (per million requests)
export const HTTP_API_PRICING = {
  first300Million: 1.00,
  over300Million: 0.90,
};

// WebSocket API Pricing
export const WEBSOCKET_API_PRICING = {
  connectionMinutes: 0.25, // per million connection minutes
  messages: 1.00, // per million messages (first 1B)
  messagesOver1B: 0.80, // per million messages (over 1B)
};

// Caching pricing (per hour)
export const API_GATEWAY_CACHE = {
  '0.5GB': 0.020,
  '1.6GB': 0.038,
  '6.1GB': 0.200,
  '13.5GB': 0.250,
  '28.4GB': 0.500,
  '58.2GB': 1.000,
  '118GB': 1.900,
  '237GB': 3.800,
};

// Calculate tiered REST API cost
function calculateRESTAPICost(requests) {
  const requestsInMillions = requests / 1000000;
  let cost = 0;

  if (requestsInMillions <= 333) {
    cost = requestsInMillions * REST_API_PRICING.first333Million;
  } else if (requestsInMillions <= 1000) {
    cost = 333 * REST_API_PRICING.first333Million;
    cost += (requestsInMillions - 333) * REST_API_PRICING.next667Million;
  } else if (requestsInMillions <= 20000) {
    cost = 333 * REST_API_PRICING.first333Million;
    cost += 667 * REST_API_PRICING.next667Million;
    cost += (requestsInMillions - 1000) * REST_API_PRICING.next19Billion;
  } else {
    cost = 333 * REST_API_PRICING.first333Million;
    cost += 667 * REST_API_PRICING.next667Million;
    cost += 19000 * REST_API_PRICING.next19Billion;
    cost += (requestsInMillions - 20000) * REST_API_PRICING.over20Billion;
  }

  return cost;
}

// Calculate HTTP API cost
function calculateHTTPAPICost(requests) {
  const requestsInMillions = requests / 1000000;
  let cost = 0;

  if (requestsInMillions <= 300) {
    cost = requestsInMillions * HTTP_API_PRICING.first300Million;
  } else {
    cost = 300 * HTTP_API_PRICING.first300Million;
    cost += (requestsInMillions - 300) * HTTP_API_PRICING.over300Million;
  }

  return cost;
}

// Calculate WebSocket API cost
function calculateWebSocketAPICost(connectionMinutes, messages) {
  const connectionCost = (connectionMinutes / 1000000) * WEBSOCKET_API_PRICING.connectionMinutes;

  const messagesInMillions = messages / 1000000;
  let messageCost = 0;

  if (messagesInMillions <= 1000) {
    messageCost = messagesInMillions * WEBSOCKET_API_PRICING.messages;
  } else {
    messageCost = 1000 * WEBSOCKET_API_PRICING.messages;
    messageCost += (messagesInMillions - 1000) * WEBSOCKET_API_PRICING.messagesOver1B;
  }

  return connectionCost + messageCost;
}

// Main cost calculation function
export function calculateAPIGatewayCost(config) {
  const {
    apiType = 'REST',
    requests = 10000000, // 10 million
    connectionMinutes = 0,
    messages = 0,
    cachingEnabled = false,
    cacheSize = '0.5GB',
    cacheHoursPerMonth = 0,
  } = config;

  let apiCost = 0;
  let connectionCost = 0;
  let messageCost = 0;

  if (apiType === 'REST') {
    apiCost = calculateRESTAPICost(requests);
  } else if (apiType === 'HTTP') {
    apiCost = calculateHTTPAPICost(requests);
  } else if (apiType === 'WebSocket') {
    const totalCost = calculateWebSocketAPICost(connectionMinutes, messages);
    connectionCost = (connectionMinutes / 1000000) * WEBSOCKET_API_PRICING.connectionMinutes;
    messageCost = totalCost - connectionCost;
    apiCost = totalCost;
  }

  // Caching cost
  const cachingCost = cachingEnabled ? (API_GATEWAY_CACHE[cacheSize] || 0) * cacheHoursPerMonth : 0;

  const monthlyCost = apiCost + cachingCost;

  return {
    service: 'APIGateway',
    apiType,
    apiCost,
    connectionCost,
    messageCost,
    cachingCost,
    monthlyCost,
    annualCost: monthlyCost * 12,
    breakdown: [
      {
        category: `${apiType} API ${apiType === 'WebSocket' ? 'Connections' : 'Requests'}`,
        description: apiType === 'WebSocket'
          ? `${connectionMinutes.toLocaleString()} connection minutes`
          : `${requests.toLocaleString()} requests`,
        monthlyCost: apiType === 'WebSocket' ? connectionCost : apiCost,
      },
      ...(apiType === 'WebSocket' ? [{
        category: 'WebSocket Messages',
        description: `${messages.toLocaleString()} messages`,
        monthlyCost: messageCost,
      }] : []),
      {
        category: 'Caching',
        description: cachingEnabled ? `${cacheSize} - ${cacheHoursPerMonth} hours` : 'Disabled',
        monthlyCost: cachingCost,
      },
    ],
    configuration: {
      apiType,
      requests,
      connectionMinutes,
      messages,
      cachingEnabled,
      cacheSize,
    },
  };
}

// Use case templates
export const API_GATEWAY_USE_CASE_TEMPLATES = [
  {
    name: 'Small REST API',
    description: 'Basic REST API for small application',
    config: {
      apiType: 'REST',
      requests: 1000000,
      connectionMinutes: 0,
      messages: 0,
      cachingEnabled: false,
      cacheSize: '0.5GB',
      cacheHoursPerMonth: 0,
    },
  },
  {
    name: 'High Traffic HTTP API',
    description: 'HTTP API with millions of requests',
    config: {
      apiType: 'HTTP',
      requests: 100000000,
      connectionMinutes: 0,
      messages: 0,
      cachingEnabled: false,
      cacheSize: '0.5GB',
      cacheHoursPerMonth: 0,
    },
  },
  {
    name: 'WebSocket Real-time App',
    description: 'Real-time application with WebSocket connections',
    config: {
      apiType: 'WebSocket',
      requests: 0,
      connectionMinutes: 10000000,
      messages: 50000000,
      cachingEnabled: false,
      cacheSize: '0.5GB',
      cacheHoursPerMonth: 0,
    },
  },
  {
    name: 'Cached REST API',
    description: 'REST API with caching enabled',
    config: {
      apiType: 'REST',
      requests: 50000000,
      connectionMinutes: 0,
      messages: 0,
      cachingEnabled: true,
      cacheSize: '6.1GB',
      cacheHoursPerMonth: 730,
    },
  },
];
