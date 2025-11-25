import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ClaimDto, CreateClaimDto } from '../types/User';
import { api } from '../api';

interface ClaimsState {
  claims: ClaimDto[];
  userClaims: ClaimDto[];
  pendingClaims: ClaimDto[];
  approvedClaims: ClaimDto[];
  rejectedClaims: ClaimDto[];
  paidClaims: ClaimDto[];
  loading: boolean;
  error: string | null;
}

const initialState: ClaimsState = {
  claims: [],
  userClaims: [],
  pendingClaims: [],
  approvedClaims: [],
  rejectedClaims: [],
  paidClaims: [],
  loading: false,
  error: null,
};

// Async thunks
export const createClaim = createAsyncThunk(
  'claims/create',
  async (claimData: CreateClaimDto, { rejectWithValue }) => {
    try {
      const response = await api.createClaim(claimData);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create claim');
    }
  }
);

export const fetchUserClaims = createAsyncThunk(
  'claims/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getUserClaims();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user claims');
    }
  }
);

export const fetchPendingClaims = createAsyncThunk(
  'claims/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPendingClaims();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch pending claims');
    }
  }
);

export const fetchApprovedClaims = createAsyncThunk(
  'claims/fetchApproved',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getApprovedClaims();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch approved claims');
    }
  }
);

export const fetchRejectedClaims = createAsyncThunk(
  'claims/fetchRejected',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getRejectedClaims();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch rejected claims');
    }
  }
);

export const fetchPaidClaims = createAsyncThunk(
  'claims/fetchPaid',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPaidClaims();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch paid claims');
    }
  }
);

export const fetchManagerClaims = createAsyncThunk(
  'claims/fetchManagerClaims',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getManagerClaims();
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch manager claims');
    }
  }
);

export const updateClaim = createAsyncThunk(
  'claims/update',
  async ({ id, claimData }: { id: number; claimData: Partial<CreateClaimDto> }, { rejectWithValue }) => {
    try {
      const response = await api.updateClaim(id, claimData);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update claim');
    }
  }
);

export const deleteClaim = createAsyncThunk(
  'claims/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.deleteClaim(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete claim');
    }
  }
);

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearClaims: (state) => {
      state.claims = [];
      state.userClaims = [];
      state.pendingClaims = [];
      state.approvedClaims = [];
      state.rejectedClaims = [];
      state.paidClaims = [];
    },
    invalidatePendingClaims: (state) => {
      state.pendingClaims = [];
    },
    invalidateApprovedClaims: (state) => {
      state.approvedClaims = [];
    },
    invalidateRejectedClaims: (state) => {
      state.rejectedClaims = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create claim
      .addCase(createClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.userClaims.unshift(action.payload);
        state.pendingClaims.unshift(action.payload);
      })
      .addCase(createClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user claims
      .addCase(fetchUserClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.userClaims = action.payload;
      })
      .addCase(fetchUserClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch pending claims
      .addCase(fetchPendingClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingClaims = action.payload;
      })
      .addCase(fetchPendingClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch approved claims
      .addCase(fetchApprovedClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedClaims = action.payload;
      })
      .addCase(fetchApprovedClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch rejected claims
      .addCase(fetchRejectedClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRejectedClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedClaims = action.payload;
      })
      .addCase(fetchRejectedClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch paid claims
      .addCase(fetchPaidClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaidClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.paidClaims = action.payload;
      })
      .addCase(fetchPaidClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update claim
      .addCase(updateClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClaim.fulfilled, (state, action) => {
        state.loading = false;
        const updatedClaim = action.payload;
        // Update in all relevant arrays
        const updateInArray = (array: ClaimDto[]) => {
          const index = array.findIndex(claim => claim.claimId === updatedClaim.claimId);
          if (index !== -1) {
            array[index] = updatedClaim;
          }
        };
        updateInArray(state.userClaims);
        updateInArray(state.pendingClaims);
        updateInArray(state.approvedClaims);
        updateInArray(state.rejectedClaims);
        updateInArray(state.paidClaims);
      })
      .addCase(updateClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete claim
      .addCase(deleteClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClaim.fulfilled, (state, action) => {
        state.loading = false;
        const claimId = action.payload;
        // Remove from all arrays
        state.userClaims = state.userClaims.filter(claim => claim.claimId !== claimId);
        state.pendingClaims = state.pendingClaims.filter(claim => claim.claimId !== claimId);
        state.approvedClaims = state.approvedClaims.filter(claim => claim.claimId !== claimId);
        state.rejectedClaims = state.rejectedClaims.filter(claim => claim.claimId !== claimId);
        state.paidClaims = state.paidClaims.filter(claim => claim.claimId !== claimId);
      })
      .addCase(deleteClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch manager claims
      .addCase(fetchManagerClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerClaims.fulfilled, (state, action) => {
        state.loading = false;
        // Separate claims by status
        state.pendingClaims = action.payload.filter(claim => claim.status === 'Pending' || claim.status === 'Submitted');
        state.approvedClaims = action.payload.filter(claim => claim.status === 'Approved');
        state.rejectedClaims = action.payload.filter(claim => claim.status === 'Rejected');
      })
      .addCase(fetchManagerClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearClaims, invalidatePendingClaims, invalidateApprovedClaims, invalidateRejectedClaims } = claimsSlice.actions;
export default claimsSlice.reducer;