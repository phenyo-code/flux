import { Element } from "@/app/lib/store";

export const handleChange = (
  key: keyof Element | string,
  value: string | number | boolean | { [key: string]: string | number | undefined },
  selectedElement: Element,
  currentPageId: string,
  updateElement: (pageId: string, elementId: number, updates: Partial<Element>) => void
) => {
  if (key === "style" && typeof value === "object") {
    const newStyle = { ...selectedElement.style };
    if ("backgroundColor" in value) {
      delete newStyle.background;
      newStyle.backgroundColor = value.backgroundColor as string;
    } else if ("background" in value) {
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

export const fontSizeOptions = [6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 128].map((size) => `${size}px`);
export const fontWeightOptions = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
export const fontFamilyOptions = [
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
export const textAlignOptions = ["left", "center", "right", "justify"];
export const borderRadiusOptions = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64].map((size) => `${size}px`);
export const borderWidthOptions = [0, 1, 2, 3, 4, 6, 8, 10].map((size) => `${size}px`);
export const shadowOptions = [
  "none",
  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
  "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
  "0 20px 40px rgba(0,0,0,0.3), 0 15px 12px rgba(0,0,0,0.22)",
];