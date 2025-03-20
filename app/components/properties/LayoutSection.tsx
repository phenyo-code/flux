"use client";
import { useBuilderStore } from "@/app/lib/store";
import { handleChange } from "./utils";

type LayoutSectionProps = {
  currentPageId: string;
};

export function LayoutSection({ currentPageId }: LayoutSectionProps) {
  const { selectedElement, updateElement } = useBuilderStore();
  const rotationOptions = [0, 15, 30, 45, 60, 75, 90, 120, 135, 150, 180, 225, 270, 315, 360].map((deg) => `${deg}deg`);

  if (!selectedElement) return null;

  return (
    <div className="space-y-4 border-b pb-4">
      <h3 className="text-lg font-medium text-gray-800">Layout</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">X (px)</label>
          <input
            type="number"
            value={selectedElement.x}
            onChange={(e) => handleChange("x", e.target.value, selectedElement, currentPageId, updateElement)}
            step="1"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Y (px)</label>
          <input
            type="number"
            value={selectedElement.y}
            onChange={(e) => handleChange("y", e.target.value, selectedElement, currentPageId, updateElement)}
            step="1"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
          <input
            type="number"
            value={selectedElement.width}
            onChange={(e) => handleChange("width", e.target.value, selectedElement, currentPageId, updateElement)}
            min="10"
            step="1"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
          <input
            type="number"
            value={selectedElement.height}
            onChange={(e) => handleChange("height", e.target.value, selectedElement, currentPageId, updateElement)}
            min="10"
            step="1"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
        <select
          value={
            selectedElement.style?.transform?.includes("rotate")
              ? selectedElement.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || "0deg"
              : "0deg"
          }
          onChange={(e) => handleChange("style", { transform: `rotate(${e.target.value})` }, selectedElement, currentPageId, updateElement)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          {rotationOptions.map((deg) => (
            <option key={deg} value={deg}>
              {deg}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}