/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import prisma from "@/app/lib/prisma";
import ObjectID from "bson-objectid";

interface SaveDesignOrTemplateParams {
  pages?: any[]; // Required for design/template, optional for component
  title?: string; // Required for design
  name?: string; // Required for template/component, optional for design
  saveAs: "design" | "template" | "component";
  designId?: string; // Optional for all, will generate if missing for design/template/component
  elements?: any[]; // Required for component
}

export async function saveDesignOrTemplate({
  pages,
  title,
  name,
  saveAs,
  designId,
  elements,
}: SaveDesignOrTemplateParams) {
  try {
    if (saveAs === "design") {
      if (!pages) throw new Error("Pages are required for design");
      const effectiveTitle = title || "Untitled Design";
      const id = designId && ObjectID.isValid(designId) ? designId : new ObjectID().toHexString();

      const design = await prisma.design.upsert({
        where: { id },
        update: {
          title: effectiveTitle,
          pages: {
            deleteMany: { designId: id }, // Clear existing pages
            create: pages.map((page) => ({
              id: page.id && ObjectID.isValid(page.id) ? page.id : new ObjectID().toHexString(),
              title: page.title || "Untitled Page",
              elements: page.elements || [],
              backgroundColor: page.backgroundColor || "#ffffff",
              backgroundImage: page.backgroundImage || null,
              frameHeight: page.frameHeight || 800,
              columnCount: page.columnCount || 1,
              gridSize: page.gridSize || 10,
              prototype: page.prototype || null, // Include prototype if present
            })),
          },
          updatedAt: new Date(), // Track last update
        },
        create: {
          id,
          title: effectiveTitle,
          pages: {
            create: pages.map((page) => ({
              id: page.id && ObjectID.isValid(page.id) ? page.id : new ObjectID().toHexString(),
              title: page.title || "Untitled Page",
              elements: page.elements || [],
              backgroundColor: page.backgroundColor || "#ffffff",
              backgroundImage: page.backgroundImage || null,
              frameHeight: page.frameHeight || 800,
              columnCount: page.columnCount || 1,
              gridSize: page.gridSize || 10,
              prototype: page.prototype || null, // Include prototype if present
            })),
          },
        },
        include: { pages: true },
      });
      return { success: true, data: design };
    } else if (saveAs === "template") {
      if (!pages) throw new Error("Pages are required for template");
      const effectiveName = name || `template-${Date.now()}`;
      const id = designId && ObjectID.isValid(designId) ? designId : new ObjectID().toHexString();

      const template = await prisma.template.upsert({
        where: { id }, // Use ID instead of name for consistency with design
        update: {
          name: effectiveName,
          pages: pages.map((page) => ({
            ...page,
            id: page.id && ObjectID.isValid(page.id) ? page.id : new ObjectID().toHexString(),
          })),
          updatedAt: new Date(),
        },
        create: {
          id,
          name: effectiveName,
          pages: pages.map((page) => ({
            ...page,
            id: page.id && ObjectID.isValid(page.id) ? page.id : new ObjectID().toHexString(),
          })),
        },
      });
      return { success: true, data: template };
    } else if (saveAs === "component") {
      if (!name || !elements) throw new Error("Name and elements are required for component");

      let effectiveDesignId = designId;
      if (!effectiveDesignId || !ObjectID.isValid(effectiveDesignId)) {
        if (!pages) throw new Error("Pages are required to create a design for a component");
        const design = await prisma.design.create({
          data: {
            title: "Untitled Design",
            pages: {
              create: pages.map((page) => ({
                id: page.id && ObjectID.isValid(page.id) ? page.id : new ObjectID().toHexString(),
                title: page.title || "Untitled Page",
                elements: page.elements || [],
                backgroundColor: page.backgroundColor || "#ffffff",
                backgroundImage: page.backgroundImage || null,
                frameHeight: page.frameHeight || 800,
                columnCount: page.columnCount || 1,
                gridSize: page.gridSize || 10,
                prototype: page.prototype || null,
              })),
            },
          },
          include: { pages: true },
        });
        effectiveDesignId = design.id;
      }

      const componentId = new ObjectID().toHexString();
      const component = await prisma.customComponent.upsert({
        where: { id: componentId }, // Use a unique ID for components
        update: {
          name,
          elements,
          designId: effectiveDesignId,
          updatedAt: new Date(),
        },
        create: {
          id: componentId,
          designId: effectiveDesignId,
          name,
          elements,
        },
      });
      return { success: true, data: { ...component, designId: effectiveDesignId } };
    }
    throw new Error("Invalid saveAs option");
  } catch (error) {
    console.error(`Error saving ${saveAs}:`, error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}