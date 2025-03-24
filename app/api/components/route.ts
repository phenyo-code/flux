import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const designId = searchParams.get("designId");

  if (!designId) {
    return NextResponse.json({ error: "designId is required" }, { status: 400 });
  }

  try {
    // Fetch custom components for the given designId
    const components = await prisma.customComponent.findMany({
      where: {
        designId: designId,
      },
      select: {
        id: true,
        name: true,
        elements: true,
        designId: true,
      },
    });

    // Map to match the CustomComponent type from your store
    const formattedComponents = components.map((comp) => ({
      id: comp.id,
      name: comp.name,
      elements: comp.elements, // Already JSON in schema, no need to parse
      designId: comp.designId,
    }));

    return NextResponse.json(formattedComponents, { status: 200 });
  } catch (error) {
    console.error("Error fetching custom components:", error);
    return NextResponse.json({ error: "Failed to fetch components" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}