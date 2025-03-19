"use client";
import { useBuilderStore } from "@/app/lib/store";
import { FaPlus } from "react-icons/fa";

export function PagesPanel() {
  const { pages, currentPageId, setCurrentPageId, addPage } = useBuilderStore();

  return (
    <div className="w-64 bg-gray-200 p-4 shrink-0 overflow-auto">
      <h2 className="text-lg font-bold mb-4">Pages</h2>
      {pages.length === 0 ? (
        <p className="text-sm text-gray-500">No pages yet. Add one to start.</p>
      ) : (
        <ul className="space-y-4">
          {pages.map((page) => (
            <li key={page.id}>
              <button
                onClick={() => setCurrentPageId(page.id)}
                className={`w-full text-left p-2 rounded ${currentPageId === page.id ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}
              >
                {page.title}
              </button>
              <ul className="ml-4 mt-2 space-y-1">
                {page.elements.length === 0 ? (
                  <li className="text-sm text-gray-500">No components</li>
                ) : (
                  page.elements.map((el) => (
                    <li key={el.id} className="text-sm text-gray-700">
                      {el.type.charAt(0).toUpperCase() + el.type.slice(1)} {el.content ? `(${el.content.slice(0, 10)}${el.content.length > 10 ? "..." : ""})` : ""}
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
        className="mt-4 w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 flex items-center justify-center gap-2"
      >
        <FaPlus /> Add Page
      </button>
    </div>
  );
}