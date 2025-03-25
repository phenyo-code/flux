/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FaPlus, FaRocket, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/app/lib/store";
import { motion, useAnimation } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Projects() {
  const { setDesignTitle } = useBuilderStore();
  const [designs, setDesigns] = useState<{ id: string; name: string; updatedAt: string; pages: any[] }[]>([]);
  const [templates, setTemplates] = useState<{ id: string; name: string; pages: any[] }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectType, setProjectType] = useState<"design" | "template">("design");
  const [title, setTitle] = useState("");
  const canvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const router = useRouter();

  const sectionVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" },
  };

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) {
          console.log("No /api/designs endpoint available; skipping design fetch.");
          setDesigns([]);
          return;
        }
        const data = await res.json();
        setDesigns(
          data.map((design: any) => ({
            id: design.id,
            name: design.title,
            updatedAt: design.updatedAt || new Date().toISOString().split("T")[0],
            pages: design.pages,
          }))
        );
      } catch (error) {
        console.error("Error fetching designs:", error);
        setDesigns([]);
      }
    };

    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplates([]);
      }
    };

    fetchDesigns();
    fetchTemplates();
  }, []);

  const renderPreview = (item: { id: string; pages: any[] }, canvas: HTMLCanvasElement | null) => {
    if (!canvas || !item.pages || !item.pages.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const firstPage = item.pages[0];
    const scale = 0.2;
    canvas.width = 1200 * scale;
    canvas.height = (firstPage.frameHeight || 800) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = firstPage.backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    firstPage.elements.forEach((el: any) => {
      ctx.fillStyle = el.style?.backgroundColor || "#e5e7eb";
      ctx.fillRect(el.x * scale, el.y * scale, el.width * scale, el.height * scale);

      if (el.type === "text" && el.content) {
        ctx.fillStyle = el.style?.color || "#1f2937";
        ctx.font = `${parseInt(el.style?.fontSize || "16") * scale}px ${el.style?.fontFamily || "Inter, sans-serif"}`;
        ctx.fillText(el.content, el.x * scale + 2, el.y * scale + el.height * scale / 2);
      }
    });
  };

  useEffect(() => {
    designs.forEach((design) => {
      const canvas = canvasRefs.current.get(design.id) || null;
      renderPreview(design, canvas);
    });
    templates.forEach((template) => {
      const canvas = canvasRefs.current.get(template.id) || null;
      renderPreview(template, canvas);
    });
  }, [designs, templates]);

  const handleNewProject = () => setIsModalOpen(true);

  const handleCreateProject = () => {
    if (!title.trim()) {
      setDesignTitle(projectType === "design" ? "Untitled Design" : "Untitled Template");
    } else {
      setDesignTitle(title);
    }
    router.push(`/builder/${projectType}`);
    setIsModalOpen(false);
    setTitle("");
  };

  const handleTemplateCanvasClick = (templateName: string) => {
    setDesignTitle(`New Design from ${templateName}`);
    router.push(`/builder/new?template=${templateName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* Hero Section with Advanced Animated Building Blocks */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-teal-700 text-white py-24 px-6 overflow-hidden">
  <AnimatedBuildingBlocks />
  <motion.div
    className="container mx-auto text-center relative z-10"
    initial="hidden"
    animate="visible"
    variants={sectionVariants}
  >
    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-xl">
      Your Creative Workspace
    </h1>
    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-100 drop-shadow-md">
      Unleash your creativity—manage designs and explore powerful templates to bring your ideas to life.
    </p>
    <div className="flex justify-center gap-6">
      <button
        onClick={handleNewProject}
        className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-100 transition-all shadow-lg hover:shadow-xl"
      >
        <FaPlus /> New Project
      </button>
      <Link
        href="/templates"
        className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 hover:bg-white hover:text-indigo-700 transition-all shadow-lg hover:shadow-xl"
      >
        <FaEye /> View Templates
      </Link>
    </div>
  </motion.div>
</section>

      {/* Main Content */}
      <main className="container mx-auto py-20 px-6">
        <section className="mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Your Designs</h2>
          {designs.length === 0 ? (
            <motion.div
              className="text-center text-gray-600 py-16 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <FaRocket className="text-6xl mx-auto mb-4 text-blue-500" />
              <p className="text-lg">No designs yet. Create your first project now!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {designs.map((design, index) => (
                <motion.div
                  key={design.id}
                  className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:border-blue-500 transition-all"
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/builder/${design.id}`} className="block">
                    <canvas
                      ref={(el) => {
                        if (el) {
                          canvasRefs.current.set(design.id, el);
                        }
                      }}
                      className="w-full h-40 border border-gray-200 rounded mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{design.name}</h3>
                    <p className="text-sm text-gray-500">Last updated: {design.updatedAt}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Templates</h2>
          {templates.length === 0 ? (
            <motion.div
              className="text-center text-gray-600 py-16 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-lg">No templates available yet.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTemplateCanvasClick(template.name)}
                >
                  <canvas
                    ref={(el) => {
                      if (el) {
                        canvasRefs.current.set(template.id, el);
                      }
                    }}
                    className="w-full h-40 border border-gray-200 rounded mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{template.name}</h3>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create a New Project</h3>
            <p className="text-gray-600 mb-6">Select a type and name your project to get started.</p>
            <div className="mb-6">
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as "design" | "template")}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <option value="design">Design (Private)</option>
                <option value="template">Template (Public)</option>
              </select>
            </div>
            <div className="mb-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={projectType === "design" ? "Enter design name" : "Enter template name"}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateProject}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Create
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}

const AnimatedBuildingBlocks = () => {
  const [isMounted, setIsMounted] = useState(false);
  const controls = useAnimation();
  const numElements = 14;

  const elementShapes = [
    { type: "rect", width: 400, height: 60, glow: true },  // Header
    { type: "rect", width: 100, height: 250, glow: false }, // Sidebar
    { type: "rect", width: 250, height: 100, glow: true },  // Hero/Content
    { type: "square", width: 80, height: 80, glow: false }, // Image
    { type: "circle", width: 40, height: 40, glow: true },  // Icon/Button
    { type: "triangle", width: 60, height: 60, glow: false }, // Decorative
    { type: "rect", width: 400, height: 50, glow: true },  // Footer
    { type: "rect", width: 120, height: 90, glow: false }, // Card 1
    { type: "rect", width: 120, height: 90, glow: false }, // Card 2
    { type: "rect", width: 200, height: 30, glow: true },  // Text Block
    { type: "circle", width: 30, height: 30, glow: false }, // Small Icon
    { type: "square", width: 50, height: 50, glow: true }, // Button
    { type: "rect", width: 150, height: 70, glow: false }, // Widget
    { type: "triangle", width: 40, height: 40, glow: true }, // Accent
  ];

  const layouts = [
    // Portfolio Layout
    [
      { x: 50, y: 40, width: 400, height: 60, type: "rect" },     // Header
      { x: 50, y: 110, width: 100, height: 250, type: "rect" },   // Sidebar
      { x: 170, y: 110, width: 250, height: 100, type: "rect" },  // Hero Image
      { x: 170, y: 220, width: 80, height: 80, type: "square" },  // Gallery 1
      { x: 260, y: 220, width: 40, height: 40, type: "circle" },  // Icon
      { x: 310, y: 220, width: 60, height: 60, type: "triangle" },// Decorative
      { x: 50, y: 370, width: 400, height: 50, type: "rect" },    // Footer
      { x: 170, y: 310, width: 120, height: 90, type: "rect" },   // Project Card 1
      { x: 300, y: 310, width: 120, height: 90, type: "rect" },   // Project Card 2
      { x: 170, y: 270, width: 200, height: 30, type: "rect" },   // Caption
      { x: 340, y: 230, width: 30, height: 30, type: "circle" },  // Small Icon
      { x: 60, y: 120, width: 50, height: 50, type: "square" },   // Nav Button
      { x: 60, y: 180, width: 150, height: 70, type: "rect" },    // Sidebar Widget
      { x: 430, y: 110, width: 40, height: 40, type: "triangle" },// Accent
    ],
    // E-commerce Layout
    [
      { x: 50, y: 40, width: 400, height: 60, type: "rect" },     // Header
      { x: 50, y: 110, width: 100, height: 250, type: "rect" },   // Filters
      { x: 170, y: 110, width: 250, height: 100, type: "rect" },  // Promo Banner
      { x: 170, y: 220, width: 80, height: 80, type: "square" },  // Product 1
      { x: 260, y: 220, width: 40, height: 40, type: "circle" },  // Add to Cart
      { x: 310, y: 220, width: 60, height: 60, type: "triangle" },// Badge
      { x: 50, y: 370, width: 400, height: 50, type: "rect" },    // Footer
      { x: 170, y: 310, width: 120, height: 90, type: "rect" },   // Product Card 1
      { x: 300, y: 310, width: 120, height: 90, type: "rect" },   // Product Card 2
      { x: 170, y: 270, width: 200, height: 30, type: "rect" },   // Price Bar
      { x: 340, y: 230, width: 30, height: 30, type: "circle" },  // Rating
      { x: 60, y: 120, width: 50, height: 50, type: "square" },   // Filter Button
      { x: 60, y: 180, width: 150, height: 70, type: "rect" },    // Category List
      { x: 430, y: 110, width: 40, height: 40, type: "triangle" },// Accent
    ],
    // Dashboard Layout
    [
      { x: 50, y: 40, width: 400, height: 60, type: "rect" },     // Header
      { x: 50, y: 110, width: 100, height: 250, type: "rect" },   // Sidebar
      { x: 170, y: 110, width: 250, height: 100, type: "rect" },  // Stats Panel
      { x: 170, y: 220, width: 80, height: 80, type: "square" },  // Chart 1
      { x: 260, y: 220, width: 40, height: 40, type: "circle" },  // Indicator
      { x: 310, y: 220, width: 60, height: 60, type: "triangle" },// Alert
      { x: 50, y: 370, width: 400, height: 50, type: "rect" },    // Footer
      { x: 170, y: 310, width: 120, height: 90, type: "rect" },   // Table
      { x: 300, y: 310, width: 120, height: 90, type: "rect" },   // Widget
      { x: 170, y: 270, width: 200, height: 30, type: "rect" },   // Subheader
      { x: 340, y: 230, width: 30, height: 30, type: "circle" },  // Status Icon
      { x: 60, y: 120, width: 50, height: 50, type: "square" },   // Nav Item
      { x: 60, y: 180, width: 150, height: 70, type: "rect" },    // Sidebar Menu
      { x: 430, y: 110, width: 40, height: 40, type: "triangle" },// Accent
    ],
  ];

  useEffect(() => {
    setIsMounted(true);
    const animateSequence = async () => {
      while (true) {
        // Initial scatter
        await controls.start((index) => ({
          x: Math.random() * 500,
          y: Math.random() * 400 + 50,
          scale: 0.3,
          opacity: 0.2,
          rotate: Math.random() * 180 - 90,
          transition: { duration: 1.2, ease: "easeOut", delay: index * 0.1 },
        }));

        // Cycle through each layout
        for (let layoutIndex = 0; layoutIndex < layouts.length; layoutIndex++) {
          const currentLayout = layouts[layoutIndex];
          await controls.start((index) => {
            const pos = currentLayout[index]; // Use exact index for each element
            const shape = elementShapes[index];
            return {
              x: pos.x,
              y: pos.y,
              width: pos.width,
              height: pos.height,
              scale: 1,
              opacity: shape.glow ? 0.9 : 0.6,
              rotate: 0,
              transition: { duration: 2.5, type: "spring", stiffness: 120, damping: 18, delay: index * 0.15 },
            };
          });
          await new Promise((resolve) => setTimeout(resolve, 2500)); // Hold layout
        }

        // Reset
        await controls.start((index) => ({
          scale: 0.1,
          opacity: 0,
          rotate: Math.random() * 360,
          transition: { duration: 0.8, ease: "easeIn", delay: index * 0.05 },
        }));
      }
    };

    if (isMounted) animateSequence();
  }, [isMounted, controls]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: numElements }).map((_, index) => {
        const shape = elementShapes[index];
        return (
          <motion.div
            key={index}
            custom={index}
            animate={controls}
            initial={{
              x: Math.random() * 500,
              y: Math.random() * 400 + 50,
              width: shape.width,
              height: shape.height,
              opacity: 0,
            }}
            className="absolute"
            style={{
              background: `linear-gradient(135deg, rgba(${index * 20 % 255}, 100, 255, 0.7), rgba(${(index + 1) * 30 % 255}, 150, 255, 0.5))`,
              borderRadius: shape.type === "circle" ? "50%" : shape.type === "square" ? "12px" : "6px",
              clipPath: shape.type === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
              boxShadow: shape.glow ? "0 8px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 255, 255, 0.2)" : "0 4px 15px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
        );
      })}
    </div>
  );
};