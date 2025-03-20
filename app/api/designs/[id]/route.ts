/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import ObjectID from "bson-objectid";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const { searchParams } = new URL(req.url);
  const templateName = searchParams.get("template");

  console.log(`GET: Fetching design with ID: ${id}, template: ${templateName}`);

  try {
    if (ObjectID.isValid(id)) {
      console.log("Checking for existing design...");
      const design = await prisma.design.findUnique({
        where: { id },
        include: { pages: true },
      });

      if (design) {
        console.log(`Found design: ${design.id}`);
        return NextResponse.json({
          id: design.id,
          title: design.title,
          pages: design.pages.map((page) => ({
            id: page.id || new ObjectID().toHexString(), // Fallback for null IDs
            title: page.title,
            elements: page.elements,
            backgroundColor: page.backgroundColor,
            backgroundImage: page.backgroundImage,
            frameHeight: page.frameHeight,
            columnCount: page.columnCount,
            gridSize: page.gridSize,
          })),
        });
      }
    } else {
      console.log(`ID ${id} is not a valid ObjectID, skipping design lookup.`);
    }

    if (templateName) {
      console.log(`Fetching template: ${templateName}`);
      const template = await prisma.template.findUnique({
        where: { name: templateName },
      });
      if (template) {
        console.log(`Found template: ${template.name}`);
        const templatePages = Array.isArray(template.pages) ? template.pages : [];
        return NextResponse.json({
          id,
          title: `${templateName.charAt(0).toUpperCase() + templateName.slice(1)} Design`,
          pages: templatePages.map((page: any) => ({
            ...page,
            id: page.id || new ObjectID().toHexString(), // Ensure unique ID
            elements: Array.isArray(page.elements) ? page.elements.map((el: any) => ({
              ...el,
              id: el.id || Number(new ObjectID().toHexString().slice(-12)), // Ensure element IDs
            })) : [],
          })),
        });
      } else {
        console.log(`No template found for name: ${templateName}`);
      }
    }

    console.log(`No design or template found for ID: ${id}. Returning new design.`);
    return NextResponse.json({
      id,
      title: "New Design",
      pages: [{ id: new ObjectID().toHexString(), title: "Page 1", elements: [], backgroundColor: "#ffffff", frameHeight: 800 }],
    });
  } catch (error) {
    console.error("Error fetching design:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  console.log(`PUT: Saving design with ID: ${id}`);

  try {
    const { pages, title = "New Design" } = await req.json();
    if (!Array.isArray(pages)) throw new Error("Pages must be an array");

    const design = await prisma.design.upsert({
      where: { id },
      update: {
        title,
        pages: {
          deleteMany: {},
          create: pages.map((page: any) => ({
            id: page.id || new ObjectID().toHexString(), // Ensure unique ID
            title: page.title,
            elements: page.elements || [],
            backgroundColor: page.backgroundColor || "#ffffff",
            backgroundImage: page.backgroundImage,
            frameHeight: page.frameHeight,
            columnCount: page.columnCount,
            gridSize: page.gridSize,
          })),
        },
        updatedAt: new Date(),
      },
      create: {
        id,
        title,
        pages: {
          create: pages.map((page: any) => ({
            id: page.id || new ObjectID().toHexString(), // Ensure unique ID
            title: page.title,
            elements: page.elements || [],
            backgroundColor: page.backgroundColor || "#ffffff",
            backgroundImage: page.backgroundImage,
            frameHeight: page.frameHeight,
            columnCount: page.columnCount,
            gridSize: page.gridSize,
          })),
        },
      },
      include: { pages: true },
    });

    console.log(`Design saved: ${design.id}`);
    return NextResponse.json({
      id: design.id,
      title: design.title,
      pages: design.pages.map((page) => ({
        id: page.id,
        title: page.title,
        elements: page.elements,
        backgroundColor: page.backgroundColor,
        backgroundImage: page.backgroundImage,
        frameHeight: page.frameHeight,
        columnCount: page.columnCount,
        gridSize: page.gridSize,
      })),
    });
  } catch (error) {
    console.error("Error saving design:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  console.log(`DELETE: Deleting design with ID: ${id}`);

  try {
    await prisma.design.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Error deleting design:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}