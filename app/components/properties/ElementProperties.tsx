"use client";
import { useBuilderStore } from "@/app/lib/store";
import { LayoutSection } from "./LayoutSection";
import { ContentSection } from "./ContentSection";
import { FillBorderSection } from "./FillBorderSection";
import { TypographySection } from "./TypographySection";
import { EffectsSection } from "./EffectsSection";
import { AlignmentSection } from "./AlignmentSection";

type ElementPropertiesProps = {
  currentPageId: string;
};

export function ElementProperties({ currentPageId }: ElementPropertiesProps) {
  const { selectedElement, deleteElement } = useBuilderStore();

  if (!selectedElement) return null;

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
        Properties
        <button
          onClick={() => deleteElement(currentPageId, selectedElement.id)}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
          title="Delete Element"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </h2>
      <div className="space-y-6">
        <LayoutSection currentPageId={currentPageId} />
        <ContentSection currentPageId={currentPageId} />
        <FillBorderSection currentPageId={currentPageId} />
        {["text", "button", "nav", "link", "input", "header", "footer", "card", "accordion", "modal", "tabs", "social"].includes(selectedElement.type) && (
          <TypographySection currentPageId={currentPageId} />
        )}
        {selectedElement.type === "icon" && <TypographySection currentPageId={currentPageId} isIcon />}
        <EffectsSection currentPageId={currentPageId} />
        <AlignmentSection currentPageId={currentPageId} />
      </div>
    </>
  );
}