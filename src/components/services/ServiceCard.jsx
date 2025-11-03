import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const ServiceCard = ({
  service,
  className = "",
  onBookService,
  showBookButton = false,
}) => {
  const navigate = useNavigate();

  // Defensive check for service prop
  if (!service) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
        <div className="h-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  const handleServiceClick = () => {
    // Check if service has a slug, otherwise navigate to services page
    if (service.slug) {
      navigate(`/services/${service.slug}`);
    } else {
      // Fallback to services page if no slug
      navigate("/services");
    }
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    if (onBookService) {
      onBookService(service);
    }
  };

  return (
    <Card
      className={`cursor-pointer transform transition-all duration-300 overflow-hidden group flex flex-col h-full ${className}`}
      hover={true}
      onClick={handleServiceClick}
      padding="sm"
    >
      {/* Service Image */}
      <div className="relative h-48 overflow-hidden -m-4 mb-4">
        <img
          src={
            service.image ||
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
          }
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg leading-tight m-0">
            {service.title}
          </h3>
        </div>
      </div>

      {/* Service Content - Using flex to push button to bottom */}
      <div className="flex flex-col flex-grow space-y-4">
        <div className="flex-grow">
          {/* Category Badge */}
          {service.category && (
            <div className="mb-3 absolute top-3 left-3">
              <Badge variant="info" size="sm">
                {service.category}
              </Badge>
            </div>
          )}

          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {service.shortDescription || service.description}
          </p>

          {/* Features Preview */}
          {service.features && service.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {service.features.slice(0, 2).map((feature, index) => (
                <Badge
                  key={`${service.id}-feature-${index}`}
                  variant="primary"
                  size="sm"
                >
                  {feature}
                </Badge>
              ))}
              {service.features.length > 2 && (
                <Badge variant="secondary" size="sm">
                  +{service.features.length - 2} more
                </Badge>
              )}
            </div>
          )}

          {/* Price Range */}
          <div>
            <span className="text-secondary font-semibold text-sm">
              {service.estimatedPriceRange}
            </span>
          </div>
        </div>

        {/* Book Now Button - Always at bottom */}
        {showBookButton && (
          <div className="mt-auto pt-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleBookClick}
            >
              Book Now
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ServiceCard;
