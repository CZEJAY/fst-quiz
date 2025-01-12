"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return { users };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getUser = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return { user };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: UserRole;
  }
) => {
  try {
    const user = await prisma.user.update({ where: { id }, data });
    revalidatePath(`/admin/users`);
    return { user };
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
};
