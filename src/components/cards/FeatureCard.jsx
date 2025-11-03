import React from "react";
import { Link } from "react-router-dom";

const FeatureCard = ({ title, description, link }) => {
  return (
    <div className="rounded-lg p-6 shadow-md transition-all duration-500 cursor-pointer bg-gray-100 hover:bg-secondary group ">
      <h3 className="text-lg font-bold mb-2 text-gray-800  duration-500 ease  group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-sm mb-4 text-gray-600 group-hover:text-gray-100 transition-all duration-500 ">
        {description}
      </p>
      {link && link !== "#" ? (
        <Link
          to={link}
          className="font-semibold inline-flex items-center gap-1 text-accent group-hover:text-white transition-all duration-500"
        >
          Learn more →
        </Link>
      ) : (
        <span className="font-semibold inline-flex items-center gap-1 text-accent group-hover:text-white transition-all duration-500">
          Learn more →
        </span>
      )}
    </div>
  );
};

export default FeatureCard;
