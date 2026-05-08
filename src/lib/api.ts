const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${BASE_URL}${endpoint}`;
  console.log('Making API request to:', url);
  console.log('Request config:', config);

  try {
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API
export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body }),

  login: (body: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body }),

  verifyOtp: (body: { email: string; otp: string }) =>
    request("/auth/verify-otp", { method: "POST", body }),

  forgotPassword: (body: { email: string }) =>
    request("/auth/forgot-password", { method: "POST", body }),

  resetPassword: (body: { email: string; otp: string; newPassword: string }) =>
    request("/auth/reset-password", { method: "POST", body }),

  logout: (token: string) =>
    request("/auth/logout", { method: "POST", token }),

  getMe: (token: string) =>
    request("/auth/me", { token }),

  updateProfile: (body: { name: string }, token: string) =>
    request("/auth/update-profile", { method: "PUT", body, token }),

  changePassword: (
    body: { oldPassword: string; newPassword: string },
    token: string
  ) => request("/auth/change-password", { method: "PUT", body, token }),
};

// Monitor API
export const monitorApi = {
  create: (
    body: {
      name: string;
      url: string;
      method: string;
      expectedStatusCode: number;
      interval: number;
      timeout: number;
    },
    token: string
  ) => request("/monitors", { method: "POST", body, token }),

  getList: (
    params: {
      offset?: number;
      limit?: number;
      search?: string;
      method?: string;
      isActive?: string;
    },
    token: string
  ) => {
    const query = new URLSearchParams();
    if (params.offset) query.set("offset", String(params.offset));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.method) query.set("method", params.method);
    if (params.isActive !== undefined) query.set("isActive", params.isActive);
    const qs = query.toString();
    return request(`/monitors${qs ? `?${qs}` : ""}`, { token });
  },

  getMonitor: (id: string, token: string) =>
    request(`/monitors/${id}`, { token }),

  updateMonitor: (
    id: string,
    body: {
      name?: string;
      url?: string;
      method?: string;
      expectedStatusCode?: number;
      interval?: number;
      timeout?: number;
    },
    token: string
  ) => request(`/monitors/${id}`, { method: "PUT", body, token }),

  deleteMonitor: (id: string, token: string) =>
    request(`/monitors/${id}`, { method: "DELETE", token }),

  toggleMonitor: (id: string, token: string) =>
    request(`/monitors/${id}/toggle`, { method: "PATCH", token }),
};
