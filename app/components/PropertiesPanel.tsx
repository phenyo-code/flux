"use client";
import { useBuilderStore, Element } from "@/app/lib/store";

export function PropertiesPanel() {
  const {
    selectedElement,
    currentPageId,
    updateElement,
    pages,
    updatePageBackground,
    moveElementToLayer,
    deleteElement,
    alignElements,
    zoom,
    showGrid,
    toggleGrid,
    setGridSize,
    setColumnCount,
  } = useBuilderStore();
  const currentPage = pages.find((p) => p.id === currentPageId);

  if (!currentPageId) {
    return <div className="w-full bg-gray-100 p-4 text-gray-500">No page selected</div>;
  }

  const handleChange = (
    key: keyof Element,
    value: string | number | boolean | { backgroundColor?: string; background?: string; fontSize?: string; color?: string; zIndex?: number }
  ) => {
    if (!selectedElement || !currentPageId) return;

    if (key === "style" && typeof value === "object") {
      const newStyle = { ...selectedElement.style, ...value };
      updateElement(currentPageId, selectedElement.id, { style: newStyle });
    } else if (["x", "y", "width", "height", "zIndex"].includes(key)) {
      updateElement(currentPageId, selectedElement.id, { [key]: Number(value) } as Partial<Element>);
    } else if (["content", "isLocked"].includes(key)) {
      updateElement(currentPageId, selectedElement.id, { [key]: value } as Partial<Element>);
    }
  };

  const handleAlignment = (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (!selectedElement || !currentPageId) return;
    alignElements(currentPageId, [selectedElement.id], alignment);
  };

  function get() {
    return { gridSize: 10 }; // Replace 10 with the actual default or dynamic value for gridSize
  }

  return (
    <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 p-6 shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)] rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
        Properties
        {selectedElement && (
          <button
            onClick={() => deleteElement(currentPageId!, selectedElement.id)}
            className="text-red-500 hover:text-red-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </h2>
      {!selectedElement ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Background Color</label>
            <input
              type="color"
              value={currentPage?.backgroundColor || "#ffffff"}
              onChange={(e) => updatePageBackground(currentPageId, e.target.value, currentPage?.backgroundImage)}
              className="w-full h-12 rounded-md border-gray-300 cursor-pointer shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Background Image</label>
            <input
              type="text"
              value={currentPage?.backgroundImage || ""}
              onChange={(e) => updatePageBackground(currentPageId, currentPage?.backgroundColor || "#ffffff", e.target.value)}
              placeholder="Enter image URL"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={toggleGrid}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Show Grid</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Level</label>
            <input
              type="text"
              value={`${Math.round(zoom * 100)}%`}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-100 text-gray-700"
            />
          </div>
        </div>
      ) : selectedElement.type === "pageFrame" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">X</label>
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) => handleChange("x", Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Y</label>
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) => handleChange("y", Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => handleChange("height", Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={selectedElement.style?.backgroundColor || "#ffffff"}
              onChange={(e) => handleChange("style", { backgroundColor: e.target.value })}
              className="w-full h-12 rounded-md border-gray-300 cursor-pointer shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
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
            <input
              type="number"
              value={get().gridSize} // Ensure get() returns an object with gridSize
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Column Count</label>
            <input
              type="number"
              value={pages.find((p) => p.id === currentPageId)?.columnCount || 0}
              onChange={(e) => setColumnCount(Number(e.target.value))}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedElement.isLocked || false}
              onChange={(e) => handleChange("isLocked", e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Lock Element</label>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">X</label>
              <input
                type="number"
                value={selectedElement.x}
                onChange={(e) => handleChange("x", Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Y</label>
              <input
                type="number"
                value={selectedElement.y}
                onChange={(e) => handleChange("y", Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) => handleChange("width", Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => handleChange("height", Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {["text", "button", "nav", "bottomSheet", "link", "input"].includes(selectedElement.type) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <input
                type="text"
                value={selectedElement.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {selectedElement.type === "image" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                value={selectedElement.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={selectedElement.style?.backgroundColor || "#ffffff"}
              onChange={(e) => handleChange("style", { backgroundColor: e.target.value })}
              className="w-full h-12 rounded-md border-gray-300 cursor-pointer shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Gradient</label>
            <input
              type="text"
              value={selectedElement.style?.background || ""}
              onChange={(e) => handleChange("style", { background: e.target.value, backgroundColor: undefined })}
              placeholder="e.g., linear-gradient(to right, #ff0000, #00ff00)"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size (px)</label>
            <input
              type="number"
              value={parseInt(selectedElement.style?.fontSize as string) || 16}
              onChange={(e) => handleChange("style", { fontSize: `${e.target.value}px` })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <input
              type="color"
              value={selectedElement.style?.color || "#000000"}
              onChange={(e) => handleChange("style", { color: e.target.value })}
              className="w-full h-12 rounded-md border-gray-300 cursor-pointer shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Z-Index</label>
            <input
              type="number"
              value={selectedElement.style?.zIndex ?? 0}
              onChange={(e) => handleChange("zIndex", Number(e.target.value))}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedElement.isLocked || false}
              onChange={(e) => handleChange("isLocked", e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Lock Element</label>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => moveElementToLayer(currentPageId!, selectedElement.id, "up")}
                className="flex-1 p-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Layer Up
              </button>
              <button
                onClick={() => moveElementToLayer(currentPageId!, selectedElement.id, "down")}
                className="flex-1 p-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Layer Down
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alignment</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAlignment("left")}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Left
                </button>
                <button
                  onClick={() => handleAlignment("center")}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Center
                </button>
                <button
                  onClick={() => handleAlignment("right")}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Right
                </button>
                <button
                  onClick={() => handleAlignment("top")}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Top
                </button>
                <button
                  onClick={() => handleAlignment("middle")}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Middle
                </button>
                <button
                  onClick={() => handleAlignment("bottom")}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Bottom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}