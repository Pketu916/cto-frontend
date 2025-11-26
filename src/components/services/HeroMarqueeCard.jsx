import React from "react";
import { useNavigate } from "react-router-dom";

const HeroMarqueeCard = ({ service, className = "", onBookService }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to booking page directly
    if (onBookService) {
      onBookService(service);
    } else {
      navigate("/booking", {
        state: {
          service: service,
        },
      });
    }
  };

  return (
    <div
      className={`cursor-pointer transform transition-all duration-300 overflow-hidden group ${className}`}
      onClick={handleClick}
    >
      {/* Service Image */}
      <div className="relative h-80 overflow-hidden rounded-lg">
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
    </div>
  );
};

export default HeroMarqueeCard;
