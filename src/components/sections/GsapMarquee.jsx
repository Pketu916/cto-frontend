import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const GsapMarquee = ({
  items,
  speed = 100, // pixels per second
  className = "",
  itemClassName = "w-[260px] flex-shrink-0",
  direction = "rtl", // "rtl" | "ltr"
}) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Duplicate content to ensure seamless scroll
    const children = Array.from(track.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true);
      track.appendChild(clone);
    });

    // Compute width of one full set
    const setWidth = children.reduce((acc, el) => acc + el.offsetWidth, 0);
    if (setWidth === 0) return;

    const totalDistance = setWidth; // we scroll one set width
    const duration = totalDistance / speed; // seconds

    const fromX = direction === "rtl" ? 0 : -totalDistance;
    const toX = direction === "rtl" ? -totalDistance : 0;

    const tween = gsap.fromTo(
      track,
      { x: fromX },
      {
        x: toX,
        ease: "none",
        duration,
        repeat: -1,
      }
    );

    return () => {
      tween?.kill();
    };
  }, [speed, direction]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex flex-row gap-4 will-change-transform">
        {items.map((item, idx) => (
          <div key={`m-${idx}`} className={itemClassName}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GsapMarquee;
