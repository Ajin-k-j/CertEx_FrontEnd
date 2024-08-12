import axios from "axios";

// Set the base URL for all API requests
const apiClient = axios.create({
  baseURL: "http://localhost:5000",
});

export default apiClient;
