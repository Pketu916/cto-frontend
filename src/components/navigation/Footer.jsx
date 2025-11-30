import React from "react";
import { Link } from "react-router-dom";
// local section renderer replacing removed sections/FooterSection
import SocialIcons from "./SocialIcons";
import FooterLink from "./FooterLink";
import Logo1 from "../../assets/Logo1.jpg";

const footerData = {
  services: [
    { text: "Accommodation (SDA, MTA, STA, ILO)", href: "/services" },
    { text: "Night Riders", href: "/services" },
    { text: "NDIS Services", href: "/services" },
    { text: "Aged Care", href: "/services" },
    { text: "Specialist Medical Care", href: "/services" },
    { text: "Therapy Support", href: "/services" },
  ],
  features: [
    { text: "How It Works", href: "/how-it-works" },
    { text: "Membership Options", href: "/membership" },
    { text: "Eligibility", href: "/eligibility" },
    { text: "Online Booking", href: "/services" },
    { text: "GPS Tracking", href: "/how-it-works" },
    { text: "NDIS & My Aged Care", href: "/membership" },
  ],
  resources: [
    { text: "Membership", href: "/membership" },
    { text: "FAQ", href: "/contact" },
    { text: "Support", href: "/contact" },
    { text: "Clinical Team", href: "/clinical-team" },
    { text: "Eligibility", href: "/eligibility" },
  ],
  company: [
    { text: "About CRT Program", href: "/about" },
    { text: "CRT Pathway", href: "/how-it-works" },
    { text: "Contact Us", href: "/contact" },
    { text: "CRT Cadetship", href: "/cadetship" },
    { text: "Careers", href: "/careers" },
  ],
  legal: [
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Terms of Service", href: "/terms" },
    // { text: "Medical Disclaimer", href: "/disclaimer" },
  ],
};

const FooterSection = ({ title, links }) => (
  <div>
    <h4 className="text-white font-semibold mb-4">{title}</h4>
    <ul className="space-y-2">
      {links.map((link, idx) => (
        <li key={idx}>
          <FooterLink href={link.href}>{link.text}</FooterLink>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto md:py-16 py-8">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-8">
          {/* Logo & Contact & Social */}
          <div className="order-last lg:order-first flex-shrink-0 flex flex-col gap-2">
            <div className="mb-1">
              <Link to="/">
                <img
                  src={Logo1}
                  alt="CTO India Logo"
                  className="h-16 w-auto mr-3"
                />
              </Link>
            </div>
            <p className="text-white font-medium m-0">1800 40 30 50</p>
            <FooterLink href="mailto:info@crtprogram.com">
              info@crtprogram.com
            </FooterLink>
            <FooterLink href="https://crtprogram.com" className="text-sm">
              www.crtprogram.com
            </FooterLink>
            <p className="text-white text-sm mt-2">ABN: 66 635 074 903</p>

            {/* Social Icons */}
            <SocialIcons />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 sm:gap-8 gap-4 order-first lg:order-last w-full">
            <FooterSection title="MyCRT Services" links={footerData.services} />
            <FooterSection title="Features" links={footerData.features} />
            <FooterSection title="Resources" links={footerData.resources} />
            <FooterSection title="Company" links={footerData.company} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:gap-4 gap-2">
            <p className="text-gray-300 m-0">
              © CRT Program (Community Restoration and Transition Care Program)
              2025. CRT PROGRAM©️copyright 2019-2028 All Rights Reserved
              Innovation patent Award - IP Australia
            </p>
            <div className="flex flex-wrap gap-6">
              {footerData.legal.map((link, index) => (
                <FooterLink key={`legal-${index}`} href={link.href}>
                  {link.text}
                </FooterLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
