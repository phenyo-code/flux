"use server";
import prisma from "@/app/lib/prisma";
import { CustomComponent } from "@/app/lib/store";

export async function createCustomComponent(component: CustomComponent) {
  return await prisma.customComponent.create({
    data: {
      name: component.name,
      elements: JSON.stringify(component.elements),
      designId: component.designId,
    },
  });
}

export async function getCustomComponents(designId: string) {
  return await prisma.customComponent.findMany({ where: { designId } });
}

export async function deleteCustomComponent(id: string) {
  return await prisma.customComponent.delete({ where: { id } });
}