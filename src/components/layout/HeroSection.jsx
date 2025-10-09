import React from "react";
import { Button } from "../ui";

const HeroSection = ({
  title,
  subtitle,
  buttonText = null, // Optional button - pass null or omit to hide button
  buttonVariant = "primary",
  buttonSize = "lg",
  onButtonClick = () => {}, // Default empty function
  image,
  imageAlt = "Hero Image",
  className = "",
}) => {
  return (
    <section className={`h-[600px] bg-primary ${className}`}>
      <div className="relative text-white overflow-hidden">
        {/* Background Image with Grain Texture */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('/src/assets/img-grain-theme-one@2x.d8b38cbe.webp')`,
          }}
        ></div>

        {/* Content */}
        <div className="container relative z-10 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center h-full min-h-[600px]">
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-white text-5xl font-bold mb-6 leading-tight text-center lg:text-left relative inline-block">
                {title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed text-center lg:text-left">
                {subtitle}
              </p>
              {buttonText && buttonText.trim() !== "" && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    variant={buttonVariant}
                    size={buttonSize}
                    onClick={onButtonClick}
                  >
                    {buttonText}
                  </Button>
                </div>
              )}
            </div>

            {/* Right Content - Image */}
            <div className="flex justify-center lg:justify-end items-center">
              <div className="relative">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full max-w-lg h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
