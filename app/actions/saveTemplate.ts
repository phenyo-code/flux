// app/actions/saveTemplate.ts
"use server";
import prisma from "@/app/lib/prisma";
import ObjectID from "bson-objectid";

interface SaveDesignOrTemplateParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pages: any[];
  title: string;
  name?: string; // Required for templates, optional for designs
  saveAs: "design" | "template";
  designId?: string;
}

export async function saveDesignOrTemplate({ pages, title, name, saveAs, designId }: SaveDesignOrTemplateParams) {
  try {
    if (saveAs === "design") {
      const id = designId || new ObjectID().toHexString();
      const design = await prisma.design.upsert({
        where: { id },
        update: {
          title,
          pages: {
            deleteMany: {},
            create: pages.map((page) => ({
              id: page.id || new ObjectID().toHexString(),
              title: page.title || "Untitled Page",
              elements: page.elements || [],
              backgroundColor: page.backgroundColor || "#ffffff",
              backgroundImage: page.backgroundImage || null,
              frameHeight: page.frameHeight || 800,
              columnCount: page.columnCount || 1,
              gridSize: page.gridSize || 10,
            })),
          },
          // updatedAt field removed as it is not a valid property
        },
        create: {
          id,
          title,
          pages: {
            create: pages.map((page) => ({
              id: page.id || new ObjectID().toHexString(),
              title: page.title || "Untitled Page",
              elements: page.elements || [],
              backgroundColor: page.backgroundColor || "#ffffff",
              backgroundImage: page.backgroundImage || null,
              frameHeight: page.frameHeight || 800,
              columnCount: page.columnCount || 1,
              gridSize: page.gridSize || 10,
            })),
          },
        },
        include: { pages: true },
      });
      return { success: true, data: design };
    } else if (saveAs === "template") {
      if (!name) throw new Error("Template name is required");
      const template = await prisma.template.upsert({
        where: { name },
        update: {
          pages: pages,
          // updatedAt field removed as it is not a valid property
        },
        create: {
          name,
          pages: pages.map((page) => ({
            ...page,
            id: page.id || new ObjectID().toHexString(),
          })),
        },
      });
      return { success: true, data: template };
    }
    throw new Error("Invalid saveAs option");
  } catch (error) {
    console.error(`Error saving ${saveAs}:`, error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}