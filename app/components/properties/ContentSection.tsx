"use client";
import { useBuilderStore } from "@/app/lib/store";
import { handleChange } from "./utils";

type ContentSectionProps = {
  currentPageId: string;
};

export function ContentSection({ currentPageId }: ContentSectionProps) {
  const { selectedElement, updateElement } = useBuilderStore();

  if (!selectedElement) return null;

  const textTypes = ["text", "button", "nav", "bottomSheet", "link", "input", "header", "footer", "card", "accordion", "modal", "tabs", "social", "table"];

  return (
    <>
      {textTypes.includes(selectedElement.type) && (
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800">Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
            <input
              type="text"
              value={selectedElement.content || ""}
              onChange={(e) => handleChange("content", e.target.value, selectedElement, currentPageId, updateElement)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>
      )}
      {selectedElement.type === "image" && (
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800">Image</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={selectedElement.content || ""}
              onChange={(e) => handleChange("content", e.target.value, selectedElement, currentPageId, updateElement)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>
      )}
      {selectedElement.type === "carousel" && (
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800">Carousel</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
            <input
              type="text"
              value={selectedElement.content || ""}
              onChange={(e) => handleChange("content", e.target.value, selectedElement, currentPageId, updateElement)}
              placeholder="https://url1.jpg, https://url2.jpg"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>
      )}
      {selectedElement.type === "progress" && (
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800">Progress</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value (0-100)</label>
            <input
              type="number"
              value={parseInt(selectedElement.content || "50", 10)}
              onChange={(e) => handleChange("content", e.target.value, selectedElement, currentPageId, updateElement)}
              min="0"
              max="100"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>
      )}
    </>
  );
}