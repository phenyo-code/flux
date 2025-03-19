"use client";
import { FaFont, FaSquare, FaCube, FaBars, FaImage } from "react-icons/fa";

const components = [
  { type: "text", label: "Text", icon: <FaFont /> },
  { type: "button", label: "Button", icon: <FaSquare /> },
  { type: "rectangle", label: "Rectangle", icon: <FaCube /> },
  { type: "nav", label: "Nav Bar", icon: <FaBars /> },
  { type: "image", label: "Image", icon: <FaImage /> },
];

export function ComponentsPanel() {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData("type", type);
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-200 bg-opacity-75 p-4 rounded-lg flex gap-4">
      {components.map((comp) => (
        <div
          key={comp.type}
          draggable
          onDragStart={(e) => handleDragStart(e, comp.type)}
          className="p-2 bg-white rounded shadow cursor-grab hover:bg-gray-100 flex items-center gap-2"
        >
          {comp.icon}
          <span>{comp.label}</span>
        </div>
      ))}
    </div>
  );
}