"use client";
import { useBuilderStore } from "@/app/lib/store";
import { handleChange, borderRadiusOptions, borderWidthOptions, shadowOptions } from "./utils";

type FillBorderSectionProps = {
  currentPageId: string;
};

export function FillBorderSection({ currentPageId }: FillBorderSectionProps) {
  const { selectedElement, updateElement } = useBuilderStore();

  if (!selectedElement) return null;

  return (
    <div className="space-y-4 border-b pb-4">
      <h3 className="text-lg font-medium text-gray-800">Fill & Border</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
        <input
          type="color"
          value={selectedElement.style?.backgroundColor || "#ffffff"}
          onChange={(e) => handleChange("style", { backgroundColor: e.target.value }, selectedElement, currentPageId, updateElement)}
          className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Gradient</label>
        <input
          type="text"
          value={selectedElement.style?.background || ""}
          onChange={(e) => handleChange("style", { background: e.target.value }, selectedElement, currentPageId, updateElement)}
          placeholder="e.g., linear-gradient(to right, #ff0000, #00ff00)"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
        <select
          value={typeof selectedElement.style?.border === "string" ? selectedElement.style.border.match(/(\d+)px/)?.[1] || "0" : "0"}
          onChange={(e) => {
            const width = e.target.value;
            const currentBorder = selectedElement.style?.border || "1px solid #000000";
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, style, color] = typeof currentBorder === "string" ? currentBorder.split(" ") : ["1px", "solid", "#000000"];
            handleChange("style", { border: `${width} ${style || "solid"} ${color || "#000000"}` }, selectedElement, currentPageId, updateElement);
          }}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          {borderWidthOptions.map((size) => (
            <option key={size} value={size.replace("px", "")}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
        <input
          type="color"
          value={typeof selectedElement.style?.border === "string" ? selectedElement.style.border.split(" ").pop() || "#000000" : "#000000"}
          onChange={(e) => {
            const currentBorder = selectedElement.style?.border || "1px solid #000000";
            const [width, style] = typeof currentBorder === "string" ? currentBorder.split(" ").slice(0, 2) : ["1px", "solid"];
            handleChange("style", { border: `${width || "1px"} ${style || "solid"} ${e.target.value}` }, selectedElement, currentPageId, updateElement);
          }}
          className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
        <select
          value={selectedElement.style?.borderRadius || "0px"}
          onChange={(e) => handleChange("style", { borderRadius: e.target.value }, selectedElement, currentPageId, updateElement)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          {borderRadiusOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Box Shadow</label>
        <select
          value={selectedElement.style?.boxShadow || "none"}
          onChange={(e) => handleChange("style", { boxShadow: e.target.value }, selectedElement, currentPageId, updateElement)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          {shadowOptions.map((shadow, i) => (
            <option key={i} value={shadow}>
              {shadow === "none" ? "None" : `Shadow ${i}`}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={selectedElement.style?.opacity || 1}
          onChange={(e) => handleChange("style", { opacity: Number(e.target.value) }, selectedElement, currentPageId, updateElement)}
          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
        />
        <span className="text-sm text-gray-600">{(Number(selectedElement.style?.opacity) || 1) * 100}%</span>
      </div>
    </div>
  );
}