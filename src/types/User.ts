export const UserRole = {
  Employee: 1,
  Manager: 2,
  Finance: 3
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  createdDate: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  departmentId: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ClaimDto {
  claimId: number;
  userId: number;
  userName: string;
  employeeName?: string;
  title: string;
  description: string;
  categoryId: number;
  categoryName: string;
  amount: number;
  expenseDate: string;
  receiptImage: string;
  status: string;
  submittedDate: string;
  submissionDate: string;
  comments?: string;
  transactionReference?: string;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface CreateClaimDto {
  title: string;
  description: string;
  categoryId: number;
  amount: number;
  expenseDate: string;
  receiptImage?: string;
}

export interface DepartmentDto {
  departmentId: number;
  departmentName: string;
  description: string;
}

export interface ExpenseCategoryDto {
  categoryId: number;
  categoryName: string;
  description: string;
  minAmount: number;
  maxAmount: number;
}