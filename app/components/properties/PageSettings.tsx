"use client";
import { useBuilderStore, Page } from "@/app/lib/store";

type PageSettingsProps = {
  currentPage: Page | undefined;
};

export function PageSettings({ currentPage }: PageSettingsProps) {
  const {
    updatePageBackground,
    setFrameHeight,
    showGrid,
    toggleGrid,
    setGridSize,
    setColumnCount,
    gridSize,
    columnCount,
    layoutMode,
    setLayoutMode,
    zoom,
    previewMode,
    setPreviewMode,
    currentPageId,
  } = useBuilderStore();

  const handlePageUpdate = (key: string, value: string | number) => {
    if (!currentPageId) return;
    if (key === "backgroundColor" || key === "backgroundImage") {
      updatePageBackground(
        currentPageId,
        key === "backgroundColor" ? value as string : currentPage?.backgroundColor || "#ffffff",
        key === "backgroundImage" ? value as string : currentPage?.backgroundImage || ""
      );
    } else if (key === "frameHeight") {
      const numValue = parseInt(String(value), 10);
      if (!isNaN(numValue)) setFrameHeight(currentPageId, numValue);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
        <input
          type="color"
          value={currentPage?.backgroundColor || "#ffffff"}
          onChange={(e) => handlePageUpdate("backgroundColor", e.target.value)}
          className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
        <input
          type="text"
          value={currentPage?.backgroundImage || ""}
          onChange={(e) => handlePageUpdate("backgroundImage", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Frame Height (px)</label>
        <input
          type="number"
          value={currentPage?.frameHeight ?? 800}
          onChange={(e) => handlePageUpdate("frameHeight", e.target.value)}
          min="200"
          step="10"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={showGrid}
          onChange={toggleGrid}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Show Grid</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Grid Size (px)</label>
        <select
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Column Count</label>
        <input
          type="number"
          value={columnCount}
          onChange={(e) => setColumnCount(Math.max(1, Math.min(12, Number(e.target.value))))}
          min="1"
          max="12"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Layout Mode</label>
        <select
          value={layoutMode}
          onChange={(e) => setLayoutMode(e.target.value as "grid" | "columns")}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="grid">Grid</option>
          <option value="columns">Columns</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Level</label>
        <input
          type="text"
          value={`${Math.round(zoom * 100)}%`}
          readOnly
          className="w-full p-2 border rounded-md bg-gray-100 text-gray-600 shadow-sm cursor-not-allowed"
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={previewMode}
          onChange={() => setPreviewMode(!previewMode)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Preview Mode</label>
      </div>
    </div>
  );
}