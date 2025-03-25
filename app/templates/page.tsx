/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/app/lib/store";
import { motion } from "framer-motion";
import { FaInfoCircle, FaRocket, FaEye, FaDownload } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Templates() {
  const { setDesignTitle } = useBuilderStore();
  const [templates, setTemplates] = useState<
    { id: string; name: string; pages: any[]; description?: string; category?: string; previewUrl?: string }[]
  >([]);
  const canvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const router = useRouter();

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" },
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        const enhancedData = data.map((template: any) => ({
          ...template,
          description: template.description || "A versatile template to kickstart your project with style and efficiency.",
          category: template.category || ["Business", "Portfolio", "Blog", "E-commerce"][Math.floor(Math.random() * 4)],
          previewUrl: template.previewUrl || "#", // Placeholder for live preview links
        }));
        setTemplates(enhancedData);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplates([]);
      }
    };
    fetchTemplates();
  }, []);

  const renderPreview = (item: { id: string; pages: any[] }, canvas: HTMLCanvasElement | null) => {
    if (!canvas || !item.pages || !item.pages.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const firstPage = item.pages[0];
    const scale = 0.25;
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
    templates.forEach((template) => {
      const canvas = canvasRefs.current.get(template.id) || null;
      renderPreview(template, canvas);
    });
  }, [templates]);

  const handleTemplateCanvasClick = (templateName: string) => {
    setDesignTitle(`New Design from ${templateName}`);
    router.push(`/builder/new?template=${templateName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto py-16 px-6">
        {/* Templates Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Template Gallery</h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-lg font-medium">{templates.length} Templates</span>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all shadow-md">
                Filter by Category
              </button>
            </div>
          </div>

          {templates.length === 0 ? (
            <motion.div
              className="text-center py-24 bg-white rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <FaRocket className="text-6xl mx-auto mb-6 text-blue-500" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Templates Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We’re working on adding more templates. Check back soon or create your own from scratch!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300"
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative">
                    <canvas
                      ref={(el) => {
                        if (el) {
                          canvasRefs.current.set(template.id, el);
                        }
                      }}
                      className="w-full h-56 object-cover rounded-t-2xl border-b border-gray-200"
                      onClick={() => handleTemplateCanvasClick(template.name)}
                    />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 bg-white rounded-full shadow-md hover:bg-blue-100"
                        title="Preview Template"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(template.previewUrl, "_blank");
                        }}
                      >
                        <FaEye className="text-gray-600" />
                      </button>
                      <button
                        className="p-2 bg-white rounded-full shadow-md hover:bg-blue-100"
                        title="Use Template"
                        onClick={() => handleTemplateCanvasClick(template.name)}
                      >
                        <FaDownload className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        {template.category}
                      </span>
                      <FaInfoCircle
                        className="text-gray-400 hover:text-blue-500 cursor-pointer"
                        title="More Info"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Template: ${template.name}\nCategory: ${template.category}\nPages: ${template.pages.length}`);
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Additional Info Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Morph Templates?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Our templates are designed to save you time, inspire creativity, and deliver professional results. Each one is built with best practices in mind and can be tailored to your vision.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-800">Speed Up Development</h4>
              <p className="text-gray-600 text-sm">
                Jumpstart your project with pre-built layouts, reducing design time by up to 70%.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-800">Expertly Crafted</h4>
              <p className="text-gray-600 text-sm">
                Designed by industry professionals for a polished, modern aesthetic.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-800">Endless Customization</h4>
              <p className="text-gray-600 text-sm">
                Modify layouts, styles, and functionality to match your brand perfectly.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">How to Get Started</h4>
            <ul className="list-disc pl-6 text-gray-600 text-sm space-y-2">
              <li>Click a template’s canvas to use it instantly in the Morph Builder.</li>
              <li>Use the <FaEye className="inline mx-1" /> button to preview it live.</li>
              <li>Hover over <FaInfoCircle className="inline mx-1" /> for quick details like page count.</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}