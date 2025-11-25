import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

interface ApprovalsState {
  loading: boolean;
  error: string | null;
}

const initialState: ApprovalsState = {
  loading: false,
  error: null,
};

// Async thunks
export const processApproval = createAsyncThunk(
  'approvals/process',
  async (data: { claimId: number; status: string; comments: string }, { rejectWithValue }) => {
    try {
      const response = await api.processApproval(data);
      return { ...response, claimId: data.claimId, status: data.status };
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to process approval');
    }
  }
);

export const processPayment = createAsyncThunk(
  'approvals/processPayment',
  async (data: { ClaimId: number; PaymentMethod: string; TransactionReference: string; Amount: number; Status: string }, { rejectWithValue }) => {
    try {
      const response = await api.processPayment(data);
      return { ...response, claimId: data.ClaimId };
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to process payment');
    }
  }
);

const approvalsSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Process approval
      .addCase(processApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processApproval.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(processApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = approvalsSlice.actions;
export default approvalsSlice.reducer;