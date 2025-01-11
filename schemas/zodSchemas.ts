import { z } from "zod";

const CategoryStatus = z.enum(["active", "draft", "archived"]);
export type CategoryStatus = z.infer<typeof CategoryStatus>;

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  status: CategoryStatus,
});
