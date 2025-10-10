import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const SocketContext = createContext();

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, userType } = useAuth();

  // Only use toast if user is logged in
  let showSuccess, showInfo, showError;
  try {
    const toast = useToast();
    showSuccess = toast.showSuccess;
    showInfo = toast.showInfo;
    showError = toast.showError;
  } catch (error) {
    // Fallback functions if toast is not available
    showSuccess = (message) => console.log("Success:", message);
    showInfo = (message) => console.log("Info:", message);
    showError = (message) => console.log("Error:", message);
  }

  useEffect(() => {
    if (user) {
      // Connect to Socket.IO server
      const newSocket = io("http://localhost:5000", {
        transports: ["websocket", "polling"], // Add polling as fallback
        timeout: 20000,
        forceNew: true,
      });

      newSocket.on("connect", () => {
        console.log("🔌 Connected to server");
        setIsConnected(true);

        // Join appropriate room based on user type
        if (userType === "provider") {
          newSocket.emit("join-provider", user.id);
          console.log("👨‍⚕️ Joined provider room");
        } else if (userType === "user") {
          newSocket.emit("join-user", user.id);
          console.log("👤 Joined user room");
        }
      });

      newSocket.on("disconnect", () => {
        console.log("🔌 Disconnected from server");
        setIsConnected(false);
      });

      // Listen for new booking notifications (for providers)
      newSocket.on("new-booking", (bookingData) => {
        console.log("📢 New booking received:", bookingData);
        showInfo(
          `New booking: ${bookingData.service} for ${bookingData.patientName} at ${bookingData.scheduledTime}`,
          {
            duration: 10000,
            action: {
              label: "View Details",
              onClick: () => {
                // Navigate to booking details or open modal
                console.log("View booking details:", bookingData.bookingId);
              },
            },
          }
        );
      });

      // Listen for booking status updates (for users)
      newSocket.on("booking-updated", (updateData) => {
        console.log("📢 Booking update received:", updateData);
        showSuccess(
          `Your booking ${updateData.bookingNumber} has been ${updateData.status}`
        );
      });

      // Listen for booking status updates from provider
      newSocket.on("booking-status-updated", (updateData) => {
        console.log("📢 Booking status updated:", updateData);
        if (userType === "user") {
          showSuccess(
            `Your booking ${updateData.bookingNumber} status updated to ${updateData.status}`
          );
        }
      });

      // Listen for connection errors
      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        // Don't show error toast for connection issues, just log them
        console.log("WebSocket connection failed, will retry automatically");
      });

      // Listen for reconnection attempts
      newSocket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}`);
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log(`✅ Reconnected after ${attemptNumber} attempts`);
        setIsConnected(true);
      });

      newSocket.on("reconnect_failed", () => {
        console.log("❌ Failed to reconnect to server");
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      // Disconnect when user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user, userType]);

  const emitBookingCreated = (bookingData) => {
    if (socket && isConnected) {
      socket.emit("booking-created", bookingData);
    }
  };

  const emitBookingStatusUpdate = (bookingData) => {
    if (socket && isConnected) {
      socket.emit("booking-status-update", bookingData);
    }
  };

  const value = {
    socket,
    isConnected,
    emitBookingCreated,
    emitBookingStatusUpdate,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
