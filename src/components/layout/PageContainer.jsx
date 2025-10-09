import React from "react";

const PageContainer = ({
  children,
  className = "",
  maxWidth = "7xl",
  padding = "default",
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 sm:px-6 lg:px-8 py-8",
    default: "px-4 sm:px-6 lg:px-8 py-16",
    lg: "px-4 sm:px-6 lg:px-8 py-20",
  };

  const classes = `${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]} ${className}`;

  return <div className={classes}>{children}</div>;
};

export default PageContainer;
