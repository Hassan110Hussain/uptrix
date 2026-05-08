// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Monitor Types
export interface Monitor {
  _id: string;
  userId: string;
  name: string;
  url: string;
  method: "GET" | "POST";
  expectedStatusCode: number;
  interval: number;
  timeout: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonitorListResponse {
  total: number;
  offset: number;
  limit: number;
  totalPages: number;
  records: Monitor[];
}

export interface MonitorFilters {
  search?: string;
  method?: string;
  isActive?: string;
  offset?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OtpFormData {
  email: string;
  otp: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MonitorFormData {
  name: string;
  url: string;
  method: "GET" | "POST";
  expectedStatusCode: number;
  interval: number;
  timeout: number;
}
