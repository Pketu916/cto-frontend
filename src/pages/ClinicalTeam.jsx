import React from "react";
import { Footer } from "../components/navigation";
import { PageContainer, HeroSection, CTASection } from "../components/layout";
import { Card } from "../components/ui";
import {
  Stethoscope,
  Heart,
  Brain,
  Pill,
  Syringe,
  Activity,
  Users,
  Shield,
} from "lucide-react";

const ClinicalTeam = () => {
  const clinicalProfessionals = [
    {
      title: "After-Hours Medical Team",
      icon: Stethoscope,
      professionals: [
        "Registered Nurses (APRAH registered)",
        "Enrolled Nurses",
        "Paramedics",
      ],
    },
    {
      title: "Disability Support Workers",
      icon: Activity,
      professionals: [
        "Cert IV Disability Support Workers",
        "Personal care assistants",
        "Community support workers",
      ],
    },
    {
      title: "Mental Health Specialists",
      icon: Brain,
      professionals: [
        "Mental Health Nurses",
        "Clinical Social Workers",
        "Psychosocial Coaches & Mentors",
      ],
    },
    {
      title: "Allied Health Professionals",
      icon: Users,
      professionals: [
        "Occupational Therapists",
        "Psychologists",
        "Speech Therapists",
      ],
    },
  ];

  const nursingServices = [
    {
      icon: Syringe,
      title: "Diabetic & Insulin Management",
      description: "Expert diabetes care and insulin administration support",
    },
    {
      icon: Heart,
      title: "Injection Administration",
      description: "Subcutaneous & intramuscular injections",
    },
    {
      icon: Activity,
      title: "Catheter Care",
      description: "IDC/SPC catheter care and management",
    },
    {
      icon: Pill,
      title: "Tube Feeding",
      description: "PEG & NG tube feeding and care",
    },
    {
      icon: Shield,
      title: "Complex Care",
      description:
        "Tracheostomy care, airway support, wound management, and continence care",
    },
  ];

  const mentalHealthServices = [
    "Welfare and Safety Checks",
    "Psychotropic Medication Monitoring",
    "Behavioural & Emotional Support",
    "Telehealth and Remote Psychiatric Consultations",
    "Psychological & OT Support",
    "Crisis Intervention and Family Liaison",
  ];

  const additionalServices = [
    {
      title: "Pharmacy & Pathology Mobile Services",
      description:
        "Our mobile pathology and partnered pharmacy networks provide home-based sample collection, medication review, packaging, delivery, and urgent medicine replacement.",
      services: [
        "Home-based sample collection and testing",
        "Medication review, packaging, and delivery",
        "Urgent medicine replacement and repeat scripts",
      ],
    },
  ];

  return (
    <>
      <PageContainer maxWidth="full" padding="none">
        <HeroSection
          title="Our Clinical & Support Teams"
          subtitle="MyCRT employs qualified and registered professionals across multiple disciplines, ensuring comprehensive care response for all members."
          image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=600&fit=crop"
          imageAlt="Clinical team"
        />

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Qualified Healthcare Professionals
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                All our staff are qualified, registered, and experienced in
                their respective fields
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {clinicalProfessionals.map((team, index) => {
                const IconComponent = team.icon;
                return (
                  <Card
                    key={index}
                    className="p-8 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {team.title}
                        </h3>
                        <ul className="space-y-3">
                          {team.professionals.map((professional, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">
                                {professional}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nursing and Clinical Support Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide high-intensity and complex care services for various
                medical needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nursingServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {service.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Mental Health & Psychosocial Support
              </h2>
              <p className="text-xl text-gray-600">
                Specialised mental health response team for comprehensive care
              </p>
            </div>

            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {mentalHealthServices.map((service, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-700 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <CTASection
          title="Need Qualified Healthcare Professionals?"
          subtitle="MyCRT connects you with the right professionals for your care needs. Join today and access our comprehensive clinical team 24/7."
          showServicesButton={false}
          showContactButton={true}
        />
      </PageContainer>
      <Footer />
    </>
  );
};

export default ClinicalTeam;
