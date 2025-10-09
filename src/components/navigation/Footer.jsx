import React from "react";
// local section renderer replacing removed sections/FooterSection
import SocialIcons from "./SocialIcons";
import FooterLink from "./FooterLink";
import Logo1 from "../../assets/Logo1.jpg";

const footerData = {
  services: [
    { text: "Telehealth", href: "/services" },
    { text: "Home Care", href: "/services" },
    { text: "Emergency Services", href: "/services" },
    { text: "Diagnostics", href: "/services" },
    { text: "Rehabilitation", href: "/services" },
    { text: "Specialist Care", href: "/services" },
  ],
  features: [
    { text: "Appointment Booking", href: "/services" },
    { text: "Health Records", href: "/profile" },
    { text: "Emergency Response", href: "/contact" },
    { text: "Medical Consultation", href: "/services" },
    { text: "Health Monitoring", href: "/profile" },
    { text: "Family Health", href: "/profile" },
  ],
  resources: [
    { text: "Pricing", href: "/pricing" },
    { text: "Blog", href: "/blog" },
    { text: "FAQ", href: "/contact" },
    { text: "Support", href: "/contact" },
    { text: "Health Tips", href: "/blog" },
    { text: "Medical News", href: "/blog" },
  ],
  company: [
    { text: "About Us", href: "/about" },
    { text: "Our Team", href: "/about" },
    { text: "Contact", href: "/contact" },
    { text: "Careers", href: "/contact" },
    { text: "Partners", href: "/contact" },
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
    <footer className="bg-[#012939] text-white">
      <div className="container mx-auto md:py-16 py-8">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-8">
          {/* Logo & Contact & Social */}
          <div className="order-last lg:order-first flex-shrink-0 flex flex-col gap-2">
            <div className="mb-1" >
              <img
                src={Logo1}
                alt="CTO India Logo"
                className="h-16 w-auto mr-3"
              />
            </div>
            <p className="text-white font-medium m-0">+91-9876543210</p>
            <FooterLink href="mailto:support@ctoindia.com">
              support@ctoindia.com
            </FooterLink>

            {/* Social Icons */}
            <SocialIcons />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 sm:gap-8 gap-4 order-first lg:order-last w-full">
            <FooterSection
              title="Healthcare Services"
              links={footerData.services}
            />
            <FooterSection title="Features" links={footerData.features} />
            <FooterSection title="Resources" links={footerData.resources} />
            <FooterSection title="Company" links={footerData.company} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:gap-4 gap-2">
            <p className="text-gray-300 m-0">© CTO India 2025</p>
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
