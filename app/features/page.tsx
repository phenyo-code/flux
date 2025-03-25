"use client";
import { FaPaintBrush, FaCogs, FaCode, FaMobileAlt, FaSearch, FaChartLine, FaUsers, FaCloudUploadAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Features() {
  const features = [
    {
      icon: <FaPaintBrush className="text-blue-500 text-4xl" />,
      title: "Intuitive Drag & Drop",
      description:
        "Design layouts effortlessly with a drag-and-drop interface built for speed and simplicity—no design experience needed.",
    },
    {
      icon: <FaCogs className="text-green-500 text-4xl" />,
      title: "Fully Customizable",
      description:
        "Tailor every component’s style, behavior, and logic to match your vision with granular control.",
    },
    {
      icon: <FaCode className="text-purple-500 text-4xl" />,
      title: "Code Export",
      description:
        "Export clean, semantic HTML, CSS, JavaScript, or even React/Next.js code that developers can easily extend.",
    },
    {
      icon: <FaMobileAlt className="text-orange-500 text-4xl" />,
      title: "Responsive Design",
      description:
        "Craft apps that adapt seamlessly to any screen size with built-in responsive design tools.",
    },
    {
      icon: <FaSearch className="text-teal-500 text-4xl" />,
      title: "SEO Optimization",
      description:
        "Boost your visibility with integrated SEO tools—meta tags, sitemaps, and performance optimization included.",
    },
    {
      icon: <FaChartLine className="text-red-500 text-4xl" />,
      title: "Analytics Integration",
      description:
        "Track performance with built-in analytics dashboards or connect to tools like Google Analytics effortlessly.",
    },
    {
      icon: <FaUsers className="text-indigo-500 text-4xl" />,
      title: "Team Collaboration",
      description:
        "Work together in real-time with team members, assign roles, and streamline your creative process.",
    },
    {
      icon: <FaCloudUploadAlt className="text-yellow-500 text-4xl" />,
      title: "One-Click Deployment",
      description:
        "Deploy your projects instantly to the cloud or export for self-hosting with a single click.",
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const testimonialVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-24 px-6">
        <motion.div
          className="container mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Build Smarter with Morph Features
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Empower your creativity with a no-code platform packed with advanced tools for design, development, and growth.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block bg-white text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Try Morph Now
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <main className="container mx-auto py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
          Why Choose Morph?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Users Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Jane Doe",
                role: "Freelance Designer",
                quote: "Morph’s drag-and-drop builder saved me hours—my clients love the results!",
              },
              {
                name: "Mark Smith",
                role: "Startup Founder",
                quote: "The SEO tools and analytics integration gave my site a huge boost.",
              },
              {
                name: "Emily Chen",
                role: "Developer",
                quote: "Exporting clean React code is a game-changer for my workflow.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                initial="hidden"
                whileInView="visible"
                variants={testimonialVariants}
                viewport={{ once: true }}
              >
                <p className="text-gray-600 italic mb-4">&rdquo;{testimonial.quote}&quot;</p>
                <p className="text-gray-800 font-semibold">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-16 px-6">
        <div className="container mx-auto text-center">
          <motion.h3
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Projects?
          </motion.h3>
          <motion.p
            className="text-lg mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join a community of creators leveraging Morph to build faster and smarter.
          </motion.p>
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link
              href="/projects"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Start Building Now
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}