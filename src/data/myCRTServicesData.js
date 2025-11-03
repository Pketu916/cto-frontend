// myCRT Services Data
// All services follow the myCRT membership model where members are called "participants" not "patients"

export const myCRTServicesData = [
  // ============ 14. myCRT After Hours Services ============
  {
    id: "after-hours-care-response",
    title: "After Hours Care Response",
    category: "After Hours Services",
    shortDescription:
      "24/7 immediate response service for urgent needs outside regular hours.",
    longDescription:
      "Professional emergency response service providing immediate assistance when you need it most. Available round the clock to ensure participant safety and wellbeing.",
    basePrice: 5000,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "after-hours-care-response",
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop",
    features: [
      "24/7 availability",
      "Immediate response",
      "Qualified professionals",
      "Emergency protocols",
      "Real-time tracking",
    ],
    faq: [
      {
        q: "How quickly can I get a response?",
        a: "Our team responds within 15-30 minutes of receiving your request, depending on location and urgency.",
      },
      {
        q: "What types of emergencies do you handle?",
        a: "We handle all types of urgent care situations requiring immediate professional intervention.",
      },
    ],
  },
  {
    id: "after-hours-dr-service-medicare",
    title: "After Hours Dr Service",
    category: "After Hours Services",
    shortDescription:
      "Licensed professional visits at home after regular hours with insurance billing.",
    longDescription:
      "Qualified practitioners available for home visits during evenings, weekends, and holidays. All services can be billed through insurance for eligible participants.",
    basePrice: 8000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "after-hours-dr-service",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
    features: [
      "Licensed professionals",
      "Insurance billing",
      "Home visits",
      "Complete documentation",
      "Follow-up care",
    ],
    faq: [
      {
        q: "Can I use my insurance?",
        a: "Yes, if you have eligible insurance coverage, the service can be billed directly.",
      },
      {
        q: "What should I prepare for the visit?",
        a: "Have your insurance card and any relevant medical documents ready.",
      },
    ],
  },
  {
    id: "after-hours-nursing-care-service",
    title: "After Hours Nursing Care Service",
    category: "After Hours Services",
    shortDescription:
      "Professional care services available after regular hours.",
    longDescription:
      "Registered professionals providing skilled care including wound management, medication administration, and vital sign monitoring during after-hours periods.",
    basePrice: 3500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "after-hours-nursing-care",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    features: [
      "Registered professionals",
      "Wound management",
      "Medication administration",
      "Vital monitoring",
      "Complete documentation",
    ],
    faq: [
      {
        q: "Are your professionals certified?",
        a: "Yes, all our professionals are fully licensed and certified.",
      },
    ],
  },
  {
    id: "after-hours-welfare-check",
    title: "After Hours Welfare Check",
    category: "After Hours Services",
    shortDescription:
      "Wellness and safety check-ins for participants living independently.",
    longDescription:
      "Regular welfare checks to ensure participant safety, medication compliance, and overall wellbeing. Includes assessment of living conditions and social needs.",
    basePrice: 1500,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "after-hours-welfare-check",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop",
    features: [
      "Safety assessments",
      "Wellness monitoring",
      "Medication checks",
      "Social support",
      "Regular reporting",
    ],
  },
  {
    id: "after-medication-management",
    title: "After Hours Medication Management",
    category: "After Hours Services",
    shortDescription:
      "Safe medication administration and management during after hours.",
    longDescription:
      "Expert medication administration including preparation, monitoring, and documentation to ensure participant safety and treatment effectiveness.",
    basePrice: 2000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "after-hours-medication-management",
    features: [
      "Safe administration",
      "Medication monitoring",
      "Complete documentation",
      "Emergency protocols",
      "Compliance tracking",
    ],
  },
  {
    id: "after-hour-pathology-service",
    title: "After Hours Pathology Service",
    category: "After Hours Services",
    shortDescription:
      "Sample collection and testing outside regular laboratory hours.",
    longDescription:
      "Professional pathology services including blood collection, urine samples, and other specimens with timely processing and results delivery.",
    basePrice: 2500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "after-hours-pathology",
    features: [
      "Expert collection",
      "Timely processing",
      "Accurate results",
      "Secure handling",
      "Quick turnaround",
    ],
  },
  {
    id: "after-pharmacy-pbs",
    title: "After Hours Pharmacy Service",
    category: "After Hours Services",
    shortDescription: "Emergency medication delivery under insurance benefits.",
    longDescription:
      "Urgent medication supply and delivery service for insurance-eligible medications when standard pharmacies are closed.",
    basePrice: 1000,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "after-hours-pharmacy",
    features: [
      "Emergency delivery",
      "Insurance eligible",
      "Temperature control",
      "Rapid dispatch",
      "24/7 availability",
    ],
  },
  {
    id: "after-hours-telehealth-dr-service",
    title: "After Hours Telehealth Service",
    category: "After Hours Services",
    shortDescription: "Virtual consultations during after-hours periods.",
    longDescription:
      "Secure video consultations with qualified professionals for non-emergency advice, prescriptions, and treatment recommendations.",
    basePrice: 6000,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "after-hours-telehealth",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop",
    features: [
      "Secure video platform",
      "Licensed professionals",
      "Prescription management",
      "Instant consultation",
      "Insurance compatible",
    ],
  },
  {
    id: "after-hours-patient-transport",
    title: "After Hours Transport",
    category: "After Hours Services",
    shortDescription:
      "Transport service for appointments and emergencies after hours.",
    longDescription:
      "Wheelchair accessible and well-equipped transport vehicles with trained personnel for safe participant transport.",
    basePrice: 3000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "after-hours-transport",
    features: [
      "Wheelchair accessible",
      "Trained staff",
      "Safe vehicles",
      "Emergency equipment",
      "Quick dispatch",
    ],
  },

  // ============ 15. myCRT Nursing Care Services ============
  {
    id: "diabetic-management",
    title: "Diabetic Management",
    category: "Nursing Care Services",
    shortDescription:
      "Comprehensive diabetes care including monitoring, education, and insulin management.",
    longDescription:
      "Specialized care for participants with diabetes including blood glucose monitoring, insulin administration, diabetic foot care, and education on diabetes management.",
    basePrice: 4000,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "diabetic-management",
    features: [
      "Glucose monitoring",
      "Insulin management",
      "Foot care",
      "Education programs",
      "Regular assessments",
    ],
  },
  {
    id: "bowel-management",
    title: "Bowel Management",
    category: "Nursing Care Services",
    shortDescription:
      "Professional assistance with bowel care and continence management.",
    longDescription:
      "Skilled care for participants with bowel dysfunction including assessment, treatment plans, and continence support.",
    basePrice: 3500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "bowel-management",
    features: [
      "Professional assessment",
      "Treatment plans",
      "Continence support",
      "Daily monitoring",
      "Family education",
    ],
  },
  {
    id: "continence-management",
    title: "Continence Management",
    category: "Nursing Care Services",
    shortDescription: "Expert continence care and bladder management.",
    longDescription:
      "Comprehensive continence assessment and management including catheter care, continence aids, and pelvic floor exercises.",
    basePrice: 3500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "continence-management",
    features: [
      "Complete assessment",
      "Catheter care",
      "Bladder management",
      "Aids provision",
      "Exercise programs",
    ],
  },
  {
    id: "ventilator-management",
    title: "Ventilator Management",
    category: "Nursing Care Services",
    shortDescription:
      "Specialized care for participants requiring respiratory support.",
    longDescription:
      "Expert management of mechanical ventilation including monitoring, maintenance, and emergency protocols for ventilator-dependent participants.",
    basePrice: 15000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "ventilator-management",
    features: [
      "Expert management",
      "24/7 monitoring",
      "Emergency protocols",
      "Equipment maintenance",
      "Family training",
    ],
  },
  {
    id: "home-peritoneal-dialysis",
    title: "Home Peritoneal Dialysis",
    category: "Nursing Care Services",
    shortDescription: "In-home dialysis service with trained support.",
    longDescription:
      "Complete peritoneal dialysis management at home with professional supervision, equipment setup, and regular health monitoring.",
    basePrice: 12000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "home-peritoneal-dialysis",
    features: [
      "Professional supervision",
      "Equipment setup",
      "Regular monitoring",
      "Complete training",
      "Emergency support",
    ],
  },
  {
    id: "tracheostomy",
    title: "Tracheostomy Care",
    category: "Nursing Care Services",
    shortDescription: "Specialized tracheostomy tube care and management.",
    longDescription:
      "Professional tracheostomy management including tube care, suctioning, and emergency procedures for participants with tracheostomy.",
    basePrice: 5000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "tracheostomy-care",
    features: [
      "Expert tube care",
      "Regular suctioning",
      "Emergency procedures",
      "Infection prevention",
      "Family education",
    ],
  },
  {
    id: "subcutaneous-injection",
    title: "Subcutaneous Injection",
    category: "Nursing Care Services",
    shortDescription: "Safe administration of subcutaneous medications.",
    longDescription:
      "Professional subcutaneous injection administration including insulin, anticoagulants, and other injectable medications.",
    basePrice: 2000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "subcutaneous-injection",
    features: [
      "Safe administration",
      "Proper technique",
      "Site rotation",
      "Documentation",
      "Patient education",
    ],
  },
  {
    id: "wound-management",
    title: "Wound Management",
    category: "Nursing Care Services",
    shortDescription: "Advanced wound care and dressing changes.",
    longDescription:
      "Expert wound assessment and management including chronic wounds, pressure injuries, and surgical wounds with evidence-based treatments.",
    basePrice: 4500,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "wound-management",
    features: [
      "Expert assessment",
      "Advanced treatments",
      "Regular monitoring",
      "Evidence-based care",
      "Progress tracking",
    ],
  },
  {
    id: "ng-peg-feed",
    title: "NG and PEG Feeding",
    category: "Nursing Care Services",
    shortDescription:
      "Enteral feeding management for participants unable to eat orally.",
    longDescription:
      "Nasogastric and percutaneous endoscopic gastrostomy feeding management including insertion, care, and monitoring.",
    basePrice: 6000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "ng-peg-feeding",
    features: [
      "Expert insertion",
      "Regular monitoring",
      "Proper nutrition",
      "Complication prevention",
      "Family training",
    ],
  },
  {
    id: "idc-spc-catheter-management",
    title: "IDC and SPC Catheter Management",
    category: "Nursing Care Services",
    shortDescription: "Indwelling and suprapubic catheter care and management.",
    longDescription:
      "Professional catheter management including insertion, maintenance, and removal with infection prevention protocols.",
    basePrice: 4000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "catheter-management",
    features: [
      "Professional insertion",
      "Daily maintenance",
      "Infection prevention",
      "Regular checks",
      "Documentation",
    ],
  },
  {
    id: "pathology-blood-collection",
    title: "Pathology Sample Collection",
    category: "Nursing Care Services",
    shortDescription: "Professional sample collection and handling.",
    longDescription:
      "Expert phlebotomy service for blood collection, ensuring proper technique and specimen integrity.",
    basePrice: 2500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "pathology-collection",
    features: [
      "Expert technique",
      "Proper handling",
      "Accurate labeling",
      "Quick processing",
      "Pain-free collection",
    ],
  },
  {
    id: "vital-sign-metabolic-screening",
    title: "Vital Signs & Metabolic Screening",
    category: "Nursing Care Services",
    shortDescription:
      "Regular monitoring of vital signs and metabolic parameters.",
    longDescription:
      "Comprehensive monitoring including blood pressure, heart rate, temperature, and metabolic markers for early detection of issues.",
    basePrice: 3000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "vital-signs-monitoring",
    features: [
      "Comprehensive monitoring",
      "Early detection",
      "Regular tracking",
      "Professional analysis",
      "Alert systems",
    ],
  },
  {
    id: "vaccination",
    title: "Vaccination Services",
    category: "Nursing Care Services",
    shortDescription: "Immunization services with vaccine management.",
    longDescription:
      "Complete vaccination service including flu shots, COVID-19 vaccines, travel immunizations, and childhood vaccinations with cold chain management.",
    basePrice: 2000,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "vaccination-services",
    features: [
      "Multiple vaccines",
      "Cold chain management",
      "Proper storage",
      "Documentation",
      "Follow-up scheduling",
    ],
  },
  {
    id: "telehealth-diagnostic-management",
    title: "Telehealth Diagnostic Management",
    category: "Nursing Care Services",
    shortDescription: "Remote monitoring and diagnostic support.",
    longDescription:
      "Technology-enabled monitoring with real-time data transmission to professionals for early intervention.",
    basePrice: 4000,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "telehealth-diagnostics",
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop",
    features: [
      "Real-time monitoring",
      "Technology integration",
      "Early intervention",
      "Professional oversight",
      "Alert systems",
    ],
  },
  {
    id: "mental-health-care-plan",
    title: "Mental Health Care Plan",
    category: "Nursing Care Services",
    shortDescription: "Structured support and care planning.",
    longDescription:
      "Comprehensive assessment and care planning including therapy support and crisis intervention.",
    basePrice: 5000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "mental-health-care",
    features: [
      "Complete assessment",
      "Structured planning",
      "Therapy support",
      "Crisis intervention",
      "Regular reviews",
    ],
  },

  // ============ 16. Mobile Diagnostic and Imaging ============
  {
    id: "mobile-digital-xray",
    title: "Mobile Digital X-Ray",
    category: "Mobile Diagnostic and Imaging",
    shortDescription: "On-site digital X-ray imaging service at your location.",
    longDescription:
      "Portable digital radiography equipment providing high-quality X-ray images with immediate digital results and expert interpretation.",
    basePrice: 4500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "mobile-digital-xray",
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop",
    features: [
      "Portable equipment",
      "High-quality imaging",
      "Instant results",
      "Expert interpretation",
      "Safe radiation",
    ],
  },
  {
    id: "mobile-ultrasound",
    title: "Mobile Ultrasound",
    category: "Mobile Diagnostic and Imaging",
    shortDescription: "Portable ultrasound imaging at home or facility.",
    longDescription:
      "Professional portable ultrasound service for abdominal, cardiac, and obstetrical imaging with same-day results.",
    basePrice: 6000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "mobile-ultrasound",
    features: [
      "Portable equipment",
      "Multiple scan types",
      "Same-day results",
      "Expert professionals",
      "Comfortable setting",
    ],
  },

  // ============ 17. Drone Delivery Services ============
  {
    id: "drone-pathology-service",
    title: "Drone Sample Delivery",
    category: "Drone Delivery Services",
    shortDescription: "Rapid delivery of samples via specialized drones.",
    longDescription:
      "Emergency service for transporting critical samples to laboratories for time-sensitive testing.",
    basePrice: 3000,
    insuranceAvailable: false,
    active: true,
    trending: true,
    slug: "drone-pathology",
    features: [
      "Rapid delivery",
      "Time-sensitive",
      "Secure handling",
      "GPS tracking",
      "Temperature control",
    ],
  },
  {
    id: "drone-pharmacy-service",
    title: "Drone Pharmacy Delivery",
    category: "Drone Delivery Services",
    shortDescription: "Emergency medication delivery using specialized drones.",
    longDescription:
      "Urgent medication delivery service using temperature-controlled drones for remote or hard-to-reach locations.",
    basePrice: 2500,
    insuranceAvailable: false,
    active: true,
    trending: true,
    slug: "drone-pharmacy",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop",
    features: [
      "Emergency delivery",
      "Temperature control",
      "Remote access",
      "Rapid dispatch",
      "Secure transport",
    ],
  },
  {
    id: "drone-health-consumables",
    title: "Drone Consumables Delivery",
    category: "Drone Delivery Services",
    shortDescription: "Delivery of supplies and consumables via drone.",
    longDescription:
      "Rapid delivery of consumables, supplies, and equipment to participant locations.",
    basePrice: 2000,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "drone-consumables",
    features: [
      "Rapid delivery",
      "Wide range items",
      "Secure transport",
      "GPS tracking",
      "Flexible scheduling",
    ],
  },

  // ============ 18. Transport Services ============
  {
    id: "hospital-pick-drop",
    title: "Hospital Pick and Drop",
    category: "Transport Services",
    shortDescription: "Transport to and from hospital for appointments.",
    longDescription:
      "Reliable transport service with wheelchair accessibility for visits and discharge pickups.",
    basePrice: 2500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "hospital-transport",
    features: [
      "Wheelchair accessible",
      "Reliable service",
      "Trained staff",
      "Safe vehicles",
      "Timely pickups",
    ],
  },
  {
    id: "medical-appointment-escort",
    title: "Appointment Escort",
    category: "Transport Services",
    shortDescription: "Accompanied transport to appointments with support.",
    longDescription:
      "Transport service with trained escorts to assist participants during appointments and procedures.",
    basePrice: 3000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "appointment-escort",
    features: [
      "Trained escorts",
      "Full assistance",
      "Professional support",
      "Documentation help",
      "Companionship",
    ],
  },
  {
    id: "court-presentation",
    title: "Court Presentation",
    category: "Transport Services",
    shortDescription: "Transport and support for court-related appointments.",
    longDescription:
      "Discrete transport service with escort support for participants attending court or legal appointments.",
    basePrice: 4000,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "court-presentation",
    features: [
      "Discrete service",
      "Escort support",
      "Professional assistance",
      "Reliable transport",
      "Privacy protection",
    ],
  },
  {
    id: "corrective-centre-pick-drop",
    title: "Corrective Centre Transport (NDIS)",
    category: "Transport Services",
    shortDescription: "NDIS-funded transport for corrective centre visits.",
    longDescription:
      "Specialized transport service for NDIS participants visiting corrective or rehabilitation centres.",
    basePrice: 3500,
    insuranceAvailable: true,
    ndisOnly: true,
    active: true,
    trending: false,
    slug: "corrective-centre-transport",
    features: [
      "NDIS funded",
      "Specialized service",
      "Wheelchair accessible",
      "Trained staff",
      "Regular scheduling",
    ],
  },

  // ============ 19. Telehealth Services ============
  {
    id: "remote-dr-specialist-consultation",
    title: "Remote Specialist Consultation",
    category: "Telehealth Services",
    shortDescription: "Virtual consultations with specialists.",
    longDescription:
      "Secure video consultations with specialists including cardiologists, neurologists, and other experts.",
    basePrice: 8000,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "remote-specialist",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop",
    features: [
      "Multiple specialists",
      "Secure platform",
      "Insurance compatible",
      "Follow-up care",
      "Prescription management",
    ],
  },
  {
    id: "telehealth-digital-diagnostic-screening",
    title: "Digital Diagnostic Screening",
    category: "Telehealth Services",
    shortDescription: "Comprehensive screening using digital diagnostics.",
    longDescription:
      "Complete assessment including metabolic check, vital signs, ECG, ultrasound, X-ray, screening tests, eye exams, and dental checks conducted remotely.",
    basePrice: 12000,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "digital-diagnostics",
    features: [
      "Multiple tests",
      "Remote access",
      "Comprehensive analysis",
      "Expert review",
      "Quick results",
    ],
  },

  // ============ 20. Allied Health Services ============
  {
    id: "psychologist",
    title: "Psychologist Services",
    category: "Allied Health Services",
    shortDescription: "Professional psychological assessment and therapy.",
    longDescription:
      "Licensed psychologist providing individual therapy, assessment, and mental health support for participants.",
    basePrice: 5000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "psychologist-services",
    features: [
      "Licensed professionals",
      "Individual therapy",
      "Assessment services",
      "Flexible scheduling",
      "Confidential service",
    ],
  },
  {
    id: "occupational-therapist",
    title: "Occupational Therapist",
    category: "Allied Health Services",
    shortDescription:
      "Occupational therapy for daily living skills and independence.",
    longDescription:
      "Registered occupational therapist providing assessment and intervention for daily living activities and functional independence.",
    basePrice: 4500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "occupational-therapy",
    features: [
      "Daily living skills",
      "Independence training",
      "Functional assessment",
      "Home modifications",
      "Equipment provision",
    ],
  },
  {
    id: "clinical-social-worker",
    title: "Clinical Social Worker",
    category: "Allied Health Services",
    shortDescription: "Social work support for wellbeing.",
    longDescription:
      "Qualified clinical social worker providing counseling, case management, and social support services.",
    basePrice: 4000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "clinical-social-worker",
    features: [
      "Counselling services",
      "Case management",
      "Social support",
      "Resource connection",
      "Advocacy",
    ],
  },
  {
    id: "ndis-support-coordination",
    title: "NDIS Support Coordination",
    category: "Allied Health Services",
    shortDescription: "NDIS plan coordination and support navigation.",
    longDescription:
      "Dedicated coordinators helping NDIS participants navigate services, providers, and maximize their plan funding.",
    basePrice: 6000,
    insuranceAvailable: true,
    ndisOnly: true,
    active: true,
    trending: false,
    slug: "ndis-support-coordination",
    features: [
      "Plan management",
      "Provider navigation",
      "Funding optimization",
      "Service coordination",
      "Progress tracking",
    ],
  },
  {
    id: "psychosocial-therapist",
    title: "Psychosocial Therapist",
    category: "Allied Health Services",
    shortDescription: "Specialized psychosocial support and therapy.",
    longDescription:
      "Qualified psychosocial therapist providing support for complex mental health and social circumstances.",
    basePrice: 5000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "psychosocial-therapy",
    features: [
      "Complex case support",
      "Holistic approach",
      "Crisis intervention",
      "Family support",
      "Case management",
    ],
  },
  {
    id: "behaviour-therapist",
    title: "Behaviour Therapist Service",
    category: "Allied Health Services",
    shortDescription: "Applied behaviour analysis and behaviour support.",
    longDescription:
      "Registered behaviour therapist providing evidence-based interventions for challenging behaviours and skill development.",
    basePrice: 5500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "behaviour-therapy",
    features: [
      "Behaviour assessment",
      "Intervention plans",
      "Skill development",
      "Data tracking",
      "Family training",
    ],
  },
  {
    id: "speech-pathologist",
    title: "Speech Pathologist",
    category: "Allied Health Services",
    shortDescription: "Speech and language therapy services.",
    longDescription:
      "Qualified speech pathologist providing assessment and therapy for communication, swallowing, and language disorders.",
    basePrice: 4500,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "speech-pathology",
    features: [
      "Communication assessment",
      "Language therapy",
      "Swallowing therapy",
      "Communication aids",
      "Family training",
    ],
  },
  {
    id: "physiotherapist",
    title: "Physiotherapist",
    category: "Allied Health Services",
    shortDescription: "Physical therapy and rehabilitation services.",
    longDescription:
      "Registered physiotherapist providing assessment, treatment, and exercise programs for mobility and physical function.",
    basePrice: 4000,
    insuranceAvailable: true,
    active: true,
    trending: true,
    slug: "physiotherapy",
    features: [
      "Movement assessment",
      "Exercise programs",
      "Pain management",
      "Mobility training",
      "Home programs",
    ],
  },
  {
    id: "paramedic",
    title: "Paramedic Services",
    category: "Allied Health Services",
    shortDescription: "Advanced paramedic care and emergency response.",
    longDescription:
      "Qualified paramedics providing advanced life support, emergency response, and assessment services.",
    basePrice: 8000,
    insuranceAvailable: true,
    active: true,
    trending: false,
    slug: "paramedic-services",
    features: [
      "Advanced life support",
      "Emergency response",
      "Rapid assessment",
      "Critical care",
      "Transport coordination",
    ],
  },

  // ============ 22. Complex Transition Care Units ============
  {
    id: "ndis-short-term-accommodation",
    title: "NDIS Short Term Accommodation (STA)",
    category: "Complex Transition Care",
    shortDescription: "Temporary accommodation for NDIS participants.",
    longDescription:
      "Short-term supported accommodation ranging from overnight to several weeks for NDIS participants.",
    basePrice: 150000,
    insuranceAvailable: true,
    ndisOnly: true,
    priceUnit: "per day",
    active: true,
    trending: false,
    slug: "ndis-short-term-accommodation",
    features: [
      "Fully accessible",
      "Professional support",
      "Flexible duration",
      "NDIS funded",
      "Quality care",
    ],
  },
  {
    id: "ndis-medium-term-accommodation",
    title: "NDIS Medium Term Accommodation (MTA)",
    category: "Complex Transition Care",
    shortDescription: "Extended temporary housing for NDIS participants.",
    longDescription:
      "Medium-term accommodation for participants waiting for permanent housing solutions.",
    basePrice: 120000,
    insuranceAvailable: true,
    ndisOnly: true,
    priceUnit: "per day",
    active: true,
    trending: false,
    slug: "ndis-medium-term-accommodation",
    features: [
      "Extended stay",
      "NDIS funded",
      "Support services",
      "Safe environment",
      "Transition planning",
    ],
  },
  {
    id: "ndis-homeless-transition-support",
    title: "NDIS Homeless Transition Support",
    category: "Complex Transition Care",
    shortDescription: "Support services for homeless NDIS participants.",
    longDescription:
      "Comprehensive support including accommodation, case management, and access to NDIS services for participants experiencing homelessness.",
    basePrice: 200000,
    insuranceAvailable: true,
    ndisOnly: true,
    priceUnit: "per day",
    active: true,
    trending: false,
    slug: "ndis-homeless-support",
    features: [
      "Immediate accommodation",
      "Case management",
      "Service access",
      "Crisis support",
      "Transition assistance",
    ],
  },
  {
    id: "ndis-high-intensive-behaviour-support",
    title: "NDIS High Intensive & Behaviour Support",
    category: "Complex Transition Care",
    shortDescription: "Specialized intensive behaviour support services.",
    longDescription:
      "24/7 intensive support with specialized behaviour intervention for participants with complex needs.",
    basePrice: 180000,
    insuranceAvailable: true,
    ndisOnly: true,
    priceUnit: "per day",
    active: true,
    trending: false,
    slug: "ndis-intensive-support",
    features: [
      "24/7 support",
      "Specialized intervention",
      "Complex needs",
      "Safety protocols",
      "Progress tracking",
    ],
  },

  // ============ 23. NDIS Emergency Support ============
  {
    id: "provider-care-breakdown",
    title: "Provider Care Breakdown Response",
    category: "NDIS Emergency Support",
    shortDescription: "Emergency response when primary provider unavailable.",
    longDescription:
      "Immediate support service when primary care provider is unable to deliver services due to emergency circumstances.",
    basePrice: 10000,
    insuranceAvailable: true,
    ndisOnly: true,
    active: true,
    trending: false,
    slug: "provider-breakdown-response",
    features: [
      "Immediate response",
      "Service continuity",
      "NDIS compatible",
      "Professional coverage",
      "Documentation",
    ],
  },
  {
    id: "regular-care-staff-unavailable",
    title: "Regular Care Staff Unavailable Support",
    category: "NDIS Emergency Support",
    shortDescription: "Coverage when regular care staff cannot attend.",
    longDescription:
      "Temporary care service ensuring continuity when regular support staff are sick, on leave, or otherwise unavailable.",
    basePrice: 8000,
    insuranceAvailable: true,
    ndisOnly: true,
    active: true,
    trending: false,
    slug: "staff-unavailable-support",
    features: [
      "Temporary coverage",
      "Service continuity",
      "Trained staff",
      "Documentation",
      "NDIS compatible",
    ],
  },
  {
    id: "safety-security-issues",
    title: "Safety & Security Support",
    category: "NDIS Emergency Support",
    shortDescription: "Immediate response to safety and security concerns.",
    longDescription:
      "Rapid response service for participants experiencing safety threats or security concerns requiring immediate intervention.",
    basePrice: 12000,
    insuranceAvailable: true,
    ndisOnly: true,
    active: true,
    trending: false,
    slug: "safety-security-support",
    features: [
      "Rapid response",
      "Safety assessment",
      "Security protocols",
      "Crisis intervention",
      "Follow-up support",
    ],
  },
  {
    id: "informal-carer-breakdown",
    title: "Informal Carer Breakdown Support",
    category: "NDIS Emergency Support",
    shortDescription: "Support when family caregivers become unavailable.",
    longDescription:
      "Emergency care coverage when informal carers (family members) are unable to provide support due to illness, emergencies, or other circumstances.",
    basePrice: 9000,
    insuranceAvailable: true,
    ndisOnly: true,
    active: true,
    trending: false,
    slug: "informal-carer-breakdown",
    features: [
      "Emergency coverage",
      "Family support",
      "NDIS compatible",
      "Professional care",
      "Documentation",
    ],
  },
  {
    id: "homeless-eviction-support",
    title: "Homeless due to Eviction Support",
    category: "NDIS Emergency Support",
    shortDescription:
      "Emergency accommodation for participants facing eviction.",
    longDescription:
      "Immediate support including temporary accommodation and case management for participants at risk of homelessness due to eviction.",
    basePrice: 15000,
    insuranceAvailable: true,
    ndisOnly: true,
    active: true,
    trending: false,
    slug: "homeless-eviction-support",
    features: [
      "Immediate accommodation",
      "Case management",
      "Crisis intervention",
      "NDIS funded",
      "Transition planning",
    ],
  },

  // ============ 24. Aged Care Services ============
  {
    id: "domestic-assistance",
    title: "Domestic Assistance",
    category: "Aged Care Services",
    shortDescription: "Home cleaning and domestic support services.",
    longDescription:
      "Professional domestic assistance including housekeeping, laundry, and home maintenance to support independence at home.",
    basePrice: 2000,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "domestic-assistance",
    features: [
      "Housekeeping",
      "Laundry service",
      "Home maintenance",
      "Flexible scheduling",
      "Quality service",
    ],
  },
  {
    id: "shopping-assistance",
    title: "Shopping Assistance",
    category: "Aged Care Services",
    shortDescription: "Support with grocery shopping and errands.",
    longDescription:
      "Assistance with grocery shopping, prescription collection, and other essential errands.",
    basePrice: 1500,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "shopping-assistance",
    features: [
      "Grocery shopping",
      "Prescription pickup",
      "Errand running",
      "Companionship",
      "Flexible schedule",
    ],
  },
  {
    id: "meal-preparation",
    title: "Meal Preparation",
    category: "Aged Care Services",
    shortDescription: "Nutritional meal planning and preparation support.",
    longDescription:
      "Meal planning and preparation service ensuring nutritional needs are met for older participants.",
    basePrice: 2500,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "meal-preparation",
    features: [
      "Nutritional planning",
      "Meal preparation",
      "Dietary requirements",
      "Healthy options",
      "Regular scheduling",
    ],
  },
  {
    id: "personal-care",
    title: "Personal Care",
    category: "Aged Care Services",
    shortDescription: "Assistance with personal hygiene and grooming.",
    longDescription:
      "Respectful support with bathing, dressing, grooming, and other personal care activities.",
    basePrice: 3000,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "personal-care",
    features: [
      "Bathing assistance",
      "Dressing support",
      "Grooming help",
      "Respectful service",
      "Privacy protection",
    ],
  },
  {
    id: "medication-assistance",
    title: "Medication Assistance",
    category: "Aged Care Services",
    shortDescription: "Support with medication management and administration.",
    longDescription:
      "Medication prompting, administration, and monitoring to ensure safe and effective medication use.",
    basePrice: 2500,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "medication-assistance",
    features: [
      "Medication prompts",
      "Safe administration",
      "Compliance tracking",
      "Documentation",
      "Emergency protocols",
    ],
  },
  {
    id: "transport-assistance",
    title: "Transport Assistance",
    category: "Aged Care Services",
    shortDescription: "Transport to appointments and social activities.",
    longDescription:
      "Transport service for appointments, social activities, and community engagement.",
    basePrice: 2000,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "transport-assistance",
    features: [
      "Reliable transport",
      "Social activities",
      "Community engagement",
      "Wheelchair accessible",
      "Flexible scheduling",
    ],
  },
  {
    id: "medical-specialist-appointment",
    title: "Appointment Support",
    category: "Aged Care Services",
    shortDescription: "Accompanied visits to specialists.",
    longDescription:
      "Transport and escort support for specialist appointments with communication assistance.",
    basePrice: 3500,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "appointment-support",
    features: [
      "Transport included",
      "Escort support",
      "Communication help",
      "Documentation",
      "Follow-up care",
    ],
  },
  {
    id: "home-nursing",
    title: "Home Nursing",
    category: "Aged Care Services",
    shortDescription: "Professional nursing care at home.",
    longDescription:
      "Registered nurse services including wound care, monitoring, and nursing procedures at home.",
    basePrice: 4000,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "home-nursing",
    features: [
      "Registered nurses",
      "Wound care",
      "Health monitoring",
      "Documentation",
      "Family updates",
    ],
  },
  {
    id: "home-respite-care",
    title: "Home Respite Care",
    category: "Aged Care Services",
    shortDescription: "In-home respite support for caregivers.",
    longDescription:
      "Temporary care service allowing primary caregivers to take breaks while ensuring participant needs are met.",
    basePrice: 15000,
    insuranceAvailable: false,
    priceUnit: "per day",
    active: true,
    trending: false,
    slug: "home-respite-care",
    features: [
      "Caregiver relief",
      "Complete care",
      "Flexible duration",
      "Quality service",
      "Peace of mind",
    ],
  },
  {
    id: "hospital-pick-drop-aged",
    title: "Hospital Pick and Drop",
    category: "Aged Care Services",
    shortDescription: "Transport to and from hospital.",
    longDescription:
      "Transport service for hospital admissions and discharges.",
    basePrice: 2500,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "hospital-transport-aged",
    features: [
      "Reliable service",
      "Wheelchair accessible",
      "Safe transport",
      "Timely pickups",
      "Professional staff",
    ],
  },
  {
    id: "night-care-assistance",
    title: "Night Care Assistance",
    category: "Aged Care Services",
    shortDescription: "Overnight support and monitoring.",
    longDescription:
      "Night-time care support including safety checks, assistance with nocturnal needs, and overnight monitoring.",
    basePrice: 20000,
    insuranceAvailable: false,
    priceUnit: "per night",
    active: true,
    trending: false,
    slug: "night-care",
    features: [
      "Overnight support",
      "Safety checks",
      "Nocturnal assistance",
      "Regular monitoring",
      "Quick response",
    ],
  },
  {
    id: "remote-monitoring",
    title: "Remote Monitoring",
    category: "Aged Care Services",
    shortDescription: "Technology-enabled safety monitoring.",
    longDescription:
      "24/7 remote monitoring service using sensors and wearable devices to track safety indicators.",
    basePrice: 5000,
    insuranceAvailable: false,
    priceUnit: "per month",
    active: true,
    trending: true,
    slug: "remote-monitoring",
    features: [
      "24/7 monitoring",
      "Sensor technology",
      "Alert systems",
      "Professional oversight",
      "Family notifications",
    ],
  },
  {
    id: "falls-response",
    title: "Falls Response",
    category: "Aged Care Services",
    shortDescription: "Rapid emergency response for falls.",
    longDescription:
      "Immediate response service for fall incidents with assessment and appropriate intervention.",
    basePrice: 8000,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "falls-response",
    features: [
      "Immediate response",
      "Assessment",
      "Appropriate intervention",
      "Follow-up care",
      "Prevention planning",
    ],
  },
  {
    id: "welfare-check-aged",
    title: "Welfare Check",
    category: "Aged Care Services",
    shortDescription: "Regular wellness and safety check-ins.",
    longDescription:
      "Scheduled visits to check on participant wellbeing, safety, and social needs.",
    basePrice: 1500,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "welfare-check",
    features: [
      "Regular visits",
      "Wellness checks",
      "Safety assessment",
      "Social support",
      "Documentation",
    ],
  },
  {
    id: "home-dr-service",
    title: "Home Professional Service",
    category: "Aged Care Services",
    shortDescription: "Professional home visits for assessments.",
    longDescription:
      "Qualified professional providing comprehensive assessments and consultations at home.",
    basePrice: 7000,
    insuranceAvailable: false,
    active: true,
    trending: false,
    slug: "home-professional-service",
    features: [
      "Qualified professionals",
      "Complete assessment",
      "Home convenience",
      "Comprehensive care",
      "Follow-up",
    ],
  },
  {
    id: "telehealth-gp-service",
    title: "Telehealth Professional Service",
    category: "Aged Care Services",
    shortDescription: "Virtual professional consultations.",
    longDescription:
      "Secure video consultations with professionals for advice and prescriptions.",
    basePrice: 5000,
    insuranceAvailable: false,
    active: true,
    trending: true,
    slug: "telehealth-service",
    features: [
      "Secure platform",
      "Virtual consultations",
      "Prescription service",
      "Quick access",
      "Privacy protection",
    ],
  },
];

// Helper function to get estimated price range
const getEstimatedPriceRange = (service) => {
  const basePrice = service.basePrice || 0;

  if (service.priceUnit?.includes("day")) {
    return `₹${basePrice.toLocaleString("en-IN")} per day`;
  } else if (service.priceUnit?.includes("month")) {
    return `₹${basePrice.toLocaleString("en-IN")} per month`;
  } else if (service.priceUnit?.includes("night")) {
    return `₹${basePrice.toLocaleString("en-IN")} per night`;
  } else {
    return `₹${basePrice.toLocaleString("en-IN")} per service`;
  }
};

// Add estimatedPriceRange and default images to all services
myCRTServicesData.forEach((service) => {
  if (!service.estimatedPriceRange) {
    service.estimatedPriceRange = getEstimatedPriceRange(service);
  }
  if (!service.image) {
    // Add default images based on category
    const defaultImages = {
      "After Hours Services":
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop",
      "Nursing Care Services":
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      "Mobile Diagnostic and Imaging":
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop",
      "Drone Delivery Services":
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop",
      "Transport Services":
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop",
      "Telehealth Services":
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop",
      "Allied Health Services":
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop",
      "Complex Transition Care":
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
      "NDIS Emergency Support":
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
      "Aged Care Services":
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop",
    };
    service.image =
      defaultImages[service.category] ||
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop";
  }
});

// Service categories for grouping in UI
export const serviceCategories = [
  { value: "all", label: "All Services" },
  { value: "After Hours Services", label: "After Hours Services" },
  { value: "Nursing Care Services", label: "Nursing Care Services" },
  {
    value: "Mobile Diagnostic and Imaging",
    label: "Mobile Diagnostic and Imaging",
  },
  { value: "Drone Delivery Services", label: "Drone Delivery Services" },
  { value: "Transport Services", label: "Transport Services" },
  { value: "Telehealth Services", label: "Telehealth Services" },
  { value: "Allied Health Services", label: "Allied Health Services" },
  { value: "Complex Transition Care", label: "Complex Transition Care" },
  { value: "NDIS Emergency Support", label: "NDIS Emergency Support" },
  { value: "Aged Care Services", label: "Aged Care Services" },
];

// Helper function to get services by category
export const getServicesByCategory = (category) => {
  if (category === "all") return myCRTServicesData;
  return myCRTServicesData.filter((service) => service.category === category);
};

// Helper function to format service price
export const formatServicePrice = (service) => {
  const price = service.basePrice || 0;
  const unit = service.priceUnit || "per service";
  return `₹${price.toLocaleString("en-IN")} ${unit}`;
};

// Export the helper function
export { getEstimatedPriceRange };
