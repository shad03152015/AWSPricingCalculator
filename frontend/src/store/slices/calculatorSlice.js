import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  services: [],
  availableServices: [],
  totalMonthlyCost: 0,
  isCalculating: false,
  error: null,
};

// Async thunks
export const loadAvailableServices = createAsyncThunk(
  'calculator/loadAvailableServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/pricing/services');
      return response.data.services;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load services');
    }
  }
);

export const calculateCost = createAsyncThunk(
  'calculator/calculateCost',
  async ({ id, serviceCode, region, configuration }, { rejectWithValue }) => {
    try {
      const response = await api.post('/pricing/calculate', {
        serviceCode,
        region,
        configuration,
      });
      return { id, monthlyCost: response.data.monthlyCost, breakdown: response.data.breakdown };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Calculation failed');
    }
  }
);

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    addService: (state, action) => {
      const service = state.availableServices.find(s => s.code === action.payload);
      if (service) {
        state.services.push({
          id: uuidv4(),
          serviceCode: service.code,
          serviceName: service.name,
          region: 'us-east-1',
          configuration: {},
          monthlyCost: 0,
        });
      }
    },
    removeService: (state, action) => {
      state.services = state.services.filter(s => s.id !== action.payload);
      state.totalMonthlyCost = state.services.reduce((sum, s) => sum + s.monthlyCost, 0);
    },
    updateServiceConfig: (state, action) => {
      const { id, configuration } = action.payload;
      const service = state.services.find(s => s.id === id);
      if (service) {
        service.configuration = { ...service.configuration, ...configuration };
      }
    },
    updateServiceRegion: (state, action) => {
      const { id, region } = action.payload;
      const service = state.services.find(s => s.id === id);
      if (service) {
        service.region = region;
      }
    },
    clearAllServices: (state) => {
      state.services = [];
      state.totalMonthlyCost = 0;
    },
    loadEstimateIntoCalculator: (state, action) => {
      state.services = action.payload.services;
      state.totalMonthlyCost = action.payload.totalMonthlyCost;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load available services
      .addCase(loadAvailableServices.fulfilled, (state, action) => {
        state.availableServices = action.payload;
      })
      // Calculate cost
      .addCase(calculateCost.pending, (state) => {
        state.isCalculating = true;
        state.error = null;
      })
      .addCase(calculateCost.fulfilled, (state, action) => {
        state.isCalculating = false;
        const service = state.services.find(s => s.id === action.payload.id);
        if (service) {
          service.monthlyCost = action.payload.monthlyCost;
        }
        state.totalMonthlyCost = state.services.reduce((sum, s) => sum + s.monthlyCost, 0);
      })
      .addCase(calculateCost.rejected, (state, action) => {
        state.isCalculating = false;
        state.error = action.payload;
      });
  },
});

export const {
  addService,
  removeService,
  updateServiceConfig,
  updateServiceRegion,
  clearAllServices,
  loadEstimateIntoCalculator,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
