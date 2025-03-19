/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const design = await prisma.design.findUnique({
      where: { id: params.id },
      include: { pages: true },
    });
    return NextResponse.json(design || { pages: [{ id: "1", title: "Page 1", elements: [] }] });
  } catch (error) {
    console.error("Error fetching design:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { pages } = await req.json();
    if (!Array.isArray(pages)) throw new Error("Pages must be an array");

    const design = await prisma.design.upsert({
      where: { id: params.id },
      update: {
        pages: {
          deleteMany: {},
          create: pages.map((page: any) => ({
            id: page.id,
            title: page.title,
            elements: page.elements || [],
          })),
        },
        updatedAt: new Date(),
      },
      create: {
        id: params.id,
        title: "New Design",
        pages: {
          create: pages.map((page: any) => ({
            id: page.id,
            title: page.title,
            elements: page.elements || [],
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