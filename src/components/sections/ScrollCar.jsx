import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import carImage from "../../assets/car.png";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ScrollCar = ({ imageSrc, className = "", height = "300px" }) => {
  const carRef = useRef(null);
  const containerRef = useRef(null);
  const stickySectionRef = useRef(null);

  useEffect(() => {
    const car = carRef.current;
    const container = containerRef.current;
    const stickySection = stickySectionRef.current;

    if (!car || !container || !stickySection) return;

    // Wait for image to load before calculating dimensions
    const setupAnimation = () => {
      // Initial: transform: translate(100%, 10%) - car starts 100% to the right, 10% down
      // Ending: transform: translate(-50%, 10%) with left: 50% - car ends centered, 10% down

      // Set initial position - car starts at right side
      gsap.set(car, {
        xPercent: 100, // translateX(100%) - starts off-screen to the right
        yPercent: 10, // translateY(10%)
        left: "0%", // Start at left: 0%
      });

      // Create scroll-triggered animation - car moves to center
      const animation = gsap.to(car, {
        xPercent: -50, // translateX(-50%) - centers the car horizontally
        yPercent: 10, // translateY(10%) - keeps vertical offset
        left: "50%", // End at left: 50% - centers horizontally
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          markers: false,
          // NO pin - just use CSS sticky
        },
      });

      return animation;
    };

    let animation;

    // If image is already loaded, setup immediately
    if (car.complete && car.naturalWidth > 0) {
      animation = setupAnimation();
    } else {
      // Wait for image to load
      car.onload = () => {
        animation = setupAnimation();
      };
    }

    // Fallback: setup after a delay to ensure dimensions are calculated
    const timeoutId = setTimeout(() => {
      if (!animation) {
        animation = setupAnimation();
      }
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (animation) {
        animation.kill();
      }
      const triggers = ScrollTrigger.getAll().filter(
        (trigger) => trigger.trigger === container
      );
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: "200vh" }}
    >
      <div
        ref={stickySectionRef}
        className="sticky-section sticky top-0 w-full overflow-hidden "
        style={{ height: "100vh" }}
      >
        <div className="relative w-full h-full">
          <img
            ref={carRef}
            src={imageSrc || carImage}
            alt="Night Riders Care Response Team Vehicle"
            className="absolute w-auto max-w-none object-contain"
            style={{
              height: height,
              left: 0,
              bottom: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollCar;
