import React from "react";
import { features } from "../../data/featuresData";
import { FeatureCard } from "../cards";

const BusinessSection = () => {
  return (
    <section>
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl md:text-4xl font-bold relative inline-block">
          Transform Your Healthcare Practice with
          <span className="relative inline-block">
          Advanced Technology
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-0 -bottom-2 w-full"
            viewBox="0 0 340 12"
            fill="none"
          >
            <path
              d="M2.02157 6.67507C59.3392 4.51664 116.939 4.73302 174.328 3.84915C225.628 3.05906 276.93 2.75644 328.24 2.36882C330.362 2.35278 336.552 1.98241 334.603 2.56927C328.79 4.31962 317.08 3.46496 311.52 3.62073C234.971 5.76542 158.303 4.80472 81.7124 6.00586C62.8847 6.30113 6.44803 10.8458 25.2248 9.86957C49.2136 8.62234 73.5295 6.28546 97.5684 5.90297C146.166 5.12971 194.761 5.00185 243.365 4.52532C254.575 4.41541 265.8 4.20438 277.013 4.2801"
              stroke="#83D915"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <FeatureCard key={`feature-${index}`} {...feature} />
        ))}
      </div>

      {/* backgroung */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://www.getjobber.com/wp-content/uploads/jobber-assets/distress-beige-top-left.4e7b40c8.png"
          alt=" background"
        />
      </div>
      {/* Mockup Image */}
      {/* <div className="flex justify-center max-h-[491px]">
        <img
          src="https://www.getjobber.com/wp-content/uploads/2025/05/Product-mockup-1440x686.webp"
          alt="Product Mockup"
          className="max-w-full"
        />
      </div> */}
    </section>
  );
};

export default BusinessSection;
