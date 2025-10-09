import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/ui/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (toast) => {
      const id = Date.now() + Math.random();
      const newToast = {
        id,
        duration: 5000,
        position: "top-right",
        type: "info",
        title: "",
        message: "",
        ...toast,
      };

      // Ensure title and message are strings
      if (typeof newToast.title !== "string") {
        newToast.title = "";
      }
      if (typeof newToast.message !== "string") {
        newToast.message = String(newToast.message || "");
      }

      console.log("🔧 Adding Toast:", {
        id: newToast.id,
        type: newToast.type,
        title: newToast.title,
        message: newToast.message,
        currentToastsCount: toasts.length,
      });

      setToasts((prev) => {
        const updated = [...prev, newToast];
        console.log("🔧 Toast State Updated:", {
          previousCount: prev.length,
          newCount: updated.length,
          newToast: newToast.id,
        });
        return updated;
      });
    },
    [toasts.length]
  );

  const removeToast = useCallback((id) => {
    console.log("🔧 Removing Toast:", { id });
    setToasts((prev) => {
      const updated = prev.filter((toast) => toast.id !== id);
      console.log("🔧 Toast Removed:", {
        removedId: id,
        previousCount: prev.length,
        newCount: updated.length,
      });
      return updated;
    });
  }, []);

  const showSuccess = useCallback(
    (message, title = "Success") => {
      addToast({
        type: "success",
        title,
        message,
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (message, title = "Error") => {
      addToast({
        type: "error",
        title,
        message,
      });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, title = "Warning") => {
      addToast({
        type: "warning",
        title,
        message,
      });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, title = "Info") => {
      addToast({
        type: "info",
        title,
        message,
      });
    },
    [addToast]
  );

  // Generic showToast function that accepts type as second parameter
  const showToast = useCallback(
    (message, type = "info", title = "") => {
      const toastTitle = title || type.charAt(0).toUpperCase() + type.slice(1);
      addToast({
        type,
        title: toastTitle,
        message,
      });
    },
    [addToast]
  );

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none space-y-2">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              zIndex: 50 + index,
            }}
          >
            <Toast {...toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
