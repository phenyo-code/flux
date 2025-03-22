/* eslint-disable @typescript-eslint/no-unused-vars */
 
// app/components/PrototypePanel.tsx
"use client";
import { useBuilderStore } from "@/app/lib/store";
import { FaMousePointer, FaEye, FaPlay, FaExternalLinkAlt, FaVideo, FaBars, FaArrowDown, FaMagic } from "react-icons/fa";

export function PrototypePanel() {
  const { selectedElement, pages, currentPageId, updateElement } = useBuilderStore();

  if (!selectedElement) {
    return (
      <div className="p-4 h-full bg-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Prototype</h2>
        <p className="text-gray-500">Select an element to add prototype actions.</p>
      </div>
    );
  }

  const currentPage = pages.find((p) => p.id === currentPageId);
  const elements = currentPage?.elements || [];

  const updatePrototype = (
    event: "onClick" | "onHover" | "onLoad",
    updates: { action?: string; targetId?: string; value?: string; delay?: number; transition?: string } | undefined
  ) => {
    updateElement(currentPageId!, selectedElement.id, {
      prototype: {
        ...selectedElement.prototype,
        [event]: updates
          ? {
              ...selectedElement.prototype?.[event], // Preserve existing properties
              ...updates,
            }
          : undefined,
      },
    });
  };

  return (
    <div className="p-4 h-full bg-gray-100 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Prototype</h2>
      <div className="space-y-6">
        {/* On Click Section */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <FaMousePointer /> On Click
          </h3>
          <select
            value={selectedElement.prototype?.onClick?.action || ""}
            onChange={(e) => {
              const action = e.target.value;
              updatePrototype("onClick", action ? { action } : undefined); // Don’t reset targetId
            }}
            className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            <option value="navigate">Navigate</option>
            <option value="openModal">Open Modal</option>
            <option value="toggleVisibility">Toggle Visibility</option>
            <option value="playVideo">Play Video</option>
            <option value="submitForm">Submit Form</option>
            <option value="openLink">Open Link</option>
            <option value="scrollTo">Scroll To</option>
            <option value="triggerAnimation">Trigger Animation</option>
          </select>
          {selectedElement.prototype?.onClick?.action && (
            <div className="mt-2 space-y-2">
              {(selectedElement.prototype.onClick.action === "navigate" ||
                selectedElement.prototype.onClick.action === "openModal" ||
                selectedElement.prototype.onClick.action === "toggleVisibility" ||
                selectedElement.prototype.onClick.action === "playVideo" ||
                selectedElement.prototype.onClick.action === "scrollTo") && (
                <select
                  value={selectedElement.prototype.onClick.targetId || ""}
                  onChange={(e) => updatePrototype("onClick", { targetId: e.target.value })}
                  className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Target</option>
                  {selectedElement.prototype.onClick.action === "navigate"
                    ? pages.map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.title}
                        </option>
                      ))
                    : elements.map((el) => (
                        <option key={el.id} value={el.id.toString()}>
                          {el.type} {el.content ? `(${el.content.slice(0, 10)}...)` : ""}
                        </option>
                      ))}
                </select>
              )}
              {(selectedElement.prototype.onClick.action === "openLink" ||
                selectedElement.prototype.onClick.action === "triggerAnimation") && (
                <input
                  type="text"
                  value={selectedElement.prototype.onClick.value || ""}
                  onChange={(e) => updatePrototype("onClick", { value: e.target.value })}
                  placeholder={selectedElement.prototype.onClick.action === "openLink" ? "Enter URL" : "Animation Name"}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              )}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={selectedElement.prototype.onClick.delay || 0}
                  onChange={(e) => updatePrototype("onClick", { delay: Number(e.target.value) })}
                  placeholder="Delay (ms)"
                  className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={selectedElement.prototype.onClick.transition || "none"}
                  onChange={(e) => updatePrototype("onClick", { transition: e.target.value })}
                  className="w-1/2 p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">No Transition</option>
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* On Hover Section */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <FaEye /> On Hover
          </h3>
          <select
            value={selectedElement.prototype?.onHover?.action || ""}
            onChange={(e) => {
              const action = e.target.value;
              updatePrototype("onHover", action ? { action } : undefined);
            }}
            className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            <option value="showTooltip">Show Tooltip</option>
            <option value="highlight">Highlight</option>
            <option value="scale">Scale</option>
          </select>
          {selectedElement.prototype?.onHover?.action && (
            <div className="mt-2 space-y-2">
              {selectedElement.prototype.onHover.action === "highlight" && (
                <select
                  value={selectedElement.prototype.onHover.targetId || ""}
                  onChange={(e) => updatePrototype("onHover", { targetId: e.target.value })}
                  className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Element</option>
                  {elements.map((el) => (
                    <option key={el.id} value={el.id.toString()}>
                      {el.type} {el.content ? `(${el.content.slice(0, 10)}...)` : ""}
                    </option>
                  ))}
                </select>
              )}
              {(selectedElement.prototype.onHover.action === "showTooltip" ||
                selectedElement.prototype.onHover.action === "scale") && (
                <input
                  type="text"
                  value={selectedElement.prototype.onHover.value || ""}
                  onChange={(e) => updatePrototype("onHover", { value: e.target.value })}
                  placeholder={selectedElement.prototype.onHover.action === "showTooltip" ? "Tooltip Text" : "Scale (e.g., 1.2)"}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          )}
        </div>

        {/* On Load Section */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <FaPlay /> On Load
          </h3>
          <select
            value={selectedElement.prototype?.onLoad?.action || ""}
            onChange={(e) => {
              const action = e.target.value;
              updatePrototype("onLoad", action ? { action } : undefined);
            }}
            className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            <option value="animate">Animate</option>
            <option value="fetchData">Fetch Data</option>
          </select>
          {selectedElement.prototype?.onLoad?.action && (
            <input
              type="text"
              value={selectedElement.prototype.onLoad.value || ""}
              onChange={(e) => updatePrototype("onLoad", { value: e.target.value })}
              placeholder={selectedElement.prototype.onLoad.action === "animate" ? "Animation Name" : "API Endpoint"}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>
    </div>
  );
}