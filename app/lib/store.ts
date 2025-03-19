import { create } from "zustand";

export type Element = {
  id: number;
  type: "text" | "button" | "rectangle" | "nav" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: React.CSSProperties;
  actions?: { event: string; action: string; value?: string }[];
};

export interface Page {
  id: string;
  title: string;
  elements: Element[];
}

interface BuilderState {
  pages: Page[];
  currentPageId: string | null;
  selectedElement: Element | null;
  setPages: (pages: Page[]) => void;
  setCurrentPageId: (pageId: string) => void;
  setSelectedElement: (element: Element | null) => void;
  updateElement: (pageId: string, id: number, updates: Partial<Element>) => void;
  addPage: (title: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  pages: [],
  currentPageId: null,
  selectedElement: null,
  setPages: (pages) => set((state) => ({ pages, currentPageId: pages.length ? pages[0].id : state.currentPageId })),
  setCurrentPageId: (currentPageId) => set({ currentPageId }),
  setSelectedElement: (selectedElement) => set({ selectedElement }),
  updateElement: (pageId, id, updates) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              elements: page.elements.some((el) => el.id === id)
                ? page.elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
                : [...page.elements, { id, ...updates } as Element],
            }
          : page
      ),
    })),
  addPage: (title) =>
    set((state) => {
      const newPage = { id: Date.now().toString(), title, elements: [] };
      return {
        pages: [...state.pages, newPage],
        currentPageId: state.currentPageId || newPage.id,
      };
    }),
}));