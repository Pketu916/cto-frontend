import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API Request - Token added:", token.substring(0, 20) + "...");
    } else {
      console.log("API Request - No token found");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      window.location.href = "/login";
    }

    // Ensure error has proper structure
    if (!error.response) {
      error.response = {
        data: {
          message: "Network error. Please check your connection.",
          success: false,
        },
      };
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // User Registration
  registerUser: async (userData) => {
    const response = await api.post("/auth/register/user", userData);
    return response.data;
  },

  // Provider Registration
  registerProvider: async (providerData) => {
    const response = await api.post("/auth/register/provider", providerData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    console.log(
      "🌐 API: Making login request to:",
      api.defaults.baseURL + "/auth/login"
    );
    console.log("📤 API: Login payload:", {
      email: credentials.email,
      userType: credentials.userType,
      hasPassword: !!credentials.password,
    });

    const response = await api.post("/auth/login", credentials);

    console.log("📥 API: Login response:", {
      status: response.status,
      success: response.data.success,
      hasToken: !!response.data.token,
      hasUser: !!response.data.user,
      message: response.data.message,
    });

    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Get Profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Refresh Token
  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
};

// Services API - REMOVED
// All services routes have been deleted from backend

// Bookings API
export const bookingsAPI = {
  // Create Booking
  createBooking: async (bookingData) => {
    console.log("API call - createBooking:", bookingData);
    console.log("API baseURL:", api.defaults.baseURL);
    console.log("API headers:", api.defaults.headers);

    const response = await api.post("/bookings", bookingData);
    console.log("API response:", response);
    return response.data;
  },

  // Get Provider Bookings
  getProviderBookings: async () => {
    const response = await api.get("/bookings/provider");
    return response.data;
  },

  // Update Booking Status
  updateBookingStatus: async (
    bookingId,
    status,
    providerNotes,
    providerId,
    providerName
  ) => {
    const response = await api.put(`/bookings/${bookingId}/status`, {
      status,
      providerNotes,
      providerId,
      providerName,
    });
    return response.data;
  },

  // Claim Booking
  claimBooking: async (bookingId, providerId, providerName) => {
    const response = await api.put(`/bookings/${bookingId}/claim`, {
      providerId,
      providerName,
    });
    return response.data;
  },

  // Get Booking Logs
  getBookingLogs: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}/logs`);
    return response.data;
  },

  // Get User Bookings
  getUserBookings: async () => {
    const response = await api.get("/bookings/user");
    return response.data;
  },
};

// Users API
export const usersAPI = {
  // Update User Profile
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },
};

// Providers API
export const providersAPI = {
  // Update Provider Profile
  updateProfile: async (providerData) => {
    const response = await api.put("/providers/profile", providerData);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Get Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  // Get All Providers
  getProviders: async (params = {}) => {
    const response = await api.get("/admin/providers", { params });
    return response.data;
  },

  // Get Provider Details
  getProviderDetails: async (providerId) => {
    const response = await api.get(`/admin/providers/${providerId}`);
    return response.data;
  },

  // Update Provider Status
  updateProviderStatus: async (providerId, status, notes = "") => {
    const response = await api.put(`/admin/providers/${providerId}/status`, {
      status,
      notes,
    });
    return response.data;
  },
};

export default api;
