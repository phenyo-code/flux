"use client";
import { useBuilderStore } from "@/app/lib/store";
import { handleChange, fontSizeOptions, fontWeightOptions, fontFamilyOptions, textAlignOptions } from "./utils";

type TypographySectionProps = {
  currentPageId: string;
  isIcon?: boolean;
};

export function TypographySection({ currentPageId, isIcon = false }: TypographySectionProps) {
  const { selectedElement, updateElement } = useBuilderStore();

  if (!selectedElement) return null;

  return (
    <div className="space-y-4 border-b pb-4">
      <h3 className="text-lg font-medium text-gray-800">{isIcon ? "Icon" : "Typography"}</h3>
      {!isIcon && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
          <select
            value={selectedElement.style?.fontFamily || "Inter"}
            onChange={(e) => handleChange("style", { fontFamily: e.target.value }, selectedElement, currentPageId, updateElement)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {fontFamilyOptions.map((family) => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{isIcon ? "Icon Size" : "Font Size"}</label>
        <select
          value={selectedElement.style?.fontSize || (isIcon ? "24px" : "16px")}
          onChange={(e) => handleChange("style", { fontSize: e.target.value }, selectedElement, currentPageId, updateElement)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          {fontSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      {!isIcon && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
            <select
              value={selectedElement.style?.fontWeight || "400"}
              onChange={(e) => handleChange("style", { fontWeight: e.target.value }, selectedElement, currentPageId, updateElement)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {fontWeightOptions.map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input
              type="color"
              value={selectedElement.style?.color || "#000000"}
              onChange={(e) => handleChange("style", { color: e.target.value }, selectedElement, currentPageId, updateElement)}
              className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
            <select
              value={selectedElement.style?.textAlign || "left"}
              onChange={(e) => handleChange("style", { textAlign: e.target.value }, selectedElement, currentPageId, updateElement)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {textAlignOptions.map((align) => (
                <option key={align} value={align}>
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
            <input
              type="number"
              value={parseFloat(selectedElement.style?.lineHeight || "1.5")}
              step="0.1"
              min="0.5"
              max="3"
              onChange={(e) => handleChange("style", { lineHeight: e.target.value }, selectedElement, currentPageId, updateElement)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Letter Spacing (px)</label>
            <input
              type="number"
              value={parseFloat(selectedElement.style?.letterSpacing || "0")}
              step="0.1"
              min="-5"
              max="10"
              onChange={(e) => handleChange("style", { letterSpacing: `${e.target.value}px` }, selectedElement, currentPageId, updateElement)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedElement.style?.fontStyle === "italic"}
                onChange={(e) => handleChange("style", { fontStyle: e.target.checked ? "italic" : "normal" }, selectedElement, currentPageId, updateElement)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Italic</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedElement.style?.textDecoration?.includes("underline")}
                onChange={(e) => handleChange("style", { textDecoration: e.target.checked ? "underline" : "none" }, selectedElement, currentPageId, updateElement)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Underline</label>
            </div>
          </div>
        </>
      )}
      {isIcon && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
          <input
            type="color"
            value={selectedElement.style?.color || "#000000"}
            onChange={(e) => handleChange("style", { color: e.target.value }, selectedElement, currentPageId, updateElement)}
            className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
          />
        </div>
      )}
    </div>
  );
}