import React from "react";
import ServiceCard from "./ServiceCard";

const ServiceGrid = ({
  services = [],
  className = "",
  onBookService,
  showBookButton = false,
}) => {
  // Defensive check for services array
  if (!services || services.length === 0) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
      >
        {[...Array(6)].map((_, index) => (
          <div
            key={`loading-skeleton-${index}`}
            className="bg-gray-100 rounded-lg p-6 animate-pulse"
          >
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
    >
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onBookService={onBookService}
          showBookButton={showBookButton}
        />
      ))}
    </div>
  );
};

export default ServiceGrid;
