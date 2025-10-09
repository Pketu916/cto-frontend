import React from "react";

const Marquee = ({
  items,
  direction = "vertical",
  reverse = false,
  speed = 25,
  className = "",
  itemClassName = "",
}) => {
  const animationClass = reverse
    ? "animate-marquee-bottom"
    : "animate-marquee-top";

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex ${
          direction === "vertical" ? "flex-col" : "flex-row"
        } ${animationClass}`}
        style={{
          animationDuration: `${speed}s`,
          animationIterationCount: "infinite",
          animationTimingFunction: "linear",
        }}
      >
        {/* First set of items */}
        <div
          className={`flex ${
            direction === "vertical" ? "flex-col" : "flex-row"
          } ${direction === "vertical" ? "space-y-4" : "space-x-4"}`}
        >
          {items.map((item, index) => (
            <div key={`first-${index}`} className={itemClassName}>
              {item}
            </div>
          ))}
        </div>

        {/* Second set of items for seamless loop */}
        <div
          className={`flex ${
            direction === "vertical" ? "flex-col" : "flex-row"
          } ${direction === "vertical" ? "space-y-4" : "space-x-4"} ${
            direction === "vertical" ? "mt-4" : "ml-4"
          }`}
        >
          {items.map((item, index) => (
            <div key={`second-${index}`} className={itemClassName}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
