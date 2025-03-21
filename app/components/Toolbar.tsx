"use client";
import { useState, useEffect } from "react";
import { useBuilderStore } from "@/app/lib/store";
import {
  FaSave,
  FaUndo,
  FaRedo,
  FaRuler,
  FaDownload,
  FaShareAlt,
  FaSearchPlus,
  FaSearchMinus,
  FaHandPaper,
  FaEye,
  FaPlay,
} from "react-icons/fa";
import { saveDesignOrTemplate } from "@/app/actions/saveTemplate";
import { useRouter } from "next/navigation";

export function Toolbar({
  canvasRef,
  setIsPanning,
}: {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  setIsPanning: (value: boolean) => void;
}) {
  const {
    pages,
    undo,
    redo,
    setZoom,
    zoom,
    toggleGrid,
    showGrid,
    previewMode,
    setPreviewMode,
  } = useBuilderStore();
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isPanningLocal, setIsPanningLocal] = useState(false);
  const [saveOption, setSaveOption] = useState<"none" | "design" | "template">("none");
  const [designName, setDesignName] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsPanning(isPanningLocal);
  }, [isPanningLocal, setIsPanning]);

  const handleSave = async (formData: FormData) => {
    const designId = window.location.pathname.split("/")[2];
    const saveAs = formData.get("saveAs") as "design" | "template";
    const dName = formData.get("designName") as string;
    const tName = formData.get("templateName") as string;

    const result = await saveDesignOrTemplate({
      pages,
      title: dName || "My Design",
      name: saveAs === "template" ? (tName || `template-${Date.now()}`) : undefined,
      saveAs,
      designId: designId !== "newproject" && designId !== "demo" ? designId : undefined,
    });

    if (!result.success) {
      console.error(`${saveAs} save failed:`, result.error);
      alert(`Failed to save ${saveAs}: ${result.error}`);
      return;
    }

    alert(
      `${saveAs.charAt(0).toUpperCase() + saveAs.slice(1)} saved as: ${
        saveAs === "design" ? dName || "My Design" : tName || `template-${Date.now()}`
      }`
    );
    if (saveAs === "design" && !designId && result.data) {
      router.push(`/builder/${result.data.id}`);
    }

    setSaveOption("none");
    setDesignName("");
    setTemplateName("");
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
    setIsPanningLocal((prev) => !prev);
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const isSaveButtonVisible = () => {
    if (saveOption === "design") return designName.trim() !== "";
    if (saveOption === "template") return templateName.trim() !== "";
    return false;
  };

  const handleLogoContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4 relative">
        <h1
          className="text-xl font-bold cursor-pointer hover:text-blue-300 transition-colors"
          onContextMenu={handleLogoContextMenu}
          onClick={() => setContextMenu(null)}
        >
          Flux
        </h1>
        {contextMenu && (
          <div
            className="absolute bg-white text-gray-800 rounded shadow-lg p-2 z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              onClick={() => {
                router.push("/projects");
                closeContextMenu();
              }}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            >
              Back to Projects
            </button>
            <button
              onClick={() => {
                handleFitToScreen();
                closeContextMenu();
              }}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            >
              Reset View
            </button>
            <button
              onClick={() => {
                handleExport();
                closeContextMenu();
              }}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            >
              Export Design
            </button>
            <button
              onClick={() => {
                window.location.reload();
                closeContextMenu();
              }}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            >
              Refresh
            </button>
          </div>
        )}
        <button onClick={undo} className="p-2 hover:bg-gray-600 rounded transition-colors" title="Undo">
          <FaUndo />
        </button>
        <button onClick={redo} className="p-2 hover:bg-gray-600 rounded transition-colors" title="Redo">
          <FaRedo />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleGrid}
          className={`p-2 ${showGrid ? "bg-gray-600" : "hover:bg-gray-600"} rounded transition-colors`}
          title="Toggle Grid"
        >
          <FaRuler />
        </button>
        <button onClick={handleZoomIn} className="p-2 hover:bg-gray-600 rounded transition-colors" title="Zoom In">
          <FaSearchPlus />
        </button>
        <button onClick={handleZoomOut} className="p-2 hover:bg-gray-600 rounded transition-colors" title="Zoom Out">
          <FaSearchMinus />
        </button>
        <span className="text-sm">{Math.round(zoom * 100)}%</span>
        <button
          onClick={togglePanMode}
          className={`p-2 ${isPanningLocal ? "bg-gray-600" : "hover:bg-gray-600"} rounded transition-colors`}
          title="Pan Mode"
        >
          <FaHandPaper />
        </button>
        <button onClick={handleFitToScreen} className="p-2 hover:bg-gray-600 rounded transition-colors" title="Fit to Screen">
          <FaEye />
        </button>
        <button
          onClick={togglePreviewMode}
          className={`p-2 ${previewMode ? "bg-blue-600" : "hover:bg-gray-600"} rounded transition-colors`}
          title={previewMode ? "Switch to Design Mode" : "Switch to Preview Mode"}
        >
          <FaPlay /> {previewMode ? "Design" : "Preview"}
        </button>
        <div className="flex gap-2">
          <input
            type="number"
            value={scrollX}
            onChange={(e) => setScrollX(Number(e.target.value))}
            onKeyPress={(e) => e.key === "Enter" && handleScrollTo()}
            placeholder="X"
            className="w-16 p-1 text-black rounded bg-gray-200 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={scrollY}
            onChange={(e) => setScrollY(Number(e.target.value))}
            onKeyPress={(e) => e.key === "Enter" && handleScrollTo()}
            placeholder="Y"
            className="w-16 p-1 text-black rounded bg-gray-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button onClick={handleExport} className="p-2 hover:bg-gray-600 rounded transition-colors" title="Export Design">
          <FaDownload />
        </button>
        <button onClick={handleShare} className="p-2 hover:bg-gray-600 rounded transition-colors" title="Share Design">
          <FaShareAlt />
        </button>
        <form action={handleSave} className="flex items-center gap-3">
          <select
            name="saveAs"
            value={saveOption}
            onChange={(e) => {
              setSaveOption(e.target.value as "none" | "design" | "template");
              setDesignName("");
              setTemplateName("");
            }}
            className="p-2 text-black rounded bg-gray-200 hover:bg-gray-300 transition-colors focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">Save As</option>
            <option value="design">Save As Design</option>
            <option value="template">Save As Template</option>
          </select>
          {saveOption === "design" && (
            <input
              type="text"
              name="designName"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="Design Name"
              className="p-2 text-black rounded bg-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
          )}
          {saveOption === "template" && (
            <input
              type="text"
              name="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template Name"
              className="p-2 text-black rounded bg-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
          )}
          {isSaveButtonVisible() && (
            <button
              type="submit"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2 text-white font-semibold shadow-md transition-colors"
            >
              <FaSave /> Save
            </button>
          )}
        </form>
      </div>
    </div>
  );
}