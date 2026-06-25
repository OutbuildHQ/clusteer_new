import axios, { AxiosError, AxiosInstance } from 'axios';
import { auth } from './firebase';

/**
 * Spring Boot API Client
 * Handles all communication with the Spring Boot backend
 */

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor: Add Firebase auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Add Firebase ID token if user is authenticated
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            console.warn('Unauthorized access. Redirecting to login...');
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden
          console.error('Access forbidden:', error.response.data);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', error.config?.url);
          break;

        case 429:
          // Rate limited
          console.error('Rate limit exceeded. Please try again later.');
          break;

        case 500:
        case 502:
        case 503:
          // Server errors
          console.error('Server error:', error.response.data);
          break;

        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error - no response from server');
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Helper function to handle API errors consistently
 */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    if (axiosError.response?.data) {
      return axiosError.response.data.message ||
             axiosError.response.data.error ||
             'An error occurred';
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
