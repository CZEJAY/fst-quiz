"use server";

import { prisma } from "@/lib/prisma";
import { CategoryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getCategories(f?: CategoryStatus) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: f || undefined, // Filter by status if provided
      },
      include: {
        quizzes: true,
      },
    });
    return { categories };
  } catch (error) {
    return { error: "Failed to fetch categories" };
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return { error: "Category not found" };
    }
    return { category };
  } catch (error) {
    return { error: "Failed to fetch category" };
  }
}

export async function createCategory(data: {
  name: string;
  description?: string;
  status: CategoryStatus;
}) {
  try {
    const category = await prisma.category.create({ data });
    revalidatePath("/categories");
    return { category };
  } catch (error) {
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: CategoryStatus;
  }
) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    revalidatePath("/categories");
    return { category };
  } catch (error) {
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete category" };
  }
}
