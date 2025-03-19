"use client";
import { useEffect } from "react";
import { use } from "react";
import { Canvas } from "@/app/components/Canvas";
import { Toolbar } from "@/app/components/Toolbar";
import { ComponentsPanel } from "@/app/components/ComponentsPanel";
import { PropertiesPanel } from "@/app/components/PropertiesPanel";
import { PagesPanel } from "@/app/components/PagesPanel";
import { useBuilderStore, Page } from "@/app/lib/store";

interface DesignResponse {
  pages: Page[];
}

export default function Builder({ params }: { params: Promise<{ id: string }> }) {
  const { setPages } = useBuilderStore();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    fetch(`/api/designs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed with status: ${res.status}`);
        return res.json() as Promise<DesignResponse>;
      })
      .then((data) => {
        const fetchedPages = data.pages.length ? data.pages : [{ id: "1", title: "Page 1", elements: [] }];
        setPages(fetchedPages);
      })
      .catch((error) => {
        console.error("Error fetching design:", error);
        setPages([{ id: "1", title: "Page 1", elements: [] }]);
      });
  }, [id, setPages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden relative">
        <PagesPanel />
        <div className="flex-1 relative">
          <Canvas />
          <ComponentsPanel /> {/* Floats over the canvas */}
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
}