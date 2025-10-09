import React from "react";

const FooterLink = ({ href, children, className = "" }) => {
  return (
    <a
      href={href}
      className={`text-gray-300 hover:text-white transition-colors duration-300 ${className}`}
    >
      {children}
    </a>
  );
};

export default FooterLink;

