"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Canvas } from "@/app/components/Canvas";
import { Toolbar } from "@/app/components/Toolbar";
import { PropertiesPanel } from "@/app/components/PropertiesPanel";
import { PagesPanel } from "@/app/components/PagesPanel";
import { useBuilderStore, Page } from "@/app/lib/store";
import ObjectID from "bson-objectid";

interface DesignResponse {
  pages: Page[];
  id: string;
  title: string;
}

export default function Builder({ params }: { params: Promise<{ id: string }> }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setPages, pages } = useBuilderStore();
  const searchParams = useSearchParams();
  const template = searchParams.get("template");
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    const fetchDesign = async () => {
      const resolvedParams = await params; // Await inside async function
      const id = resolvedParams.id;

      try {
        const url = template ? `/api/designs/${id}?template=${template}` : `/api/designs/${id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Fetch failed with status: ${res.status}`);
        const data: DesignResponse = await res.json();
        const fetchedPages = data.pages.length
          ? data.pages
          : [{ id: new ObjectID().toHexString(), title: "Page 1", elements: [], backgroundColor: "#ffffff", frameHeight: 800 }];
        setPages(fetchedPages);
      } catch (error) {
        console.error("Error fetching design:", error);
        setPages([{ id: new ObjectID().toHexString(), title: "Page 1", elements: [], backgroundColor: "#ffffff", frameHeight: 800 }]);
      }
    };

    fetchDesign();
  }, [params, setPages, template]); // Include params in dependencies

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