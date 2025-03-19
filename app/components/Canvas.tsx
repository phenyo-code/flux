/* eslint-disable @next/next/no-img-element */
"use client";
import { useBuilderStore } from "@/app/lib/store";

export function Canvas() {
  const { pages, currentPageId, setSelectedElement, updateElement } = useBuilderStore();
  const currentPage = pages.find((p) => p.id === currentPageId) || { id: "default", title: "Default", elements: [] };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!currentPageId) return; // Prevent drop if no page selected

    const id = Number(e.dataTransfer.getData("id"));
    const type = e.dataTransfer.getData("type");
    const offsetX = e.clientX - 200; // Adjust for sidebar
    const offsetY = e.clientY - 100; // Adjust for toolbar

    console.log("Dropped:", { id, type, offsetX, offsetY });

    if (id) {
      updateElement(currentPageId, id, { x: offsetX, y: offsetY });
    } else if (type) {
      const newElement = {
        id: Date.now(),
        type: type as "text" | "button" | "rectangle" | "nav" | "image",
        x: offsetX,
        y: offsetY,
        width: type === "button" ? 120 : type === "text" ? 100 : type === "nav" ? 300 : type === "image" ? 200 : 150,
        height: type === "button" ? 40 : type === "text" ? 20 : type === "nav" ? 50 : type === "image" ? 200 : 100,
      };
      updateElement(currentPageId, newElement.id, newElement);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const renderElement = (el: typeof pages[0]["elements"][0]) => {
    const style = {
      position: "absolute" as const,
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      ...(el.style || {}),
    };

    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData("id", el.id.toString());
      console.log("Dragging existing element:", el.id);
    };

    const handleAction = () => {
      el.actions?.forEach((action) => {
        if (action.event === "click") {
          if (action.action === "alert") alert(action.value || "Clicked!");
          if (action.action === "navigate") window.location.href = action.value || "#";
        }
      });
    };

    switch (el.type) {
      case "text":
        return (
          <span
            draggable
            onDragStart={handleDragStart}
            style={style}
            onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}
          >
            {el.content || "Text"}
          </span>
        );
      case "button":
        return (
          <button
            draggable
            onDragStart={handleDragStart}
            style={style}
            className="bg-blue-500 text-white rounded"
            onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}
          >
            {el.content || "Button"}
          </button>
        );
      case "rectangle":
        return (
          <div
            draggable
            onDragStart={handleDragStart}
            style={{ ...style, backgroundColor: el.style?.backgroundColor || "gray" }}
            onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}
          />
        );
      case "nav":
        return (
          <nav
            draggable
            onDragStart={handleDragStart}
            style={{ ...style, backgroundColor: el.style?.backgroundColor || "#333", color: "white" }}
            className="flex items-center justify-around"
            onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}
          >
            {(el.content || "Home,About,Contact").split(",").map((item, i) => (
              <span key={i} className="px-2">{item}</span>
            ))}
          </nav>
        );
      case "image":
        return (
          <img
            draggable
            onDragStart={handleDragStart}
            src={el.content || "https://via.placeholder.com/200"}
            alt="Image"
            style={style}
            onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex-1 bg-gray-100 relative h-[calc(100vh-4rem)] overflow-auto"
      style={{ backgroundImage: "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(to right, #ccc 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      onClick={() => setSelectedElement(null)}
    >
      {!currentPageId ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Please select or create a page to start editing
        </div>
      ) : (
        currentPage.elements.map((el) => (
          <div key={el.id}>{renderElement(el)}</div>
        ))
      )}
    </div>
  );
}