import React from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../../ui";

const FormStep = ({ onSubmit, register, errors, isLoading }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">CTO India</h1>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        Forgot Your Password?
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Enter your email address and we'll send you instructions to reset your
        password
      </p>
    </div>

    <form className="space-y-6" onSubmit={onSubmit}>
      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email address"
        error={errors.email?.message}
        required
        {...register("email")}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? "Sending Instructions..." : "Send Reset Instructions"}
      </Button>
    </form>

    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Remember your password?
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Login
        </Link>
      </div>
    </div>

    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Security Notice
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              For your security, password reset links expire after 1 hour. If
              you don't receive the email within 5 minutes, check your spam
              folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FormStep;
