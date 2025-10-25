export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface Service {
  _id: string;
  code: string;
  name: string;
  fullName: string;
  description: string;
  category: string;
  icon?: string;
  configSchema: ConfigSchema;
  availableRegions: string[];
  isActive: boolean;
}

export interface ConfigSchema {
  fields: ConfigField[];
}

export interface ConfigField {
  name: string;
  type: 'text' | 'number' | 'dropdown' | 'searchable-dropdown' | 'checkbox' | 'slider';
  label: string;
  required: boolean;
  default?: any;
  min?: number;
  max?: number;
  options?: string[] | 'fetch_from_regions';
  helpText?: string;
}

export interface Region {
  _id: string;
  code: string;
  name: string;
  location: string;
  isActive: boolean;
}

export interface ServiceConfig {
  serviceCode: string;
  serviceName: string;
  configuration: Record<string, any>;
  costBreakdown: CostBreakdown;
  monthlyCost: number;
  annualCost: number;
}

export interface CostBreakdown {
  compute?: number;
  storage?: number;
  dataTransfer?: number;
  requests?: number;
  retrieval?: number;
  backup?: number;
  [key: string]: number | undefined;
}

export interface Estimate {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  services: ServiceConfig[];
  totalMonthlyCost: number;
  totalAnnualCost: number;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalculationRequest {
  serviceCode: string;
  configuration: Record<string, any>;
}

export interface CalculationResponse {
  success: boolean;
  data: {
    serviceCode: string;
    serviceName: string;
    configuration: Record<string, any>;
    costBreakdown: CostBreakdown;
    monthlyCost: number;
    annualCost: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
}
