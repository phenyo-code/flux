"use client";
import { useBuilderStore } from "@/app/lib/store";
import { FaSave } from "react-icons/fa";

export function Toolbar() {
  const { pages } = useBuilderStore();

  const handleSave = async () => {
    const designId = window.location.pathname.split("/")[2];
    try {
      const response = await fetch(`/api/designs/${designId}`, {
        method: "PUT",
        body: JSON.stringify({ pages }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to save design");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Flux</h1>
      <button onClick={handleSave} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
        <FaSave /> Save
      </button>
    </div>
  );
}