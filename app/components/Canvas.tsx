/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useBuilderStore, Element } from "@/app/lib/store";

export function Canvas({ isPanning }: { isPanning: boolean }) {
  const {
    pages,
    currentPageId,
    selectedElement,
    setSelectedElement,
    updateElement,
    deleteElement,
    duplicateElement,
    moveElementToLayer,
    groupElements,
    ungroupElements,
    zoom,
    showGrid,
    gridSize,
    columnCount,
  } = useBuilderStore();
  const currentPage = pages.find((p) => p.id === currentPageId) || {
    id: "default",
    title: "Default",
    elements: [],
    backgroundColor: "#ffffff",
  };
  const [guides, setGuides] = useState<
    { id: string; x?: number; y?: number; distance?: number; from?: number; to?: number; type?: string }[]
  >([]);
  const [resizing, setResizing] = useState<{ id: number; edge: "right" | "bottom" | "bottom-right" } | null>(null);
  const [dragging, setDragging] = useState<{ id: number; startX: number; startY: number; lastX: number; lastY: number } | null>(null);
  const [panning, setPanning] = useState<{ startX: number; startY: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; element: Element } | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [frameHeight, setFrameHeight] = useState(800);
  const [layoutMode, setLayoutMode] = useState<"grid" | "columns">("grid");
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const FRAME_WIDTH = 1200;
  const MIN_GRID_SIZE = 2; // Finer grid for small components

  const snapToGrid = (value: number, useFineGrid: boolean = false) =>
    Math.round(value / (useFineGrid ? MIN_GRID_SIZE : gridSize)) * (useFineGrid ? MIN_GRID_SIZE : gridSize);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentPageId) return;

    const id = Number(e.dataTransfer.getData("id"));
    const type = e.dataTransfer.getData("type");
    const rect = frameRef.current!.getBoundingClientRect();
    const offsetX = snapToGrid((e.clientX - rect.left) / zoom, type === "text");
    const offsetY = snapToGrid((e.clientY - rect.top) / zoom, type === "text");

    if (id) {
      updateElement(currentPageId, id, { x: offsetX, y: offsetY });
    } else if (type) {
      const newElement: Element = {
        id: Date.now(),
        type: type as Element["type"],
        x: offsetX,
        y: offsetY,
        width: snapToGrid(type === "button" ? 140 : type === "text" ? 120 : type === "nav" ? 400 : type === "image" ? 250 : type === "container" ? 300 : type === "bottomSheet" ? 350 : type === "radio" ? 24 : type === "link" ? 120 : type === "form" ? 300 : type === "input" ? 200 : 200, type === "text"),
        height: snapToGrid(type === "button" ? 48 : type === "text" ? 28 : type === "nav" ? 60 : type === "image" ? 250 : type === "container" ? 300 : type === "bottomSheet" ? 120 : type === "radio" ? 24 : type === "link" ? 28 : type === "form" ? 400 : type === "input" ? 40 : 150, type === "text"),
        content: "",
        style: {
          backgroundColor: type === "button" ? "#3b82f6" : type === "form" ? "#f9fafb" : undefined,
          borderRadius: "4px",
          color: "#000000",
          fontSize: "16px",
        },
      };
      updateElement(currentPageId, newElement.id, newElement);
      setSelectedElement(newElement);
      setSelectedIds([newElement.id]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = snapToGrid((e.clientX - rect.left) / zoom);
    const y = snapToGrid((e.clientY - rect.top) / zoom);
    updateGuides(x, y);
  };

  const updateGuides = (x: number, y: number) => {
    const newGuides: { id: string; x?: number; y?: number; distance?: number; from?: number; to?: number; type?: string }[] = [];
    const frameCenterX = FRAME_WIDTH / 2;
    const frameCenterY = frameHeight / 2;

    // Frame center guides
    if (Math.abs(x - frameCenterX) < 8) newGuides.push({ id: "center-x", x: frameCenterX, type: "center-x" });
    if (Math.abs(y - frameCenterY) < 8) newGuides.push({ id: "center-y", y: frameCenterY, type: "center-y" });

    // Element guides with spacing
    const elements = currentPage.elements.filter((el) => !selectedIds.includes(el.id));
    elements.forEach((el, index) => {
      const bounds = {
        left: el.x,
        right: el.x + el.width,
        top: el.y,
        bottom: el.y + el.height,
        centerX: el.x + el.width / 2,
        centerY: el.y + el.height / 2,
      };

      // Edge and center alignment
      [
        { pos: bounds.left, type: "x" },
        { pos: bounds.right, type: "x" },
        { pos: bounds.top, type: "y" },
        { pos: bounds.bottom, type: "y" },
        { pos: bounds.centerX, type: "x", center: true },
        { pos: bounds.centerY, type: "y", center: true },
      ].forEach(({ pos, type, center }, i) => {
        const diff = type === "x" ? Math.abs(pos - x) : Math.abs(pos - y);
        if (diff < 8) {
          newGuides.push({
            id: `${el.id}-${type}-${i}`,
            [type]: pos,
            distance: diff < 2 ? Math.abs(pos - (type === "x" ? x : y)) : undefined,
            type: center ? `center-${type}` : undefined,
          });
        }
      });

      // Spacing guides (horizontal)
      if (x > bounds.right && x < FRAME_WIDTH) {
        const distance = x - bounds.right;
        if (distance < 50) {
          newGuides.push({ id: `${el.id}-spacing-x-right`, x: bounds.right, to: x, distance, type: "spacing-x" });
        }
      }
      if (x < bounds.left && x > 0) {
        const distance = bounds.left - x;
        if (distance < 50) {
          newGuides.push({ id: `${el.id}-spacing-x-left`, x: x, to: bounds.left, distance, type: "spacing-x" });
        }
      }

      // Spacing guides (vertical)
      if (y > bounds.bottom && y < frameHeight) {
        const distance = y - bounds.bottom;
        if (distance < 50) {
          newGuides.push({ id: `${el.id}-spacing-y-bottom`, y: bounds.bottom, to: y, distance, type: "spacing-y" });
        }
      }
      if (y < bounds.top && y > 0) {
        const distance = bounds.top - y;
        if (distance < 50) {
          newGuides.push({ id: `${el.id}-spacing-y-top`, y: y, to: bounds.top, distance, type: "spacing-y" });
        }
      }
    });

    setGuides(newGuides);
  };

  const handleMouseDown = (e: React.MouseEvent, el?: Element, edge?: "right" | "bottom" | "bottom-right") => {
    e.preventDefault();
    e.stopPropagation();

    if (isPanning && !el) {
      setPanning({ startX: e.clientX, startY: e.clientY });
      return;
    }
    if (!el || el.isLocked) return;

    if (e.shiftKey) {
      const newSelectedIds = selectedIds.includes(el.id) ? selectedIds.filter((id) => id !== el.id) : [...selectedIds, el.id];
      setSelectedIds(newSelectedIds);
      setSelectedElement(el);
    } else if (!selectedIds.includes(el.id)) {
      setSelectedIds([el.id]);
      setSelectedElement(el);
    }

    if (edge && ["container", "button", "rectangle", "image", "form"].includes(el.type)) {
      setResizing({ id: el.id, edge });
    } else {
      setDragging({ id: el.id, startX: e.clientX, startY: e.clientY, lastX: el.x, lastY: el.y });
    }
  };

  const handleFrameResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startHeight = frameHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newHeight = snapToGrid(startHeight + (moveEvent.clientY - startY));
      setFrameHeight(Math.max(200, newHeight));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!currentPageId) return;

      if (panning && isPanning) {
        if (canvasRef.current) {
          const dx = e.clientX - panning.startX;
          const dy = e.clientY - panning.startY;
          canvasRef.current.scrollLeft -= dx;
          canvasRef.current.scrollTop -= dy;
          setPanning({ startX: e.clientX, startY: e.clientY });
        }
        return;
      }

      if (!resizing && !dragging) return;
      const rect = frameRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      const el = currentPage.elements.find((e) => e.id === (resizing?.id || dragging?.id))!;
      const useFineGrid = el.type === "text"; // Use finer grid for text

      if (resizing) {
        if (resizing.edge === "right") {
          updateElement(currentPageId, el.id, { width: Math.max(20, snapToGrid(x - el.x, useFineGrid)) });
        } else if (resizing.edge === "bottom") {
          updateElement(currentPageId, el.id, { height: Math.max(20, snapToGrid(y - el.y, useFineGrid)) });
        } else if (resizing.edge === "bottom-right") {
          updateElement(currentPageId, el.id, {
            width: Math.max(20, snapToGrid(x - el.x, useFineGrid)),
            height: Math.max(20, snapToGrid(y - el.y, useFineGrid)),
          });
        }
      } else if (dragging) {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        const moveElement = () => {
          const newX = snapToGrid(x - (dragging.startX - rect.left) / zoom, useFineGrid);
          const newY = snapToGrid(y - (dragging.startY - rect.top) / zoom, useFineGrid);
          const dx = newX - dragging.lastX;
          const dy = newY - dragging.lastY;

          selectedIds.forEach((id) => {
            const element = currentPage.elements.find((e) => e.id === id)!;
            updateElement(currentPageId, id, {
              x: element.x + dx,
              y: element.y + dy,
            });
          });

          setDragging((prev) => (prev ? { ...prev, lastX: newX, lastY: newY } : null));
          updateGuides(newX, newY);
        };

        animationFrameRef.current = requestAnimationFrame(moveElement);
      }
    },
    [currentPageId, resizing, dragging, panning, isPanning, currentPage.elements, updateElement, selectedIds, zoom, frameHeight]
  );

  const handleMouseUp = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setResizing(null);
    setDragging(null);
    setPanning(null);
    setGuides([]);
  };

  const handleContextMenu = (e: React.MouseEvent, el: Element) => {
    e.preventDefault();
    if (el.isLocked) return;
    setContextMenu({ x: e.clientX, y: e.clientY, element: el });
  };

  const closeContextMenu = () => setContextMenu(null);

  const toggleLayoutMode = () => {
    setLayoutMode((prev) => (prev === "grid" ? "columns" : "grid"));
  };

  const renderElement = (el: Element) => {
    const isSelected = selectedIds.includes(el.id);
    const style = {
      position: "absolute" as const,
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      zIndex: el.style?.zIndex ?? 0,
      border: isSelected ? "2px solid #3b82f6" : "1px dashed #d1d5db",
      transition: "all 0.1s ease",
      opacity: el.isLocked ? 0.6 : 1,
      ...(el.style || {}),
    };

    const isEditable = ["text", "button", "nav", "bottomSheet", "link", "input"].includes(el.type) && selectedElement?.id === el.id && !el.isLocked;

    return (
      <div
        key={el.id}
        style={style}
        draggable={!isEditable && !el.isLocked && !isPanning}
        onDragStart={(e) => {
          e.dataTransfer.setData("id", el.id.toString());
        }}
        onMouseDown={(e) => handleMouseDown(e, el)}
        onDoubleClick={() => !el.isLocked && isEditable && setSelectedElement(el)}
        onContextMenu={(e) => handleContextMenu(e, el)}
        className={`relative group ${el.isLocked ? "cursor-not-allowed" : "cursor-move"}`}
      >
        {isEditable ? (
          <input
            type="text"
            value={el.content || ""}
            onChange={(e) => updateElement(currentPageId!, el.id, { content: e.target.value })}
            onBlur={() => setSelectedElement(null)}
            onKeyPress={(e) => e.key === "Enter" && setSelectedElement(null)}
            className="w-full h-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 text-black"
            style={{ fontSize: el.style?.fontSize || "16px", color: el.style?.color || "#000" }}
            autoFocus
          />
        ) : (
          <>
            {el.type === "text" && (
              <span style={{ fontSize: el.style?.fontSize || "16px", color: el.style?.color || "#000" }}>
                {el.content || "Text"}
              </span>
            )}
            {el.type === "button" && (
              <button
                className="w-full h-full text-white rounded"
                style={{ backgroundColor: el.style?.backgroundColor || "#3b82f6", color: el.style?.color || "#fff" }}
              >
                {el.content || "Button"}
              </button>
            )}
            {el.type === "rectangle" && <div className="w-full h-full" style={{ backgroundColor: el.style?.backgroundColor || "#e5e7eb" }} />}
            {el.type === "nav" && (
              <nav
                className="w-full h-full bg-gray-800 text-white flex items-center justify-around rounded"
                style={{ background: el.style?.background || undefined }}
              >
                {(el.content || "Home,About,Contact").split(",").map((item, i) => (
                  <span key={i} className="px-3 py-1 hover:bg-gray-700 rounded" style={{ color: el.style?.color || "#fff" }}>
                    {item}
                  </span>
                ))}
              </nav>
            )}
            {el.type === "image" && (
              <img src={el.content || "https://via.placeholder.com/250"} alt="Image" className="w-full h-full object-cover rounded" />
            )}
            {el.type === "container" && <div className="w-full h-full bg-gray-50 border-dashed border-gray-300 rounded" />}
            {el.type === "bottomSheet" && (
              <div
                className="w-full h-full bg-white shadow-xl rounded-t-lg border-t-4 border-blue-500"
                style={{ color: el.style?.color || "#000" }}
              >
                {el.content || "Bottom Sheet"}
              </div>
            )}
            {el.type === "radio" && <input type="radio" className="w-full h-full" checked={el.content === "checked"} />}
            {el.type === "link" && (
              <a
                href={el.content || "#"}
                className="w-full h-full underline hover:text-blue-700"
                style={{ color: el.style?.color || "#3b82f6" }}
              >
                {el.content || "Link"}
              </a>
            )}
            {el.type === "form" && (
              <div className="w-full h-full bg-gray-50 border rounded p-2" style={{ backgroundColor: el.style?.backgroundColor || "#f9fafb" }}>
                {el.content || "Form Container"}
              </div>
            )}
            {el.type === "input" && (
              <input
                type="text"
                placeholder={el.content || "Input"}
                className="w-full h-full p-2 border rounded"
                style={{ fontSize: el.style?.fontSize || "16px", color: el.style?.color || "#000" }}
                readOnly
              />
            )}
            {["container", "button", "rectangle", "image", "form"].includes(el.type) && !el.isLocked && (
              <div className="absolute inset-0 pointer-events-none group-hover:pointer-events-auto">
                <div
                  className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize bg-transparent hover:bg-blue-300 opacity-0 group-hover:opacity-100"
                  onMouseDown={(e) => handleMouseDown(e, el, "right")}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize bg-transparent hover:bg-blue-300 opacity-0 group-hover:opacity-100"
                  onMouseDown={(e) => handleMouseDown(e, el, "bottom")}
                />
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-blue-500 rounded-full opacity-0 group-hover:opacity-100"
                  onMouseDown={(e) => handleMouseDown(e, el, "bottom-right")}
                />
              </div>
            )}
            {el.isLocked && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 opacity-75 pointer-events-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11V7m0 10h.01M16 12h-8" />
                </svg>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-gray-200 p-8 overflow-auto"
      style={{ minHeight: "200vh" }}
    >
      {!currentPageId ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">Select or create a page to start</div>
      ) : (
        <div className="relative flex flex-col items-center">
          <div className="sticky top-2 left-8 bg-gray-800 text-white px-2 py-1 rounded z-50">{currentPage.title}</div>
          <div
            ref={frameRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={(e) => handleMouseDown(e)}
            onClick={(e) => {
              if (e.target === frameRef.current) {
                setSelectedIds([]);
                setSelectedElement(null);
              }
              closeContextMenu();
            }}
            className={`relative bg-white shadow-lg rounded-lg overflow-hidden mt-6 ${isPanning ? "cursor-grab" : ""}`}
            style={{
              width: `${FRAME_WIDTH}px`,
              height: `${frameHeight}px`,
              backgroundColor: currentPage.backgroundColor,
              backgroundImage: currentPage.backgroundImage ? `url(${currentPage.backgroundImage})` : undefined,
              backgroundSize: "cover",
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              marginBottom: "20px",
            }}
          >
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={
                  layoutMode === "grid"
                    ? {
                        backgroundImage: `
                          linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: `${gridSize}px ${gridSize}px`,
                      }
                    : {
                        backgroundImage: `
                          linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: `${FRAME_WIDTH / columnCount}px 100%`,
                      }
                }
              />
            )}
            {guides.map((guide) => (
              <div
                key={guide.id}
                className={`absolute ${guide.type?.includes("center") ? "bg-blue-500" : guide.type?.includes("spacing") ? "bg-purple-500" : "bg-red-500"} opacity-70`}
                style={{
                  left: guide.x !== undefined ? Math.min(guide.x, guide.to || guide.x) : 0,
                  top: guide.y !== undefined ? Math.min(guide.y, guide.to || guide.y) : 0,
                  width: guide.x !== undefined ? (guide.to ? Math.abs(guide.to - guide.x) : "1px") : "100%",
                  height: guide.y !== undefined ? (guide.to ? Math.abs(guide.to - guide.y) : "1px") : "100%",
                  zIndex: 9999,
                }}
              >
                {guide.distance !== undefined && (
                  <span
                    className="absolute text-xs bg-white px-1 rounded"
                    style={{
                      left: guide.x !== undefined ? (guide.to ? (guide.to > guide.x ? "100%" : "-100%") : "100%") : "50%",
                      top: guide.y !== undefined ? (guide.to ? (guide.to > guide.y ? "100%" : "-100%") : "100%") : "50%",
                      transform: guide.x !== undefined ? "translate(4px, -50%)" : "translate(-50%, 4px)",
                      color: guide.type?.includes("center") ? "#3b82f6" : guide.type?.includes("spacing") ? "#9333ea" : "#ef4444",
                    }}
                  >
                    {Math.round(guide.distance)}px
                  </span>
                )}
              </div>
            ))}
            {currentPage.elements.map((el) => renderElement(el))}
            <div
              className="absolute bottom-0 left-0 right-0 h-3 bg-transparent cursor-ns-resize hover:bg-blue-300"
              onMouseDown={handleFrameResize}
            />
            {contextMenu && (
              <div
                className="absolute bg-white shadow-lg rounded-md p-2 z-50"
                style={{ left: contextMenu.x, top: contextMenu.y }}
              >
                <button
                  onClick={() => {
                    duplicateElement(currentPageId!, contextMenu.element.id);
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    deleteElement(currentPageId!, contextMenu.element.id);
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    moveElementToLayer(currentPageId!, contextMenu.element.id, "top");
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                >
                  Bring to Front
                </button>
                <button
                  onClick={() => {
                    moveElementToLayer(currentPageId!, contextMenu.element.id, "bottom");
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                >
                  Send to Back
                </button>
                <button
                  onClick={() => {
                    updateElement(currentPageId!, contextMenu.element.id, { isLocked: !contextMenu.element.isLocked });
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                >
                  {contextMenu.element.isLocked ? "Unlock" : "Lock"}
                </button>
                {selectedIds.length > 1 && (
                  <button
                    onClick={() => {
                      groupElements(currentPageId!, selectedIds);
                      setSelectedIds([]);
                      closeContextMenu();
                    }}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                  >
                    Group
                  </button>
                )}
                {contextMenu.element.type === "container" && (
                  <button
                    onClick={() => {
                      ungroupElements(currentPageId!, contextMenu.element.id);
                      setSelectedIds([]);
                      closeContextMenu();
                    }}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                  >
                    Ungroup
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={toggleLayoutMode}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Toggle to {layoutMode === "grid" ? "Columns" : "Grid"}
          </button>
        </div>
      )}
    </div>
  );
}