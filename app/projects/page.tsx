/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FaPlus, FaRocket } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useBuilderStore } from "@/app/lib/store";

export default function Projects() {
  const { setDesignTitle } = useBuilderStore(); // Access store to set designTitle
  const [designs, setDesigns] = useState<{ id: string; name: string; updatedAt: string; pages: any[] }[]>([]);
  const [templates, setTemplates] = useState<{ id: string; name: string; pages: any[] }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectType, setProjectType] = useState<"design" | "template">("design"); // Track project type
  const [title, setTitle] = useState(""); // Input for custom title
  const canvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const router = useRouter();

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
        console.log("Templates data:", data);
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

  const handleNewProject = () => {
    setIsModalOpen(true);
  };

  const handleCreateProject = () => {
    if (!title.trim()) {
      setDesignTitle(projectType === "design" ? "Untitled Design" : "Untitled Template"); // Default title if empty
    } else {
      setDesignTitle(title); // Set custom title
    }
    router.push(`/builder/${projectType}`);
    setIsModalOpen(false);
    setTitle(""); // Reset input
  };

  const handleTemplateCanvasClick = (templateName: string) => {
    setDesignTitle(`New Design from ${templateName}`); // Set title based on template
    router.push(`/builder/new?template=${templateName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Flux</h1>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium">
              <li><Link href="/" className="hover:underline hover:text-blue-300">Home</Link></li>
              <li><Link href="/features" className="hover:underline hover:text-blue-300">Features</Link></li>
              <li><Link href="/pricing" className="hover:underline hover:text-blue-300">Pricing</Link></li>
              <li><Link href="/docs" className="hover:underline hover:text-blue-300">Docs</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-16 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Your Designs</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleNewProject}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-md"
            >
              <FaPlus /> New Project
            </button>
          </div>
        </div>
        {designs.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            <FaRocket className="text-6xl mx-auto mb-4 text-blue-500" />
            <p className="text-lg">No designs yet. Start by creating a new one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Link
                key={design.id}
                href={`/builder/${design.id}`}
                className="p-6 hover:shadow-lg transition-shadow flex flex-col"
              >
                <canvas
                  ref={(el) => {
                    if (el) canvasRefs.current.set(design.id, el);
                  }}
                  className="w-full h-32 border border-gray-200 rounded mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{design.name}</h3>
                <p className="text-sm text-gray-500">Last updated: {design.updatedAt}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Templates</h2>
          {templates.length === 0 ? (
            <div className="text-center text-gray-600 py-16">
              <p className="text-lg">No templates available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-6 hover:shadow-lg transition-shadow flex flex-col"
                >
                  <canvas
                    ref={(el) => {
                      if (el) canvasRefs.current.set(template.id, el);
                    }}
                    onClick={() => handleTemplateCanvasClick(template.name)}
                    className="w-full h-32 border border-gray-200 rounded mb-4 cursor-pointer hover:border-blue-500 transition-colors"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{template.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal for creating new project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create a New Project</h3>
            <p className="text-gray-600 mb-4">Choose project type and give it a name:</p>
            <div className="mb-4">
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as "design" | "template")}
                className="w-full p-2 border rounded text-gray-700 focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border rounded text-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreateProject}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Flux. All rights reserved.
        </div>
      </footer>
    </div>
  );
}