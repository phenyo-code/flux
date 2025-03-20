"use server";
import prisma from "@/app/lib/prisma";
import ObjectID from "bson-objectid";

interface SaveProjectParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pages: any[];
  title: string;
  designId?: string; // Optional ID for updates
}

export async function saveProject({ pages, title, designId }: SaveProjectParams) {
  try {
    const id = designId || new ObjectID().toHexString();

    const project = await prisma.project.upsert({
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
        updatedAt: new Date(),
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

    return { success: true, data: project };
  } catch (error) {
    console.error("Error saving project:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}