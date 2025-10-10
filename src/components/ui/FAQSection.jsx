import React from "react";
import FAQItem from "./FAQItem";

const FAQSection = ({
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions here",
  faqs = [],
  className = "",
}) => {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
