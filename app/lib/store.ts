 
import { create } from "zustand";

export type Element = {
  id: number;
  type:
    | "text"
    | "button"
    | "rectangle"
    | "nav"
    | "image"
    | "container"
    | "bottomSheet"
    | "radio"
    | "link"
    | "form"
    | "input"
    | "pageFrame"
    | "header"
    | "footer"
    | "card"
    | "carousel"
    | "accordion"
    | "modal"
    | "tabs"
    | "video"
    | "divider"
    | "progress"
    | "icon"
    | "table"
    | "social"
    | "map";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: React.CSSProperties & {
    zIndex?: number;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right" | "justify";
    lineHeight?: string;
    letterSpacing?: string;
    fontStyle?: "normal" | "italic";
    textDecoration?: "none" | "underline";
    transform?: string;
    mixBlendMode?: "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn";
    cursor?: "auto" | "pointer" | "default" | "crosshair" | "move" | "text" | "wait";
  };
  prototype?: {
    onClick?: {
      action:
        | "navigate"
        | "openModal"
        | "toggleVisibility"
        | "playVideo"
        | "submitForm"
        | "openLink"
        | "scrollTo"
        | "triggerAnimation";
      targetId?: string;
      value?: string;
      delay?: number;
      transition?: "none" | "fade" | "slide" | "zoom";
    };
    onHover?: {
      action: "showTooltip" | "highlight" | "scale";
      targetId?: string;
      value?: string;
    };
    onLoad?: {
      action: "animate" | "fetchData";
      value?: string;
    };
  };
  parentId?: number;
  isLocked?: boolean;
  zIndex?: number;
};

export interface Page {
  id: string;
  title: string;
  elements: Element[];
  backgroundColor?: string;
  backgroundImage?: string;
  frameHeight?: number;
  columnCount?: number;
  gridSize?: number;
}

interface BuilderState {
  pages: Page[];
  currentPageId: string | null;
  selectedElement: Element | null;
  history: Page[][];
  historyIndex: number;
  zoom: number;
  showGrid: boolean;
  gridSize: number;
  columnCount: number;
  layoutMode: "grid" | "columns";
  previewMode: boolean;
  gutter: number;
  setPages: (pages: Page[]) => void;
  setCurrentPageId: (pageId: string) => void;
  setSelectedElement: (element: Element | null) => void;
  updateElement: (pageId: string, id: number, updates: Partial<Element>) => void;
  addPage: (title: string) => void;
  renamePage: (pageId: string, newTitle: string) => void;
  updatePageBackground: (pageId: string, color: string, image?: string) => void;
  deleteElement: (pageId: string, id: number) => void;
  duplicateElement: (pageId: string, id: number) => void;
  undo: () => void;
  redo: () => void;
  moveElementToLayer: (pageId: string, id: number, direction: "up" | "down" | "top" | "bottom") => void;
  groupElements: (pageId: string, elementIds: number[]) => void;
  ungroupElements: (pageId: string, containerId: number) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  setFrameHeight: (pageId: string, height: number) => void;
  setGridSize: (size: number) => void;
  setColumnCount: (count: number) => void;
  alignElements: (
    pageId: string,
    elementIds: number[],
    alignment: "left" | "center" | "right" | "top" | "middle" | "bottom"
  ) => void;
  setLayoutMode: (mode: "grid" | "columns") => void;
  setPreviewMode: (mode: boolean) => void;
  setGutter: (gutter: number) => void;
  handlePrototypeAction: (event: "onClick" | "onHover" | "onLoad", element: Element) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  pages: [],
  currentPageId: null,
  selectedElement: null,
  history: [],
  historyIndex: -1,
  zoom: 1,
  showGrid: true,
  gridSize: 10,
  columnCount: 12,
  layoutMode: "grid",
  previewMode: false,
  gutter: 10,

  setPages: (pages) =>
    set((state) => {
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), pages];
      return {
        pages,
        currentPageId: pages.length ? pages[0].id : state.currentPageId,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }),

  setCurrentPageId: (currentPageId) => set({ currentPageId }),

  setSelectedElement: (selectedElement) => set({ selectedElement }),

  updateElement: (pageId, id, updates) =>
    set((state) => {
      const newPages = state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              elements: page.elements.some((el) => el.id === id)
                ? page.elements.map((el) =>
                    el.id === id
                      ? {
                          ...el,
                          ...updates,
                          style: { ...el.style, ...updates.style },
                          prototype: updates.prototype
                            ? {
                                ...el.prototype,
                                ...updates.prototype,
                                onClick: updates.prototype.onClick
                                  ? { ...el.prototype?.onClick, ...updates.prototype.onClick }
                                  : el.prototype?.onClick,
                                onHover: updates.prototype.onHover
                                  ? { ...el.prototype?.onHover, ...updates.prototype.onHover }
                                  : el.prototype?.onHover,
                                onLoad: updates.prototype.onLoad
                                  ? { ...el.prototype?.onLoad, ...updates.prototype.onLoad }
                                  : el.prototype?.onLoad,
                              }
                            : el.prototype,
                        }
                      : el
                  )
                : [...page.elements, { id, ...updates } as Element],
            }
          : page
      );
      const updatedElement = newPages
        .find((p) => p.id === pageId)
        ?.elements.find((el) => el.id === id);
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return {
        pages: newPages,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedElement: state.selectedElement?.id === id ? updatedElement || null : state.selectedElement,
      };
    }),

  addPage: (title) =>
    set((state) => {
      const newPage = { id: Date.now().toString(), title, elements: [], backgroundColor: "#ffffff", frameHeight: 800 };
      const newPages = [...state.pages, newPage];
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return {
        pages: newPages,
        currentPageId: state.currentPageId || newPage.id,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }),

  renamePage: (pageId, newTitle) =>
    set((state) => {
      const newPages = state.pages.map((page) => (page.id === pageId ? { ...page, title: newTitle } : page));
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return { pages: newPages, history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  updatePageBackground: (pageId, color, image) =>
    set((state) => {
      const newPages = state.pages.map((page) =>
        page.id === pageId ? { ...page, backgroundColor: color, backgroundImage: image } : page
      );
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return { pages: newPages, history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  deleteElement: (pageId, id) =>
    set((state) => {
      const newPages = state.pages.map((page) =>
        page.id === pageId ? { ...page, elements: page.elements.filter((el) => el.id !== id) } : page
      );
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return {
        pages: newPages,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
      };
    }),

  duplicateElement: (pageId, id) =>
    set((state) => {
      const page = state.pages.find((p) => p.id === pageId);
      if (!page) return state;
      const element = page.elements.find((el) => el.id === id);
      if (!element) return state;
      const newElement = { ...element, id: Date.now(), x: element.x + 20, y: element.y + 20 };
      const newPages = state.pages.map((p) =>
        p.id === pageId ? { ...p, elements: [...p.elements, newElement] } : p
      );
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return { pages: newPages, history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        pages: state.history[newIndex],
        historyIndex: newIndex,
        selectedElement: null,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        pages: state.history[newIndex],
        historyIndex: newIndex,
        selectedElement: null,
      };
    }),

  moveElementToLayer: (pageId, id, direction) =>
    set((state) => {
      const page = state.pages.find((p) => p.id === pageId);
      if (!page) return state;
      const elements = [...page.elements];
      const index = elements.findIndex((el) => el.id === id);
      if (index === -1) return state;

      let newElements: Element[];
      if (direction === "up" && index < elements.length - 1) {
        [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
        newElements = elements.map((el, i) => ({ ...el, style: { ...el.style, zIndex: i } }));
      } else if (direction === "down" && index > 0) {
        [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
        newElements = elements.map((el, i) => ({ ...el, style: { ...el.style, zIndex: i } }));
      } else if (direction === "top") {
        const [element] = elements.splice(index, 1);
        newElements = [...elements, element].map((el, i) => ({ ...el, style: { ...el.style, zIndex: i } }));
      } else if (direction === "bottom") {
        const [element] = elements.splice(index, 1);
        newElements = [element, ...elements].map((el, i) => ({ ...el, style: { ...el.style, zIndex: i } }));
      } else {
        return state;
      }

      const newPages = state.pages.map((p) => (p.id === pageId ? { ...p, elements: newElements } : p));
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return { pages: newPages, history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  groupElements: (pageId, elementIds) =>
    set((state) => {
      const page = state.pages.find((p) => p.id === pageId);
      if (!page) return state;
      const elementsToGroup = page.elements.filter((el) => elementIds.includes(el.id));
      if (elementsToGroup.length < 2) return state;

      const minX = Math.min(...elementsToGroup.map((el) => el.x));
      const minY = Math.min(...elementsToGroup.map((el) => el.y));
      const maxX = Math.max(...elementsToGroup.map((el) => el.x + el.width));
      const maxY = Math.max(...elementsToGroup.map((el) => el.y + el.height));

      const container: Element = {
        id: Date.now(),
        type: "container",
        x: minX - 10,
        y: minY - 10,
        width: maxX - minX + 20,
        height: maxY - minY + 20,
        style: { backgroundColor: "rgba(0, 0, 0, 0.05)", zIndex: page.elements.length },
      };

      const updatedElements = page.elements
        .filter((el) => !elementIds.includes(el.id))
        .concat([
          container,
          ...elementsToGroup.map((el) => ({
            ...el,
            x: el.x - minX + 10,
            y: el.y - minY + 10,
            parentId: container.id,
          })),
        ]);

      const newPages = state.pages.map((p) => (p.id === pageId ? { ...p, elements: updatedElements } : p));
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return { pages: newPages, history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  ungroupElements: (pageId, containerId) =>
    set((state) => {
      const page = state.pages.find((p) => p.id === pageId);
      if (!page) return state;
      const container = page.elements.find((el) => el.id === containerId && el.type === "container");
      if (!container) return state;

      const childElements = page.elements.filter((el) => el.parentId === containerId);
      const newElements = page.elements
        .filter((el) => el.id !== containerId && el.parentId !== containerId)
        .concat(
          childElements.map((el) => ({
            ...el,
            x: el.x + container.x,
            y: el.y + container.y,
            parentId: undefined,
          }))
        );

      const newPages = state.pages.map((p) => (p.id === pageId ? { ...p, elements: newElements } : p));
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return { pages: newPages, history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(2, zoom)) }),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  setFrameHeight: (pageId, height) =>
    set((state) => {
      const newPages = state.pages.map((page) =>
        page.id === pageId ? { ...page, frameHeight: Math.max(200, height) } : page
      );
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return { pages: newPages, history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  setGridSize: (size) => set({ gridSize: Math.max(1, size) }),

  setColumnCount: (count) => set({ columnCount: Math.max(1, Math.min(24, count)) }),

  alignElements: (pageId, elementIds, alignment) =>
    set((state) => {
      const page = state.pages.find((p) => p.id === pageId);
      if (!page) return state;
      const elementsToAlign = page.elements.filter((el) => elementIds.includes(el.id));
      if (elementsToAlign.length === 0) return state;

      let newElements = [...page.elements];
      if (alignment === "left") {
        const minX = Math.min(...elementsToAlign.map((el) => el.x));
        newElements = newElements.map((el) =>
          elementIds.includes(el.id) ? { ...el, x: minX } : el
        );
      } else if (alignment === "center") {
        const avgX = elementsToAlign.reduce((sum, el) => sum + el.x + el.width / 2, 0) / elementsToAlign.length;
        newElements = newElements.map((el) =>
          elementIds.includes(el.id) ? { ...el, x: avgX - el.width / 2 } : el
        );
      } else if (alignment === "right") {
        const maxX = Math.max(...elementsToAlign.map((el) => el.x + el.width));
        newElements = newElements.map((el) =>
          elementIds.includes(el.id) ? { ...el, x: maxX - el.width } : el
        );
      } else if (alignment === "top") {
        const minY = Math.min(...elementsToAlign.map((el) => el.y));
        newElements = newElements.map((el) =>
          elementIds.includes(el.id) ? { ...el, y: minY } : el
        );
      } else if (alignment === "middle") {
        const avgY = elementsToAlign.reduce((sum, el) => sum + el.y + el.height / 2, 0) / elementsToAlign.length;
        newElements = newElements.map((el) =>
          elementIds.includes(el.id) ? { ...el, y: avgY - el.height / 2 } : el
        );
      } else if (alignment === "bottom") {
        const maxY = Math.max(...elementsToAlign.map((el) => el.y + el.height));
        newElements = newElements.map((el) =>
          elementIds.includes(el.id) ? { ...el, y: maxY - el.height } : el
        );
      }

      const newPages = state.pages.map((p) => (p.id === pageId ? { ...p, elements: newElements } : p));
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newPages];
      return { pages: newPages, history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  setLayoutMode: (mode) => set({ layoutMode: mode }),

  setPreviewMode: (mode) => set({ previewMode: mode }),

  setGutter: (gutter) => set({ gutter }),

  handlePrototypeAction: (event: "onClick" | "onHover" | "onLoad", element: Element) => {
    const proto = element.prototype?.[event];
    if (!proto || !get().previewMode) return;

    const applyTransition = (styleUpdate: Partial<Element["style"]>): Partial<Element["style"]> => {
      const transitionStyle =
        "transition" in proto && proto.transition && proto.transition !== "none"
          ? { transition: `${proto.transition} ${proto.delay || 300}ms ease` }
          : {};
      return { ...styleUpdate, ...transitionStyle };
    };

    const applyDelay = (callback: () => void) => {
      if ('delay' in proto && proto.delay) {
        setTimeout(callback, proto.delay);
      } else {
        callback();
      }
    };

    switch (event) {
      case "onClick":
        switch (proto.action) {
          case "navigate":
            applyDelay(() => {
              if (proto.targetId && get().pages.some((p) => p.id === proto.targetId)) {
                set({ currentPageId: proto.targetId, selectedElement: null });
              }
            });
            break;
          case "openModal":
            applyDelay(() => {
              const page = get().pages.find((p) => p.id === get().currentPageId);
              if (!page || !proto.targetId) return;
              const modal = page.elements.find((el) => el.id === Number(proto.targetId) && el.type === "modal");
              if (!modal) return;
              set((state) => ({
                pages: state.pages.map((p) =>
                  p.id === state.currentPageId
                    ? {
                        ...p,
                        elements: p.elements.map((el) =>
                          el.id === Number(proto.targetId)
                            ? { ...el, style: { ...el.style, ...applyTransition({ display: "block" }) } }
                            : el
                        ),
                      }
                    : p
                ),
              }));
            });
            break;
          case "toggleVisibility":
            applyDelay(() => {
              const page = get().pages.find((p) => p.id === get().currentPageId);
              if (!page || !proto.targetId) return;
              const target = page.elements.find((el) => el.id === Number(proto.targetId));
              if (!target) return;
              set((state) => ({
                pages: state.pages.map((p) =>
                  p.id === state.currentPageId
                    ? {
                        ...p,
                        elements: p.elements.map((el) =>
                          el.id === Number(proto.targetId)
                            ? {
                                ...el,
                                style: {
                                  ...el.style,
                                  ...applyTransition({
                                    display: el.style?.display === "none" ? "block" : "none",
                                  }),
                                },
                              }
                            : el
                        ),
                      }
                    : p
                ),
              }));
            });
            break;
          case "playVideo":
            applyDelay(() => {
              const video = document.getElementById(`element-${proto.targetId}`) as HTMLVideoElement;
              if (video && video.paused) video.play();
            });
            break;
          case "submitForm":
            applyDelay(() => {
              const form = document.getElementById(`element-${proto.targetId}`) as HTMLFormElement;
              if (form) form.requestSubmit();
            });
            break;
          case "openLink":
            applyDelay(() => {
              if (proto.value) window.open(proto.value, "_blank");
            });
            break;
          case "scrollTo":
            applyDelay(() => {
              if (proto.targetId) {
                const el = document.getElementById(`element-${proto.targetId}`);
                if (el) {
                  el.scrollIntoView({
                    behavior: proto.transition === "none" ? "auto" : "smooth",
                  });
                }
              }
            });
            break;
          case "triggerAnimation":
            applyDelay(() => {
              const page = get().pages.find((p) => p.id === get().currentPageId);
              if (!page || !element.id) return;
              set((state) => ({
                pages: state.pages.map((p) =>
                  p.id === state.currentPageId
                    ? {
                        ...p,
                        elements: p.elements.map((el) =>
                          el.id === element.id
                            ? {
                                ...el,
                                style: {
                                  ...el.style,
                                  ...applyTransition({
                                    animation: proto.value ? `${proto.value} 1s ease` : undefined,
                                  }),
                                },
                              }
                            : el
                        ),
                      }
                    : p
                ),
              }));
            });
            break;
        }
        break;

      case "onHover":
        switch (proto.action) {
          case "showTooltip":
            console.log(`Show tooltip: ${proto.value}`); // Handled in Canvas
            break;
          case "highlight":
            const pageHighlight = get().pages.find((p) => p.id === get().currentPageId);
            if (!pageHighlight || !proto.targetId) return;
            set((state) => ({
              pages: state.pages.map((p) =>
                p.id === state.currentPageId
                  ? {
                      ...p,
                      elements: p.elements.map((el) =>
                        el.id === Number(proto.targetId)
                          ? { ...el, style: { ...el.style, outline: "2px solid #3b82f6" } }
                          : el
                      ),
                    }
                  : p
              ),
            }));
            break;
          case "scale":
            const pageScale = get().pages.find((p) => p.id === get().currentPageId);
            if (!pageScale || !element.id) return;
            set((state) => ({
              pages: state.pages.map((p) =>
                p.id === state.currentPageId
                  ? {
                      ...p,
                      elements: p.elements.map((el) =>
                        el.id === element.id
                          ? {
                              ...el,
                              style: { ...el.style, transform: `scale(${proto.value || "1.1"})` },
                            }
                          : el
                      ),
                    }
                  : p
              ),
            }));
            break;
        }
        break;

      case "onLoad":
        switch (proto.action) {
          case "animate":
            const pageAnimate = get().pages.find((p) => p.id === get().currentPageId);
            if (!pageAnimate || !element.id) return;
            set((state) => ({
              pages: state.pages.map((p) =>
                p.id === state.currentPageId
                  ? {
                      ...p,
                      elements: p.elements.map((el) =>
                        el.id === element.id
                          ? {
                              ...el,
                              style: {
                                ...el.style,
                                animation: proto.value ? `${proto.value} 1s ease` : undefined,
                              },
                            }
                          : el
                      ),
                    }
                  : p
              ),
            }));
            break;
          case "fetchData":
            applyDelay(() => {
              if (proto.value) {
                fetch(proto.value)
                  .then((res) => res.json())
                  .then((data) =>
                    set((state) => ({
                      pages: state.pages.map((p) =>
                        p.id === state.currentPageId
                          ? {
                              ...p,
                              elements: p.elements.map((el) =>
                                el.id === element.id ? { ...el, content: JSON.stringify(data) } : el
                              ),
                            }
                          : p
                      ),
                    }))
                  )
                  .catch((err) => console.error("Fetch failed:", err));
              }
            });
            break;
        }
        break;
    }
  },
}));