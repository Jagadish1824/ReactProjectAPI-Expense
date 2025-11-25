import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AnalyticsData } from '../api';
import { api } from '../api';

interface AnalyticsState {
  financeAnalytics: AnalyticsData | null;
  managerAnalytics: AnalyticsData | null;
  employeeAnalytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  financeAnalytics: null,
  managerAnalytics: null,
  employeeAnalytics: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchFinanceAnalytics = createAsyncThunk(
  'analytics/fetchFinance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getFinanceAnalytics();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch finance analytics');
    }
  }
);

export const fetchManagerAnalytics = createAsyncThunk(
  'analytics/fetchManager',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getManagerAnalytics();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch manager analytics');
    }
  }
);

export const fetchEmployeeAnalytics = createAsyncThunk(
  'analytics/fetchEmployee',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getEmployeeAnalytics();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch employee analytics');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.financeAnalytics = null;
      state.managerAnalytics = null;
      state.employeeAnalytics = null;
    },
    clearManagerAnalytics: (state) => {
      state.managerAnalytics = null;
    },
    invalidateManagerAnalytics: (state) => {
      state.managerAnalytics = null;
    },
    invalidateFinanceAnalytics: (state) => {
      state.financeAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch finance analytics
      .addCase(fetchFinanceAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinanceAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.financeAnalytics = action.payload;
      })
      .addCase(fetchFinanceAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch manager analytics
      .addCase(fetchManagerAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.managerAnalytics = action.payload;
      })
      .addCase(fetchManagerAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch employee analytics
      .addCase(fetchEmployeeAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeAnalytics = action.payload;
      })
      .addCase(fetchEmployeeAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearAnalytics, clearManagerAnalytics, invalidateManagerAnalytics, invalidateFinanceAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;