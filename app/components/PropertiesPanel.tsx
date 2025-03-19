"use client";
import { useBuilderStore } from "@/app/lib/store";

export function PropertiesPanel() {
  const { selectedElement, currentPageId, updateElement } = useBuilderStore();

  if (!selectedElement || !currentPageId) return <div className="w-64 bg-gray-200 p-4">Select a component on an active page</div>;

  const handleChange = (key: string, value: unknown) => {
    updateElement(currentPageId, selectedElement.id, { [key]: value });
  };

  const handleActionChange = (event: string, action: string, value: string) => {
    const newActions = selectedElement.actions ? [...selectedElement.actions] : [];
    const actionIndex = newActions.findIndex((a) => a.event === event);
    if (actionIndex > -1) newActions[actionIndex] = { event, action, value };
    else newActions.push({ event, action, value });
    handleChange("actions", newActions);
  };

  return (
    <div className="w-64 bg-gray-200 p-4 shrink-0">
      <h2 className="text-lg font-bold mb-4">Properties</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm">X</label>
          <input
            type="number"
            value={selectedElement.x}
            onChange={(e) => handleChange("x", Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Y</label>
          <input
            type="number"
            value={selectedElement.y}
            onChange={(e) => handleChange("y", Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Width</label>
          <input
            type="number"
            value={selectedElement.width}
            onChange={(e) => handleChange("width", Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Height</label>
          <input
            type="number"
            value={selectedElement.height}
            onChange={(e) => handleChange("height", Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        {["text", "button", "nav"].includes(selectedElement.type) && (
          <div>
            <label className="block text-sm">Content</label>
            <input
              type="text"
              value={selectedElement.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {selectedElement.type === "image" && (
          <div>
            <label className="block text-sm">Image URL</label>
            <input
              type="text"
              value={selectedElement.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        <div>
          <label className="block text-sm">Background Color</label>
          <input
            type="color"
            value={selectedElement.style?.backgroundColor || "#ffffff"}
            onChange={(e) => handleChange("style", { ...selectedElement.style, backgroundColor: e.target.value })}
            className="w-full h-10 border rounded"
          />
        </div>
        <div>
          <h3 className="text-sm font-bold">Actions</h3>
          <select
            value={selectedElement.actions?.find((a) => a.event === "click")?.action || ""}
            onChange={(e) => handleActionChange("click", e.target.value, selectedElement.actions?.find(a => a.event === "click")?.value || "")}
            className="w-full p-2 border rounded mt-2"
          >
            <option value="">None</option>
            <option value="alert">Alert</option>
            <option value="navigate">Navigate</option>
          </select>
          {selectedElement.actions?.some((a) => a.event === "click" && ["alert", "navigate"].includes(a.action)) && (
            <input
              type="text"
              placeholder="Action Value"
              value={selectedElement.actions.find((a) => a.event === "click")?.value || ""}
              onChange={(e) => handleActionChange("click", selectedElement.actions?.find(a => a.event === "click")?.action || "", e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
}