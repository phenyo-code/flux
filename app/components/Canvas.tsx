/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useBuilderStore, Element } from "@/app/lib/store";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";

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
    setFrameHeight,
    layoutMode,
    previewMode,
  } = useBuilderStore();
  const currentPage = pages.find((p) => p.id === currentPageId) || {
    id: "default",
    title: "Default",
    elements: [],
    backgroundColor: "#ffffff",
    frameHeight: 800,
  };
  const [guides, setGuides] = useState<
    { id: string; x?: number; y?: number; distance?: number; from?: number; to?: number; type: string }[]
  >([]);
  const [resizing, setResizing] = useState<{ id: number; edge: "right" | "bottom" | "bottom-right" } | null>(null);
  const [dragging, setDragging] = useState<{
    ids: number[];
    offsetX: number;
    offsetY: number;
    lastX: number;
    lastY: number;
  } | null>(null);
  const [panning, setPanning] = useState<{ startX: number; startY: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; element: Element } | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const FRAME_WIDTH = 1200;
  const MIN_GRID_SIZE = 2;
  const INFINITE_HEIGHT = 10000;

  const Icons = { ...FaIcons, ...MdIcons, ...IoIcons, ...Io5Icons };

  const snapToGrid = (value: number, useFineGrid: boolean = false) =>
    Math.round(value / (useFineGrid ? MIN_GRID_SIZE : gridSize)) * (useFineGrid ? MIN_GRID_SIZE : gridSize);

  const clampToFrame = (x: number, y: number, width: number, height: number) => {
    const frameHeight = currentPage.frameHeight ?? 800;
    return {
      x: Math.max(0, Math.min(x, FRAME_WIDTH - width)),
      y: Math.max(0, Math.min(y, frameHeight - height)),
    };
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentPageId || previewMode) return;

    const type = e.dataTransfer.getData("type");
    const rect = frameRef.current!.getBoundingClientRect();
    const offsetX = snapToGrid((e.clientX - rect.left) / zoom);
    const offsetY = snapToGrid((e.clientY - rect.top) / zoom);

    if (type && type !== "pageFrame") {
      const newElement: Element = {
        id: Date.now(),
        type: type as Element["type"],
        x: offsetX,
        y: offsetY,
        width: snapToGrid(
          type === "button"
            ? 140
            : type === "text"
            ? 200
            : type === "nav"
            ? 400
            : type === "accordion"
            ? 300
            : type === "modal"
            ? 400
            : type === "tabs"
            ? 350
            : type === "video"
            ? 320
            : type === "divider"
            ? 200
            : type === "progress"
            ? 200
            : type === "icon"
            ? 40
            : type === "table"
            ? 400
            : type === "social"
            ? 200
            : type === "map"
            ? 400
            : 200
        ),
        height: snapToGrid(
          type === "button"
            ? 48
            : type === "text"
            ? 28
            : type === "nav"
            ? 60
            : type === "accordion"
            ? 150
            : type === "modal"
            ? 300
            : type === "tabs"
            ? 200
            : type === "video"
            ? 180
            : type === "divider"
            ? 2
            : type === "progress"
            ? 20
            : type === "icon"
            ? 40
            : type === "table"
            ? 200
            : type === "social"
            ? 50
            : type === "map"
            ? 300
            : 150
        ),
        content: type === "icon" ? "FaStar" : type === "button" ? "Click Me" : type === "text" ? "Sample Text" : "",
        style: {
          backgroundColor:
            type === "button"
              ? "#3b82f6"
              : type === "form"
              ? "#f9fafb"
              : type === "modal"
              ? "#ffffff"
              : type === "divider"
              ? "#d1d5db"
              : type === "progress"
              ? "#e5e7eb"
              : type === "table"
              ? "#ffffff"
              : type === "nav"
              ? "#1f2937"
              : undefined,
          borderRadius: type === "button" || type === "modal" || type === "tabs" ? "6px" : undefined,
          color: type === "icon" ? "#1f2937" : type === "button" || type === "nav" ? "#ffffff" : "#1f2937",
          fontSize: type === "icon" ? "24px" : "16px",
          fontFamily: "Inter, sans-serif",
          border:
            type === "modal" || type === "table"
              ? "1px solid #e5e7eb"
              : type === "input"
              ? "1px solid #d1d5db"
              : undefined,
        },
      };
      const clamped = clampToFrame(newElement.x, newElement.y, newElement.width, newElement.height);
      updateElement(currentPageId, newElement.id, { ...newElement, ...clamped });
      setSelectedElement(newElement);
      setSelectedIds([newElement.id]);
    }
  };

  const updateGuides = (x: number, y: number, width: number, height: number, draggedIds: number[] = []) => {
    const newGuides: { id: string; x?: number; y?: number; distance?: number; from?: number; to?: number; type: string }[] = [];
    const frameCenterX = FRAME_WIDTH / 2;
    const frameCenterY = (currentPage.frameHeight ?? 800) / 2;
    const frameHeight = currentPage.frameHeight ?? 800;

    const snapThreshold = 8;
    const checkPoints = {
      left: x,
      right: x + width,
      top: y,
      bottom: y + height,
      centerX: x + width / 2,
      centerY: y + height / 2,
    };

    // Frame Alignment Guides
    if (Math.abs(checkPoints.centerX - frameCenterX) < snapThreshold)
      newGuides.push({ id: "center-x", x: frameCenterX, type: "center-x" });
    if (Math.abs(checkPoints.centerY - frameCenterY) < snapThreshold)
      newGuides.push({ id: "center-y", y: frameCenterY, type: "center-y" });
    if (Math.abs(checkPoints.left) < snapThreshold) newGuides.push({ id: "left-edge", x: 0, type: "edge-x" });
    if (Math.abs(checkPoints.right - FRAME_WIDTH) < snapThreshold)
      newGuides.push({ id: "right-edge", x: FRAME_WIDTH, type: "edge-x" });
    if (Math.abs(checkPoints.top) < snapThreshold) newGuides.push({ id: "top-edge", y: 0, type: "edge-y" });
    if (Math.abs(checkPoints.bottom - frameHeight) < snapThreshold)
      newGuides.push({ id: "bottom-edge", y: frameHeight, type: "edge-y" });

    // Element Alignment and Spacing Guides
    const elements = currentPage.elements.filter((el) => !draggedIds.includes(el.id));
    const spacingThreshold = 4;

    elements.forEach((el) => {
      const bounds = {
        left: el.x,
        right: el.x + el.width,
        top: el.y,
        bottom: el.y + el.height,
        centerX: el.x + el.width / 2,
        centerY: el.y + el.height / 2,
      };

      // Alignment Guides
      ["left", "right", "centerX"].forEach((key) => {
        const pos = bounds[key as keyof typeof bounds];
        const checkPos = checkPoints[key as keyof typeof checkPoints];
        if (Math.abs(pos - checkPos) < snapThreshold) {
          newGuides.push({ id: `${el.id}-${key}`, x: pos, type: `align-x-${key}` });
        }
      });
      ["top", "bottom", "centerY"].forEach((key) => {
        const pos = bounds[key as keyof typeof bounds];
        const checkPos = checkPoints[key as keyof typeof checkPoints];
        if (Math.abs(pos - checkPos) < snapThreshold) {
          newGuides.push({ id: `${el.id}-${key}`, y: pos, type: `align-y-${key}` });
        }
      });

      // Spacing Guides (Outside Elements)
      if (x > bounds.right && x < FRAME_WIDTH) {
        const distance = x - bounds.right;
        if (distance < 100) {
          newGuides.push({ id: `${el.id}-spacing-x-right`, x: bounds.right, to: x, distance, type: "spacing-x" });
        }
      }
      if (bounds.left > checkPoints.right && bounds.left < FRAME_WIDTH) {
        const distance = bounds.left - checkPoints.right;
        if (distance < 100) {
          newGuides.push({ id: `${el.id}-spacing-x-left`, x: checkPoints.right, to: bounds.left, distance, type: "spacing-x" });
        }
      }
      if (y > bounds.bottom && y < frameHeight) {
        const distance = y - bounds.bottom;
        if (distance < 100) {
          newGuides.push({ id: `${el.id}-spacing-y-bottom`, y: bounds.bottom, to: y, distance, type: "spacing-y" });
        }
      }
      if (bounds.top > checkPoints.bottom && bounds.top < frameHeight) {
        const distance = bounds.top - checkPoints.bottom;
        if (distance < 100) {
          newGuides.push({ id: `${el.id}-spacing-y-top`, y: checkPoints.bottom, to: bounds.top, distance, type: "spacing-y" });
        }
      }

      // Inside Container Spacing (if dragged element is inside a container)
      if (el.type === "container" && checkPoints.left >= bounds.left && checkPoints.right <= bounds.right && checkPoints.top >= bounds.top && checkPoints.bottom <= bounds.bottom) {
        const insideLeft = checkPoints.left - bounds.left;
        const insideRight = bounds.right - checkPoints.right;
        const insideTop = checkPoints.top - bounds.top;
        const insideBottom = bounds.bottom - checkPoints.bottom;

        if (insideLeft < 100) {
          newGuides.push({ id: `${el.id}-inside-left`, x: bounds.left, to: checkPoints.left, distance: insideLeft, type: "spacing-x-inside" });
        }
        if (insideRight < 100) {
          newGuides.push({ id: `${el.id}-inside-right`, x: checkPoints.right, to: bounds.right, distance: insideRight, type: "spacing-x-inside" });
        }
        if (insideTop < 100) {
          newGuides.push({ id: `${el.id}-inside-top`, y: bounds.top, to: checkPoints.top, distance: insideTop, type: "spacing-y-inside" });
        }
        if (insideBottom < 100) {
          newGuides.push({ id: `${el.id}-inside-bottom`, y: checkPoints.bottom, to: bounds.bottom, distance: insideBottom, type: "spacing-y-inside" });
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

    if (previewMode) return;

    if (!el) {
      const rect = frameRef.current!.getBoundingClientRect();
      setSelectionBox({ startX: e.clientX - rect.left, startY: e.clientY - rect.top, endX: e.clientX - rect.left, endY: e.clientY - rect.top });
      setSelectedIds([]);
      setSelectedElement(null);
      return;
    }

    if (el.isLocked) return;

    if (e.shiftKey) {
      const newSelectedIds = selectedIds.includes(el.id) ? selectedIds.filter((id) => id !== el.id) : [...selectedIds, el.id];
      setSelectedIds(newSelectedIds);
      setSelectedElement(el);
    } else if (!selectedIds.includes(el.id)) {
      setSelectedIds([el.id]);
      setSelectedElement(el);
    }

    if (edge) {
      setResizing({ id: el.id, edge });
    } else {
      const rect = frameRef.current!.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / zoom;
      const mouseY = (e.clientY - rect.top) / zoom;
      setDragging({
        ids: selectedIds.length ? selectedIds : [el.id],
        offsetX: mouseX - el.x,
        offsetY: mouseY - el.y,
        lastX: el.x,
        lastY: el.y,
      });
    }
  };

  const handleFrameResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (previewMode) return;
    const startY = e.clientY;
    const startHeight = currentPage.frameHeight ?? 800;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newHeight = snapToGrid(startHeight + (moveEvent.clientY - startY) / zoom);
      setFrameHeight(currentPageId!, Math.max(200, newHeight));
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
      if (!currentPageId || previewMode) return;

      const rect = frameRef.current!.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / zoom;
      const mouseY = (e.clientY - rect.top) / zoom;

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

      if (selectionBox) {
        setSelectionBox((prev) => ({ ...prev!, endX: e.clientX - rect.left, endY: e.clientY - rect.top }));
        const box = {
          left: Math.min(selectionBox.startX, e.clientX - rect.left) / zoom,
          right: Math.max(selectionBox.startX, e.clientX - rect.left) / zoom,
          top: Math.min(selectionBox.startY, e.clientY - rect.top) / zoom,
          bottom: Math.max(selectionBox.startY, e.clientY - rect.top) / zoom,
        };
        const newSelectedIds = currentPage.elements
          .filter((el) => !el.isLocked && el.x < box.right && el.x + el.width > box.left && el.y < box.bottom && el.y + el.height > box.top)
          .map((el) => el.id);
        setSelectedIds(newSelectedIds);
        if (newSelectedIds.length === 1) setSelectedElement(currentPage.elements.find((el) => el.id === newSelectedIds[0]) ?? null);
        return;
      }

      if (!resizing && !dragging) return;

      const el = currentPage.elements.find((e) => e.id === (resizing?.id || dragging?.ids[0]));
      if (!el) {
        setResizing(null);
        setDragging(null);
        return;
      }

      const useFineGrid = ["text", "radio", "icon"].includes(el.type);

      if (resizing) {
        let newWidth = el.width;
        let newHeight = el.height;
        if (resizing.edge === "right") {
          newWidth = Math.max(20, snapToGrid(mouseX - el.x, useFineGrid));
        } else if (resizing.edge === "bottom") {
          newHeight = Math.max(20, snapToGrid(mouseY - el.y, useFineGrid));
        } else if (resizing.edge === "bottom-right") {
          newWidth = Math.max(20, snapToGrid(mouseX - el.x, useFineGrid));
          newHeight = Math.max(20, snapToGrid(mouseY - el.y, useFineGrid));
        }
        const clamped = clampToFrame(el.x, el.y, newWidth, newHeight);
        updateElement(currentPageId, el.id, { width: newWidth, height: newHeight, x: clamped.x, y: clamped.y });
        updateGuides(el.x, el.y, newWidth, newHeight, dragging?.ids || [el.id]);
      } else if (dragging) {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        const moveElement = () => {
          const newX = snapToGrid(mouseX - dragging.offsetX, useFineGrid);
          const newY = snapToGrid(mouseY - dragging.offsetY, useFineGrid);

          const snapThreshold = 8;
          let snappedX = newX;
          let snappedY = newY;
          guides.forEach((guide) => {
            if (guide.x !== undefined && Math.abs(newX - guide.x) < snapThreshold) snappedX = guide.x;
            if (guide.y !== undefined && Math.abs(newY - guide.y) < snapThreshold) snappedY = guide.y;
            if (guide.x !== undefined && Math.abs(newX + el.width - guide.x) < snapThreshold) snappedX = guide.x - el.width;
            if (guide.y !== undefined && Math.abs(newY + el.height - guide.y) < snapThreshold) snappedY = guide.y - el.height;
          });

          const clamped = clampToFrame(snappedX, snappedY, el.width, el.height);
          const dx = clamped.x - dragging.lastX;
          const dy = clamped.y - dragging.lastY;

          dragging.ids.forEach((id) => {
            const element = currentPage.elements.find((e) => e.id === id);
            if (element) {
              const newElementPos = clampToFrame(element.x + dx, element.y + dy, element.width, element.height);
              updateElement(currentPageId, id, { x: newElementPos.x, y: newElementPos.y });
            }
          });

          setDragging((prev) => (prev ? { ...prev, lastX: clamped.x, lastY: clamped.y } : null));
          updateGuides(clamped.x, clamped.y, el.width, el.height, dragging.ids);
        };

        animationFrameRef.current = requestAnimationFrame(moveElement);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPageId, resizing, dragging, panning, isPanning, currentPage.elements, updateElement, selectedIds, zoom, selectionBox, guides, previewMode]
  );

  const handleMouseUp = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setResizing(null);
    setDragging(null);
    setPanning(null);
    setSelectionBox(null);
    setGuides([]);
  };

  const handleContextMenu = (e: React.MouseEvent, el: Element) => {
    e.preventDefault();
    if (el.isLocked || previewMode) return;
    const rect = frameRef.current!.getBoundingClientRect();
    setContextMenu({ x: e.clientX - rect.left, y: e.clientY - rect.top, element: el });
    setSelectedElement(el); // Ensure the clicked element is selected
    setSelectedIds([el.id]); // Ensure only this element is selected for single-click context
  };

  const closeContextMenu = () => setContextMenu(null);

  const distributeElements = (direction: "horizontal" | "vertical") => {
    if (selectedIds.length < 3 || previewMode) return;
    const elements = currentPage.elements.filter((el) => selectedIds.includes(el.id)).sort((a, b) => (direction === "horizontal" ? a.x - b.x : a.y - b.y));
    const min = direction === "horizontal" ? Math.min(...elements.map((el) => el.x)) : Math.min(...elements.map((el) => el.y));
    const max = direction === "horizontal" ? Math.max(...elements.map((el) => el.x + el.width)) : Math.max(...elements.map((el) => el.y + el.height));
    const totalSpace = max - min;
    const step = totalSpace / (elements.length - 1);

    elements.forEach((el, i) => {
      const newPos = snapToGrid(min + i * step);
      const clamped = clampToFrame(direction === "horizontal" ? newPos : el.x, direction === "vertical" ? newPos : el.y, el.width, el.height);
      updateElement(currentPageId!, el.id, { x: clamped.x, y: clamped.y });
    });
  };

  const renderElement = (el: Element) => {
    const isSelected = selectedIds.includes(el.id);
    const isEditable = ["text", "button", "nav", "link", "input", "accordion", "modal", "tabs"].includes(el.type) && selectedElement?.id === el.id && !el.isLocked && !previewMode;
    const isDragging = dragging?.ids.includes(el.id);

    const normalizedStyle = { ...el.style };
    if (normalizedStyle.background && !normalizedStyle.backgroundColor) {
      delete normalizedStyle.backgroundColor;
    } else if (normalizedStyle.backgroundColor) {
      delete normalizedStyle.background;
    }

    const baseStyle = {
      position: "absolute" as const,
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      zIndex: normalizedStyle.zIndex ?? 0,
      border: isSelected && !previewMode ? "2px solid #3b82f6" : (isDragging || isEditable) && !previewMode ? "1px dashed #d1d5db" : normalizedStyle.border || "none",
      opacity: el.isLocked ? 0.6 : normalizedStyle.opacity ?? 1,
      transform: normalizedStyle.transform,
      mixBlendMode: normalizedStyle.mixBlendMode || "normal",
      cursor: normalizedStyle.cursor || (el.isLocked || previewMode ? "default" : "move"),
      boxShadow: normalizedStyle.boxShadow,
    };

    const contentStyle = {
      background: normalizedStyle.background || undefined,
      backgroundColor: normalizedStyle.backgroundColor || undefined,
      borderRadius: normalizedStyle.borderRadius || "0px",
      fontFamily: normalizedStyle.fontFamily || "Inter, sans-serif",
      fontSize: normalizedStyle.fontSize || "16px",
      fontWeight: normalizedStyle.fontWeight || "400",
      color: normalizedStyle.color || "#1f2937",
      textAlign: normalizedStyle.textAlign || "left",
      lineHeight: normalizedStyle.lineHeight || "1.5",
      letterSpacing: normalizedStyle.letterSpacing || "0px",
      fontStyle: normalizedStyle.fontStyle || "normal",
      textDecoration: normalizedStyle.textDecoration || "none",
      whiteSpace: "pre-wrap" as const,
      wordBreak: "normal" as const,
      overflowWrap: "break-word" as const,
    };

    let IconComponent = null;
    if (el.type === "icon" && el.content) {
      IconComponent = Icons[el.content as keyof typeof Icons];
      if (!IconComponent) {
        console.warn(`Icon "${el.content}" not found in imported sets. Ensure it matches a valid react-icons name (e.g., FaStar, MdHome).`);
      }
    }

    return (
      <div
        key={el.id}
        style={baseStyle}
        draggable={!isEditable && !el.isLocked && !isPanning && !previewMode}
        onDragStart={(e) => {
          e.dataTransfer.setData("id", el.id.toString());
        }}
        onMouseDown={(e) => handleMouseDown(e, el)}
        onDoubleClick={() => !el.isLocked && isEditable && setSelectedElement(el)}
        onContextMenu={(e) => handleContextMenu(e, el)}
        className={`relative group`}
      >
        {isEditable ? (
          el.type === "text" ? (
            <textarea
              value={el.content || ""}
              onChange={(e) => updateElement(currentPageId!, el.id, { content: e.target.value })}
              onBlur={() => setSelectedElement(el)} // Keep selection on blur
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSelectedElement(null);
                  e.preventDefault();
                }
              }}
              className="w-full h-full px-2 py-1 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              style={{ ...contentStyle, overflow: "auto" }}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={el.content || ""}
              onChange={(e) => updateElement(currentPageId!, el.id, { content: e.target.value })}
              onBlur={() => setSelectedElement(el)} // Keep selection on blur
              onKeyPress={(e) => e.key === "Enter" && setSelectedElement(el)}
              className="w-full h-full px-2 py-1 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              style={contentStyle}
              autoFocus
            />
          )
        ) : (
          <>
            {el.type === "text" && (
              <div className="w-full h-full px-2 py-1" style={{ ...contentStyle, display: "block" }}>
                {el.content || "Sample Text"}
              </div>
            )}
            {el.type === "button" && (
              <button className="w-full h-full flex items-center justify-center" style={contentStyle}>
                {el.content || "Click Me"}
              </button>
            )}
            {el.type === "rectangle" && <div className="w-full h-full" style={contentStyle} />}
            {el.type === "nav" && (
              <nav className="w-full h-full flex items-center justify-around" style={contentStyle}>
                {(el.content || "Home,About,Contact").split(",").map((item, i) => (
                  <span key={i} className="px-3 py-1 hover:bg-gray-700/20 rounded">
                    {item}
                  </span>
                ))}
              </nav>
            )}
            {el.type === "image" && (
              <img
                src={el.content || "https://via.placeholder.com/250"}
                alt="Image"
                className="w-full h-full object-cover"
                style={contentStyle}
              />
            )}
            {el.type === "container" && <div className="w-full h-full" style={contentStyle} />}
            {el.type === "bottomSheet" && (
              <div className="w-full h-full rounded-t-lg p-2 flex flex-col" style={contentStyle}>
                <div>{el.content || "Bottom Sheet"}</div>
                <div className="mt-1 flex-1">Content</div>
              </div>
            )}
            {el.type === "radio" && (
              <input
                type="radio"
                className="w-full h-full accent-blue-600"
                checked={el.content === "checked"}
                style={contentStyle}
              />
            )}
            {el.type === "link" && (
              <a href={el.content || "#"} className="w-full h-full flex items-center justify-center hover:underline" style={contentStyle}>
                {el.content || "Link"}
              </a>
            )}
            {el.type === "form" && (
              <div className="w-full h-full p-2" style={contentStyle}>
                {el.content || "Form Container"}
              </div>
            )}
            {el.type === "input" && (
              <input
                type="text"
                placeholder={el.content || "Input"}
                className="w-full h-full p-2 focus:outline-none focus:border-blue-500"
                style={contentStyle}
                readOnly
              />
            )}
            {el.type === "header" && (
              <header className="w-full h-full p-2 flex items-center justify-between" style={contentStyle}>
                <span>{el.content || "Header"}</span>
                <div className="text-sm opacity-70">Subtitle</div>
              </header>
            )}
            {el.type === "footer" && (
              <footer className="w-full h-full p-2 flex items-center justify-between" style={contentStyle}>
                <span>{el.content || "Footer"}</span>
                <div className="text-sm opacity-70">© 2025</div>
              </footer>
            )}
            {el.type === "card" && (
              <div className="w-full h-full p-3 flex flex-col" style={contentStyle}>
                <div>{el.content || "Card Content"}</div>
                <div className="mt-1 text-sm opacity-70 flex-1">Description</div>
                <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 self-end">
                  Action
                </button>
              </div>
            )}
            {el.type === "carousel" && (
              <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory" style={contentStyle}>
                {(el.content || "https://via.placeholder.com/150").split(",").map((url, i) => (
                  <img
                    key={i}
                    src={url.trim()}
                    alt={`Slide ${i}`}
                    className="h-full object-cover flex-shrink-0 snap-center"
                  />
                ))}
              </div>
            )}
            {el.type === "accordion" && (
              <div className="w-full h-full" style={contentStyle}>
                <div className="p-2 border-b">{el.content || "Accordion Title"}</div>
                <div className="p-2 opacity-70">Content</div>
              </div>
            )}
            {el.type === "modal" && (
              <div className="w-full h-full p-3 flex flex-col" style={contentStyle}>
                <div>{el.content || "Modal Title"}</div>
                <div className="mt-1 flex-1 opacity-70">Content</div>
                <button className="self-end mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Close
                </button>
              </div>
            )}
            {el.type === "tabs" && (
              <div className="w-full h-full" style={contentStyle}>
                <div className="flex border-b">
                  {(el.content || "Tab 1,Tab 2").split(",").map((tab, i) => (
                    <div key={i} className="px-3 py-1 border-r hover:bg-gray-100/50">
                      {tab}
                    </div>
                  ))}
                </div>
                <div className="p-2 opacity-70">Content</div>
              </div>
            )}
            {el.type === "video" && (
              <video
                src={el.content || "https://www.w3schools.com/html/mov_bbb.mp4"}
                controls
                className="w-full h-full object-cover"
                style={contentStyle}
              />
            )}
            {el.type === "divider" && (
              <hr className="w-full" style={{ borderColor: contentStyle.backgroundColor || "#d1d5db", height: el.height }} />
            )}
            {el.type === "progress" && (
              <progress
                value={parseInt(el.content || "50")}
                max="100"
                className="w-full h-full"
                style={{
                  backgroundColor: contentStyle.backgroundColor || "#e5e7eb",
                  color: "#3b82f6",
                  borderRadius: contentStyle.borderRadius,
                }}
              />
            )}
            {el.type === "icon" && (
              IconComponent ? (
                <IconComponent className="w-full h-full" style={contentStyle} />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-red-500 text-sm">
                  Icon: {el.content || "none"}
                </span>
              )
            )}
            {el.type === "table" && (
              <table className="w-full h-full border-collapse" style={contentStyle}>
                <thead>
                  <tr style={{ backgroundColor: contentStyle.backgroundColor ? `${contentStyle.backgroundColor}20` : "#f9fafb" }}>
                    <th className="border p-2">Header 1</th>
                    <th className="border p-2">Header 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 opacity-70">{el.content || "Cell 1"}</td>
                    <td className="border p-2 opacity-70">Cell 2</td>
                  </tr>
                </tbody>
              </table>
            )}
            {el.type === "social" && (
              <div className="w-full h-full flex items-center justify-around" style={contentStyle}>
                {(el.content || "facebook,twitter").split(",").map((platform, i) => (
                  <a
                    key={i}
                    href={`https://${platform}.com`}
                    className="flex items-center gap-1 hover:underline"
                    style={{ color: contentStyle.color }}
                  >
                    <FaIcons.FaLink className="w-4 h-4" />
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                ))}
              </div>
            )}
            {el.type === "map" && (
              <iframe
                src={el.content || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509368!2d144.9537353153167!3d-37.81627997975146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727d7a9b5d8e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1635789271533!5m2!1sen!2sus"}
                className="w-full h-full border-0"
                style={contentStyle}
                allowFullScreen
              />
            )}
            {[
              "container", "button", "rectangle", "text",
              "image", "form", "header", "footer", "card", "carousel", "modal", "tabs", "video", "table", "map",
              "nav", "accordion", "input", "social", "progress"
            ].includes(el.type) && !el.isLocked && !previewMode && (
              <div className="absolute inset-0 pointer-events-none group-hover:pointer-events-auto">
                <div
                  className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-transparent hover:bg-blue-200/50"
                  onMouseDown={(e) => handleMouseDown(e, el, "right")}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-transparent hover:bg-blue-200/50"
                  onMouseDown={(e) => handleMouseDown(e, el, "bottom")}
                />
                <div
                  className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-blue-500 rounded-full hover:bg-blue-600"
                  onMouseDown={(e) => handleMouseDown(e, el, "bottom-right")}
                />
              </div>
            )}
            {el.isLocked && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      className="flex-1 relative bg-gray-100 overflow-auto"
      style={{ height: "100vh" }}
    >
      {!currentPageId ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">Select or create a page to start</div>
      ) : (
        <div className="relative flex justify-center">
          <div
            ref={frameRef}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
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
            className={`relative bg-white rounded-lg ${isPanning ? "cursor-grab" : ""}`}
            style={{
              width: `${FRAME_WIDTH}px`,
              height: `${currentPage.frameHeight ?? 800}px`,
              backgroundColor: currentPage.backgroundColor,
              backgroundImage: currentPage.backgroundImage ? `url(${currentPage.backgroundImage})` : undefined,
              backgroundSize: "cover",
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              marginTop: "50px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: `${INFINITE_HEIGHT / 2}px`,
            }}
          >
            {!previewMode && showGrid && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={
                  layoutMode === "grid"
                    ? {
                        backgroundImage: `
                          linear-gradient(to right, rgba(255, 0, 0, 0.3) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 0, 0, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: `${gridSize}px ${gridSize}px`,
                      }
                    : {
                        backgroundImage: `linear-gradient(to right, rgba(255, 0, 0, 0.3) 1px, transparent 1px)`,
                        backgroundSize: `100px 100%`,
                      }
                }
              />
            )}
            {!previewMode &&
              guides.map((guide) => (
                <div
                  key={guide.id}
                  className={`absolute ${
                    guide.type.includes("center")
                      ? "bg-blue-400"
                      : guide.type.includes("spacing-x-inside") || guide.type.includes("spacing-y-inside")
                      ? "bg-green-400"
                      : guide.type.includes("spacing")
                      ? "bg-purple-400"
                      : "bg-red-400"
                  }`}
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
                      className="absolute text-xs bg-gray-800 text-white px-1 rounded"
                      style={{
                        left: guide.x !== undefined ? (guide.to ? (guide.to > guide.x ? "100%" : "-100%") : "100%") : "50%",
                        top: guide.y !== undefined ? (guide.to ? (guide.to > guide.y ? "100%" : "-100%") : "100%") : "50%",
                        transform: guide.x !== undefined ? "translate(4px, -50%)" : "translate(-50%, 4px)",
                      }}
                    >
                      {Math.round(guide.distance)}px
                    </span>
                  )}
                </div>
              ))}
            {currentPage.elements.map((el) => renderElement(el))}
            {!previewMode && (
              <div
                className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-200/50"
                onMouseDown={handleFrameResize}
              />
            )}
            {!previewMode && selectionBox && (
              <div
                className="absolute border border-dashed border-blue-500 bg-blue-100/10 pointer-events-none"
                style={{
                  left: Math.min(selectionBox.startX, selectionBox.endX) / zoom,
                  top: Math.min(selectionBox.startY, selectionBox.endY) / zoom,
                  width: Math.abs(selectionBox.endX - selectionBox.startX) / zoom,
                  height: Math.abs(selectionBox.endY - selectionBox.startY) / zoom,
                }}
              />
            )}
            {contextMenu && !previewMode && (
              <div
                className="absolute bg-white rounded border border-gray-200 p-1 z-50 shadow-lg"
                style={{ left: contextMenu.x / zoom, top: contextMenu.y / zoom }}
              >
                <button
                  onClick={() => {
                    duplicateElement(currentPageId!, contextMenu.element.id);
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    deleteElement(currentPageId!, contextMenu.element.id);
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-red-50 text-red-500 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    moveElementToLayer(currentPageId!, contextMenu.element.id, "top");
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                >
                  Bring to Front
                </button>
                <button
                  onClick={() => {
                    moveElementToLayer(currentPageId!, contextMenu.element.id, "bottom");
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                >
                  Send to Back
                </button>
                <button
                  onClick={() => {
                    updateElement(currentPageId!, contextMenu.element.id, { isLocked: !contextMenu.element.isLocked });
                    closeContextMenu();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                >
                  {contextMenu.element.isLocked ? "Unlock" : "Lock"}
                </button>
                {selectedIds.length > 1 && (
                  <>
                    <button
                      onClick={() => {
                        groupElements(currentPageId!, selectedIds);
                        setSelectedIds([]);
                        closeContextMenu();
                      }}
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      Group
                    </button>
                    <button
                      onClick={() => {
                        distributeElements("horizontal");
                        closeContextMenu();
                      }}
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      Distribute Horizontally
                    </button>
                    <button
                      onClick={() => {
                        distributeElements("vertical");
                        closeContextMenu();
                      }}
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      Distribute Vertically
                    </button>
                  </>
                )}
                {contextMenu.element.type === "container" && (
                  <button
                    onClick={() => {
                      ungroupElements(currentPageId!, contextMenu.element.id);
                      setSelectedIds([]);
                      closeContextMenu();
                    }}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    Ungroup
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}