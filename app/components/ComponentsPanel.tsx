/* eslint-disable @next/next/no-img-element */
"use client";
import { useBuilderStore, Element } from "@/app/lib/store";

export function Canvas() {
  const { pages, currentPageId, setSelectedElement, updateElement } = useBuilderStore();
  const currentPage = pages.find((p) => p.id === currentPageId) || { id: "default", title: "Default", elements: [], backgroundColor: "#ffffff" };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!currentPageId) return;

    const id = Number(e.dataTransfer.getData("id"));
    const type = e.dataTransfer.getData("type");
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const snappedX = Math.round(offsetX / 20) * 20;
    const snappedY = Math.round(offsetY / 20) * 20;

    if (id) {
      updateElement(currentPageId, id, { x: snappedX, y: snappedY });
    } else if (type) {
      const newElement: Element = {
        id: Date.now(),
        type: type as Element["type"],
        x: snappedX,
        y: snappedY,
        width: type === "button" ? 120 : type === "text" ? 100 : type === "nav" ? 300 : type === "image" ? 200 : type === "container" ? 200 : type === "bottomSheet" ? 300 : type === "radio" ? 20 : type === "link" ? 100 : 150,
        height: type === "button" ? 40 : type === "text" ? 20 : type === "nav" ? 50 : type === "image" ? 200 : type === "container" ? 200 : type === "bottomSheet" ? 100 : type === "radio" ? 20 : type === "link" ? 20 : 100,
      };
      updateElement(currentPageId, newElement.id, newElement);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentPageId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const element = currentPage.elements.find((el) => x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height);
    if (element) setSelectedElement(element);
  };

  const renderElement = (el: Element) => {
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
        return <span draggable onDragStart={handleDragStart} style={style} onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}>{el.content || "Text"}</span>;
      case "button":
        return <button draggable onDragStart={handleDragStart} style={style} className="bg-blue-500 text-white rounded" onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}>{el.content || "Button"}</button>;
      case "rectangle":
        return <div draggable onDragStart={handleDragStart} style={{ ...style, backgroundColor: el.style?.backgroundColor || "gray" }} onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }} />;
      case "nav":
        return (
          <nav draggable onDragStart={handleDragStart} style={{ ...style, backgroundColor: el.style?.backgroundColor || "#333", color: "white" }} className="flex items-center justify-around" onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}>
            {(el.content || "Home,About,Contact").split(",").map((item, i) => <span key={i} className="px-2">{item}</span>)}
          </nav>
        );
      case "image":
        return <img draggable onDragStart={handleDragStart} src={el.content || "https://via.placeholder.com/200"} alt="Image" style={style} onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }} />;
      case "container":
        return <div draggable onDragStart={handleDragStart} style={{ ...style, backgroundColor: el.style?.backgroundColor || "#f0f0f0", border: "1px dashed gray" }} onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }} />;
      case "bottomSheet":
        return <div draggable onDragStart={handleDragStart} style={{ ...style, backgroundColor: el.style?.backgroundColor || "#fff", boxShadow: "0 -2px 10px rgba(0,0,0,0.2)" }} onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}>{el.content || "Bottom Sheet"}</div>;
      case "radio":
        return <input type="radio" draggable onDragStart={handleDragStart} style={style} onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }} />;
      case "link":
        return <a draggable onDragStart={handleDragStart} href={el.content || "#"} style={style} className="text-blue-500 underline" onClick={(e) => { e.stopPropagation(); setSelectedElement(el); handleAction(); }}>{el.content || "Link"}</a>;
      default:
        return null;
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDoubleClick={handleDoubleClick}
      className="flex-1 relative overflow-auto"
      style={{ minHeight: "2000px", minWidth: "2000px", backgroundColor: currentPage.backgroundColor || "#ffffff" }}
    >
      {!currentPageId ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">Please select or create a page to start editing</div>
      ) : (
        currentPage.elements.map((el) => <div key={el.id}>{renderElement(el)}</div>)
      )}
    </div>
  );
}