import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/navigation";
import { PageContainer } from "../components/layout";
import { Card, Button } from "../components/ui";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <>
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Card className="p-12">
              {/* 404 Illustration */}
              <div className="mb-8">
                <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
                <div className="w-32 h-32 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Page Not Found
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Sorry, the page you are looking for does not exist or has been
                  moved.
                </p>
                <p className="text-gray-500">
                  You might have typed the wrong URL or the link might be
                  broken.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button onClick={handleGoHome} className="px-8 py-3">
                  🏠 Go to Home Page
                </Button>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="px-8 py-3"
                >
                  ← Go Back to Previous Page
                </Button>
              </div>

              {/* Quick Links */}
              <div className="border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Pages
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link
                    to="/"
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      Home
                    </div>
                  </Link>
                  <Link
                    to="/services"
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      Services
                    </div>
                  </Link>
                  <Link
                    to="/about"
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      About
                    </div>
                  </Link>
                  <Link
                    to="/contact"
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      Contact
                    </div>
                  </Link>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Still need help?
                </h4>
                <p className="text-blue-700 text-sm mb-4">
                  If you think this is an error, please contact our support
                  team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/contact"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    📧 Contact Support
                  </Link>
                  <a
                    href="mailto:support@ctoindia.com"
                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm"
                  >
                    📞 Email Us
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
      <Footer />
    </>
  );
};

export default NotFound;
