import React from "react";
import Marquee from "./Marquee";
import GsapMarquee from "./GsapMarquee";
import { HeroMarqueeCard } from "../services";
import { Button } from "../ui";

const HomeHero = () => {
  return (
    <section className="min-h-[650px] bg-primary">
      <div className="relative text-white overflow-hidden">
        {/* Background Image with Grain Texture */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('/src/assets/img-grain-theme-one@2x.d8b38cbe.webp')`,
          }}
        ></div>

        {/* Content */}
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-white text-5xl font-bold mb-6 leading-tight relative inline-block">
                Comprehensive{" "}
                <span className="relative inline-block">
                  Healthcare
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-0 -bottom-2 w-full"
                    viewBox="0 0 340 12"
                    fill="none"
                  >
                    <path
                      d="M2.02157 6.67507C59.3392 4.51664 116.939 4.73302 174.328 3.84915C225.628 3.05906 276.93 2.75644 328.24 2.36882C330.362 2.35278 336.552 1.98241 334.603 2.56927C328.79 4.31962 317.08 3.46496 311.52 3.62073C234.971 5.76542 158.303 4.80472 81.7124 6.00586C62.8847 6.30113 6.44803 10.8458 25.2248 9.86957C49.2136 8.62234 73.5295 6.28546 97.5684 5.90297C146.166 5.12971 194.761 5.00185 243.365 4.52532C254.575 4.41541 265.8 4.20438 277.013 4.2801"
                      stroke="#84ea00"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>{" "}
                Solutions for Modern India
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                CTO India brings world-class healthcare services directly to
                your doorstep. From telehealth consultations to home nursing
                care, we're revolutionizing healthcare delivery across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg">
                  Get Started Today
                </Button>
              </div>
              <p className="text-sm text-gray-300 mt-4">
                Put CTO India to work for you. No credit card required.
              </p>
            </div>

            {/* Right Content - Responsive Marquees */}
            {/* Large screens: show two vertical CSS marquees */}
            <div className="hidden lg:grid grid-cols-2 gap-4 h-[650px] ">
              <Marquee
                direction="vertical"
                reverse={false}
                speed={25}
                className="h-full"
                itemClassName="mb-4 pointer-events-none"
                items={[
                  <HeroMarqueeCard
                    key="opd"
                    service={{
                      id: "opd",
                      title: "OPD Day Care",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/jobe-and-sons-plumbing.webp",
                      slug: "opd-day-care",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="hospital"
                    service={{
                      id: "hospital",
                      title: "Hospital Care",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/love-green-clean.webp",
                      slug: "hospital-care",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="telehealth"
                    service={{
                      id: "telehealth",
                      title: "Telehealth",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/kalfas-landscaping.webp",
                      slug: "telehealth",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="nursing"
                    service={{
                      id: "nursing",
                      title: "Nursing Care",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/reliable-kitchen-services.webp",
                      slug: "nursing-care",
                    }}
                  />,
                ]}
              />
              <Marquee
                direction="vertical"
                reverse={true}
                speed={25}
                className="h-full"
                itemClassName="mb-4 pointer-events-none"
                items={[
                  <HeroMarqueeCard
                    key="transport"
                    service={{
                      id: "transport",
                      title: "Patient Transport",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/montreal-contractors.webp",
                      slug: "patient-transport",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="rehabilitation"
                    service={{
                      id: "rehabilitation",
                      title: "Rehabilitation",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/jobe-and-sons-plumbing.webp",
                      slug: "rehabilitation",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="equipment"
                    service={{
                      id: "equipment",
                      title: "Medical Equipment",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/love-green-clean.webp",
                      slug: "medical-equipment",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="diagnostic"
                    service={{
                      id: "diagnostic",
                      title: "Diagnostic Imaging",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/kalfas-landscaping.webp",
                      slug: "diagnostic-imaging",
                    }}
                  />,
                ]}
              />
            </div>
            {/* Small/medium screens: show smooth GSAP horizontal marquee and hide verticals */}
            <div className="block lg:hidden">
              <GsapMarquee
                direction="rtl"
                speed={110}
                className="w-full"
                itemClassName="w-[240px] flex-shrink-0 pointer-events-none"
                items={[
                  <HeroMarqueeCard
                    key="opd"
                    service={{
                      id: "opd",
                      title: "OPD Day Care",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/jobe-and-sons-plumbing.webp",
                      slug: "opd-day-care",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="hospital"
                    service={{
                      id: "hospital",
                      title: "Hospital Care",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/love-green-clean.webp",
                      slug: "hospital-care",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="telehealth"
                    service={{
                      id: "telehealth",
                      title: "Telehealth",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/kalfas-landscaping.webp",
                      slug: "telehealth",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="nursing"
                    service={{
                      id: "nursing",
                      title: "Nursing Care",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/reliable-kitchen-services.webp",
                      slug: "nursing-care",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="transport"
                    service={{
                      id: "transport",
                      title: "Patient Transport",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/montreal-contractors.webp",
                      slug: "patient-transport",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="rehabilitation"
                    service={{
                      id: "rehabilitation",
                      title: "Rehabilitation",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/jobe-and-sons-plumbing.webp",
                      slug: "rehabilitation",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="equipment"
                    service={{
                      id: "equipment",
                      title: "Medical Equipment",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/love-green-clean.webp",
                      slug: "medical-equipment",
                    }}
                  />,
                  <HeroMarqueeCard
                    key="diagnostic"
                    service={{
                      id: "diagnostic",
                      title: "Diagnostic Imaging",
                      image:
                        "https://www.getjobber.com/wp-content/plugins/jobberblocks/blocks/t4-home-hero/assets/kalfas-landscaping.webp",
                      slug: "diagnostic-imaging",
                    }}
                  />,
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
