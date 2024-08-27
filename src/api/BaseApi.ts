// BaseApi.ts
import axios from "axios";

// Create an axios instance
const apiClient = axios.create({
  baseURL: "https://localhost:7209/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization token
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve token from storage or state management
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh and error
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token refresh or other errors
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Handle token refresh if needed
      originalRequest._retry = true;
      // Implement token refresh logic here
      // Example: const newToken = await refreshToken();
      // localStorage.setItem('authToken', newToken);
      // apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;
      // return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
