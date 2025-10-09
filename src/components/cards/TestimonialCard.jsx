import React from "react";

const TestimonialCard = () => {
  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl relative overflow-hidden">
      {/* Background Image with Absolute Positioning */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://www.getjobber.com/wp-content/uploads/jobber-assets/logo-bug.fa400aa1.svg"
          alt="Background Logo"
          className="absolute top-1/2 right-0 transform -translate-y-1 w-40 h-40 md:w-60 md:h-60 object-contain"
        />
      </div>

      {/* Card Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-2xl"></div>

      {/* Content */}
      <div className="relative z-10">
        <blockquote className="text-xl md:text-2xl font-medium text-gray-800 mb-6 leading-relaxed">
          "Jobber has taken a lot of stress off my shoulders. I can invoice from
          my cell phone. I'm not tied to my office."
        </blockquote>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Mitchell Gordy"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Mitchell Gordy</p>
            <p className="text-gray-600 text-sm">MITHGO Outdoor Services</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
