/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import {
  FaPaintBrush,
  FaSearch,
  FaChartLine,
  FaUsers,
  FaCloudUploadAlt,
  FaCode,
  FaMobileAlt,
  FaCogs,
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  const [templates, setTemplates] = useState<{ id: string; name: string; pages: any[]; createdAt: string }[]>([]);

  // Fetch templates (aligned with Projects.tsx)
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        setTemplates(
          data.map((template: any) => ({
            id: template.id,
            name: template.name,
            pages: template.pages || [],
            createdAt: new Date(template.createdAt).toLocaleDateString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplates([
          { id: "1", name: "Blog Layout", pages: [], createdAt: "2025-03-25" },
          { id: "2", name: "E-commerce Store", pages: [], createdAt: "2025-03-25" },
          { id: "3", name: "Portfolio Showcase", pages: [], createdAt: "2025-03-25" },
          { id: "4", name: "Landing Page", pages: [], createdAt: "2025-03-25" },
          { id: "5", name: "Dashboard", pages: [], createdAt: "2025-03-25" },
          { id: "6", name: "Contact Page", pages: [], createdAt: "2025-03-25" },
          { id: "7", name: "Product Detail", pages: [], createdAt: "2025-03-25" },
        ]); // Mock fallback
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900 font-sans overflow-hidden">
      <EnhancedAnimatedBackground />
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto py-32 text-center px-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-extrabold mb-8 text-white leading-tight"
        >
          No Code, No Limits—Just Build
        </motion.h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12">
        Build and deploy responsive websites effortlessly with Morph.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href="/projects"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-5 rounded-lg text-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Building Now
          </Link>
          <Link
            href="/builder/demo"
            className="border-2 border-blue-400 text-blue-400 px-12 py-5 rounded-lg text-xl font-semibold hover:bg-blue-400 hover:text-white transition-all"
          >
            Try the Demo
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-10 text-gray-400 text-lg"
        >
          Trusted by 10,000+ creators worldwide.
        </motion.div>
      </main>

      {/* Features Section (Aligned with Features.tsx) */}
      <section className="container mx-auto py-24 px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">Core Features</h2>
        <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Everything you need to create, optimize, and scale your projects with ease.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <FeatureCard
            icon={<FaPaintBrush className="text-blue-500 text-5xl mb-6" />}
            title="Intuitive Drag & Drop"
            description="Build layouts effortlessly with a drag-and-drop interface designed for speed and simplicity."
          />
          <FeatureCard
            icon={<FaCogs className="text-green-500 text-5xl mb-6" />}
            title="Fully Customizable"
            description="Adjust every component’s style, behavior, and functionality to fit your unique needs."
          />
          <FeatureCard
            icon={<FaCode className="text-purple-500 text-5xl mb-6" />}
            title="Code Export"
            description="Export clean, semantic HTML, CSS, JS, or React/Next.js code for developers."
          />
          <FeatureCard
            icon={<FaMobileAlt className="text-orange-500 text-5xl mb-6" />}
            title="Responsive Design"
            description="Create apps that look great on any device with built-in responsive tools."
          />
          <FeatureCard
            icon={<FaSearch className="text-teal-500 text-5xl mb-6" />}
            title="SEO Optimization"
            description="Boost visibility with integrated SEO tools—meta tags, sitemaps, and more."
          />
          <FeatureCard
            icon={<FaChartLine className="text-red-500 text-5xl mb-6" />}
            title="Analytics Integration"
            description="Track performance with built-in dashboards or connect to Google Analytics."
          />
          <FeatureCard
            icon={<FaUsers className="text-indigo-500 text-5xl mb-6" />}
            title="Team Collaboration"
            description="Work together in real-time with team members and streamlined workflows."
          />
          <FeatureCard
            icon={<FaCloudUploadAlt className="text-yellow-500 text-5xl mb-6" />}
            title="One-Click Deployment"
            description="Deploy instantly to the cloud or export for self-hosting with a single click."
          />
        </div>
      </section>

      {/* Templates Section (Aligned with Projects.tsx) */}
      <section className="container mx-auto py-24 px-6 bg-gray-800 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">Professional Templates</h2>
        <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Kickstart your project with fully customizable templates designed by experts.
        </p>
        {templates.length === 0 ? (
          <p className="text-center text-gray-400">Loading templates...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                title={template.name}
                description={`Created on ${template.createdAt}. A template with ${template.pages.length} pages, ready to customize.`}
                link={`/builder/new?template=${template.name}`}
              />
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link
            href="/templates"
            className="text-blue-400 text-xl font-semibold hover:underline hover:text-blue-300 transition-colors"
          >
            View All Templates
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-28 text-center px-6 bg-gradient-to-b from-gray-900 to-blue-900 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Start Creating Today</h2>
        <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12">
          Join a global community building everything from blogs to e-commerce stores—no code required.
        </p>
        <Link
          href="/projects"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-14 py-6 rounded-lg text-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          Get Started Free
        </Link>
      </section>

      <Footer />
    </div>
  );
}

interface FeatureCardProps { icon: React.ReactNode; title: string; description: string; }
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="p-6 text-center bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
  >
    {icon}
    <h4 className="text-xl font-semibold mb-4 text-white">{title}</h4>
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </motion.div>
);

interface TemplateCardProps { title: string; description: string; link: string; }
const TemplateCard = ({ title, description, link }: TemplateCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow"
  >
    <h4 className="text-xl font-semibold mb-3 text-gray-800">{title}</h4>
    <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
    <Link href={link} className="text-blue-500 font-semibold hover:underline hover:text-blue-600 transition-colors">
      Use Template
    </Link>
  </motion.div>
);

const EnhancedAnimatedBackground = () => {
  const [isMounted, setIsMounted] = useState(false);
  const controls = useAnimation();
  const numBlocks = 12;

  const blockShapes = [
    { width: 70, height: 50 }, { width: 120, height: 30 }, { width: 90, height: 90 },
    { width: 60, height: 40 }, { width: 140, height: 35 }, { width: 80, height: 80 },
    { width: 70, height: 50 }, { width: 110, height: 25 }, { width: 60, height: 40 },
    { width: 85, height: 85 }, { width: 100, height: 30 }, { width: 75, height: 75 },
  ];

  const layouts = [
    // Blog Layout
    [
      { x: 25, y: 75, width: 350, height: 50 },   // Header
      { x: 25, y: 135, width: 100, height: 250 }, // Sidebar
      { x: 135, y: 135, width: 240, height: 80 }, // Featured Post
      { x: 135, y: 225, width: 115, height: 70 }, // Post 1
      { x: 260, y: 225, width: 115, height: 70 }, // Post 2
      { x: 135, y: 305, width: 240, height: 80 }, // Recent Posts
      { x: 140, y: 310, width: 110, height: 30 }, // Recent Post 1
      { x: 260, y: 310, width: 110, height: 30 }, // Recent Post 2
      { x: 35, y: 145, width: 80, height: 50 },   // Sidebar Widget 1
      { x: 35, y: 205, width: 80, height: 50 },   // Sidebar Widget 2
      { x: 25, y: 395, width: 350, height: 50 },  // Footer
      { x: 35, y: 265, width: 80, height: 50 },   // Sidebar Widget 3
    ],
    // E-commerce Layout
    [
      { x: 25, y: 75, width: 350, height: 50 },   // Header
      { x: 25, y: 135, width: 100, height: 200 }, // Filters Sidebar
      { x: 135, y: 135, width: 240, height: 60 }, // Promo Banner
      { x: 135, y: 205, width: 75, height: 75 },  // Product 1
      { x: 215, y: 205, width: 75, height: 75 },  // Product 2
      { x: 295, y: 205, width: 75, height: 75 },  // Product 3
      { x: 135, y: 290, width: 75, height: 75 },  // Product 4
      { x: 215, y: 290, width: 75, height: 75 },  // Product 5
      { x: 295, y: 290, width: 75, height: 75 },  // Product 6
      { x: 35, y: 145, width: 80, height: 40 },   // Filter Option
      { x: 25, y: 375, width: 350, height: 50 },  // Footer
      { x: 135, y: 375, width: 240, height: 30 }, // Pagination
    ],
    // Portfolio Layout
    [
      { x: 25, y: 75, width: 350, height: 50 },   // Header
      { x: 25, y: 135, width: 160, height: 120 }, // Large Gallery Item
      { x: 195, y: 135, width: 80, height: 80 },  // Gallery 1
      { x: 285, y: 135, width: 80, height: 80 },  // Gallery 2
      { x: 195, y: 225, width: 80, height: 80 },  // Gallery 3
      { x: 285, y: 225, width: 80, height: 80 },  // Gallery 4
      { x: 25, y: 265, width: 80, height: 80 },   // Gallery 5
      { x: 115, y: 265, width: 80, height: 80 },  // Gallery 6
      { x: 195, y: 315, width: 170, height: 30 }, // Caption/CTA
      { x: 25, y: 355, width: 350, height: 50 },  // Footer
      { x: 25, y: 135, width: 80, height: 80 },   // Gallery 7
      { x: 285, y: 315, width: 80, height: 30 },  // Extra CTA
    ],
    // Landing Page Layout
    [
      { x: 25, y: 75, width: 350, height: 50 },   // Header
      { x: 25, y: 135, width: 350, height: 100 }, // Hero Section
      { x: 150, y: 245, width: 100, height: 30 }, // CTA Button
      { x: 25, y: 285, width: 100, height: 60 },  // Feature 1
      { x: 135, y: 305, width: 100, height: 60 }, // Feature 2
      { x: 245, y: 285, width: 100, height: 60 }, // Feature 3
      { x: 25, y: 355, width: 100, height: 60 },  // Feature 4
      { x: 135, y: 375, width: 100, height: 60 }, // Feature 5
      { x: 245, y: 355, width: 100, height: 60 }, // Feature 6
      { x: 25, y: 445, width: 350, height: 50 },  // Footer
      { x: 135, y: 135, width: 100, height: 30 }, // Hero Subtext
      { x: 245, y: 135, width: 100, height: 30 }, // Hero Image
    ],
    // Dashboard Layout
    [
      { x: 25, y: 75, width: 350, height: 50 },   // Header
      { x: 25, y: 135, width: 100, height: 300 }, // Sidebar
      { x: 135, y: 135, width: 240, height: 70 }, // Stats Bar
      { x: 140, y: 140, width: 110, height: 30 }, // Stat 1
      { x: 260, y: 140, width: 110, height: 30 }, // Stat 2
      { x: 135, y: 215, width: 110, height: 90 }, // Chart 1
      { x: 255, y: 215, width: 110, height: 90 }, // Chart 2
      { x: 135, y: 315, width: 110, height: 90 }, // Table
      { x: 255, y: 315, width: 110, height: 90 }, // Widget
      { x: 25, y: 445, width: 350, height: 50 },  // Footer
      { x: 35, y: 145, width: 80, height: 40 },   // Nav Item 1
      { x: 35, y: 195, width: 80, height: 40 },   // Nav Item 2
    ],
    // Contact Page Layout
    [
      { x: 25, y: 75, width: 350, height: 50 },   // Header
      { x: 25, y: 135, width: 350, height: 100 }, // Hero/Map
      { x: 25, y: 245, width: 170, height: 150 }, // Contact Form
      { x: 205, y: 245, width: 170, height: 50 }, // Info Header
      { x: 210, y: 305, width: 160, height: 30 }, // Address
      { x: 210, y: 345, width: 160, height: 30 }, // Phone
      { x: 210, y: 385, width: 160, height: 30 }, // Email
      { x: 35, y: 255, width: 150, height: 30 },  // Form Field 1
      { x: 35, y: 295, width: 150, height: 30 },  // Form Field 2
      { x: 35, y: 335, width: 150, height: 30 },  // Form Field 3
      { x: 25, y: 405, width: 350, height: 50 },  // Footer
      { x: 135, y: 365, width: 100, height: 30 }, // Submit Button
    ],
    // Product Detail Layout
    [
      { x: 25, y: 75, width: 350, height: 50 },   // Header
      { x: 25, y: 135, width: 170, height: 170 }, // Product Image
      { x: 205, y: 135, width: 170, height: 50 }, // Product Title
      { x: 205, y: 195, width: 170, height: 90 }, // Description
      { x: 205, y: 295, width: 80, height: 40 },  // Price
      { x: 295, y: 295, width: 80, height: 40 },  // Buy Button
      { x: 25, y: 315, width: 80, height: 80 },   // Thumbnail 1
      { x: 115, y: 315, width: 80, height: 80 },  // Thumbnail 2
      { x: 205, y: 345, width: 170, height: 30 }, // Reviews
      { x: 25, y: 405, width: 350, height: 50 },  // Footer
      { x: 25, y: 135, width: 80, height: 80 },   // Secondary Image
      { x: 205, y: 135, width: 80, height: 30 },  // Rating
    ],
  ];

  useEffect(() => {
    setIsMounted(true);
    const animateSequence = async () => {
      while (true) {
        await controls.start((index) => ({
          x: 50,
          y: 60 + (numBlocks - index - 1) * (blockShapes[index].height * 0.7),
          width: blockShapes[index].width,
          height: blockShapes[index].height,
          scale: 1.2,
          opacity: 0.7,
          transition: { duration: 1.8, type: "spring", stiffness: 130, damping: 15 },
        }));

        await controls.start((index) => ({
          x: 0,
          y: 60 + (numBlocks - index - 1) * (blockShapes[index].height * 0.7),
          transition: { duration: 1.2, ease: "easeInOut" },
        }));

        for (const layout of layouts) {
          await controls.start((index) => {
            const pos = layout[index % layout.length];
            return {
              x: pos.x,
              y: pos.y,
              width: pos.width,
              height: pos.height,
              scale: 1,
              transition: { duration: 2.2, type: "spring", stiffness: 110, damping: 20 },
            };
          });
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      }
    };

    if (isMounted) animateSequence();
  }, [isMounted, controls]);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden" style={{ zIndex: 1 }}>
      {Array.from({ length: numBlocks }).map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          animate={controls}
          initial={{
            y: "15vh",
            x: index * 30 + 20,
            width: blockShapes[index].width,
            height: blockShapes[index].height,
            opacity: 0.7,
          }}
          className="absolute"
          style={{
            background: `linear-gradient(135deg, hsl(${index * 40}, 80%, 60%), hsl(${index * 40 + 50}, 80%, 50%))`,
            borderRadius: "10px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
            zIndex: 1,
          }}
        />
      ))}
    </div>
  );
};