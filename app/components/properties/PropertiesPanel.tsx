"use client";
import { useBuilderStore } from "@/app/lib/store";
import { PageSettings } from "./PageSettings";
import { ElementProperties } from "./ElementProperties";

export function PropertiesPanel() {
  const { selectedElement, currentPageId, pages } = useBuilderStore();
  const currentPage = pages.find((p) => p.id === currentPageId);

  if (!currentPageId) {
    return <div className="w-full bg-gray-100 p-4 text-gray-500">No page selected</div>;
  }

  return (
    <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 p-6 shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)] rounded-lg">
      {!selectedElement ? (
        <PageSettings currentPage={currentPage} />
      ) : (
        <ElementProperties currentPageId={currentPageId} />
      )}
    </div>
  );
}