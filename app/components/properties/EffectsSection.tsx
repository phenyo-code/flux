"use client";
import { useBuilderStore } from "@/app/lib/store";
import { handleChange } from "./utils";

type EffectsSectionProps = {
  currentPageId: string;
};

export function EffectsSection({ currentPageId }: EffectsSectionProps) {
  const { selectedElement, updateElement } = useBuilderStore();

  if (!selectedElement) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Effects & Advanced</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Z-Index</label>
        <input
          type="number"
          value={selectedElement.style?.zIndex ?? selectedElement.zIndex ?? 0}
          onChange={(e) => handleChange("zIndex", e.target.value, selectedElement, currentPageId, updateElement)}
          step="1"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Blend Mode</label>
        <select
          value={selectedElement.style?.mixBlendMode || "normal"}
          onChange={(e) => handleChange("style", { mixBlendMode: e.target.value }, selectedElement, currentPageId, updateElement)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="normal">Normal</option>
          <option value="multiply">Multiply</option>
          <option value="screen">Screen</option>
          <option value="overlay">Overlay</option>
          <option value="darken">Darken</option>
          <option value="lighten">Lighten</option>
          <option value="color-dodge">Color Dodge</option>
          <option value="color-burn">Color Burn</option>
          <option value="soft-light">Soft Light</option>
          <option value="hard-light">Hard Light</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cursor</label>
        <select
          value={selectedElement.style?.cursor || "auto"}
          onChange={(e) => handleChange("style", { cursor: e.target.value }, selectedElement, currentPageId, updateElement)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="auto">Auto</option>
          <option value="default">Default</option>
          <option value="pointer">Pointer</option>
          <option value="move">Move</option>
          <option value="text">Text</option>
          <option value="crosshair">Crosshair</option>
          <option value="wait">Wait</option>
          <option value="not-allowed">Not Allowed</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={selectedElement.isLocked || false}
          onChange={(e) => handleChange("isLocked", e.target.checked, selectedElement, currentPageId, updateElement)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Lock Element</label>
      </div>
    </div>
  );
}