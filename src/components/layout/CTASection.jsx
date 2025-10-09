import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import ripTopImage from "../../assets/img-rip-top.44e5f6e1.svg";
import useCounter from "../../hooks/useCounter";

const CTASection = ({
  title = "Ready to Transform Your Healthcare Experience?",
  subtitle = "Join thousands of patients who trust CTO India for their healthcare needs. Get started today with our comprehensive healthcare services.",
  className = "",
  variant = "default",
  showServicesButton = true,
  showContactButton = true,
  customButtons = null,
}) => {
  const navigate = useNavigate();

  const handleServicesClick = () => {
    navigate("/services");
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  const handleGetStartedClick = () => {
    navigate("/register");
  };

  // Counter hooks for animated stats
  const patientsCounter = useCounter(50000, 0, 2500, 200);
  const providersCounter = useCounter(200, 0, 2000, 400);
  const supportCounter = useCounter(24, 0, 1500, 600);
  const satisfactionCounter = useCounter(95, 0, 1800, 800);

  const variants = {
    default: "bg-[#012939]",
    blue: "bg-gradient-to-br from-blue-600 to-blue-800",
    green: "bg-gradient-to-br from-green-600 to-green-800",
    purple: "bg-gradient-to-br from-purple-600 to-purple-800",
    gray: "bg-gradient-to-br from-gray-600 to-gray-800",
  };

  return (
    <div className={`${variants[variant]} ${className} relative mb-20`}>
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative">
        <div className="text-center">
          {/* Main Heading */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-l md:text-xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div
                ref={patientsCounter.elementRef}
                className="text-3xl md:text-4xl font-bold text-[#84ea00] mb-2"
              >
                {patientsCounter.count.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-sm md:text-base">
                Patients Served
              </div>
            </div>
            <div className="text-center">
              <div
                ref={providersCounter.elementRef}
                className="text-3xl md:text-4xl font-bold text-[#84ea00] mb-2"
              >
                {providersCounter.count}+
              </div>
              <div className="text-blue-100 text-sm md:text-base">
                Healthcare Providers
              </div>
            </div>
            <div className="text-center">
              <div
                ref={supportCounter.elementRef}
                className="text-3xl md:text-4xl font-bold text-[#84ea00] mb-2"
              >
                {supportCounter.count}/7
              </div>
              <div className="text-blue-100 text-sm md:text-base">
                Medical Support
              </div>
            </div>
            <div className="text-center">
              <div
                ref={satisfactionCounter.elementRef}
                className="text-3xl md:text-4xl font-bold text-[#84ea00] mb-2"
              >
                {satisfactionCounter.count}%
              </div>
              <div className="text-blue-100 text-sm md:text-base">
                Satisfaction Rate
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {customButtons ? (
              customButtons
            ) : (
              <>
                {/* Get Started Button */}

                {/* Services Button */}
                {showServicesButton && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleServicesClick}
                    className="bg-[#84ea00] text-[#012939] hover:bg-[#7dd300] font-semibold px-8 py-4 text-lg shadow-lg transition-colors duration-300 ease-in-out"
                  >
                    View Our Services
                  </Button>
                )}

                {/* Contact Button */}
                {showContactButton && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleContactClick}
                    className="border-2 border-[#84ea00] text-[#84ea00] hover:bg-[#84ea00] hover:text-[#012939] font-semibold px-8 py-4 text-lg transition-colors duration-300 ease-in-out"
                  >
                    Contact Us
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top Rip Decoration */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
        style={{
          transform: "translate(0, calc(100% - 1px))",
        }}
      >
        <img src={ripTopImage} alt="Rip Top" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default CTASection;
