import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

const ServiceHeader = ({ service }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/services")}
          className="mb-6"
        >
          <Icon name="arrowLeft" size="sm" className="mr-2" />
          Back to Services
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {service.shortDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-green-600">
                <Icon name="check" size="sm" className="mr-2" />
                <span className="font-semibold">
                  {service.estimatedPriceRange}
                </span>
              </div>
             
            </div>
          </div>

          <div className="relative">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeader;
