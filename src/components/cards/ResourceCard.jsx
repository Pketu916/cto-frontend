import React from "react";

const ResourceCard = ({ title, image, logo, color = "white" }) => {
  return (
    <div className="flex-shrink-0 w-80 mx-4 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />

        {/* Overlay with title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Logo if provided */}
        {logo && (
          <div className="absolute top-4 left-4">
            <img src={logo} alt="Logo" className="h-6 w-auto" />
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3
            className={`text-lg font-bold ${
              color === "green" ? "text-secondary" : "text-white"
            }`}
          >
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
