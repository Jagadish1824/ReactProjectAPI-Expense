import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import claimsReducer from './claimsSlice';
import departmentsReducer from './departmentsSlice';
import categoriesReducer from './categoriesSlice';
import analyticsReducer from './analyticsSlice';
import approvalsReducer from './approvalsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    claims: claimsReducer,
    departments: departmentsReducer,
    categories: categoriesReducer,
    analytics: analyticsReducer,
    approvals: approvalsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;