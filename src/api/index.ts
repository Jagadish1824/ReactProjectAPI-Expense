import axios from 'axios';
import type { LoginDto, CreateUserDto, AuthResponse, ClaimDto, CreateClaimDto, ExpenseCategoryDto } from '../types/User';

// Config
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7074/api';
console.log('API Base URL:', API_BASE_URL);

// Axios setup
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Silent axios instance for login (no console errors)
const silentApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Debug payment requests
  if (config.url === '/Reimbursement') {
    console.log('Payment request:', config.data);
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      if (error.config?.url !== '/auth/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        // Create a clean error for login failures without axios stack trace
        const loginError = new Error('Invalid email or password');
        loginError.name = 'LoginError';
        return Promise.reject(loginError);
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Department {
  departmentId: number;
  departmentName: string;
  description: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface AnalyticsData {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  paidClaims: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

// API
export const api = {
  // Auth
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    try {
      const response = await silentApiClient.post('/auth/login', {
        Email: credentials.email,
        Password: credentials.password
      });
      
      // Backend actually returns lowercase field names: { success: true/false, token?: string, user?: object, message?: string }
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Invalid email or password');
      }
      
      if (response.data.success === true) {
        return { token: response.data.token, user: response.data.user };
      }
      
      throw new Error('Unexpected response format');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data?: { success?: boolean; message?: string } } };
        if (axiosError.response?.data?.success === false) {
          throw new Error(axiosError.response.data.message || 'Invalid email or password');
        }
      }
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  },

  register: async (userData: CreateUserDto): Promise<{ Message: string }> => {
    try {
      const response = await apiClient.post('/auth/register', {
        Name: userData.name, Email: userData.email, Password: userData.password,
        Role: userData.role, DepartmentId: userData.departmentId
      });
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  },

  // Claims
  createClaim: async (claimData: CreateClaimDto): Promise<ClaimDto> => {
    try {
      const response = await apiClient.post('/Claim', claimData);
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create claim');
    }
  },

  getUserClaims: async (): Promise<ClaimDto[]> => {
    try {
      const response = await apiClient.get('/Claim');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch claims');
    }
  },

  getPendingClaims: async (): Promise<ClaimDto[]> => {
    try {
      const response = await apiClient.get('/Claim/pending');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch pending claims');
    }
  },

  getApprovedClaims: async (): Promise<ClaimDto[]> => {
    try {
      const response = await apiClient.get('/Claim/approved');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch approved claims');
    }
  },

  getRejectedClaims: async (): Promise<ClaimDto[]> => {
    try {
      const response = await apiClient.get('/Claim/rejected');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch rejected claims');
    }
  },

  getPaidClaims: async (): Promise<ClaimDto[]> => {
    try {
      const response = await apiClient.get('/Claim/paid');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch paid claims');
    }
  },

  getManagerClaims: async (): Promise<ClaimDto[]> => {
    try {
      const response = await apiClient.get('/Claim/manager/all');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch manager claims');
    }
  },

  updateClaim: async (id: number, claimData: Partial<CreateClaimDto>): Promise<ClaimDto> => {
    try {
      const response = await apiClient.put(`/Claim/${id}`, claimData);
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update claim');
    }
  },

  deleteClaim: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/Claim/${id}`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete claim');
    }
  },

  // Approvals
  processApproval: async (data: { claimId: number; status: string; comments: string }): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.post('/Approval', data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to process approval');
    }
  },

  // Reimbursements
  processPayment: async (data: { ClaimId: number; PaymentMethod: string; TransactionReference: string; Amount: number; Status: string }): Promise<{ success: boolean }> => {
    try {
      // Backend expects PascalCase based on CreateReimbursementDto
      const paymentData = {
        ClaimId: data.ClaimId,
        PaymentMethod: data.PaymentMethod,
        TransactionReference: data.TransactionReference,
        Amount: data.Amount,
        Status: data.Status
      };
      
      const response = await apiClient.post('/Reimbursement', paymentData);
      
      // Backend returns { success: boolean, error?: string, data?: object }
      if (response.data.success === false) {
        throw new Error(response.data.error || 'Payment processing failed');
      }
      
      return { success: response.data.success };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data?: any } };
        if (axiosError.response?.status === 400) {
          const errorMsg = axiosError.response.data?.error || axiosError.response.data?.message || 'Invalid payment data';
          throw new Error(errorMsg);
        }
      }
      throw new Error(error instanceof Error ? error.message : 'Failed to process payment');
    }
  },

  // Departments
  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await apiClient.get('/Department');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch departments');
    }
  },

  createDepartment: async (data: { departmentName: string; description: string }): Promise<Department> => {
    try {
      const response = await apiClient.post('/Department', data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create department');
    }
  },

  updateDepartment: async (id: number, data: { departmentName: string; description: string }): Promise<Department> => {
    try {
      const response = await apiClient.put(`/Department/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update department');
    }
  },

  deleteDepartment: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/Department/${id}`);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data?: { message?: string } } };
        if (axiosError.response?.status === 500) {
          throw new Error('Cannot delete department. It may be in use by existing users or claims.');
        }
        if (axiosError.response?.status === 404) {
          throw new Error('Department not found.');
        }
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      throw new Error(error instanceof Error ? error.message : 'Failed to delete department');
    }
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get('/ExpenseCategory');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  },

  createCategory: async (data: { CategoryName: string; Description: string; MinAmount: number; MaxAmount: number }): Promise<Category> => {
    try {
      const response = await apiClient.post('/ExpenseCategory', data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create category');
    }
  },

  updateCategory: async (id: number, data: { CategoryName: string; Description: string; MinAmount: number; MaxAmount: number }): Promise<Category> => {
    try {
      const response = await apiClient.put(`/ExpenseCategory/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update category');
    }
  },

  deleteCategory: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/ExpenseCategory/${id}`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete category');
    }
  },

  // Analytics
  getFinanceAnalytics: async (): Promise<AnalyticsData> => {
    try {
      const response = await apiClient.get('/Analytics/dashboard');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch finance analytics');
    }
  },

  getManagerAnalytics: async (): Promise<AnalyticsData> => {
    try {
      const response = await apiClient.get('/Analytics/dashboard');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch manager analytics');
    }
  },

  getEmployeeAnalytics: async (): Promise<AnalyticsData> => {
    try {
      const response = await apiClient.get('/Analytics/user');
      return response.data;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch employee analytics');
    }
  },

  // Expense Categories (fallback)
  getExpenseCategories: async (): Promise<ExpenseCategoryDto[]> => {
    try {
      const response = await apiClient.get('/ExpenseCategory');
      return response.data;
    } catch {
      return [
        { categoryId: 1, categoryName: 'Travel', description: 'Travel expenses', minAmount: 100, maxAmount: 50000 },
        { categoryId: 2, categoryName: 'Meals', description: 'Meal expenses', minAmount: 50, maxAmount: 5000 },
        { categoryId: 3, categoryName: 'Office Supplies', description: 'Office supply expenses', minAmount: 10, maxAmount: 10000 },
        { categoryId: 4, categoryName: 'Training', description: 'Training and education', minAmount: 500, maxAmount: 100000 },
        { categoryId: 5, categoryName: 'Equipment', description: 'Equipment purchases', minAmount: 1000, maxAmount: 200000 }
      ];
    }
  }
};