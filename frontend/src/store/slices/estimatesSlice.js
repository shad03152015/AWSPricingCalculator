import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  list: [],
  currentEstimate: null,
  comparisonList: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchEstimates = createAsyncThunk(
  'estimates/fetchEstimates',
  async ({ sort, search } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (sort) params.append('sort', sort);
      if (search) params.append('search', search);

      const response = await api.get(`/estimates?${params.toString()}`);
      return response.data.estimates;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch estimates');
    }
  }
);

export const fetchEstimateById = createAsyncThunk(
  'estimates/fetchEstimateById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/estimates/${id}`);
      return response.data.estimate;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch estimate');
    }
  }
);

export const createEstimate = createAsyncThunk(
  'estimates/createEstimate',
  async (estimateData, { rejectWithValue }) => {
    try {
      const response = await api.post('/estimates', estimateData);
      return response.data.estimate;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create estimate');
    }
  }
);

export const updateEstimate = createAsyncThunk(
  'estimates/updateEstimate',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/estimates/${id}`, data);
      return response.data.estimate;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update estimate');
    }
  }
);

export const deleteEstimate = createAsyncThunk(
  'estimates/deleteEstimate',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/estimates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete estimate');
    }
  }
);

export const duplicateEstimate = createAsyncThunk(
  'estimates/duplicateEstimate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/estimates/${id}/duplicate`);
      return response.data.estimate;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to duplicate estimate');
    }
  }
);

export const shareEstimate = createAsyncThunk(
  'estimates/shareEstimate',
  async ({ id, shareOptions }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/estimates/${id}/share`, shareOptions);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to share estimate');
    }
  }
);

const estimatesSlice = createSlice({
  name: 'estimates',
  initialState,
  reducers: {
    clearCurrentEstimate: (state) => {
      state.currentEstimate = null;
    },
    addToComparison: (state, action) => {
      if (state.comparisonList.length < 3 && !state.comparisonList.includes(action.payload)) {
        state.comparisonList.push(action.payload);
      }
    },
    removeFromComparison: (state, action) => {
      state.comparisonList = state.comparisonList.filter(id => id !== action.payload);
    },
    clearComparison: (state) => {
      state.comparisonList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch estimates
      .addCase(fetchEstimates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEstimates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchEstimates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch estimate by ID
      .addCase(fetchEstimateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEstimateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEstimate = action.payload;
      })
      .addCase(fetchEstimateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create estimate
      .addCase(createEstimate.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      // Update estimate
      .addCase(updateEstimate.fulfilled, (state, action) => {
        const index = state.list.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentEstimate?._id === action.payload._id) {
          state.currentEstimate = action.payload;
        }
      })
      // Delete estimate
      .addCase(deleteEstimate.fulfilled, (state, action) => {
        state.list = state.list.filter(e => e._id !== action.payload);
      })
      // Duplicate estimate
      .addCase(duplicateEstimate.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const {
  clearCurrentEstimate,
  addToComparison,
  removeFromComparison,
  clearComparison,
} = estimatesSlice.actions;

export default estimatesSlice.reducer;
