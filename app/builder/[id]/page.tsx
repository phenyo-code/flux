"use client";
import { use, useEffect, useRef, useState } from "react";
import { Canvas } from "@/app/components/Canvas";
import { Toolbar } from "@/app/components/Toolbar";
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    fetch(`/api/designs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed with status: ${res.status}`);
        return res.json() as Promise<DesignResponse>;
      })
      .then((data) => {
        const fetchedPages = data.pages.length ? data.pages : [{ id: "1", title: "Page 1", elements: [], backgroundColor: "#ffffff" }];
        setPages(fetchedPages);
      })
      .catch((error) => {
        console.error("Error fetching design:", error);
        setPages([{ id: "1", title: "Page 1", elements: [], backgroundColor: "#ffffff" }]);
      });
  }, [id, setPages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
      <Toolbar canvasRef={canvasRef} setIsPanning={setIsPanning} />
      <div className="flex flex-1">
        <PagesPanel />
        <Canvas isPanning={isPanning} />
        <div className="w-64 shrink-0 bg-gray-100 z-10">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}