"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaHome, FaBook, FaTools, FaQuestionCircle, FaCode } from "react-icons/fa";

export default function Docs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { href: "/", icon: <FaHome />, label: "Home" },
    { href: "/docs", icon: <FaBook />, label: "Docs Overview" },
    { href: "#getting-started", icon: <FaTools />, label: "Getting Started" },
    { href: "#builder-guide", icon: <FaCode />, label: "Builder Guide" },
    { href: "#support", icon: <FaQuestionCircle />, label: "Support" },
  ];

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    closed: { x: "-100%", transition: { duration: 0.3, ease: "easeIn" } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* Sidebar (Fixed on all screens) */}
      <div className="fixed h-full w-64 bg-gray-800 text-white shadow-lg z-40 overflow-y-auto">
        {/* Mobile Toggle Button */}
        <button
          className="lg:hidden absolute top-4 right-4 p-2 bg-gray-700 text-white rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Sidebar Content */}
        <AnimatePresence>
          <motion.aside
            className="h-full w-64 p-6"
            initial="open"
            animate={isSidebarOpen || window.innerWidth >= 1024 ? "open" : "closed"}
            variants={sidebarVariants}
          >
            <h1 className="text-2xl font-bold mb-8">
              <Link href="/" className="hover:text-blue-300 transition-colors">
                Flux Docs
              </Link>
            </h1>
            <nav>
              <ul className="space-y-4">
                {sidebarItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 text-sm font-medium hover:text-blue-300 transition-colors"
                      onClick={() => setIsSidebarOpen(false)} // Close on mobile click
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-16 px-6 ml-0 lg:ml-64">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-12"
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            Flux Documentation
          </motion.h2>

          <div className="prose text-gray-700">
            {/* Table of Contents */}
            <motion.section
              id="toc"
              initial="hidden"
              animate="visible"
              variants={contentVariants}
            >
              <h3 className="text-2xl font-semibold mb-4">Table of Contents</h3>
              <ul className="list-disc pl-6 mb-8">
                <li><a href="#getting-started" className="text-blue-500 hover:underline">Getting Started</a></li>
                <li><a href="#builder-guide" className="text-blue-500 hover:underline">Builder Guide</a></li>
                <li><a href="#support" className="text-blue-500 hover:underline">Support</a></li>
              </ul>
            </motion.section>

            {/* Getting Started */}
            <motion.section
              id="getting-started"
              initial="hidden"
              whileInView="visible"
              variants={contentVariants}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 mt-12">Getting Started</h3>
              <p>
                Welcome to Flux! This guide will walk you through setting up your first project. Start by signing up or logging in via the <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link> page, then head to <Link href="/projects" className="text-blue-500 hover:underline">Projects</Link> to create your app.
              </p>
              <h4 className="text-xl font-medium mt-6 mb-2">Step 1: Create a Project</h4>
              <p>Click “New Project,” name it, and choose a template or start from scratch. [Screenshot placeholder]</p>
              <h4 className="text-xl font-medium mt-6 mb-2">Step 2: Explore the Dashboard</h4>
              <p>Familiarize yourself with the dashboard—manage projects, settings, and exports here. [Screenshot placeholder]</p>
            </motion.section>

            {/* Builder Guide */}
            <motion.section
              id="builder-guide"
              initial="hidden"
              whileInView="visible"
              variants={contentVariants}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 mt-12">Builder Guide</h3>
              <p>
                The Flux Builder is your creative hub. Here’s how to use its core features to design and deploy your app.
              </p>
              <h4 className="text-xl font-medium mt-6 mb-2">Drag-and-Drop Interface</h4>
              <p>Add components by dragging them from the sidebar to the canvas. Adjust layouts in real-time. [Screenshot placeholder]</p>
              <h4 className="text-xl font-medium mt-6 mb-2">Customizing Components</h4>
              <p>Click any component to edit styles, add interactions, or connect data. [Screenshot placeholder]</p>
              <h4 className="text-xl font-medium mt-6 mb-2">Exporting Your Project</h4>
              <p>Preview your app, then export as HTML, CSS, JS, or React code with one click. [Screenshot placeholder]</p>
            </motion.section>

            {/* Support */}
            <motion.section
              id="support"
              initial="hidden"
              whileInView="visible"
              variants={contentVariants}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 mt-12">Support</h3>
              <p>
                Need assistance? Flux offers multiple support channels to ensure your success.
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li><Link href="/contact" className="text-blue-500 hover:underline">Contact Us</Link> for direct help.</li>
                <li>Email us at <a href="mailto:support@flux.com" className="text-blue-500 hover:underline">support@flux.com</a>.</li>
                <li>Join our <a href="#" className="text-blue-500 hover:underline">Community Forum</a> for peer support.</li>
              </ul>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}