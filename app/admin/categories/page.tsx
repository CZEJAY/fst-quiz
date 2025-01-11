import { getCategories } from "@/actions/category-actions";
import {
  Category,
  CategoryTable,
} from "@/components/admin/category/category-table";
import CrudBtn from "@/components/admin/category/CrudBtn";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function CategoriesPage() {
  const { categories, error } = await getCategories();
  if (error) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold tracking-tight">Error</h2>
        </div>
      </div>
    );
  }
  if (!categories) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold tracking-tight">
            No categories found
          </h2>
          <CrudBtn />
        </div>
      </div>
    );
  }
  const formattedCategories: Category[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    createdAt: new Date(category.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    description: category.description ?? "",
    quizCount: category.quizzes.length,
    status: category.status,
  }));
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <CrudBtn />
      </div>
      <CategoryTable data={formattedCategories} />
    </div>
  );
}
