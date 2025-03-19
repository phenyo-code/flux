"use client";
import { useState, useEffect } from "react";
import { useBuilderStore } from "@/app/lib/store";
import { FaSave, FaUndo, FaRedo, FaRuler, FaDownload, FaShareAlt, FaSearchPlus, FaSearchMinus, FaHandPaper, FaEye } from "react-icons/fa";

export function Toolbar({ canvasRef, setIsPanning }: { 
  canvasRef: React.RefObject<HTMLDivElement | null>;
  setIsPanning: (value: boolean) => void; 
}) {
  const { pages, undo, redo, setZoom, zoom, toggleGrid, showGrid } = useBuilderStore();
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isPanningLocal, setIsPanningLocal] = useState(false);

  // Sync local panning state with Builder
  useEffect(() => {
    setIsPanning(isPanningLocal);
  }, [isPanningLocal, setIsPanning]);

  const handleSave = async () => {
    const designId = window.location.pathname.split("/")[2];
    try {
      const response = await fetch(`/api/designs/${designId}`, {
        method: "PUT",
        body: JSON.stringify({ pages }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to save design");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(pages, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert("Design URL copied to clipboard!");
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.1));

  const handleFitToScreen = () => {
    setZoom(1);
    if (canvasRef.current) {
      canvasRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setScrollX(0);
      setScrollY(0);
    }
  };

  const handleScrollTo = () => {
    if (canvasRef.current) {
      canvasRef.current.scrollTo({ top: scrollY, left: scrollX, behavior: "smooth" });
    }
  };

  const togglePanMode = () => {
    setIsPanningLocal((prev) => !prev); // Only update local state, effect syncs it
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Flux</h1>
        <button onClick={undo} className="p-2 hover:bg-gray-700 rounded" title="Undo">
          <FaUndo />
        </button>
        <button onClick={redo} className="p-2 hover:bg-gray-700 rounded" title="Redo">
          <FaRedo />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleGrid}
          className={`p-2 ${showGrid ? "bg-gray-600" : "hover:bg-gray-700"} rounded`}
          title="Toggle Grid"
        >
          <FaRuler />
        </button>
        <button onClick={handleZoomIn} className="p-2 hover:bg-gray-700 rounded" title="Zoom In">
          <FaSearchPlus />
        </button>
        <button onClick={handleZoomOut} className="p-2 hover:bg-gray-700 rounded" title="Zoom Out">
          <FaSearchMinus />
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button
          onClick={togglePanMode}
          className={`p-2 ${isPanningLocal ? "bg-gray-600" : "hover:bg-gray-700"} rounded`}
          title="Pan Mode"
        >
          <FaHandPaper />
        </button>
        <button onClick={handleFitToScreen} className="p-2 hover:bg-gray-700 rounded" title="Fit to Screen">
          <FaEye />
        </button>
        <div className="flex gap-2">
          <input
            type="number"
            value={scrollX}
            onChange={(e) => setScrollX(Number(e.target.value))}
            onKeyPress={(e) => e.key === "Enter" && handleScrollTo()}
            placeholder="X"
            className="w-16 p-1 text-black rounded"
          />
          <input
            type="number"
            value={scrollY}
            onChange={(e) => setScrollY(Number(e.target.value))}
            onKeyPress={(e) => e.key === "Enter" && handleScrollTo()}
            placeholder="Y"
            className="w-16 p-1 text-black rounded"
          />
        </div>
        <button onClick={handleExport} className="p-2 hover:bg-gray-700 rounded" title="Export Design">
          <FaDownload />
        </button>
        <button onClick={handleShare} className="p-2 hover:bg-gray-700 rounded" title="Share Design">
          <FaShareAlt />
        </button>
        <button onClick={handleSave} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
          <FaSave /> Save
        </button>
      </div>
    </div>
  );
}