// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { title } from "process";

const prisma = new PrismaClient();

// GET: Fetch all projects (Designs)
export async function GET() {
  try {
    const projects = await prisma.design.findMany({
      include: {
        pages: {
          select: {
            id: true,
            title: true,
            elements: true,
            backgroundColor: true,
            backgroundImage: true,
            frameHeight: true,
            columnCount: true,
            gridSize: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Sort by most recently updated
      },
    });

    // Transform data to match Projects.tsx expected format
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.title,
      updatedAt: project.updatedAt.toISOString().split("T")[0], // Format as YYYY-MM-DD
      pages: project.pages,
    }));

    return NextResponse.json(formattedProjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a new project (Design)
export async function POST(req: Request) {
    try {
      const body = await req.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, name, updatedAt, pages } = body;
  
      const project = await prisma.design.create({
        data: {
          id,
          title,
          updatedAt,
          pages: { create: pages }, // Adjust based on your schema
        },
      });
      return NextResponse.json(project, { status: 201 });
    } catch (error) {
      console.error("Error creating project:", error);
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
  }