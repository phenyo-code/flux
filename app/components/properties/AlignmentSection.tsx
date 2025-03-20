"use client";
import { useBuilderStore } from "@/app/lib/store";

type AlignmentSectionProps = {
  currentPageId: string;
};

export function AlignmentSection({ currentPageId }: AlignmentSectionProps) {
  const { selectedElement, moveElementToLayer, alignElements } = useBuilderStore();

  if (!selectedElement) return null;

  const handleAlignment = (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    alignElements(currentPageId, [selectedElement.id], alignment);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Alignment & Layering</h3>
      <div className="flex gap-2">
        <button
          onClick={() => moveElementToLayer(currentPageId, selectedElement.id, "up")}
          className="flex-1 p-2 bg-gray-200 rounded hover:bg-gray-300 shadow-sm transition-colors duration-200"
        >
          Layer Up
        </button>
        <button
          onClick={() => moveElementToLayer(currentPageId, selectedElement.id, "down")}
          className="flex-1 p-2 bg-gray-200 rounded hover:bg-gray-300 shadow-sm transition-colors duration-200"
        >
          Layer Down
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Align</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAlignment("left")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm shadow-sm transition-colors duration-200"
          >
            Left
          </button>
          <button
            onClick={() => handleAlignment("center")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm shadow-sm transition-colors duration-200"
          >
            Center
          </button>
          <button
            onClick={() => handleAlignment("right")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm shadow-sm transition-colors duration-200"
          >
            Right
          </button>
          <button
            onClick={() => handleAlignment("top")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm shadow-sm transition-colors duration-200"
          >
            Top
          </button>
          <button
            onClick={() => handleAlignment("middle")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm shadow-sm transition-colors duration-200"
          >
            Middle
          </button>
          <button
            onClick={() => handleAlignment("bottom")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 text-sm shadow-sm transition-colors duration-200"
          >
            Bottom
          </button>
        </div>
      </div>
    </div>
  );
}