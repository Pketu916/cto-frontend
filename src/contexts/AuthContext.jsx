import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  userType: null, // 'user', 'provider', 'admin'
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        userType: action.payload.userType,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        userType: null,
        isAuthenticated: false,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");
      const userData = localStorage.getItem("user");

      console.log("Auth check - localStorage:", {
        token: !!token,
        userType,
        userData,
      });

      if (token && userType && userData) {
        try {
          const user = JSON.parse(userData);
          console.log("Verifying token with backend...");
          // Verify token with backend
          const profile = await authAPI.getProfile();
          console.log("Profile response:", profile);

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: profile.user, userType: profile.userType },
          });
          console.log("User authenticated successfully:", profile.user);
        } catch (error) {
          console.error("Auth verification failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userType");
          localStorage.removeItem("user");
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials, userType) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      console.log("🔐 Frontend login attempt:", {
        email: credentials.email,
        userType,
        timestamp: new Date().toISOString(),
      });

      // Call backend API
      const response = await authAPI.login({
        ...credentials,
        userType,
      });

      console.log("📨 Login response received:", {
        success: response.success,
        hasUser: !!response.user,
        hasToken: !!response.token,
        message: response.message,
      });

      if (response.success) {
        const { user, token } = response;

        console.log("✅ Login successful, storing user data:", {
          userId: user.id,
          userEmail: user.email,
          userType,
          tokenLength: token?.length,
        });

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userType", userType);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("💾 User data stored in localStorage:", {
          tokenStored: !!localStorage.getItem("token"),
          userTypeStored: localStorage.getItem("userType"),
          userStored: !!localStorage.getItem("user"),
        });

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, userType },
        });

        console.log("🎉 Auth state updated successfully");
        return { success: true };
      } else {
        console.log("❌ Login failed:", response.message);
        dispatch({ type: "SET_LOADING", payload: false });
        return {
          success: false,
          message: response.message || "Login failed. Please try again.",
        };
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      console.error("Login error:", error);

      // Extract specific error message from backend response
      let errorMessage = "Login failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          errorMessage = errors[0].msg || errors[0].message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    }
  };

  const register = async (userData, userType) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Call backend API based on user type
      const response =
        userType === "provider"
          ? await authAPI.registerProvider(userData)
          : await authAPI.registerUser(userData);

      const { user, token } = response;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, userType },
      });

      return { success: true };
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      console.error("Registration error:", error);

      // Extract specific error message from backend response
      let errorMessage = "Registration failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          errorMessage = errors[0].msg || errors[0].message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
