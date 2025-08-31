import axios from "axios";

// Create an instance of Axios with default settings
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Update this with your backend API base URL
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json", // Default content type for requests
  },
});

// Request interceptor to add JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Handle unauthorized errors (e.g., redirect to login)
      if (status === 401) {
        console.log("Unauthorized access:", data.message || error.message);
        window.location.href = "/login"; // Redirect to login route
      }
      // Handle forbidden errors (e.g., show alert)
      else if (status === 403) {
        console.log("Forbidden access:", data.message || error.message);
        alert("You do not have permission to access this resource.");
      }
      // Handle not found errors (e.g., show alert)
      else if (status === 404) {
        console.log("Resource not found:", data.message || error.message);
        alert("The requested resource was not found.");
      }
      // Handle server errors (e.g., show alert)
      else if (status >= 500) {
        console.log("Server error:", data.message || error.message);
        alert("An error occurred on the server. Please try again later.");
      }
      // Handle conflict errors (409)
      else if (status === 409) {
        console.error("Conflict error:", data);
        // Don't show alert here as it's handled in the component
      }
      // Handle other HTTP errors
      else {
        console.error("HTTP error:", data.message || error.message);
        alert(data.message || error.message);
      }
    } else {
      // Handle network errors
      console.error("Network error:", error.message);
      alert("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
