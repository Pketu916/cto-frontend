import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../ui";

const ConfirmationStep = ({ email, onResend, isLoading }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
      <p className="mt-4 text-gray-600">
        We've sent password reset instructions to <strong>{email}</strong>
      </p>
    </div>

    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">What's next?</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Check your email inbox</li>
          <li>• Look for an email from CTO India</li>
          <li>• Click the reset link in the email</li>
          <li>• Follow the instructions to create a new password</li>
        </ul>
      </div>

      <div className="space-y-4">
        <Button
          onClick={onResend}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? "Sending..." : "Resend Email"}
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">
          Didn't receive the email?
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check your spam/junk folder</li>
          <li>• Make sure you entered the correct email address</li>
          <li>• Wait a few minutes and try again</li>
          <li>• Contact support if you continue to have issues</li>
        </ul>
      </div>
    </div>
  </div>
);

export default ConfirmationStep;
