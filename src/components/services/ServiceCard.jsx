import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Icon from "../ui/Icon";

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
      <div className="bg-gray-100 rounded-lg p-6 animate-pulse">
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
      className={`cursor-pointer transform transition-all duration-300 overflow-hidden group ${className}`}
      hover={true}
      onClick={handleServiceClick}
    >
      {/* Service Image */}
      <div className="relative h-48 overflow-hidden -m-6 mb-6">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg leading-tight">
            {service.title}
          </h3>
        </div>
      </div>

      {/* Service Content */}
      <div className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2">
          {service.shortDescription || service.description}
        </p>

        {/* Features Preview */}
        <div>
          {service.features && service.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {service.features.slice(0, 3).map((feature, index) => (
                <Badge
                  key={`${service.id}-feature-${index}`}
                  variant="primary"
                  size="sm"
                >
                  {feature}
                </Badge>
              ))}
              {service.features.length > 3 && (
                <Badge variant="secondary" size="sm">
                  +{service.features.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <span className="text-green-600 font-semibold text-sm">
            {service.estimatedPriceRange}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="md"
            className="flex-1 group-hover:bg-[#8de026]"
            onClick={handleServiceClick}
          >
            Learn More
            <Icon
              name="arrowRight"
              size="sm"
              className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
            />
          </Button>

          {showBookButton && (
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={handleBookClick}
            >
              Book Now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
