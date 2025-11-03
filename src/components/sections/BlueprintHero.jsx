import React from "react";
import Logo1 from "../../assets/Logo1.jpg";
import { Button } from "../ui";

const BlueprintHero = () => {
  return (
    <div>
      <div className="max-w-6xl mx-auto relative z-10 px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left side - Logo */}
          <div className="flex-shrink-0">
            <img src={Logo1} alt="CTO India Logo" className="h-24 w-auto" />
          </div>

          {/* Right side - Content */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-bold relative inline-block mb-6">
              Unlock the blueprint for your
              <span className="relative inline-block">
                &nbsp;Success
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-0 -bottom-2 w-full"
                  viewBox="0 0 340 12"
                  fill="none"
                >
                  <path
                    d="M2.02157 6.67507C59.3392 4.51664 116.939 4.73302 174.328 3.84915C225.628 3.05906 276.93 2.75644 328.24 2.36882C330.362 2.35278 336.552 1.98241 334.603 2.56927C328.79 4.31962 317.08 3.46496 311.52 3.62073C234.971 5.76542 158.303 4.80472 81.7124 6.00586C62.8847 6.30113 6.44803 10.8458 25.2248 9.86957C49.2136 8.62234 73.5295 6.28546 97.5684 5.90297C146.166 5.12971 194.761 5.00185 243.365 4.52532C254.575 4.41541 265.8 4.20438 277.013 4.2801"
                    stroke="#6C4BC0"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Whether you're seeking primary care or specialized medical
              services, CTO India provides comprehensive healthcare solutions,
              expert medical professionals, and cutting-edge technology for
              patients at every stage of life.
            </p>

            <Button
              variant="primary"
              size="md"
              className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors duration-300"
            >
              Explore CTO India Services
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintHero;
