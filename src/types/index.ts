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
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OtpData {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MonitorData {
  name: string;
  url: string;
  method: "GET" | "POST";
  expectedStatusCode: number;
  interval: number;
  timeout: number;
}
