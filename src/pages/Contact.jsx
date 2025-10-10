import React, { useState } from "react";
import { Footer } from "../components/navigation";
import { PageContainer, CTASection, HeroSection } from "../components/layout";
import { Card, Button, Input, FAQSection } from "../components/ui";
import { useToast } from "../contexts/ToastContext";

const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    userType: "user",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast(
        "Your message has been successfully submitted! We will respond soon.",
        "success"
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        userType: "user",
      });
    } catch (error) {
      showToast(
        "There was an error submitting your message. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Phone",
      details: ["+91-9876543210", "+91-8765432109"],
      action: "Call Now",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email",
      details: ["support@ctoindia.com", "info@ctoindia.com"],
      action: "Send Email",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Address",
      details: [
        "CTO India Office",
        "Tech Park, Sector 5",
        "Gurgaon, Haryana 122001",
      ],
      action: "Get Directions",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Working Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
        "Sunday: Closed",
      ],
      action: "View Schedule",
    },
  ];

  return (
    <>
      <PageContainer maxWidth="full" padding="none">
        {/* Hero Section */}
        <HeroSection
          title="Contact Us"
          subtitle="Need help with your healthcare needs? Our expert team is always ready to assist you. Whether you have questions about our services, need medical consultation, or want to partner with us - we're here to help."
          image="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop"
          imageAlt="Healthcare support team"
        />

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {info.title}
                  </h3>
                  <div className="space-y-1 mb-4">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    {info.action}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <Card className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91-9876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What are you?
                        </label>
                        <select
                          name="userType"
                          value={formData.userType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="user">Patient</option>
                          <option value="provider">Healthcare Provider</option>
                          <option value="business">Medical Business</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your message subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter your detailed message here..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Map and Additional Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Office Location
                </h2>

                {/* Map Placeholder */}
                <Card className="p-8 mb-8">
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-gray-500">Interactive Map</p>
                      <p className="text-sm text-gray-400">
                        Tech Park, Gurgaon
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Quick Contact Options */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Quick Contact Options
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          WhatsApp Support
                        </p>
                        <p className="text-sm text-gray-600">
                          Instant support via WhatsApp
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Phone Support
                        </p>
                        <p className="text-sm text-gray-600">Mon-Fri 9AM-6PM</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Schedule Meeting
                        </p>
                        <p className="text-sm text-gray-600">
                          Book a consultation call
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions here"
          faqs={[
            {
              question: "What healthcare services do you provide?",
              answer:
                "We provide telehealth consultations, home nursing care, patient transport, diagnostic imaging, medical equipment rental, and rehabilitation services.",
            },
            {
              question: "How quickly can I get medical assistance?",
              answer:
                "For urgent cases, we provide immediate assistance within 30 minutes. For routine consultations, appointments can be scheduled within 24 hours.",
            },
            {
              question: "How do I get support?",
              answer:
                "We provide 24/7 medical support through phone, email, WhatsApp, and our mobile app. Our medical team is always available to assist you.",
            },
            {
              question: "How is pricing calculated?",
              answer:
                "Pricing depends on the type of service, duration, and complexity. We offer competitive rates and transparent pricing with no hidden costs.",
            },
            {
              question: "Are your services available across India?",
              answer:
                "Yes, our services are available in major cities across India. We are continuously expanding to cover more locations.",
            },
            {
              question: "How do I book a service?",
              answer:
                "You can book services through our website, mobile app, or by calling our helpline. Our booking process is simple and user-friendly.",
            },
          ]}
        />
      </PageContainer>

      {/* CTA Section */}
      <CTASection
        title="Need Immediate Medical Assistance?"
        subtitle="Our 24/7 medical support team is always ready to help. Contact us now for urgent healthcare needs or book a consultation."
        showServicesButton={true}
        showContactButton={false}
      />

      <Footer />
    </>
  );
};

export default Contact;
