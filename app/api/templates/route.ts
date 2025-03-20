import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      select: {
        id: true,
        name: true,
        pages: true, // Include pages for rendering previews
      },
    });
    return NextResponse.json(templates); // Return full objects
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}