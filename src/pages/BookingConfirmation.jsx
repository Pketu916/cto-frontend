import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { formatAUD } from "../utils/pricingUtils";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Get booking data from location state
    if (location.state?.booking) {
      setBookingData(location.state.booking);
      showSuccess("Booking confirmed successfully!");
    } else {
      // If no booking data, redirect to dashboard
      navigate("/user/dashboard");
    }
  }, [location.state, navigate, showSuccess]);

  const handleGoToDashboard = () => {
    navigate("/user/dashboard");
  };

  const handleBookAnother = () => {
    navigate("/services");
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your service has been successfully booked
          </p>
        </div>

        {/* Booking Details Card */}
        <Card padding="lg" className="mb-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Booking Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Booking Number: {bookingData.bookingNumber}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Service Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {bookingData.service}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(bookingData.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Time</p>
                    <p className="text-sm text-gray-500">
                      {bookingData.scheduledTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-500">
                      {bookingData.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Patient Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Name</p>
                    <p className="text-sm text-gray-500">
                      {bookingData.patientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-500">
                      {bookingData.patientPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status</p>
                    <p className="text-sm text-green-600 capitalize">
                      {bookingData.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                Total Amount
              </span>
              <span className="text-xl font-bold text-blue-600">
                {bookingData.totalAmount !== null &&
                bookingData.totalAmount !== undefined
                  ? formatAUD(bookingData.totalAmount)
                  : "Price not available"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              All prices in Australian Dollars (AUD)
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGoToDashboard}
            className="flex-1 sm:flex-none"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleBookAnother}
            className="flex-1 sm:flex-none"
          >
            Book Another Service
          </Button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <Card padding="md" className="bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900">
                  What happens next?
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  You will receive a confirmation call from our team within 30
                  minutes. A service provider will be assigned to your booking
                  and will contact you before the scheduled time.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
