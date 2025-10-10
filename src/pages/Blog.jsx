import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/navigation";
import { PageContainer, HeroSection } from "../components/layout";
import { Card, Button, Input } from "../components/ui";
import { CTASection } from "../components/layout";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "Telehealth Revolution: The Future of Healthcare",
      excerpt:
        "Discover how telehealth is transforming healthcare delivery and improving patient outcomes worldwide.",
      content:
        "The healthcare industry has witnessed a significant transformation with the advent of telehealth technologies. Remote consultations, digital health monitoring, and AI-powered diagnostics are revolutionizing patient care...",
      author: "Dr. Rajesh Kumar",
      authorRole: "Chief Medical Officer",
      authorImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      publishDate: "2024-01-15",
      readTime: "5 min read",
      category: "telehealth",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
      tags: ["Telehealth", "Healthcare Technology", "Digital Health"],
      featured: true,
    },
    {
      id: 2,
      title: "Home Healthcare: Bringing Quality Care to Your Doorstep",
      excerpt:
        "Learn about the benefits of home healthcare services and how they provide personalized medical care in the comfort of your home.",
      content:
        "Home healthcare services have become increasingly popular as they offer personalized medical care in familiar surroundings. From nursing care to physiotherapy, patients can receive comprehensive treatment at home...",
      author: "Priya Sharma",
      authorRole: "Head of Home Care Services",
      authorImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      publishDate: "2024-01-10",
      readTime: "7 min read",
      category: "home-care",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop",
      tags: ["Home Care", "Nursing", "Patient Care"],
      featured: false,
    },
    {
      id: 3,
      title: "Preventive Healthcare: Your Guide to Staying Healthy",
      excerpt:
        "Essential preventive healthcare measures and regular health checkups for maintaining optimal health.",
      content:
        "Preventive healthcare is crucial for maintaining good health and preventing diseases. Regular health screenings, vaccinations, and lifestyle modifications can significantly improve your quality of life...",
      author: "Dr. Amit Patel",
      authorRole: "Preventive Medicine Specialist",
      authorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      publishDate: "2024-01-05",
      readTime: "6 min read",
      category: "preventive-care",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      tags: ["Preventive Care", "Health Screening", "Wellness"],
      featured: true,
    },
    {
      id: 4,
      title: "Mental Health Awareness: Breaking the Stigma",
      excerpt:
        "Understanding mental health challenges and the importance of seeking professional help for mental wellness.",
      content:
        "Mental health is as important as physical health. Breaking the stigma around mental health issues and promoting awareness about available resources and treatments is essential for overall well-being...",
      author: "Dr. Sunita Gupta",
      authorRole: "Clinical Psychologist",
      authorImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      publishDate: "2024-01-01",
      readTime: "8 min read",
      category: "mental-health",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop",
      tags: ["Mental Health", "Psychology", "Wellness"],
      featured: false,
    },
    {
      id: 5,
      title: "Emergency Medical Response: When Every Second Counts",
      excerpt:
        "Understanding emergency medical services and how to respond effectively in critical health situations.",
      content:
        "Emergency medical response systems play a crucial role in saving lives during critical situations. Understanding when to call for emergency services and basic first aid knowledge can make a significant difference...",
      author: "Dr. Vikas Jain",
      authorRole: "Emergency Medicine Specialist",
      authorImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      publishDate: "2023-12-28",
      readTime: "10 min read",
      category: "emergency",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop",
      tags: ["Emergency Care", "First Aid", "Medical Response"],
      featured: false,
    },
    {
      id: 6,
      title:
        "Chronic Disease Management: Living Well with Long-term Conditions",
      excerpt:
        "Effective strategies for managing chronic diseases and maintaining quality of life.",
      content:
        "Chronic disease management requires a comprehensive approach involving medication adherence, lifestyle modifications, and regular monitoring. With proper care and support, patients can lead fulfilling lives...",
      author: "Dr. Neeta Sharma",
      authorRole: "Chronic Care Specialist",
      authorImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      publishDate: "2023-12-25",
      readTime: "6 min read",
      category: "chronic-care",
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop",
      tags: ["Chronic Disease", "Patient Care", "Health Management"],
      featured: false,
    },
  ];

  const categories = [
    { id: "all", name: "All Posts", count: blogPosts.length },
    {
      id: "telehealth",
      name: "Telehealth",
      count: blogPosts.filter((post) => post.category === "telehealth").length,
    },
    {
      id: "home-care",
      name: "Home Care",
      count: blogPosts.filter((post) => post.category === "home-care").length,
    },
    {
      id: "preventive-care",
      name: "Preventive Care",
      count: blogPosts.filter((post) => post.category === "preventive-care")
        .length,
    },
    {
      id: "mental-health",
      name: "Mental Health",
      count: blogPosts.filter((post) => post.category === "mental-health")
        .length,
    },
    {
      id: "emergency",
      name: "Emergency Care",
      count: blogPosts.filter((post) => post.category === "emergency").length,
    },
    {
      id: "chronic-care",
      name: "Chronic Care",
      count: blogPosts.filter((post) => post.category === "chronic-care")
        .length,
    },
  ];

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts.filter((post) => !post.featured)
      : blogPosts.filter(
          (post) => post.category === selectedCategory && !post.featured
        );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <PageContainer maxWidth="full" padding="none">
        {/* Hero Section */}
        <HeroSection
          title="Healthcare Blog"
          subtitle="Latest healthcare trends, medical insights, and wellness tips. Explore the world of healthcare with our medical experts and stay informed about your health."
          image="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop"
          imageAlt="Healthcare blog and medical insights"
        />

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Featured Posts
                </h2>
                <p className="text-gray-600">
                  Our most popular and trending healthcare articles
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          Featured
                        </span>
                        <span className="text-gray-500 text-sm">
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.authorImage}
                            alt={post.author}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {post.author}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.authorRole}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(post.publishDate)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                          selectedCategory === category.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Newsletter
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Subscribe to get the latest healthcare posts and updates
                  </p>
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="w-full"
                    />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </Card>
              </div>

              {/* Posts Grid */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCategory === "all"
                      ? "All Posts"
                      : categories.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600">
                    {filteredPosts.length} posts found
                  </p>
                </div>

                {filteredPosts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
                      <Card
                        key={post.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="h-40 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                              {
                                categories.find((c) => c.id === post.category)
                                  ?.name
                              }
                            </span>
                            <span className="text-gray-500 text-sm">
                              {post.readTime}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={post.authorImage}
                                alt={post.author}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-gray-900">
                                {post.author}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(post.publishDate)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Posts Found
                    </h3>
                    <p className="text-gray-600">
                      No posts found in this category yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </PageContainer>
      <Footer />
    </>
  );
};

export default Blog;
