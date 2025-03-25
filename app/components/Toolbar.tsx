/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useCallback } from "react";
import { useBuilderStore } from "@/app/lib/store";
import {
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
  FaCube,
  FaHome,
  FaSyncAlt,
  FaSave,
  FaExpand,
} from "react-icons/fa";
import { saveDesignOrTemplate } from "@/app/actions/saveTemplate";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import Image from "next/image"; // Import Next Image

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
    componentBuilderMode,
    toggleComponentBuilderMode,
    componentElementIds,
    currentPageId,
    currentDesignId,
    setCurrentDesignId,
    addCustomComponent,
    designTitle,
    setDesignTitle,
  } = useBuilderStore();
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isPanningLocal, setIsPanningLocal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [componentName, setComponentName] = useState("");
  const router = useRouter();

  const isNewDesign = window.location.pathname === "/builder/design";
  const isNewTemplate = window.location.pathname === "/builder/template";
  const saveAsDefault = isNewTemplate ? "template" : "design";

  // Debounced auto-save function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const autoSave = useCallback(
    debounce(async (pagesData: typeof pages, designId: string | null, title: string) => {
      if (previewMode || componentBuilderMode) return;

      const urlDesignId = window.location.pathname.split("/")[2];
      const effectiveDesignId = designId || (urlDesignId !== "design" && urlDesignId !== "template" ? urlDesignId : null);

      const result = await saveDesignOrTemplate({
        pages: pagesData,
        title: saveAsDefault === "design" ? title : undefined,
        name: saveAsDefault === "template" ? title : undefined,
        saveAs: saveAsDefault,
        designId: effectiveDesignId || undefined,
      });

      if (!result.success || !result.data) {
        console.error(`Auto-save ${saveAsDefault} failed:`, result.error);
        return;
      }

      if (!effectiveDesignId && result.data.id) {
        setCurrentDesignId(result.data.id);
        router.push(`/builder/${result.data.id}`);
      }

      console.log(`Auto-saved ${saveAsDefault} as ${result.data.id}`);
    }, 1000),
    [previewMode, componentBuilderMode, saveAsDefault, currentDesignId, router, setCurrentDesignId]
  );

  useEffect(() => {
    if (pages.length > 0 && !componentBuilderMode) {
      autoSave(pages, currentDesignId, designTitle || (saveAsDefault === "design" ? "Untitled Design" : "Untitled Template"));
    }
  }, [pages, designTitle, autoSave, currentDesignId, componentBuilderMode, saveAsDefault]);

  const handleSaveComponent = async () => {
    if (!componentName.trim()) {
      alert("Please enter a component name.");
      return;
    }

    const currentPage = pages.find((p) => p.id === currentPageId);
    if (!currentPage) {
      console.error("No current page found for component save.");
      return;
    }

    let effectiveDesignId = currentDesignId;
    if (!effectiveDesignId || effectiveDesignId === "design" || effectiveDesignId === "template") {
      const designResult = await saveDesignOrTemplate({
        saveAs: "design",
        pages,
        title: designTitle || "Untitled Design",
      });
      if (!designResult.success || !designResult.data) {
        console.error("Failed to save design before component:", designResult.error);
        return;
      }
      effectiveDesignId = designResult.data.id;
      setCurrentDesignId(effectiveDesignId);
      router.push(`/builder/${effectiveDesignId}`);
    }

    let elementsToSave = currentPage.elements;
    if (componentElementIds.length > 0) {
      elementsToSave = componentElementIds
        .map((id) => {
          const el = currentPage.elements.find((e) => e.id === id);
          if (!el) return null;
          return {
            ...el,
            x: el.x - Math.min(...componentElementIds.map((id) => currentPage.elements.find((e) => e.id === id)!.x)),
            y: el.y - Math.min(...componentElementIds.map((id) => currentPage.elements.find((e) => e.id === id)!.y)),
          };
        })
        .filter((el): el is typeof currentPage.elements[number] => el !== null);
    }

    if (elementsToSave.length === 0) {
      console.error("No elements to save for component.");
      return;
    }

    const result = await saveDesignOrTemplate({
      saveAs: "component",
      designId: effectiveDesignId,
      name: componentName,
      elements: elementsToSave,
      pages,
    });

    if (!result.success || !result.data) {
      console.error("Component save failed:", result.error);
      return;
    }

    const componentData = result.data;
    addCustomComponent({
      id: componentData.id,
      name: componentName,
      elements: elementsToSave,
      designId: effectiveDesignId,
    });

    alert(`Component saved as: ${componentName}`);
    setComponentName("");
    toggleComponentBuilderMode();
  };

  const handleTogglePanMode = () => {
    setIsPanningLocal((prev) => {
      const newValue = !prev;
      setIsPanning(newValue);
      return newValue;
    });
  };

  const handleExport = () => {
    const json = JSON.stringify(pages, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${designTitle || "design"}.json`;
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

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    if (componentBuilderMode) toggleComponentBuilderMode();
  };

  const handleToggleComponentBuilderMode = () => {
    toggleComponentBuilderMode();
    if (previewMode) setPreviewMode(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu && e.target instanceof Element && !e.target.closest(".context-menu")) {
        closeContextMenu();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu]);

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4 relative">
        <div
          className="cursor-pointer"
          onClick={handleLogoClick}
          onContextMenu={handleLogoClick}
        >
          <Image
            src="/logo.png" // Replace with your actual logo path
            alt="Flux Logo"
            width={30} // Adjust width as needed
            height={15} // Adjust height as needed
            className="hover:opacity-80 transition-opacity"
          />
        </div>
        {contextMenu && (
          <div
            className="absolute bg-white text-gray-800 rounded-lg shadow-lg p-2 z-50 context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              onClick={() => {
                router.push("/projects");
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
            >
              <FaHome className="text-blue-500" />
              Back to Projects
            </button>
            <button
              onClick={() => {
                autoSave.flush();
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
            >
              <FaSave className="text-green-500" />
              Save Now
            </button>
            <button
              onClick={() => {
                handleFitToScreen();
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
            >
              <FaExpand className="text-purple-500" />
              Fit to Screen
            </button>
            <button
              onClick={() => {
                handleExport();
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
            >
              <FaDownload className="text-gray-600" />
              Export Design
            </button>
            <button
              onClick={() => {
                handleShare();
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
            >
              <FaShareAlt className="text-blue-600" />
              Share Design
            </button>
            <button
              onClick={() => {
                window.location.reload();
                closeContextMenu();
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
            >
              <FaSyncAlt className="text-orange-500" />
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
          onClick={handleTogglePanMode}
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
          <FaPlay />
        </button>
        <button
          onClick={handleToggleComponentBuilderMode}
          className={`p-2 ${componentBuilderMode ? "bg-purple-600" : "hover:bg-gray-600"} rounded transition-colors`}
          title={componentBuilderMode ? "Exit Component Builder" : "Enter Component Builder"}
        >
          <FaCube />
        </button>
        <button onClick={handleExport} className="p-2 hover:bg-gray-600 rounded transition-colors" title="Export Design">
          <FaDownload />
        </button>
        <button onClick={handleShare} className="p-2 hover:bg-gray-600 rounded transition-colors" title="Share Design">
          <FaShareAlt />
        </button>
        {componentBuilderMode && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="Component Name"
              className="p-2 text-black rounded bg-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveComponent}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 text-white font-semibold transition-colors"
              disabled={!componentName.trim()}
            >
              Save Component
            </button>
          </div>
        )}
      </div>
    </div>
  );
}