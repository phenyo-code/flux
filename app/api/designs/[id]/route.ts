/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const design = await prisma.design.findUnique({
      where: { id: params.id },
      include: { pages: true },
    });
    return NextResponse.json(
      design || { id: params.id, title: "New Design", pages: [{ id: "1", title: "Page 1", elements: [], backgroundColor: "#ffffff" }] }
    );
  } catch (error) {
    console.error("Error fetching design:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { pages, title = "New Design" } = await req.json();
    if (!Array.isArray(pages)) throw new Error("Pages must be an array");

    const design = await prisma.design.upsert({
      where: { id: params.id },
      update: {
        title,
        pages: {
          deleteMany: {},
          create: pages.map((page: any) => ({
            id: page.id,
            title: page.title,
            elements: page.elements || [],
            backgroundColor: page.backgroundColor || "#ffffff",
            backgroundImage: page.backgroundImage, // New
          })),
        },
        updatedAt: new Date(),
      },
      create: {
        id: params.id,
        title,
        pages: {
          create: pages.map((page: any) => ({
            id: page.id,
            title: page.title,
            elements: page.elements || [],
            backgroundColor: page.backgroundColor || "#ffffff",
            backgroundImage: page.backgroundImage, // New
          })),
        },
      },
      include: { pages: true },
    });
    return NextResponse.json(design);
  } catch (error) {
    console.error("Error saving design:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.design.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Design deleted successfully" });
  } catch (error) {
    console.error("Error deleting design:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}