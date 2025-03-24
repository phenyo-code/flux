/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Canvas } from "@/app/components/Canvas";
import { Toolbar } from "@/app/components/Toolbar";
import { PropertiesPanel } from "@/app/components/PropertiesPanel";
import { PrototypePanel } from "@/app/components/PrototypePanel";
import { PagesPanel } from "@/app/components/PagesPanel";
import { useBuilderStore, Page } from "@/app/lib/store";
import ObjectID from "bson-objectid";

interface DesignResponse {
  pages: Page[];
  id: string;
  title: string;
}

export default function Builder({ params }: { params: Promise<{ id: string }> }) {
  const {
    initializeDesign,
    setPages,
    pages: originalPages,
    previewMode,
    componentBuilderMode,
    toggleComponentBuilderMode,
    setCurrentPageId,
    currentPageId,
    setCurrentDesignId,
    currentDesignId,
    setDesignTitle, // New: Added to set designTitle
  } = useBuilderStore();
  const searchParams = useSearchParams();
  const template = searchParams.get("template");
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [activeTab, setActiveTab] = useState<"properties" | "prototype">("properties");
  const [originalPagesSnapshot, setOriginalPagesSnapshot] = useState<Page[]>([]);
  const [originalPageId, setOriginalPageId] = useState<string | null>(null);
  const hasInitializedRef = useRef(false);
  const hasToggledBuilderModeRef = useRef(false);

  // Initialize design based on route
  useEffect(() => {
    if (hasInitializedRef.current) return;

    const initDesign = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;

      if (id === "design" || id === "template") {
        // New design or template
        const defaultPageId = new ObjectID().toHexString();
        const defaultPages: Page[] = [
          {
            id: defaultPageId,
            title: "Page 1",
            elements: [],
            backgroundColor: "#ffffff",
            frameHeight: 800,
          },
        ];
        setPages(defaultPages);
        setCurrentPageId(defaultPageId);
        setCurrentDesignId(null);
        setDesignTitle(id === "design" ? "Untitled Design" : "Untitled Template"); // Set default title if not set by Projects
        hasInitializedRef.current = true;
      } else {
        // Fetch existing design/template
        try {
          const url = template ? `/api/designs/${id}?template=${template}` : `/api/designs/${id}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Fetch failed with status: ${res.status}`);
          const data: DesignResponse = await res.json();
          const fetchedPages = data.pages.length
            ? data.pages
            : [{ id: new ObjectID().toHexString(), title: "Page 1", elements: [], backgroundColor: "#ffffff", frameHeight: 800 }];
          setPages(fetchedPages);
          setCurrentPageId(fetchedPages[0].id);
          setCurrentDesignId(id);
          setDesignTitle(data.title); // Set fetched title
        } catch (error) {
          console.error("Error fetching design:", error);
          initializeDesign(id); // Fallback to initializing with the ID
        } finally {
          hasInitializedRef.current = true;
        }
      }
    };

    initDesign();
  }, [params, initializeDesign, setPages, setCurrentPageId, setCurrentDesignId, setDesignTitle, template]);

  // Handle component builder mode transition
  useEffect(() => {
    if (!hasInitializedRef.current) return;

    if (componentBuilderMode && !hasToggledBuilderModeRef.current) {
      setOriginalPagesSnapshot([...originalPages]);
      setOriginalPageId(currentPageId);

      const builderPageId = new ObjectID().toHexString();
      const builderPage: Page = {
        id: builderPageId,
        title: "Component Builder",
        elements: [],
        backgroundColor: "#f3e8ff",
        frameHeight: 800,
      };
      setPages([builderPage]);
      setCurrentPageId(builderPageId);
      hasToggledBuilderModeRef.current = true;
    } else if (!componentBuilderMode && hasToggledBuilderModeRef.current && originalPagesSnapshot.length > 0) {
      setPages(originalPagesSnapshot);
      setCurrentPageId(originalPageId || originalPagesSnapshot[0].id);
      setOriginalPagesSnapshot([]);
      setOriginalPageId(null);
      hasToggledBuilderModeRef.current = false;
    }
  }, [componentBuilderMode, originalPages, currentPageId, setPages, setCurrentPageId, originalPagesSnapshot, originalPageId]);

  // Sync design ID with auto-save updates
  useEffect(() => {
    if (currentDesignId && !componentBuilderMode) {
      const resolvedParams = params.then((p) => p.id);
      resolvedParams.then((id) => {
        if (id !== "design" && id !== "template" && id !== currentDesignId) {
          window.history.replaceState(null, "", `/builder/${currentDesignId}`);
        }
      });
    }
  }, [currentDesignId, componentBuilderMode, params]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
      <Toolbar canvasRef={canvasRef} setIsPanning={setIsPanning} />
      <div className="flex flex-1">
        {!previewMode && <PagesPanel />}
        <Canvas isPanning={isPanning} />
        {!previewMode && (
          <div className="w-64 shrink-0 bg-gray-100 z-10 flex flex-col">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("properties")}
                className={`flex-1 p-2 text-sm font-medium ${
                  activeTab === "properties" ? "bg-white border-b-2 border-blue-500 text-blue-600" : "bg-gray-200 text-gray-700"
                }`}
              >
                Properties
              </button>
              <button
                onClick={() => setActiveTab("prototype")}
                className={`flex-1 p-2 text-sm font-medium ${
                  activeTab === "prototype" ? "bg-white border-b-2 border-blue-500 text-blue-600" : "bg-gray-200 text-gray-700"
                }`}
              >
                Prototype
              </button>
            </div>
            <div className="flex-1">
              {activeTab === "properties" ? <PropertiesPanel /> : <PrototypePanel />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}