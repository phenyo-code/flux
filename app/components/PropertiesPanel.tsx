"use client";
import { useBuilderStore, Element } from "@/app/lib/store";
import React from "react";
import { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";

const Icons = { ...FaIcons, ...MdIcons, ...IoIcons, ...Io5Icons };

export function PropertiesPanel() {
  const {
    selectedElement,
    currentPageId,
    updateElement,
    pages,
    updatePageBackground,
    moveElementToLayer,
    deleteElement,
    alignElements,
    zoom,
    showGrid,
    toggleGrid,
    setGridSize,
    setColumnCount,
    gridSize,
    columnCount,
    setFrameHeight,
    layoutMode,
    setLayoutMode,
    previewMode,
    setPreviewMode,
    
  } = useBuilderStore();
  const currentPage = pages.find((p) => p.id === currentPageId);

  const iconOptions = [
    // FontAwesome (FaIcons)
    "FaStar",
    "FaHeart",
    "FaHome",
    "FaUser",
    "FaCog",
    "FaArrowRight",
    "FaArrowLeft",
    "FaArrowUp",
    "FaArrowDown",
    "FaCheck",
    "FaTimes",
    "FaPlus",
    "FaMinus",
    "FaTrash",
    "FaEdit",
    "FaCopy",
    "FaPaste",
    "FaLock",
    "FaUnlock",
    "FaEye",
    "FaEyeSlash",
    "FaDownload",
    "FaUpload",
    "FaCamera",
    "FaEnvelope",
    "FaPhone",
    "FaBell",

    // Material Design (MdIcons)
    "MdMenu",
    "MdSearch",
    "MdEdit",
    "MdDelete",
    "MdSettings",
    "MdPerson",
    "MdMail",
    "MdPhone",
    "MdLocationOn",
    "MdFavorite",
    "MdShare",
    "MdPlayArrow",
    "MdPause",
    "MdStop",
    "MdVolumeUp",
    "MdVolumeOff",
    "MdNotifications",
    "MdDashboard",
    "MdShoppingCart",
    "MdAccountCircle",
    "MdVisibility",
    "MdVisibilityOff",
    "MdZoomIn",
    "MdZoomOut",
    "MdAdd",
    "MdRemove",
    "MdArrowForward",
    "MdArrowBack",
    "MdArrowUpward",
    "MdArrowDownward",
    "MdCheck",
    "MdClose",
    "MdInfo",
    "MdWarning",
    "MdHelp",
    "MdLockOpen",
    "MdHome",

    // Ionicons (IoIcons and Io5Icons)
    "IoIosAdd",
    "IoMdSearch",
    "IoIosRemove",
    "IoMdPlay",
    "IoMdPause",
    "IoMdStop",
    "IoIosArrowForward",
    "IoIosArrowBack",
    "IoIosArrowUp",
    "IoIosArrowDown",
    "IoIosCheckmark",
    "IoIosClose",
    "IoMdInformationCircle",
    "IoMdWarning",
    "IoMdHelpCircle",
    "IoAddOutline", 
"IoRemoveOutline",
"IoTrashOutline",
"IoPencilOutline",
"IoEyeOutline",
"IoEyeOffOutline",
"IoLockClosedOutline",
"IoLockOpenOutline",
"IoDocumentTextOutline",
"IoDocumentTextSharp",
  ];

  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);


  if (!currentPageId) {
    return <div className="w-full bg-gray-100 p-4 text-gray-500">No page selected</div>;
  }

  const handleChange = (
    key: keyof Element | string,
    value: string | number | boolean | { [key: string]: string | number | undefined }
  ) => {
    if (!selectedElement || !currentPageId) return;

    if (key === "style" && typeof value === "object") {
      const newStyle = { ...selectedElement.style };
      if ("backgroundColor" in value) {
        // Clear background when setting backgroundColor to avoid conflicts
        delete newStyle.background;
        newStyle.backgroundColor = value.backgroundColor as string;
      } else if ("background" in value) {
        // Clear backgroundColor when setting background
        delete newStyle.backgroundColor;
        newStyle.background = value.background as string;
      } else {
        Object.assign(newStyle, value);
      }
      updateElement(currentPageId, selectedElement.id, { style: newStyle });
    } else if (["x", "y", "width", "height"].includes(key)) {
      const numValue = parseInt(String(value), 10);
      if (!isNaN(numValue)) {
        updateElement(currentPageId, selectedElement.id, { [key]: numValue } as Partial<Element>);
      }
    } else if (key === "zIndex") {
      const numValue = parseInt(String(value), 10);
      if (!isNaN(numValue)) {
        updateElement(currentPageId, selectedElement.id, { style: { ...selectedElement.style, zIndex: numValue } });
      }
    } else if (["content", "isLocked"].includes(key)) {
      updateElement(currentPageId, selectedElement.id, { [key]: value } as Partial<Element>);
    }
  };

  const handleAlignment = (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (!selectedElement || !currentPageId) return;
    alignElements(currentPageId, [selectedElement.id], alignment);
  };

  const handlePageUpdate = (key: string, value: string | number) => {
    if (!currentPageId) return;
    if (key === "backgroundColor" || key === "backgroundImage") {
      updatePageBackground(
        currentPageId,
        key === "backgroundColor" ? value as string : currentPage?.backgroundColor || "#ffffff",
        key === "backgroundImage" ? value as string : currentPage?.backgroundImage || ""
      );
    } else if (key === "frameHeight") {
      const numValue = parseInt(String(value), 10);
      if (!isNaN(numValue)) setFrameHeight(currentPageId, numValue);
    }
  };

  const fontSizeOptions = [6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 128].map((size) => `${size}px`);
  const fontWeightOptions = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
  const fontFamilyOptions = [
    "Inter",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Nunito",
  ];
  const textAlignOptions = ["left", "center", "right", "justify"];
  const borderRadiusOptions = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64].map((size) => `${size}px`);
  const borderWidthOptions = [0, 1, 2, 3, 4, 6, 8, 10].map((size) => `${size}px`);
  const rotationOptions = [0, 15, 30, 45, 60, 75, 90, 120, 135, 150, 180, 225, 270, 315, 360].map((deg) => `${deg}deg`);
  const shadowOptions = [
    "none",
    "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    "0 20px 40px rgba(0,0,0,0.3), 0 15px 12px rgba(0,0,0,0.22)",
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 p-6 shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)] rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
        Properties
        {selectedElement && (
          <button
            onClick={() => deleteElement(currentPageId!, selectedElement.id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200"
            title="Delete Element"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </h2>
      {!selectedElement ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={currentPage?.backgroundColor || "#ffffff"}
              onChange={(e) => handlePageUpdate("backgroundColor", e.target.value)}
              className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
            <input
              type="text"
              value={currentPage?.backgroundImage || ""}
              onChange={(e) => handlePageUpdate("backgroundImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frame Height (px)</label>
            <input
              type="number"
              value={currentPage?.frameHeight ?? 800}
              onChange={(e) => handlePageUpdate("frameHeight", e.target.value)}
              min="200"
              step="10"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={toggleGrid}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Show Grid</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grid Size (px)</label>
            <select
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Column Count</label>
            <input
              type="number"
              value={columnCount}
              onChange={(e) => setColumnCount(Math.max(1, Math.min(12, Number(e.target.value))))}
              min="1"
              max="12"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout Mode</label>
            <select
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value as "grid" | "columns")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="grid">Grid</option>
              <option value="columns">Columns</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Level</label>
            <input
              type="text"
              value={`${Math.round(zoom * 100)}%`}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-100 text-gray-600 shadow-sm cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={previewMode}
              onChange={() => setPreviewMode(!previewMode)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Preview Mode</label>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Position & Size */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-medium text-gray-800">Layout</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">X (px)</label>
                <input
                  type="number"
                  value={selectedElement.x}
                  onChange={(e) => handleChange("x", e.target.value)}
                  step="1"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Y (px)</label>
                <input
                  type="number"
                  value={selectedElement.y}
                  onChange={(e) => handleChange("y", e.target.value)}
                  step="1"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={selectedElement.width}
                  onChange={(e) => handleChange("width", e.target.value)}
                  min="10"
                  step="1"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={selectedElement.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                  min="10"
                  step="1"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
              <select
                value={
                  selectedElement.style?.transform?.includes("rotate")
                    ? selectedElement.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || "0deg"
                    : "0deg"
                }
                onChange={(e) => handleChange("style", { transform: `rotate(${e.target.value})` })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {rotationOptions.map((deg) => (
                  <option key={deg} value={deg}>
                    {deg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          {["text", "button", "nav", "bottomSheet", "link", "input", "header", "footer", "card", "accordion", "modal", "tabs", "social", "table"].includes(selectedElement.type) && (
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800">Content</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                <input
                  type="text"
                  value={selectedElement.content || ""}
                  onChange={(e) => handleChange("content", e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
          )}
          {selectedElement.type === "image" && (
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800">Image</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={selectedElement.content || ""}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
          )}
          {selectedElement.type === "carousel" && (
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800">Carousel</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma-separated)</label>
                <input
                  type="text"
                  value={selectedElement.content || ""}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="https://url1.jpg, https://url2.jpg"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
          )}
          {selectedElement.type === "progress" && (
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800">Progress</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value (0-100)</label>
                <input
                  type="number"
                  value={parseInt(selectedElement.content || "50", 10)}
                  onChange={(e) => handleChange("content", e.target.value)}
                  min="0"
                  max="100"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Fill & Border */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-medium text-gray-800">Fill & Border</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="color"
                value={selectedElement.style?.backgroundColor || "#ffffff"}
                onChange={(e) => handleChange("style", { backgroundColor: e.target.value })}
                className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Gradient</label>
              <input
                type="text"
                value={selectedElement.style?.background || ""}
                onChange={(e) => handleChange("style", { background: e.target.value })}
                placeholder="e.g., linear-gradient(to right, #ff0000, #00ff00)"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
              <select
                value={typeof selectedElement.style?.border === "string" ? selectedElement.style.border.match(/(\d+)px/)?.[1] || "0" : "0"}
                onChange={(e) => {
                  const width = e.target.value;
                  const currentBorder = selectedElement.style?.border || "1px solid #000000";
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const [_, style, color] = typeof currentBorder === "string" ? currentBorder.split(" ") : ["1px", "solid", "#000000"];
                  handleChange("style", { border: `${width} ${style || "solid"} ${color || "#000000"}` });
                }}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {borderWidthOptions.map((size) => (
                  <option key={size} value={size.replace("px", "")}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
              <input
                type="color"
                value={typeof selectedElement.style?.border === "string" ? selectedElement.style.border.split(" ").pop() || "#000000" : "#000000"}
                onChange={(e) => {
                  const currentBorder = selectedElement.style?.border || "1px solid #000000";
                  const [width, style] = typeof currentBorder === "string" ? currentBorder.split(" ").slice(0, 2) : ["1px", "solid"];
                  handleChange("style", { border: `${width || "1px"} ${style || "solid"} ${e.target.value}` });
                }}
                className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
              <select
                value={selectedElement.style?.borderRadius || "0px"}
                onChange={(e) => handleChange("style", { borderRadius: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {borderRadiusOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Box Shadow</label>
              <select
                value={selectedElement.style?.boxShadow || "none"}
                onChange={(e) => handleChange("style", { boxShadow: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {shadowOptions.map((shadow, i) => (
                  <option key={i} value={shadow}>
                    {shadow === "none" ? "None" : `Shadow ${i}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={selectedElement.style?.opacity || 1}
                onChange={(e) => handleChange("style", { opacity: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="text-sm text-gray-600">{(Number(selectedElement.style?.opacity) || 1) * 100}%</span>
            </div>
          </div>

          {/* Typography */}
          {["text", "button", "nav", "link", "input", "header", "footer", "card", "accordion", "modal", "tabs", "social"].includes(selectedElement.type) && (
            <div className="space-y-4 border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800">Typography</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <select
                  value={selectedElement.style?.fontFamily || "Inter"}
                  onChange={(e) => handleChange("style", { fontFamily: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  {fontFamilyOptions.map((family) => (
                    <option key={family} value={family}>
                      {family}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                <select
                  value={selectedElement.style?.fontSize || "16px"}
                  onChange={(e) => handleChange("style", { fontSize: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  {fontSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
                <select
                  value={selectedElement.style?.fontWeight || "400"}
                  onChange={(e) => handleChange("style", { fontWeight: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  {fontWeightOptions.map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                <input
                  type="color"
                  value={selectedElement.style?.color || "#000000"}
                  onChange={(e) => handleChange("style", { color: e.target.value })}
                  className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
                <select
                  value={selectedElement.style?.textAlign || "left"}
                  onChange={(e) => handleChange("style", { textAlign: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  {textAlignOptions.map((align) => (
                    <option key={align} value={align}>
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
                <input
                  type="number"
                  value={parseFloat(selectedElement.style?.lineHeight || "1.5")}
                  step="0.1"
                  min="0.5"
                  max="3"
                  onChange={(e) => handleChange("style", { lineHeight: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Letter Spacing (px)</label>
                <input
                  type="number"
                  value={parseFloat(selectedElement.style?.letterSpacing || "0")}
                  step="0.1"
                  min="-5"
                  max="10"
                  onChange={(e) => handleChange("style", { letterSpacing: `${e.target.value}px` })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedElement.style?.fontStyle === "italic"}
                    onChange={(e) => handleChange("style", { fontStyle: e.target.checked ? "italic" : "normal" })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Italic</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedElement.style?.textDecoration?.includes("underline")}
                    onChange={(e) => handleChange("style", { textDecoration: e.target.checked ? "underline" : "none" })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Underline</label>
                </div>
              </div>
            </div>
          )}

          {/* Icon Styles */}
          {selectedElement && selectedElement.type === "icon" && (
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800">Icon</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon Type</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                className="w-full p-2 border rounded-md bg-white flex items-center justify-between focus:ring-2 focus:ring-blue-500 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {Icons[selectedElement.content as keyof typeof Icons || "FaStar"] && (
                    <span>{React.createElement(Icons[selectedElement.content as keyof typeof Icons || "FaStar"], { size: 20 })}</span>
                  )}
                  {selectedElement.content || "FaStar"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isIconDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isIconDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        handleChange("content", icon);
                        setIsIconDropdownOpen(false);
                      }}
                      className="w-full p-2 flex items-center gap-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      {Icons[icon as keyof typeof Icons] && <span>{React.createElement(Icons[icon as keyof typeof Icons], { size: 20 })}</span>}
                      {icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
            <input
              type="color"
              value={selectedElement.style?.color || "#000000"}
              onChange={(e) => handleChange("style", { color: e.target.value })}
              className="w-full h-10 rounded-md border-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon Size</label>
            <select
              value={selectedElement.style?.fontSize || "24px"}
              onChange={(e) => handleChange("style", { fontSize: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {fontSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

          {/* Effects & Advanced */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Effects & Advanced</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Z-Index</label>
              <input
                type="number"
                value={selectedElement.style?.zIndex ?? selectedElement.zIndex ?? 0}
                onChange={(e) => handleChange("zIndex", e.target.value)}
                step="1"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blend Mode</label>
              <select
                value={selectedElement.style?.mixBlendMode || "normal"}
                onChange={(e) => handleChange("style", { mixBlendMode: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="normal">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="darken">Darken</option>
                <option value="lighten">Lighten</option>
                <option value="color-dodge">Color Dodge</option>
                <option value="color-burn">Color Burn</option>
                <option value="soft-light">Soft Light</option>
                <option value="hard-light">Hard Light</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cursor</label>
              <select
                value={selectedElement.style?.cursor || "auto"}
                onChange={(e) => handleChange("style", { cursor: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="auto">Auto</option>
                <option value="default">Default</option>
                <option value="pointer">Pointer</option>
                <option value="move">Move</option>
                <option value="text">Text</option>
                <option value="crosshair">Crosshair</option>
                <option value="wait">Wait</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedElement.isLocked || false}
                onChange={(e) => handleChange("isLocked", e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Lock Element</label>
            </div>
          </div>

          {/* Alignment & Layering */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Alignment & Layering</h3>
            <div className="flex gap-2">
              <button
                onClick={() => moveElementToLayer(currentPageId!, selectedElement.id, "up")}
                className="flex-1 p-2 bg-gray-200 rounded hover:bg-gray-300 shadow-sm transition-colors duration-200"
              >
                Layer Up
              </button>
              <button
                onClick={() => moveElementToLayer(currentPageId!, selectedElement.id, "down")}
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
        </div>
      )}
    </div>
  );
}