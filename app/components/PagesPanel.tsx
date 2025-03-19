/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useBuilderStore } from "@/app/lib/store";
import { FaPlus, FaTrash, FaLayerGroup, FaCopy } from "react-icons/fa";

const components = [
  { type: "pageFrame", label: "Page Frame", icon: "📄" }, // New PageFrame component
  { type: "text", label: "Text", icon: "T" },
  { type: "button", label: "Button", icon: "B" },
  { type: "rectangle", label: "Rectangle", icon: "□" },
  { type: "nav", label: "Nav Bar", icon: "≡" },
  { type: "image", label: "Image", icon: "🖼️" },
  { type: "container", label: "Container", icon: "📦" },
  { type: "bottomSheet", label: "Bottom Sheet", icon: "⬇️" },
  { type: "radio", label: "Radio Button", icon: "◉" },
  { type: "link", label: "Link", icon: "🔗" },
  { type: "form", label: "Form", icon: "📋" },
  { type: "input", label: "Input", icon: "✍️" },
  // New website-relevant components
  { type: "header", label: "Header", icon: "🏠" },
  { type: "footer", label: "Footer", icon: "👣" },
  { type: "card", label: "Card", icon: "🃏" },
  { type: "carousel", label: "Carousel", icon: "🎠" },
];

export function PagesPanel() {
  const {
    pages,
    currentPageId,
    setCurrentPageId,
    addPage,
    setSelectedElement,
    renamePage,
    deleteElement,
    duplicateElement,
    groupElements,
  } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<"pages" | "components">("pages");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRename = (pageId: string) => {
    if (newTitle.trim()) {
      renamePage(pageId, newTitle.trim());
    }
    setEditingPageId(null);
    setNewTitle("");
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData("type", type);
  };

  const filteredComponents = components.filter((comp) =>
    comp.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-72 bg-gradient-to-b from-gray-100 to-gray-200 p-4 shrink-0 overflow-auto h-[calc(100vh-4rem)] shadow-lg">
      <div className="flex mb-4 rounded-lg overflow-hidden">
        <button
          onClick={() => setActiveTab("pages")}
          className={`flex-1 p-2 font-medium ${activeTab === "pages" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700 hover:bg-gray-400"} transition-colors`}
        >
          Pages
        </button>
        <button
          onClick={() => setActiveTab("components")}
          className={`flex-1 p-2 font-medium ${activeTab === "components" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700 hover:bg-gray-400"} transition-colors`}
        >
          Components
        </button>
      </div>

      {activeTab === "pages" ? (
        <>
          <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            Pages
            <button
              onClick={() => {
                const selectedIds = pages
                  .find((p) => p.id === currentPageId)
                  ?.elements.filter((el) => !el.isLocked)
                  .map((el) => el.id);
                if (selectedIds && selectedIds.length > 1) groupElements(currentPageId!, selectedIds);
              }}
              className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              title="Group selected elements"
            >
              <FaLayerGroup />
            </button>
          </h2>
          {pages.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No pages yet. Add one to start.</p>
          ) : (
            <ul className="space-y-4">
              {pages.map((page) => (
                <li key={page.id} className="relative group">
                  {editingPageId === page.id ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleRename(page.id)}
                      onKeyPress={(e) => e.key === "Enter" && handleRename(page.id)}
                      className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPageId(page.id)}
                        onDoubleClick={() => {
                          setEditingPageId(page.id);
                          setNewTitle(page.title);
                        }}
                        className={`flex-1 text-left p-2 rounded ${currentPageId === page.id ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"} shadow-sm`}
                      >
                        {page.title}
                      </button>
                      <button
                        onClick={() => {
                          const newPageId = Date.now().toString();
                          addPage(`${page.title} Copy`);
                          setCurrentPageId(newPageId);
                        }}
                        className="text-gray-500 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Duplicate Page"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  )}
                  <ul className="ml-4 mt-2 space-y-1 max-h-40 overflow-auto">
                    {page.elements.length === 0 ? (
                      <li className="text-sm text-gray-500">No components</li>
                    ) : (
                      page.elements.map((el) => (
                        <li
                          key={el.id}
                          onClick={() => setSelectedElement(el)}
                          className={`text-sm p-1 rounded flex justify-between items-center ${el.isLocked ? "text-gray-400" : "text-gray-700 hover:bg-gray-100 cursor-pointer"}`}
                        >
                          <span>
                            {el.type.charAt(0).toUpperCase() + el.type.slice(1)}{" "}
                            {el.content ? `(${el.content.slice(0, 10)}${el.content.length > 10 ? "..." : ""})` : ""}
                          </span>
                          {!el.isLocked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteElement(page.id, el.id);
                              }}
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTrash size={12} />
                            </button>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => addPage(`Page ${pages.length + 1}`)}
            className="mt-4 w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white p-2 rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center justify-center gap-2 shadow-md"
          >
            <FaPlus /> Add Page
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold mb-4 text-gray-800">Components</h2>
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-2">
            {filteredComponents.map((comp) => (
              <div
                key={comp.type}
                draggable
                onDragStart={(e) => handleDragStart(e, comp.type)}
                className="p-2 bg-white rounded-lg shadow-md cursor-grab hover:bg-gray-50 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span className="text-lg">{comp.icon}</span>
                <span>{comp.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}