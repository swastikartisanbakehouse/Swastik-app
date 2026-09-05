import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export const TOKEN_KEY = 'swastik_auth_token';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// --- Request interceptor: attach auth token ---
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token && config.headers) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- Response interceptor: handle 401 ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      // Navigate to login — dynamically import to avoid circular deps
      try {
        router.replace('/(auth)/login');
      } catch {
        // Router may not be ready on startup; handled by _layout.tsx
      }
    }
    return Promise.reject(error);
  },
);

/** Extract a user-friendly error message from an Axios error */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
      // Try common error field names
      const fields = ['detail', 'message', 'error', 'non_field_errors'];
      for (const f of fields) {
        if (data[f]) {
          const val = data[f];
          return Array.isArray(val) ? val[0] : String(val);
        }
      }
      // Return first field error
      const firstKey = Object.keys(data)[0];
      if (firstKey) {
        const val = data[firstKey];
        return Array.isArray(val) ? `${firstKey}: ${val[0]}` : `${firstKey}: ${val}`;
      }
    }
    if (error.message === 'Network Error') return 'Network error. Please check your connection.';
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}
